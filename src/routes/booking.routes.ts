import { Router } from 'express';
import { createBooking, getBookings } from '../controllers/booking.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const bookingRouter = Router();

bookingRouter.post('/book', authMiddleware, createBooking);

bookingRouter.get('/bookings', authMiddleware, getBookings);
