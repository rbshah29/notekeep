import { connectToDatabase } from '../../../../utils/mongodb';
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

  const noteId = event.context.params.id;
  const email = event.context.params.email;
  
  const db = await connectToDatabase();
  const collection = db.collection('notekeep');

  const result = await collection.updateOne(
    { _id: new ObjectId(noteId) },
    { 
      $pull: { 
        collaborators: { email } 
      } 
    }
  );

  return { success: true };
});