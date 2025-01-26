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
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    });
  }
  try {
    const db = await connectToDatabase();
    const collection = db.collection('notekeep');
    const method = event.node.req.method;

    
    const userId = decoded.userId;

    if (method === 'GET') {
      const notes = await collection.find({ userId }).toArray();
      return notes;
    }

    if (method === 'POST') {
      const body = await readBody(event);
      const noteWithUser = {
        title: body.title,
        content: body.content,
        tags: body.tags || [],
        userId: decoded.userId,
        createdAt: new Date()
      };
      const result = await collection.insertOne(noteWithUser);
      return {
        ...noteWithUser,
        _id: result.insertedId
      };
    }
    
    if (method === 'PUT') {
      const query = getQuery(event);
      const id = query.id;
      const body = await readBody(event);
      
      const result = await collection.updateOne(
        { _id: new ObjectId(id), userId },
        { $set: {
          title: body.title,
          content: body.content,
          tags: body.tags || []
        }}
      );
      return { success: result.modifiedCount === 1 };
    }

    if (method === 'DELETE') {
      const query = getQuery(event);
      const id = query.id;
      
      if (!id) {
        throw createError({
          statusCode: 400,
          message: 'ID is required for deletion'
        });
      }

      const result = await collection.deleteOne({ 
        _id: new ObjectId(id),
        userId 
      });

      return { success: result.deletedCount === 1 };
    }

    throw createError({
      statusCode: 405,
      message: 'Method Not Allowed'
    });

  } catch (error) {
    console.error('API error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Internal Server Error'
    });
  }
});


    

