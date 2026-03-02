import type { Request, Response } from 'express';
import { loginSchema, signupSchema } from '../validators/auth.validator';
import { prisma } from '../lib/prisma';
import { comparePassword, hashPassword } from '../utils/hash';
import { generatetoken } from '../utils/jwt';

export async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues.map((issue) => issue.message),
      data: null,
    });
  }

  const { username, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { username } });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
      data: null,
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
    select: { id: true },
  });

  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      userId: user.id,
    },
  });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues.map((issue) => issue.message),
      data: null,
    });
  }

  const { username, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      data: null,
    });
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      data: null,
    });
  }

  const token = generatetoken(user.id, user.username);

  return res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      token,
    },
  });
}
