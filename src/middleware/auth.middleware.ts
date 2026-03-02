import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type JwtPayload = {
  userId: string;
  email: string;
};

function unauthorized(message: string) {
  return { success: false, message: `Unauthorized: ${message}`, data: null };
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json(unauthorized('Token missing'));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    next();
  } catch {
    return res.status(401).json(unauthorized('Invalid or expired token'));
  }
}
