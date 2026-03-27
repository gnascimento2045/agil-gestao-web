import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { login } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', senha: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData);
      const { token, cliente } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('cliente', JSON.stringify(cliente));

      toast.success('Login realizado com sucesso!');
      navigate('/painel');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Voltar
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta.</h2>
          <p className="text-gray-500">Faça login para acessar sua conta.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="senha"
              placeholder="Sua senha"
              value={formData.senha}
              onChange={handleInputChange}
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Não tem uma conta?{' '}
          <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
