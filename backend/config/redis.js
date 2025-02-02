const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Redis connection error:', error);
  }
};

// Cache duration in seconds
const CACHE_DURATION = 3600; // 1 hour

const cacheService = {
  // Set data in cache
  set: async (key, value) => {
    try {
      await redisClient.setEx(key, CACHE_DURATION, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  },

  // Get data from cache
  get: async (key) => {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  // Delete cache entry
  delete: async (key) => {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  },

  // Clear all cache
  clear: async () => {
    try {
      await redisClient.flushAll();
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  },

  // Clear cache by pattern
  clearPattern: async (pattern) => {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error('Redis clear pattern error:', error);
    }
  }
};

module.exports = {
  redisClient,
  connectRedis,
  cacheService
};