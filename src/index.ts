import 'dotenv/config';
import express from 'express';
import { authRouter } from './auth/auth.routes';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
