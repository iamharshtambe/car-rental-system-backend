import { Router } from 'express';
import {
  createBooking,
  getBookings,
  deleteBooking,
  updateBooking,
} from '../controllers/booking.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const bookingRouter = Router();

bookingRouter.post('/', authMiddleware, createBooking);

bookingRouter.get('/', authMiddleware, getBookings);

bookingRouter.put('/:bookingId', authMiddleware, updateBooking);

bookingRouter.delete('/:bookingId', authMiddleware, deleteBooking);
