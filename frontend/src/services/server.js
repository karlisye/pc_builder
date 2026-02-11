import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const buildService = {
  generateBuild: async (budget) => {
    const response = await axios.post('/build/generate', { budget });
    return response.data;
  },
};
