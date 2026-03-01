import { Router } from 'express';
import { signup } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/signup', signup);
