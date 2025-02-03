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


faqSchema.methods.getQuestion = function(lang = 'en') {
  if (lang === 'en') return this.question;
  return this.translations.get(lang)?.question || this.question;
};


faqSchema.methods.getAnswer = function(lang = 'en') {
  if (lang === 'en') return this.answer;
  return this.translations.get(lang)?.answer || this.answer;
};


faqSchema.statics.findByLanguage = async function(lang = 'en') {
  const faqs = await this.find();
  return faqs.map(faq => ({
    _id: faq._id,
    question: faq.getQuestion(lang),
    answer: faq.getAnswer(lang),
    createdAt: faq.createdAt
  }));
};


faqSchema.virtual('supportedLanguages').get(function() {
  const languages = ['en', ...Array.from(this.translations.keys())];
  return [...new Set(languages)]; 
});

export default mongoose.model('FAQ', faqSchema);
