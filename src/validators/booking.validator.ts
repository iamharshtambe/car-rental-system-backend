import { z } from 'zod';

export const createBookingSchema = z.object({
  carName: z.string().min(1, 'Car name is required'),
  days: z
    .number()
    .int('Days must be an integer')
    .positive('Days must be positive')
    .max(364, 'Invalid inputs'),
  rentPerDay: z
    .number()
    .positive('Rent per day must be positive')
    .max(2000, 'Invalid inputs'),
});

export const updateBookingSchema = z
  .object({
    carName: z.string().min(1).optional(),

    days: z.number().int().positive().max(364, 'Invalid inputs').optional(),

    rentPerDay: z.number().positive().max(2000, 'Invalid inputs').optional(),

    status: z.enum(['booked', 'completed', 'cancelled']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });
