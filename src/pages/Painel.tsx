import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  LogOut, Key, RefreshCw, Lock, ChevronRight, Copy,
  CheckCircle, AlertCircle, Clock, Crown, CalendarDays,
  Sparkles, Eye, EyeOff, CreditCard, MessageCircle,
  Download, ShieldCheck, RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { getMe, alterarSenha, criarCheckoutAsaas } from '../services/api';

// ─── Constantes ──────────────────────────────────────────────────────────────
const WHATSAPP  = 'https://wa.me/5561992724480';
const DOWNLOAD_URL = 'https://pub-269810c1c90047949ec25a9b7b9a5545.r2.dev/releases/agil-gestao-setup.exe';

const PLANOS = {
  mensal: { label: 'Pro Mensal', preco: 'R$ 29,90', dias: 30, icon: Crown },
  anual:  { label: 'Pro Anual',  preco: 'R$ 190,80', dias: 365, icon: CalendarDays },
};

type PlanoKey = keyof typeof PLANOS;

interface LicencaInfo {
  id: number;
  chave: string;
  tipoPlano: string;
  status: string;
  dataExpiracao: string;
  diasRestantes: number;
}

interface ClienteInfo {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf_cnpj?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function labelPlano(tipo: string) {
  if (tipo === 'demo') return 'Teste Grátis';
  if (tipo === 'mensal') return 'Pro Mensal';
  if (tipo === 'anual') return 'Pro Anual';
  return tipo;
}

function corStatus(status: string) {
  if (status === 'ativa') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (status === 'expirada') return 'text-red-600 bg-red-50 border-red-200';
  return 'text-amber-600 bg-amber-50 border-amber-200';
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Painel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [cliente, setCliente] = useState<ClienteInfo | null>(null);
  const [licenca, setLicenca] = useState<LicencaInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Abas
  const [aba, setAba] = useState<'inicio' | 'senha' | 'renovar'>('inicio');

  // Alterar senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha]   = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha]   = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);

  // Renovar plano
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoKey>('mensal');
  const [loadingRenovar, setLoadingRenovar] = useState(false);

  // ── Auth guard + carregar dados ──────────────────────────────────────────
  const carregarDados = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await getMe();
      setCliente(data.cliente);
      setLicenca(data.licenca);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('cliente');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Captura token passado pelo Stripe no redirect (cadastro com plano pago)
  useEffect(() => {
    const tokenUrl = searchParams.get('token');
    if (tokenUrl) {
      localStorage.setItem('token', tokenUrl);
      // Remove o token da URL sem recarregar a página
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  // Feedback após redirect do Stripe
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'sucesso') {
      toast.success('Pagamento confirmado! Seu plano foi atualizado.');
      carregarDados();
    } else if (status === 'cancelado') {
      toast.error('Pagamento cancelado.');
    }
  }, [searchParams, carregarDados]);

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cliente');
    navigate('/login');
  };

