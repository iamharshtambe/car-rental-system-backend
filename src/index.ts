import express from 'express';
import { authRouter } from './routes/auth.routes';
import { bookingRouter } from './routes/booking.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/bookings', bookingRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
