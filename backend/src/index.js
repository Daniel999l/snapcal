import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import estimateRouter from './routes/estimate.js';

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api', estimateRouter);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;