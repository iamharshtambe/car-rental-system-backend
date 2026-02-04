import { Router } from 'express';
import { db } from '../db/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';

export const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Invalid inputs' });
  }

  // check if user already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (existing.length > 0) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user
  await db.insert(users).values({
    username,
    password: hashedPassword,
  });

  // success
  return res.status(201).json({
    success: true,
    data: { message: 'User created successfully' },
  });
});

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Invalid inputs' });
  }

  // find user
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (result.length === 0) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const user = result[0];

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401).json({ error: 'Invalid username or password' });
  }

  // create jwt
  const token = signToken(user.id);

  // success
  return res
    .status(200)
    .json({ success: true, data: { message: 'Login successful', token } });
});
