import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: {
    type: Map,
    of: {
      question: String,
      answer: String
    }
  },
  createdAt: { type: Date, default: Date.now }
});

// Method to get translated question
faqSchema.methods.getQuestion = function(lang = 'en') {
  if (lang === 'en') return this.question;
  return this.translations.get(lang)?.question || this.question;
};

// Method to get translated answer
faqSchema.methods.getAnswer = function(lang = 'en') {
  if (lang === 'en') return this.answer;
  return this.translations.get(lang)?.answer || this.answer;
};

// Static method to find FAQs with translations
faqSchema.statics.findByLanguage = async function(lang = 'en') {
  const faqs = await this.find();
  return faqs.map(faq => ({
    _id: faq._id,
    question: faq.getQuestion(lang),
    answer: faq.getAnswer(lang),
    createdAt: faq.createdAt
  }));
};

// Virtual for supported languages
faqSchema.virtual('supportedLanguages').get(function() {
  const languages = ['en', ...Array.from(this.translations.keys())];
  return [...new Set(languages)]; // Remove duplicates
});

export default mongoose.model('FAQ', faqSchema);
