// server/api/notes/[id]/collaborators.js
import { getUsersCollection } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';
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

  const method = event.node.req.method;
  const noteId = event.context.params.id;
  const db = await connectToDatabase();
  const collection = db.collection('notekeep');

  const note = await collection.findOne({ 
    _id: new ObjectId(noteId)
  });

  if (!note || note.userId !== decoded.userId) {
    throw createError({ 
      statusCode: 403,
      message: 'Not authorized to share this note'
    });
  }

  if (method === 'POST') {
    const { email, permission } = await readBody(event);
    
    const users = await getUsersCollection();
    const targetUser = await users.findOne({ email });
    if (!targetUser) {
      throw createError({ 
        statusCode: 404,
        message: 'User not found'
      });
    }

    const existingCollaborator = note.collaborators?.find(c => c.email === email);
    
    let updateOperation;
    if (existingCollaborator) {
      updateOperation = {
        $set: {
          'collaborators.$[elem].permission': permission
        }
      };
    } else {
      updateOperation = {
        $push: {
          collaborators: { email, permission }
        }
      };
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(noteId) },
      updateOperation,
      existingCollaborator ? {
        arrayFilters: [{ 'elem.email': email }]
      } : {}
    );

    return { success: true };
  }

  if (method === 'DELETE') {
    const email = event.context.params.email;
    
    const result = await collection.updateOne(
      { _id: new ObjectId(noteId) },
      { 
        $pull: { 
          collaborators: { email } 
        } 
      }
    );

    return { success: true };
  }

  if (method === 'GET') {
    return note.collaborators || [];
  }
});