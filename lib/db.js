import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'evault';

let cachedClient = global.mongoClient;
let cachedDb = global.mongoDb;

export async function connectToDatabase() {
  if (!uri) {
    return { client: null, db: null, isConnected: false };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb, isConnected: true };
  }

  try {
    const client = await MongoClient.connect(uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    const db = client.db(dbName);

    // Create unique index on docId if missing
    await db.collection('documents').createIndex({ docId: 1 }, { unique: true });

    global.mongoClient = client;
    global.mongoDb = db;

    return { client, db, isConnected: true };
  } catch (error) {
    console.warn('[eVault DB Warning] Could not connect to MongoDB Atlas:', error.message);
    return { client: null, db: null, isConnected: false, error: error.message };
  }
}
