import { getUsersCollection } from '../../utils/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const users = await getUsersCollection();
  const body = await readBody(event);
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
});