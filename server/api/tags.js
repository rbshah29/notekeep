// server/api/tags.js
import { connectToDatabase } from '../utils/mongodb';
import { ObjectId } from 'mongodb';

// server/api/notes.js - add auth check
import jwt from 'jsonwebtoken';

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};


export default defineEventHandler(async (event) => {
    const token = event.node.req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        throw createError({ statusCode: 401 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('notekeep');

    const userNotes = await collection.find({ userId: decoded.userId }).toArray();
    const uniqueTags = Array.from(new Set(userNotes.flatMap(note => note.tags || [])));
    console.log("uniqueTags", uniqueTags);
    return uniqueTags;
});