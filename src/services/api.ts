import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

export const register = (data: any) => api.post('/clientes/register', data);
export const login = (data: { email: string; senha: string }) => api.post('/clientes/login', data);

export default api;

