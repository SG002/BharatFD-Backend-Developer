import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import FAQ from '../../models/faqm.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('FAQ Model Test Suite', () => {
  const sampleFAQ = {
    question: 'Test Question?',
    answer: 'Test Answer',
    translations: new Map([
      ['hi', { question: 'टेस्ट प्रश्न?', answer: 'टेस्ट उत्तर' }],
      ['fr', { question: 'Question de test?', answer: 'Réponse de test' }]
    ])
  };

  beforeEach(async () => {
    await FAQ.deleteMany({});
  });

  describe('Validation', () => {
    test('should create & save FAQ successfully', async () => {
      const validFAQ = new FAQ(sampleFAQ);
      const savedFAQ = await validFAQ.save();
      
      expect(savedFAQ._id).toBeDefined();
      expect(savedFAQ.question).toBe(sampleFAQ.question);
      expect(savedFAQ.answer).toBe(sampleFAQ.answer);
      expect(savedFAQ.createdAt).toBeDefined();
    });

    test('should fail to save FAQ without required fields', async () => {
      const faqWithoutRequired = new FAQ({});
      let err;
      
      try {
        await faqWithoutRequired.save();
      } catch (error) {
        err = error;
      }
      
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
  });

  describe('Translation Methods', () => {
    test('getQuestion should return correct translation', async () => {
      const faq = new FAQ(sampleFAQ);
      
      expect(faq.getQuestion('hi')).toBe('टेस्ट प्रश्न?');
      expect(faq.getQuestion('fr')).toBe('Question de test?');
      expect(faq.getQuestion('en')).toBe('Test Question?');
      expect(faq.getQuestion('es')).toBe('Test Question?'); // Fallback to English
    });

    test('getAnswer should return correct translation', async () => {
      const faq = new FAQ(sampleFAQ);
      
      expect(faq.getAnswer('hi')).toBe('टेस्ट उत्तर');
      expect(faq.getAnswer('fr')).toBe('Réponse de test');
      expect(faq.getAnswer('en')).toBe('Test Answer');
      expect(faq.getAnswer('es')).toBe('Test Answer'); // Fallback to English
    });
  });

  describe('Static Methods', () => {
    test('findByLanguage should return translated FAQs', async () => {
      await new FAQ(sampleFAQ).save();
      
      const enFaqs = await FAQ.findByLanguage('en');
      expect(enFaqs[0].question).toBe('Test Question?');
      
      const hiFaqs = await FAQ.findByLanguage('hi');
      expect(hiFaqs[0].question).toBe('टेस्ट प्रश्न?');
    });

    test('supportedLanguages should return all available languages', async () => {
      const faq = new FAQ(sampleFAQ);
      const languages = faq.supportedLanguages;
      
      expect(languages).toContain('en');
      expect(languages).toContain('hi');
      expect(languages).toContain('fr');
      expect(languages.length).toBe(3);
    });
  });
});