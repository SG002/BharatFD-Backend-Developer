const googletrans = require('googletrans').default;

const supportedLanguages = ['hi', 'bn', 'fr', 'es']; 

async function translateFAQContent(question, answer) {
  const translations = new Map();
  
  for (const lang of supportedLanguages) {
    try {
      const [translatedQuestion, translatedAnswer] = await Promise.all([
        googletrans(question, { to: lang }),
        googletrans(answer, { to: lang })
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

module.exports = { 
  translateFAQContent,
  translateFAQ: translateFAQContent,
  supportedLanguages 
};