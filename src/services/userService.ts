import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../models/prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const createUser = async (email: string, password: string, full_name: string, role: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      full_name,
      role: role as any,
    },
  });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
  });

  if (!user) throw new Error('User not found');
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid password');

  const accessToken = jwt.sign({
    userId: user.id,
    role: user.role
  }, JWT_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({
    userId: user.id
  }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    accessToken,
    refreshToken,
    user
  };
};