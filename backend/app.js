import express from 'express';
import cors from 'cors';
import { router as faqRoutes } from './routes/route.js';

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // React app's address
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

// Enable CORS with options
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/api/faqs', faqRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export default app;