import app from './app.js';
const mongoose = require('mongoose');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 8000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/faq')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Connect to Redis
connectRedis();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});