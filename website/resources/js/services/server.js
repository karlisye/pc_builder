import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:80/api';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const buildService = {
  generateBuild: async (budget) => {
    try {
      const response = await axios.post('/build/generate', { budget });
      return response.data;
    } catch (error) {
      console.error('failed to generate: ', error)
    }
  },
  generateBuildWithLocked: async (budget, locked) => {
    try {
      const response = await axios.post('/build/generate', { budget, locked });
      return response.data;
    } catch (error) {
      console.error('failed to generate with locked components: ', error);
      throw error;
    }
  },
};
