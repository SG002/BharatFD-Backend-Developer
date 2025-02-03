import express from 'express';
import cors from 'cors';
import { router as faqRoutes } from './routes/route.js';

const app = express();


const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};


app.use(cors(corsOptions));


app.use(express.json());

app.use('/api/faqs', faqRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export default app;