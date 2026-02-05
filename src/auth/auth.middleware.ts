import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  // check header exist
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // verify token
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    // attach user to request
    req.user = { id: payload.userId };

    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
