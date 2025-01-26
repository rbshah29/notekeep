import { getUsersCollection } from '../../utils/mongodb';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const users = await getUsersCollection();
  const body = await readBody(event);
  const { name, email, password } = body;
  
  const existingUser = await users.findOne({ email });
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'Email already exists'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await users.insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date()
  });
  
  return { message: 'User created successfully' };
});