  // ── Alterar senha ────────────────────────────────────────────────────────
  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      toast.error('A nova senha e a confirmação não coincidem.');
      return;
    }
    if (novaSenha.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoadingSenha(true);
    try {
      await alterarSenha({ senhaAtual, novaSenha });
      toast.success('Senha alterada com sucesso!');
      setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('');
    } catch (err: any) {
      toast.error(err.response?.data?.erro || 'Erro ao alterar senha.');
    } finally {
      setLoadingSenha(false);
    }
  };

  // ── Renovar via Asaas ───────────────────────────────────────────────────
  const handleRenovarAsaas = async () => {
    setLoadingRenovar(true);
    try {
      const { data } = await criarCheckoutAsaas(planoSelecionado);
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.response?.data?.erro || 'Erro ao iniciar pagamento.');
    } finally {
      setLoadingRenovar(false);
    }
  };



  // ── Calcular dias acumulados (preview) ──────────────────────────────────
  const diasAcumulados = () => {
    const diasPlano = PLANOS[planoSelecionado].dias;
    const diasRestantes = licenca?.diasRestantes ?? 0;
    return diasRestantes + diasPlano;
  };

  const novaDataExpiracao = () => {
    const diasPlano = PLANOS[planoSelecionado].dias;
    const base = licenca && new Date(licenca.dataExpiracao) > new Date()
      ? new Date(licenca.dataExpiracao)
      : new Date();
    const nova = new Date(base);
    nova.setDate(nova.getDate() + diasPlano);
    return nova.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // ─── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // ─── Render principal ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAV */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/icone.png" alt="" className="h-7 w-7 object-contain" />
            <span className="font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Ágil <span className="text-emerald-500">Gestão</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block truncate max-w-[160px]">
              {cliente?.nome}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* ── CARD PLANO ATUAL ─────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Minha Conta</p>
              <h1 className="text-xl font-bold text-gray-900">{cliente?.nome}</h1>
              <p className="text-sm text-gray-500">{cliente?.email}</p>
            </div>
            <a href={DOWNLOAD_URL} download
              className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded-lg px-3 py-1.5 transition-colors">
              <Download className="w-3.5 h-3.5" /> Baixar App
            </a>
          </div>

          <div className="border-t border-gray-100 pt-4">
            {licenca ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Plano */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Plano Atual</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{labelPlano(licenca.tipoPlano)}</span>
                    <span className={`text-xs border px-2 py-0.5 rounded-full font-medium ${corStatus(licenca.status)}`}>
                      {licenca.status}
                    </span>
                  </div>
                </div>

                {/* Expiração */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Válido até</p>
                  <p className="font-semibold text-gray-900">{formatarData(licenca.dataExpiracao)}</p>
                  <p className={`text-xs mt-1 ${licenca.diasRestantes <= 7 ? 'text-red-500' : licenca.diasRestantes <= 30 ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {licenca.diasRestantes > 0
                      ? `${licenca.diasRestantes} dia${licenca.diasRestantes !== 1 ? 's' : ''} restantes`
                      : 'Plano expirado'}
                  </p>
                </div>

              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Nenhuma licença encontrada</p>
                <p className="text-sm text-gray-400 mt-1">Escolha um plano para começar</p>
              </div>
            )}
          </div>
        </div>

        {/* ── ABAS ─────────────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Tab header */}
          <div className="flex border-b border-gray-100">
            {[
              { key: 'inicio', label: 'Início', icon: ShieldCheck },
              { key: 'senha',  label: 'Alterar Senha', icon: Lock },
              { key: 'renovar', label: 'Renovar Plano', icon: RefreshCw },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setAba(key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors ${
                  aba === key
                    ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/30'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* ── ABA INÍCIO ─────────────────────────────────────────────── */}
          {aba === 'inicio' && (
            <div className="p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">Acesso rápido</h2>

              <button
                onClick={() => setAba('renovar')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Renovar / Contratar Plano</p>
                    <p className="text-xs text-gray-400">Renove ou contrate um plano</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </button>

              <button
                onClick={() => setAba('senha')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Alterar Senha</p>
                    <p className="text-xs text-gray-400">Mesma senha usada no app desktop</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </button>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Suporte via WhatsApp</p>
                    <p className="text-xs text-gray-400">Atendimento em tempo real</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </a>

              {licenca && licenca.diasRestantes <= 10 && licenca.status === 'ativa' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Plano expirando em breve</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      Renove agora para não perder o acesso. Dias restantes acumulam sobre o prazo atual.
                    </p>
                    <button
                      onClick={() => setAba('renovar')}
                      className="mt-2 text-xs text-amber-700 font-medium underline"
                    >
                      Renovar agora →
                    </button>
                  </div>
                </div>
              )}

              {licenca && licenca.status === 'expirada' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Sua licença expirou</p>
                    <p className="text-xs text-red-600 mt-0.5">
                      Contrate um plano para voltar a usar o Ágil Gestão.
                    </p>
                    <button
                      onClick={() => setAba('renovar')}
                      className="mt-2 text-xs text-red-700 font-medium underline"
                    >
                      Ver planos →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ABA ALTERAR SENHA ───────────────────────────────────────── */}
          {aba === 'senha' && (
            <div className="p-6">
              <h2 className="font-semibold text-gray-900 mb-1">Alterar Senha</h2>
              <p className="text-sm text-gray-400 mb-6">
                A mesma senha é usada no app desktop e no painel web.
              </p>

              <form onSubmit={handleAlterarSenha} className="space-y-4">
                {/* Senha atual */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Senha atual</label>
                  <div className="relative">
                    <input
                      type={showSenhaAtual ? 'text' : 'password'}
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      required
                      placeholder="Digite sua senha atual"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSenhaAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Nova senha */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Nova senha</label>
                  <div className="relative">
                    <input
                      type={showNovaSenha ? 'text' : 'password'}
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      required
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNovaSenha(!showNovaSenha)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar nova senha */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Confirmar nova senha</label>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    placeholder="Repita a nova senha"
                    className={`w-full bg-white border rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      confirmarSenha && novaSenha !== confirmarSenha
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                  {confirmarSenha && novaSenha !== confirmarSenha && (
                    <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loadingSenha}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-2"
                >
                  {loadingSenha ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </form>
            </div>
          )}

          {/* ── ABA RENOVAR PLANO ───────────────────────────────────────── */}
          {aba === 'renovar' && (
            <div className="p-6 space-y-5">
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">Renovar ou Contratar Plano</h2>
                <p className="text-sm text-gray-400">
                  {licenca && licenca.diasRestantes > 0
                    ? `Você tem ${licenca.diasRestantes} dias restantes. Os dias serão somados ao renovar.`
                    : 'Escolha um plano para começar ou continuar usando o Ágil Gestão.'}
                </p>
              </div>

            <><div className="space-y-3">
                {(Object.keys(PLANOS) as PlanoKey[]).map((key) => {
                  const p = PLANOS[key];
                  const Icon = p.icon;
                  const isAnual = key === 'anual';
                  return (
                    <label
                      key={key}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        planoSelecionado === key
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="plano"
                        value={key}
                        checked={planoSelecionado === key}
                        onChange={() => setPlanoSelecionado(key)}
                        className="w-4 h-4 text-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Icon className={`w-4 h-4 ${isAnual ? 'text-emerald-500' : 'text-amber-500'}`} />
                          <span className="font-semibold text-gray-900">{p.label}</span>
                          {isAnual && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              47% OFF
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{p.dias} dias de acesso</p>
                      </div>
                      <span className="font-bold text-gray-900 whitespace-nowrap">{p.preco}</span>
                    </label>
                  );
                })}
              </div>

              {licenca && licenca.diasRestantes > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">
                      Seus dias serão acumulados!
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {licenca.diasRestantes} dias restantes + {PLANOS[planoSelecionado].dias} dias do novo plano ={' '}
                      <strong>{diasAcumulados()} dias no total</strong>
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Nova expiração: <strong>{novaDataExpiracao()}</strong>
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Você será redirecionado ao Asaas para escolher a forma de pagamento: <strong>PIX ou cartão de crédito</strong>.
                  </p>
                </div>
                <button
                  onClick={handleRenovarAsaas}
                  disabled={loadingRenovar}
                  className="w-full bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  {loadingRenovar
                    ? 'Redirecionando...'
                    : `Renovar Plano — ${PLANOS[planoSelecionado].preco}`}
                </button>
                <p className="text-center text-xs text-gray-400">
                  Pagamento seguro via <strong>Asaas</strong> · SSL criptografado
                </p>
              </div></>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 pb-4">
          © {new Date().getFullYear()} Ágil Gestão
        </p>
      </div>
    </div>
  );
}
