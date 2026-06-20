import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { esqueciSenha } from '../services/api';

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await esqueciSenha(email);
      toast.success(response.data.mensagem);
      setEnviado(true);
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro ao enviar solicitação');
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <>
        <Helmet>
          <title>Email enviado - Ágil Gestão</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verifique seu email</h2>
            <p className="text-gray-500 mb-8">
              Enviamos um link de redefinição para <strong>{email}</strong>.
              Ele expira em 1 hora.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Voltar para o login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Esqueci minha senha - Ágil Gestão</title>
        <meta name="description" content="Redefina sua senha da Ágil Gestão. Informe seu email e enviaremos um link para criar uma nova senha." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Voltar
        </button>

        <div className="text-center mb-8">
          <Mail className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Esqueceu sua senha?</h2>
          <p className="text-gray-500">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            {loading ? 'Enviando...' : 'Enviar link de redefinição'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
