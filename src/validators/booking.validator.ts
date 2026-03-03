import { z } from 'zod';

export const bookingSchema = z.object({
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
