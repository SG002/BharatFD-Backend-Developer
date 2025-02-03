import app from './app.js';
import mongoose from 'mongoose';
import { connectRedis } from './config/redis.js';

const PORT = process.env.PORT || 8000;


mongoose.connect('mongodb://localhost:27017/faq')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


connectRedis();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});