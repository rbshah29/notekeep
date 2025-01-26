import { getUsersCollection } from '../utils/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const users = await getUsersCollection();
  const method = event.node.req.method;
  const url = event.node.req.url;
  const body = await readBody(event);

  // Signup endpoint
  if (method === 'POST' && url.endsWith('/auth/signup')) {
    const { email, password } = body;
    
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date()
    });
    
    return { message: 'User created successfully' };
  }

  // Login endpoint
  if (method === 'POST' && url.endsWith('/auth/login')) {
    const { email, password } = body;
    
    const user = await users.findOne({ email });
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token };
  }
});