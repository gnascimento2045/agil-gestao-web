import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { redefinirSenha } from '../services/api';

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [redefinido, setRedefinido] = useState(false);

  if (!token) {
    return (
      <>
        <Helmet>
          <title>Link inválido - Ágil Gestão</title>
          <meta name="description" content="O link de redefinição de senha é inválido ou expirou. Solicite um novo link para redefinir sua senha." />
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Link inválido</h2>
            <p className="text-gray-500 mb-8">
              O link de redefinição é inválido ou está faltando o token.
            </p>
            <button
              onClick={() => navigate('/esqueci-senha')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Solicitar novo link
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não conferem');
      return;
    }

    setLoading(true);
    try {
      const response = await redefinirSenha(token, novaSenha);
      toast.success(response.data.mensagem);
      setRedefinido(true);
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  if (redefinido) {
    return (
      <>
        <Helmet>
          <title>Senha redefinida - Ágil Gestão</title>
          <meta name="description" content="Sua senha foi redefinida com sucesso! Faça login com sua nova senha e aproveite todos os recursos da Ágil Gestão." />
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Senha redefinida!</h2>
            <p className="text-gray-500 mb-8">
              Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Fazer login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Redefinir senha - Ágil Gestão</title>
        <meta name="description" content="Redefina sua senha da Ágil Gestão. Escolha uma nova senha para sua conta." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Lock className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Redefinir senha</h2>
          <p className="text-gray-500">
            Escolha uma nova senha para sua conta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              minLength={6}
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

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirmar nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              minLength={6}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition pr-12"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
