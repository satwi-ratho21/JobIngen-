import express from 'express';
import cors from 'cors';
import aiRoutes from './features/ai/routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('EduBridge Backend API');
});

export default app;