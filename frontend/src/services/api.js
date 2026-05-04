import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3004', // URL do backend
});

export default api;