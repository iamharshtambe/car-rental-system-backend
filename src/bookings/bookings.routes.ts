import { Router } from 'express';

export const bookingsRouter = Router();

bookingsRouter.get('/', (req, res) => {
  res.json({
    message: 'Protected bookings route',
    userId: req.user?.id,
  });
});
