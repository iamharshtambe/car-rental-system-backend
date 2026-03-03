import { Router } from 'express';
import { createBooking } from '../controllers/booking.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const bookingRouter = Router();

bookingRouter.post('/book', authMiddleware, createBooking);
