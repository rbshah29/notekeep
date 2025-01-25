import { connectToDatabase } from '../utils/mongodb';
import { ObjectId } from 'mongodb';

export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('notekeep');
    const method = event.node.req.method;

    if (method === 'GET') {
      const notes = await collection.find({}).toArray();
      return notes;
    }

    if (method === 'POST') {
      const body = await readBody(event);
      const result = await collection.insertOne(body);
      return {
        ...body,
        _id: result.insertedId
      };
    }
    
    if (method === 'PUT') {
      const query = getQuery(event);
      const id = query.id;
      const body = await readBody(event);
      
      if (!id) {
        throw createError({
          statusCode: 400,
          message: 'ID is required for updating'
        });
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: {
          title: body.title,
          content: body.content
        }}
      );

      return {
        success: result.modifiedCount === 1
      };
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
        _id: new ObjectId(id) 
      });

      return {
        success: result.deletedCount === 1
      };
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