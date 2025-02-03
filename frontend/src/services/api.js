import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

export const faqAPI = {
  getAll: async (lang = 'en') => {
    const response = await api.get(`/faqs?lang=${lang}`);
    return response.data;
  },

  getById: async (id, lang = 'en') => {
    const response = await api.get(`/faqs/${id}?lang=${lang}`);
    return response.data;
  },

  create: async (faqData) => {
    try {
      const response = await api.post('/faqs', {
        question: faqData.question.trim(),
        answer: faqData.answer.trim()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  },

  update: async (id, faqData) => {
    const response = await api.put(`/faqs/${id}`, faqData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/faqs/${id}`);
  }
};

export default api;
