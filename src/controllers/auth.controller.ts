import type { Request, Response } from 'express';
import { loginSchema, signupSchema } from '../validators/auth.validator';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function respond(
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: unknown = null,
) {
  return res.status(status).json({ success, message, data });
}

function generateToken(userId: string, email: string) {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return respond(
      res,
      400,
      false,
      parsed.error.issues.map((issue) => issue.message).join(', '),
    );
  }

  const { email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return respond(res, 400, false, 'User already exists');
  }

  const user = await prisma.user.create({
    data: { email, password: await hashPassword(password) },
    select: { id: true },
  });

  return respond(res, 201, true, 'User created successfully', {
    userId: user.id,
  });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return respond(
      res,
      400,
      false,
      parsed.error.issues.map((issue) => issue.message).join(', '),
    );
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  const isPasswordValid =
    user && (await comparePassword(password, user.password));

  if (!isPasswordValid) {
    return respond(res, 401, false, 'Invalid credentials');
  }

  return respond(res, 200, true, 'User logged in successfully', {
    token: generateToken(user.id, user.email),
  });
}
