import express from 'express';
import { Router } from 'express';
import FAQ from '../models/faqm.js';
import { translateFAQ, supportedLanguages } from '../helper/translate.js';  
import { cacheService } from '../config/redis.js';

const router = Router();


const validateLang = (req, res, next) => {
  const lang = req.query.lang || 'en';
  if (lang !== 'en' && !supportedLanguages.includes(lang)) {
    return res.status(400).json({ 
      error: `Unsupported language. Supported languages are: en, ${supportedLanguages.join(', ')}` 
    });
  }
  next();
};


router.get('/', validateLang, async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const cacheKey = `faqs:${lang}`;


    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

   
    const faqs = await FAQ.findByLanguage(lang);
    const response = {
      language: lang,
      supportedLanguages: ['en', ...supportedLanguages],
      count: faqs.length,
      faqs
    };

    await cacheService.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error('Get FAQs Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', validateLang, async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const cacheKey = `faq:${req.params.id}:${lang}`;

    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    const response = {
      _id: faq._id,
      question: faq.getQuestion(lang),
      answer: faq.getAnswer(lang),
      createdAt: faq.createdAt,
      supportedLanguages: faq.supportedLanguages
    };

    await cacheService.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error('Get FAQ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const translations = await translateFAQ(question, answer);
    const faq = new FAQ({ question, answer, translations });
    await faq.save();

    await cacheService.clearPattern('faqs:*');
    
    res.status(201).json(faq);
  } catch (error) {
    console.error('Create FAQ Error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    const translations = await translateFAQ(
      question || faq.question,
      answer || faq.answer
    );

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      {
        question: question || faq.question,
        answer: answer || faq.answer,
        translations
      },
      { new: true, runValidators: true }
    );

    await cacheService.clearPattern(`faq:${req.params.id}:*`);
    await cacheService.clearPattern('faqs:*');

    res.json({
      _id: updatedFAQ._id,
      question: updatedFAQ.question,
      answer: updatedFAQ.answer,
      createdAt: updatedFAQ.createdAt,
      supportedLanguages: updatedFAQ.supportedLanguages
    });
  } catch (error) {
    console.error('Update FAQ Error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);

    if (!deletedFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    await cacheService.clearPattern(`faq:${req.params.id}:*`); 
    await cacheService.clearPattern('faqs:*');

    res.status(204).end();
  } catch (error) {
    console.error('Delete FAQ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export { router }; 