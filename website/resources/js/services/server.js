import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:80/api';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const buildService = {
  generateBuild: async (budget, locked = {}) => {
    try {
      const payload = { budget };
      if (locked && Object.keys(locked).length > 0) {
        payload.locked = locked;
      }
      const response = await axios.post('/build/generate', payload);
      return response.data;
    } catch (error) {
      console.error(
        'failed to generate: ',
        error.response?.data ?? error
      );
      throw error;
    }
  },
};
