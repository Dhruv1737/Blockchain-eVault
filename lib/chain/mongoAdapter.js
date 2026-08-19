import { connectToDatabase } from '../db';
import { seedInitialDocuments, INITIAL_DOCUMENTS } from '../seed';

// Global in-memory fallback store for offline development/demo
if (!global.__evault_inmemory_documents) {
  global.__evault_inmemory_documents = new Map();
  // Pre-seed in-memory store
  for (const doc of INITIAL_DOCUMENTS) {
    global.__evault_inmemory_documents.set(doc.docId, { ...doc });
  }
}

const memoryStore = global.__evault_inmemory_documents;

/**
 * Register SHA-256 hash in MongoDB (or in-memory fallback)
 * IMMUTABILITY RULE: Rejects any attempt to overwrite an existing docId hash
 * 
 * @param {string} docId - UUID lookup key
 * @param {string} hash - 64-character SHA-256 hex string
 * @param {object} metadata - optional filename, fileSize, etc.
 * @returns {Promise<{ docId: string, hash: string, registeredAt: Date, adapterMode: string }>}
 */
export async function registerHashInMongo(docId, hash, metadata = {}) {
  if (!docId || typeof docId !== 'string') {
    throw new Error('Invalid docId provided to chain adapter');
  }
  if (!hash || typeof hash !== 'string' || hash.length !== 64) {
    throw new Error('Invalid SHA-256 hash provided to chain adapter');
  }

  const registeredAt = new Date();
  const documentRecord = {
    docId,
    hash: hash.toLowerCase(),
    filename: metadata.filename || 'Untitled Document',
    fileSize: metadata.fileSize || 0,
    registeredAt,
  };

  const { db, isConnected } = await connectToDatabase();

  if (isConnected && db) {
    const collection = db.collection('documents');

    // Strict Immutability check: Check if docId already exists
    const existing = await collection.findOne({ docId });
    if (existing) {
      throw new Error(`[Immutability Violation] Document docId ${docId} is already registered on chain. Overwriting is strictly prohibited.`);
    }

    // Insert new immutable record
    await collection.insertOne(documentRecord);

    // Also mirror to memoryStore for local sync fallback
    memoryStore.set(docId, documentRecord);

    return {
      docId,
      hash: documentRecord.hash,
      registeredAt,
      adapterMode: 'mongodb',
    };
  }

  // --- Fallback In-Memory Mode ---
  if (memoryStore.has(docId)) {
    throw new Error(`[Immutability Violation] Document docId ${docId} already registered. Overwrites prohibited.`);
  }

  memoryStore.set(docId, documentRecord);

  return {
    docId,
    hash: documentRecord.hash,
    registeredAt,
    adapterMode: 'in-memory',
  };
}

/**
 * Verify hash against stored record for docId
 * 
 * @param {string} docId - UUID key
 * @param {string} computedHash - 64-char SHA-256 hex string computed from verification file
 * @returns {Promise<{ match: boolean, storedHash: string|null, notFound: boolean, adapterMode: string }>}
 */
export async function verifyHashInMongo(docId, computedHash) {
  if (!docId) {
    return { match: false, storedHash: null, notFound: true, adapterMode: 'none' };
  }

  const formattedComputedHash = computedHash.toLowerCase();
  const { db, isConnected } = await connectToDatabase();

  if (isConnected && db) {
    const collection = db.collection('documents');
    const record = await collection.findOne({ docId });

    if (!record) {
      // Differentiate Not Found from Tampered
      return { match: false, storedHash: null, notFound: true, adapterMode: 'mongodb' };
    }

    const storedHash = record.hash.toLowerCase();
    const match = storedHash === formattedComputedHash;

    return {
      match,
      storedHash,
      notFound: false,
      filename: record.filename,
      registeredAt: record.registeredAt,
      adapterMode: 'mongodb',
    };
  }

  // --- Fallback In-Memory Mode ---
  const record = memoryStore.get(docId);
  if (!record) {
    return { match: false, storedHash: null, notFound: true, adapterMode: 'in-memory' };
  }

  const storedHash = record.hash.toLowerCase();
  const match = storedHash === formattedComputedHash;

  return {
    match,
    storedHash,
    notFound: false,
    filename: record.filename,
    registeredAt: record.registeredAt,
    adapterMode: 'in-memory',
  };
}

/**
 * Helper to fetch all documents for UI list & dropdowns
 */
export async function listAllDocumentsFromMongo() {
  const { db, isConnected } = await connectToDatabase();

  if (isConnected && db) {
    const collection = db.collection('documents');
    
    // Seed initial demo documents if collection is empty
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(INITIAL_DOCUMENTS);
    }

    const docs = await collection.find({}).sort({ registeredAt: -1 }).toArray();
    return docs.map(doc => ({
      docId: doc.docId,
      filename: doc.filename,
      hash: doc.hash,
      registeredAt: doc.registeredAt,
      fileSize: doc.fileSize,
      adapterMode: 'mongodb',
    }));
  }

  // In-memory mode list
  const docs = Array.from(memoryStore.values());
  docs.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

  return docs.map(doc => ({
    docId: doc.docId,
    filename: doc.filename,
    hash: doc.hash,
    registeredAt: doc.registeredAt,
    fileSize: doc.fileSize,
    adapterMode: 'in-memory',
  }));
}
