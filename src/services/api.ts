import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

export const register = (data: any) => api.post('/clientes/register', data);

export default api;

