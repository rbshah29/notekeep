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
      // Get user's email from decoded token
      const users = await db.collection('users');
      const currentUser = await users.findOne({ _id: new ObjectId(userId) });
      const userEmail = currentUser.email;
    
      const notes = await collection.find({
        $or: [
          { userId }, // Notes owned by user
          { 'collaborators.email': userEmail } // Notes shared with user
        ]
      }).toArray();
    
      // Add permission level to each note
      const notesWithPermissions = notes.map(note => ({
        ...note,
        userPermission: note.userId === userId ? 'owner' : 
          note.collaborators.find(c => c.email === userEmail)?.permission
      }));
    
      return notesWithPermissions;
    }

    // server/api/notes.js
    if (method === 'POST') {
      const body = await readBody(event);
      const noteWithUser = {
        title: body.title,
        content: body.content,
        tags: body.tags || [],
        userId: decoded.userId,
        collaborators: [], // Array of { email, permission: 'view' | 'edit' }
        createdAt: new Date(),
        createdBy: decoded.userId // Keep track of original creator
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
      
      // Get the user's email from the users collection
      const users = await db.collection('users');
      const currentUser = await users.findOne({ _id: new ObjectId(decoded.userId) });
      const userEmail = currentUser.email;
    
      // Find the note
      const note = await collection.findOne({ _id: new ObjectId(id) });
      if (!note) {
        throw createError({
          statusCode: 404,
          message: 'Note not found'
        });
      }
    
      // Check permissions
      const isOwner = note.userId === decoded.userId;
      const collaborator = note.collaborators?.find(c => c.email === userEmail);
      const canEdit = isOwner || collaborator?.permission === 'edit';
    
      if (!canEdit) {
        throw createError({
          statusCode: 403,
          message: 'Not authorized to edit this note'
        });
      }
      const updateResult = await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            title: body.title,
            content: body.content,
            tags: body.tags || [],
            updatedAt: new Date()
          }
        }
      );
    
      if (updateResult.modifiedCount === 0) {
        throw createError({
          statusCode: 500,
          message: 'Failed to update note'
        });
      }
    
      const updatedNote = await collection.findOne({ _id: new ObjectId(id) });
      return updatedNote;
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


    

