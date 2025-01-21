import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://rutvikmymovie:mSaq3KlPqa63GhYp@cluster0.96bjh.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

let db;

export async function connectToDatabase() {
  if (!db) {
    try {
      if (!client.isConnected) {
        await client.connect();
      }
      db = client.db('notekeeps');
      console.log('Successfully connected to MongoDB.');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to the database: ' + error.message);
    }
  }
  return db;
}

export async function closeDatabaseConnection() {
  try {
    if (client.isConnected) {
      await client.close();
      db = null;
      console.log('MongoDB connection closed.');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}