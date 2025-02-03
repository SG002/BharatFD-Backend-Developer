import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app.js';
import FAQ from '../../models/faqm.js';
import { redisClient, cacheService } from '../../config/redis.js';


jest.unstable_mockModule('../../helper/translate.js', () => ({
  translateFAQ: jest.fn().mockImplementation(async () => 
    new Map([['hi', { question: 'टेस्ट प्रश्न?', answer: 'टेस्ट उत्तर' }]])
  ),
  translateFAQContent: jest.fn(),
  supportedLanguages: ['hi', 'bn', 'fr', 'es']
}));


const translationService = await import('../../helper/translate.js');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  
  
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await redisClient.quit();
});

describe('FAQ API Integration Tests', () => {
  const sampleFAQ = {
    question: 'Test Question?',
    answer: 'Test Answer',
    translations: new Map([
      ['hi', { question: 'टेस्ट प्रश्न?', answer: 'टेस्ट उत्तर' }]
    ])
  };

  beforeEach(async () => {
    await FAQ.deleteMany({});
    if (redisClient.isOpen) {
      await redisClient.flushAll();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/faqs', () => {
    test('should return empty array when no FAQs exist', async () => {
      const res = await request(app).get('/api/faqs');
      
      expect(res.status).toBe(200);
      expect(res.body.faqs).toEqual([]);
      expect(res.body.count).toBe(0);
    });

    test('should return FAQs in requested language', async () => {
      await new FAQ(sampleFAQ).save();
      
      const res = await request(app).get('/api/faqs?lang=hi');
      
      expect(res.status).toBe(200);
      expect(res.body.language).toBe('hi');
      expect(res.body.faqs[0].question).toBe('टेस्ट प्रश्न?');
    });

    test('should return cached FAQs on subsequent requests', async () => {
      await new FAQ(sampleFAQ).save();
      
      await request(app).get('/api/faqs?lang=hi');
      const res = await request(app).get('/api/faqs?lang=hi');
      
      expect(res.status).toBe(200);
      expect(res.body.faqs[0].question).toBe('टेस्ट प्रश्न?');
    });

    test('should return 400 for invalid language', async () => {
      const res = await request(app).get('/api/faqs?lang=invalid');
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/faqs', () => {
    test('should create new FAQ with translations', async () => {
      const res = await request(app)
        .post('/api/faqs')
        .send({
          question: 'New Question?',
          answer: 'New Answer'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.question).toBe('New Question?');
    });

    test('should fail without required fields', async () => {
      const res = await request(app)
        .post('/api/faqs')
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('PUT /api/faqs/:id', () => {
    test('should update FAQ and translations', async () => {
      const faq = await new FAQ(sampleFAQ).save();
      
      const res = await request(app)
        .put(`/api/faqs/${faq._id}`)
        .send({
          question: 'Updated Question?',
          answer: 'Updated Answer'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.question).toBe('Updated Question?');
    });

    test('should return 404 for non-existent FAQ', async () => {
      const res = await request(app)
        .put('/api/faqs/123456789012')
        .send({
          question: 'Updated Question?'
        });
      
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/faqs/:id', () => {
    test('should delete FAQ and clear cache', async () => {
      const faq = await new FAQ(sampleFAQ).save();
      
      const res = await request(app)
        .delete(`/api/faqs/${faq._id}`);
      
      expect(res.status).toBe(204);
      
      const deletedFAQ = await FAQ.findById(faq._id);
      expect(deletedFAQ).toBeNull();
    });

    test('should return 404 for non-existent FAQ', async () => {
      const res = await request(app)
        .delete('/api/faqs/123456789012');
      
      expect(res.status).toBe(404);
    });
  });
});