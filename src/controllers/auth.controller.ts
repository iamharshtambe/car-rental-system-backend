import type { Request, Response } from 'express';
import { signupSchema } from '../validators/auth.validator';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../utils/hash';

export async function signup(req: Request, res: Response) {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0]?.message,
    });
  }

  const { username, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { username } });

  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, error: 'User already exists' });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
    select: { id: true },
  });

  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    userId: user.id,
  });
}
