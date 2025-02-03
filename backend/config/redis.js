import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

const connectRedis = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error('Redis connection error:', error);
  }
};
const CACHE_DURATION = 3600; 

const cacheService = {

  set: async (key, value) => {
    try {
      await client.setEx(key, CACHE_DURATION, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  },
  get: async (key) => {
    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  delete: async (key) => {
    try {
      await client.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  },

  clear: async () => {
    try {
      await client.flushAll();
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  },


  clearPattern: async (pattern) => {
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error('Redis clear pattern error:', error);
    }
  }
};


export const redisClient = client; 
export { connectRedis, cacheService };