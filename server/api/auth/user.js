import { getUsersCollection } from '../../utils/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
export default defineEventHandler(async (event) => {
  console.log("nknsakndkjxansjxnkasn")
  const token = event.node.req.headers.authorization?.split(' ')[1];
  if (!token) throw createError({ statusCode: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = await getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
    
    if (!user) throw createError({ statusCode: 404 });
    
    const { password, name, ...userDetails } = user;
    return { ...userDetails, name };
  } catch (error) {
    throw createError({ statusCode: 401 });
  }
});