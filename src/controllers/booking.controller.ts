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
