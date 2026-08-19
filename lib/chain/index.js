/**
 * eVault Swappable Chain Abstraction Seam
 * 
 * ARCHITECTURAL SEAM REQUIREMENT:
 * No page or API route in this application may import or execute direct database/MongoDB queries.
 * All reads and writes to the cryptographic hash registry MUST pass exclusively through this seam module.
 * 
 * Currently delegates to mongoAdapter.js. 
 * To swap for Ethereum/Sepolia/Fabric on-chain smart contract adapter in the future,
 * simply change the import target below to web3Adapter.js.
 */
import {
  registerHashInMongo,
  verifyHashInMongo,
  listAllDocumentsFromMongo,
} from './mongoAdapter';

/**
 * Register a document SHA-256 hash in the registry.
 * MUST be async.
 * 
 * @param {string} docId - Unique Document Identifier (UUID)
 * @param {string} hash - 64-character hex SHA-256 string
 * @param {object} metadata - Optional display metadata (filename, fileSize)
 * @returns {Promise<{ docId: string, hash: string, registeredAt: Date }>}
 */
export async function registerHash(docId, hash, metadata = {}) {
  // Delegate to active adapter (mongoAdapter)
  return await registerHashInMongo(docId, hash, metadata);
}

/**
 * Verify an uploaded file's SHA-256 hash against stored record for docId.
 * MUST be async.
 * 
 * @param {string} docId - Unique Document Identifier (UUID)
 * @param {string} hash - 64-character hex SHA-256 string computed from test file
 * @returns {Promise<{ match: boolean, storedHash: string|null, notFound?: boolean, filename?: string }>}
 */
export async function verifyHash(docId, hash) {
  // Delegate to active adapter (mongoAdapter)
  return await verifyHashInMongo(docId, hash);
}

/**
 * List all registered documents.
 * 
 * @returns {Promise<Array<{ docId: string, filename: string, hash: string, registeredAt: Date, fileSize: number }>>}
 */
export async function listAllDocuments() {
  return await listAllDocumentsFromMongo();
}
