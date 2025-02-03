import { translate } from '@vitalets/google-translate-api';

export const supportedLanguages = ['hi', 'bn', 'fr', 'es'];

export async function translateFAQContent(question, answer) {
  const translations = new Map();
  
  for (const lang of supportedLanguages) {
    try {
      const [translatedQuestion, translatedAnswer] = await Promise.all([
        translate(question, { to: lang }),
        translate(answer, { to: lang })
      ]);
      
      translations.set(lang, {
        question: translatedQuestion.text,
        answer: translatedAnswer.text
      });
    } catch (error) {
      console.error(`Translation to ${lang} failed:`, error);
    }
  }
  
  return translations;
}

export const translateFAQ = translateFAQContent;