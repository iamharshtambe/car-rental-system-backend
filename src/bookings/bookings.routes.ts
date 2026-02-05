import { Router } from 'express';
import { db } from '../db/db';
import { bookings } from '../db/schema';

export const bookingsRouter = Router();

bookingsRouter.post('/', async (req, res) => {
  const { carName, days, rentPerDay } = req.body;
  const userId = req.user!.id;

  if (!carName || !days || !rentPerDay) {
    return res.status(400).json({ error: 'Invalid inputs' });
  }

  if (
    typeof days !== 'number' ||
    typeof rentPerDay !== 'number' ||
    days <= 0 ||
    days >= 365 ||
    rentPerDay <= 0 ||
    rentPerDay >= 2000
  ) {
    return res.json(400).json({ error: 'Invalid inputs' });
  }

  const [booking] = await db
    .insert(bookings)
    .values({ userId, carName, days, rentPerDay, status: 'booked' })
    .returning();

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const totalCost = days * rentPerDay;

  try {
    return res.status(201).json({
      booking: booking.id,
      carName: booking.carName,
      rentPerDay: booking.rentPerDay,
      totalCost,
      status: booking.status,
      createdAt: booking.createdAt,
    });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
