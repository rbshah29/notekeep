import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please add your MongoDB URI to .env');
}

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

// server/utils/mongodb.js - add users collection
export async function getUsersCollection() {
  const db = await connectToDatabase();
  return db.collection('users');
}