import type { Request, Response } from 'express';
import { bookingSchema } from '../validators/booking.validator';
import { prisma } from '../lib/prisma';

function respond(
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: unknown = null,
) {
  return res.status(status).json({ success, message, data });
}

export async function createBooking(req: Request, res: Response) {
  if (!req.user) {
    return respond(res, 401, false, 'Unauthorized');
  }

  const parsed = bookingSchema.safeParse(req.body);

  if (!parsed.success) {
    return respond(
      res,
      400,
      false,
      parsed.error.issues.map((issue) => issue.message).join(', '),
    );
  }

  const { carName, days, rentPerDay } = parsed.data;

  const totalCost = days * rentPerDay;

  const booking = await prisma.booking.create({
    data: {
      carName,
      days,
      rentPerDay,
      status: 'booked',
      userId: req.user.userId,
    },
    select: {
      id: true,
      carName: true,
      days: true,
      rentPerDay: true,
      status: true,
      createdAt: true,
    },
  });

  return respond(res, 201, true, 'Booking created successfully', {
    ...booking,
    totalCost,
  });
}

export async function getBookings(req: Request, res: Response) {
  if (!req.user) {
    return respond(res, 401, false, 'Unauthorized');
  }

  const { bookingId, summary } = req.query;

  // summary mode
  if (summary === 'true') {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.userId,
        status: { in: ['booked', 'completed'] },
      },
      select: { days: true, rentPerDay: true },
    });

    let totalAmountSpent = 0;
    for (const booking of bookings) {
      totalAmountSpent += booking.days * booking.rentPerDay;
    }

    return respond(res, 200, true, 'Booking summary', {
      userId: req.user.userId,
      email: req.user.email,
      totalBookings: bookings.length,
      totalAmountSpent,
    });
  }

  // single booking mode
  if (bookingId) {
    const booking = await prisma.booking.findFirst({
      where: {
        id: String(bookingId),
        userId: req.user.userId,
      },
      select: {
        id: true,
        carName: true,
        days: true,
        rentPerDay: true,
        status: true,
      },
    });

    if (!booking) {
      return respond(res, 404, false, 'Booking not found');
    }

    return respond(res, 200, true, 'Booking fetched', {
      ...booking,
      totalCost: booking.days * booking.rentPerDay,
    });
  }

  // normal list mode
  const bookings = await prisma.booking.findMany({
    where: {
      userId: req.user.userId,
    },
    select: {
      id: true,
      carName: true,
      days: true,
      rentPerDay: true,
      status: true,
    },
  });

  const formatted = bookings.map((b) => ({
    ...b,
    totalCost: b.days * b.rentPerDay,
  }));

  return respond(res, 200, true, 'Bookings fetched', formatted);
}
