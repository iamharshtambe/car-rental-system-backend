import jwt from 'jsonwebtoken';

export function generatetoken(userId: string, username: string) {
  return jwt.sign({ userId, username }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
