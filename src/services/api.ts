import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('cliente');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const register = (data: any) => api.post('/clientes/register', data);
export const login = (data: { email: string; senha: string }) =>
  api.post('/clientes/login', data);
export const getMe = () => api.get('/clientes/me');
export const alterarSenha = (data: { senhaAtual: string; novaSenha: string }) =>
  api.put('/clientes/me/senha', data);
export const atualizarEndereco = (data: {
  cep?: string; cidade?: string; endereco?: string;
  numero?: string; bairro?: string; complemento?: string;
}) => api.put('/clientes/me/endereco', data);
export const renovarPlanoPix = (plano: 'mensal' | 'anual') =>
  api.post('/clientes/me/renovar', { plano });
export const criarCheckoutAsaas = (plano: 'mensal' | 'anual') =>
  api.post('/asaas/create-checkout', { plano });
export const esqueciSenha = (email: string) =>
  api.post('/clientes/esqueci-senha', { email });
export const redefinirSenha = (token: string, novaSenha: string) =>
  api.post('/clientes/redefinir-senha', { token, novaSenha });

export default api;
