import 'dotenv/config';
import express from 'express';
import { authRouter } from './auth/auth.routes';
import { bookingsRouter } from './bookings/bookings.routes';
import { authMiddleware } from './auth/auth.middleware';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/auth', authRouter);

app.use('/bookings', authMiddleware, bookingsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
