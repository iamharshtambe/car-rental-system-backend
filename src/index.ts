import express from 'express';
import { authRouter } from './routes/auth.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1/auth', authRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
