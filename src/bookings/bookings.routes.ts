import { Router } from 'express';
import { db } from '../db/db';
import { bookings } from '../db/schema';
import { and, eq, inArray } from 'drizzle-orm';

export const bookingsRouter = Router();

bookingsRouter.get('/', async (req, res) => {
  try {
    const userId = req.user!.id;
    const { bookingId, summary } = req.query;

    // single booking
    if (bookingId) {
      const result = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.userId, userId),
            eq(bookings.id, bookingId as string),
          ),
        );

      if (result.length === 0) {
        return res.status(404).json({
          error: 'Booking not found',
        });
      }

      const booking = result[0];
      const totalCost = booking.days * booking.rentPerDay;

      return res.status(200).json({
        booking: {
          id: booking.id,
          carName: booking.carName,
          days: booking.days,
          rentPerDay: booking.rentPerDay,
          totalCost,
          status: booking.status,
          createdAt: booking.createdAt,
        },
      });
    }

    // summary mode
    if (summary === 'true') {
      const result = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.userId, userId),
            inArray(bookings.status, ['booked', 'completed']),
          ),
        );

      const totalBookings = result.length;

      let totalCost = 0;
      for (let i = 0; i < result.length; i++) {
        totalCost += result[i].days * result[i].rentPerDay;
      }

      return res.status(200).json({ summary: { totalBookings, totalCost } });
    }

    // default: all bookings
    const result = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.userId, userId)));

    const bookingList = result.map((booking) => ({
      id: booking.id,
      carName: booking.carName,
      days: booking.days,
      rentPerDay: booking.rentPerDay,
      totalCost: booking.days * booking.rentPerDay,
      status: booking.status,
      createdAt: booking.createdAt,
    }));

    return res.status(200).json({ bookings: bookingList });
  } catch (e) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

bookingsRouter.post('/', async (req, res) => {
  try {
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
      rentPerDay > 2000
    ) {
      return res.status(400).json({ error: 'Invalid inputs' });
    }

    const [booking] = await db
      .insert(bookings)
      .values({ userId, carName, days, rentPerDay, status: 'booked' })
      .returning();

    const totalCost = days * rentPerDay;

    return res.status(201).json({
      booking: {
        id: booking.id,
        carName: booking.carName,
        days: booking.days,
        rentPerDay: booking.rentPerDay,
        totalCost,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

bookingsRouter.put('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user!.id;
    const { carName, days, rentPerDay, status } = req.body;

    // fetch booking
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = result[0];

    // ownership check
    if (booking.userId !== userId) {
      return res
        .status(403)
        .json({ error: 'You are not allowed to update this booking' });
    }

    if (status && (carName || days || rentPerDay)) {
      return res.status(400).json({ error: 'Invalid inputs' });
    }

    // update status
    if (status) {
      if (!['booked', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid inputs' });
      }

      const [updated] = await db
        .update(bookings)
        .set({ status })
        .where(eq(bookings.id, bookingId))
        .returning();

      return res.status(200).json({
        booking: {
          id: updated.id,
          carName: updated.carName,
          days: updated.days,
          rentPerDay: updated.rentPerDay,
          totalCost: updated.days * updated.rentPerDay,
          status: updated.status,
          createdAt: updated.createdAt,
        },
      });
    }

    if (!carName || !days || !rentPerDay) {
      return res.status(400).json({ error: 'Invalid inputs' });
    }

    if (
      typeof days !== 'number' ||
      typeof rentPerDay !== 'number' ||
      days <= 0 ||
      days >= 365 ||
      rentPerDay > 2000 ||
      rentPerDay <= 0
    ) {
      return res.status(400).json({ error: 'Invalid inputs' });
    }

    const [updated] = await db
      .update(bookings)
      .set({ carName, days, rentPerDay })
      .where(eq(bookings.id, bookingId))
      .returning();

    return res.status(200).json({
      booking: {
        id: updated.id,
        carName: updated.carName,
        days: updated.days,
        rentPerDay: updated.rentPerDay,
        totalCost: updated.days * updated.rentPerDay,
        status: updated.status,
        createdAt: updated.createdAt,
      },
    });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

bookingsRouter.delete('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user!.id;

    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = result[0];

    if (booking.userId !== userId) {
      return res
        .status(403)
        .json({ error: 'You are not allowed to delete this booking' });
    }

    await db.delete(bookings).where(eq(bookings.id, bookingId));

    return res.status(200).json({
      message: 'Booking deleted successfully',
    });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
