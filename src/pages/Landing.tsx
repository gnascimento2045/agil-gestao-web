import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight, Check, X, Download, MessageCircle,
  Clock, Shield, Zap, Sparkles, ChevronRight, Menu,
  Crown, CalendarDays
} from 'lucide-react';
import { toast } from 'sonner';
import { register } from '../services/api';

import { maskTelefone, maskCpfCnpj } from '../utils/masks';

const DOWNLOAD_URL = 'https://pub-269810c1c90047949ec25a9b7b9a5545.r2.dev/releases/agil-gestao-setup.exe';
const WHATSAPP_URL = 'https://wa.me/5561992724480';

interface LicencaInfo {
  chave: string;
  dataExpiracao: string;
  diasRestantes: number;
}

export default function Landing() {
  const location = useLocation();
  const [step, setStep] = useState<'landing' | 'form' | 'success'>(location.state?.from === 'login' ? 'form' : 'landing');
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cpf_cnpj: '',
    plano: 'gratis' as 'gratis' | 'mensal' | 'anual',
  });
  const [loading, setLoading] = useState(false);
  const [licencaInfo, setLicencaInfo] = useState<LicencaInfo | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name === 'telefone') value = maskTelefone(value);
    if (e.target.name === 'cpf_cnpj') value = maskCpfCnpj(value);
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handlePlanoChange = (plano: 'gratis' | 'mensal' | 'anual') => {
    setFormData({ ...formData, plano });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        plano: formData.plano,
        telefone: formData.telefone || undefined,
        cpf_cnpj: formData.cpf_cnpj || undefined,
      };
      const response = await register(data);
      const { checkout, checkoutUrl, license, token, user } = response.data;

      // Salva token em qualquer caso
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('cliente', JSON.stringify(user));
      }

      // Plano pago: redireciona para o checkout do Asaas
      if (checkout && checkoutUrl) {
        toast.success('Conta criada! Redirecionando para o pagamento...');
        window.location.href = checkoutUrl;
        return;
      }

      // Plano grátis: vai para a tela de sucesso
      setLicencaInfo({
        chave: license.chave,
        dataExpiracao: license.dataExpiracao,
        diasRestantes: license.diasRestantes ?? 90,
      });
      toast.success('Conta criada! Sua licença está ativa.');
      setStep('success');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro no registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (iso: string) => {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const getPlanoLabel = () => {
    const labels: Record<string, string> = {
      gratis: 'Teste Grátis 30 dias',
      mensal: 'Pro Mensal',
      anual: 'Pro Anual',
    };
    return labels[formData.plano] || 'Teste Grátis 30 dias';
  };

  const getPlanoPreco = () => {
    const precos: Record<string, string> = {
      gratis: 'R$ 0',
      mensal: 'R$ 29,90/mês',
      anual: 'R$ 15,90/mês',
    };
    return precos[formData.plano] || 'R$ 0';
  };

  // ── SUCCESS ──────────────────────────────────────────────
  if (step === 'success' && licencaInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => setStep('form')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Voltar
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tudo pronto.</h2>
            <p className="text-gray-500">Sua licença está ativa.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Plano:</span> {getPlanoLabel()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Válida até:</span> {formatarData(licencaInfo.dataExpiracao)}
            </p>
          </div>

          <a
            href={DOWNLOAD_URL}
            download
            className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl transition-all mb-3 shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-5 h-5" />
            Baixar Agora
          </a>

          {formData.plano === 'gratis' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-amber-700 text-center">
                 Teste grátis por 30 dias. Após isso, escolha um plano para continuar.
               </p>
            </div>
          )}

          <div className="text-center space-y-2">
            <Link
              to="/painel"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium block"
            >
              Acessar painel de controle →
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-400 hover:text-gray-600 block"
            >
              Precisa de ajuda?
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── FORM ──────────────────────────────────────────────
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <button
            onClick={() => setStep('landing')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Voltar
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Crie sua conta.</h2>
            <p className="text-gray-500">Escolha seu plano e comece agora.</p>
          </div>

          {/* Seleção de Plano */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3">Escolha seu plano</p>
            <div className="space-y-3">
              {[
                { key: 'gratis' as const, icon: Clock, label: 'Teste Grátis', badge: '30 dias', desc: 'Sem cartão de crédito', preco: 'R$ 0' },
                { key: 'mensal' as const, icon: Crown, label: 'Pro Mensal', badge: null, desc: 'Tudo do gratís + relatórios avançados', preco: 'R$ 29,90' },
                { key: 'anual' as const, icon: CalendarDays, label: 'Pro Anual', badge: 'ECONOMIZE 47%', desc: 'Cobrado anualmente (R$ 190,80)', preco: 'R$ 15,90/mês' },
              ].map(({ key, icon: Icon, label, badge, desc, preco }) => {
                const selected = formData.plano === key;
                return (
                  <label
                    key={key}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selected
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plano"
                      value={key}
                      checked={selected}
                      onChange={() => setFormData({ ...formData, plano: key })}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      selected ? 'bg-emerald-500' : 'border-2 border-gray-300'
                    }`}>
                      {selected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${selected ? 'text-emerald-500' : 'text-gray-400'}`} />
                        <span className="font-semibold text-gray-900">{label}</span>
                        {badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            key === 'anual'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>{badge}</span>
                        )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
                    </div>
                    <span className="font-bold text-gray-900">{preco}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input
                name="nome"
                placeholder="Nome da sua empresa"
                value={formData.nome}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>
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
            <div>
              <input
                type="password"
                name="senha"
                placeholder="Crie uma senha"
                value={formData.senha}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="telefone"
                placeholder="WhatsApp"
                value={formData.telefone}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
              <input
                name="cpf_cnpj"
                placeholder="CPF ou CNPJ"
                value={formData.cpf_cnpj}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Criando...' : (
                <><Sparkles className="w-4 h-4" /> Criar Conta — {getPlanoPreco()}</>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Ao criar sua conta, você terá acesso ao painel para gerenciar sua assinatura.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ── LANDING ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/icone.png" alt="Hii" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Ágil <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">Gestão</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#beneficios" className="hover:text-gray-900 transition-colors">Benefícios</a>
            <a href="#como-funciona" className="hover:text-gray-900 transition-colors">Como Funciona</a>
            <a href="#planos" className="hover:text-gray-900 transition-colors">Planos</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">Suporte</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-600 hover:text-emerald-600 font-medium px-3 py-2 transition-colors"
            >
              Login
            </Link>
            <button
              onClick={() => setStep('form')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-5 py-2 rounded-full text-sm transition-all"
            >
              Começar Grátis
            </button>
            <button className="md:hidden text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 text-sm text-gray-500">
            <a href="#beneficios" className="block hover:text-gray-900" onClick={() => setMenuOpen(false)}>Benefícios</a>
            <a href="#como-funciona" className="block hover:text-gray-900" onClick={() => setMenuOpen(false)}>Como Funciona</a>
            <a href="#planos" className="block hover:text-gray-900" onClick={() => setMenuOpen(false)}>Planos</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="block hover:text-gray-900">Suporte</a>
            <Link to="/login" className="block hover:text-emerald-600" onClick={() => setMenuOpen(false)}>Login</Link>
          </div>
        )}
      </nav>

      {/* 1. HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/50 via-lime-50/30 via-white to-black" />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-emerald-500/10" />
        <div className="absolute inset-0 bg-gradient-to-bl from-black/5 via-transparent to-orange-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tr from-emerald-400 to-lime-500 rounded-full blur-3xl opacity-15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-black/5 to-orange-500/10 rounded-full blur-3xl" />

        <div className="relative w-full max-w-7xl mx-auto px-6 perspective-1000">
          <div className="flex flex-wrap justify-center items-end gap-4 py-8">
            <div className="relative group" style={{ animation: 'floatTab1 7s ease-in-out infinite' }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs font-medium px-4 py-1.5 rounded-t-lg shadow-lg whitespace-nowrap">Dashboard</div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-white rounded-2xl p-3 border border-gray-200 shadow-xl">
                <div className="rounded-xl overflow-hidden w-80 shadow-lg">
                  <img src="/images/model/dashboard.jpg" alt="Dashboard" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
            <div className="relative group" style={{ animation: 'floatTab2 8s ease-in-out infinite' }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs font-medium px-4 py-1.5 rounded-t-lg shadow-lg whitespace-nowrap">PDV - Ponto de Venda</div>
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-white rounded-2xl p-3 border border-gray-200 shadow-xl">
                <div className="rounded-xl overflow-hidden w-72 shadow-lg">
                  <img src="/images/model/pdv.jpg" alt="PDV" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
            <div className="relative group" style={{ animation: 'floatTab3 7.5s ease-in-out infinite' }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs font-medium px-4 py-1.5 rounded-t-lg shadow-lg whitespace-nowrap">Lista de Produtos</div>
              <div className="absolute -inset-1 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-white rounded-2xl p-3 border border-gray-200 shadow-xl">
                <div className="rounded-xl overflow-hidden w-72 shadow-lg">
                  <img src="/images/model/listaprodutos.jpg" alt="Lista de Produtos" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
            <div className="relative group" style={{ animation: 'floatTab4 8.5s ease-in-out infinite' }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs font-medium px-4 py-1.5 rounded-t-lg shadow-lg whitespace-nowrap">Relatório de Vendas</div>
              <div className="absolute -inset-1 bg-gradient-to-r from-black to-gray-800 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-white rounded-2xl p-3 border border-gray-200 shadow-xl">
                <div className="rounded-xl overflow-hidden w-72 shadow-lg">
                  <img src="/images/model/relatoriovendas.jpg" alt="Relatório de Vendas" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center px-6 -mt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Teste grátis por 30 dias — sem cartão
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-gray-900">
            Controle total do seu<br />
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              negócio em um só lugar.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            PDV, estoque e vendas organizados. Simples assim.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setStep('form')}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-xl shadow-emerald-500/30"
            >
              Começar Grátis <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={DOWNLOAD_URL}
              download
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-medium px-8 py-4 rounded-full transition-all border border-gray-800"
            >
              <Download className="w-4 h-4" /> Baixar Agora
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-pulse" />
          </div>
        </div>

        <style>{`
          @keyframes floatTab1 { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-20px) rotate(-2deg); } }
          @keyframes floatTab2 { 0%, 100% { transform: translateY(0) rotate(1deg); } 50% { transform: translateY(-25px) rotate(1deg); } }
          @keyframes floatTab3 { 0%, 100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-15px) rotate(-1deg); } }
          @keyframes floatTab4 { 0%, 100% { transform: translateY(0) rotate(2deg); } 50% { transform: translateY(-22px) rotate(2deg); } }
          .perspective-1000 { perspective: 1000px; }
        `}</style>
      </section>

      {/* 2. DOR */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">O problema</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Você se identifica?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: X, text: 'Planilhas espalhadas e desatualizadas' },
              { icon: X, text: 'Não sabe o que realmente vende mais' },
              { icon: X, text: 'Equipe perdida sem processo claro' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 border border-gray-200 rounded-2xl bg-white">
                <item.icon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRANSFORMAÇÃO */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">A mudança</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Antes vs Depois</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 border border-red-200 rounded-3xl bg-red-50/50">
              <p className="text-red-600 text-sm font-medium mb-6">ANTES</p>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-3"><X className="w-4 h-4 text-red-500" /> Caos no controle de estoque</li>
                <li className="flex items-center gap-3"><X className="w-4 h-4 text-red-500" /> Vendas perdidas na anotação</li>
                <li className="flex items-center gap-3"><X className="w-4 h-4 text-red-500" /> Decisões no escuro</li>
              </ul>
            </div>
            <div className="p-8 border border-emerald-200 rounded-3xl bg-emerald-50/50">
              <p className="text-emerald-600 text-sm font-medium mb-6">DEPOIS</p>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> Estoque sempre atualizado</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> Todas as vendas registradas</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-emerald-500" /> Dados para decidir melhor</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENEFÍCIOS */}
      <section id="beneficios" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Por que escolher</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Resultados reais</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'Venda mais', desc: 'Identifique seus produtos campeões e foque no que realmente importa.' },
              { icon: Clock, title: 'Ganhe tempo', desc: 'Processos automáticos liberam horas da sua semana.' },
              { icon: Shield, title: 'Zero erros', desc: 'Sem mais perdas por falta de controle ou desorganização.' },
            ].map((item, i) => (
              <div key={i} className="group p-8 border border-gray-200 rounded-3xl bg-white hover:border-emerald-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Implementação</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Três passos. Simples assim.</h2>
          </div>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Baixe o app', desc: 'Instale em qualquer computador. Leva 2 minutos.' },
              { step: '02', title: 'Escolha seu plano', desc: 'Grátis 30 dias. Teste tudo gratuitamente.' },
              { step: '03', title: 'Comece a vender', desc: 'Pronto. Seu controle completo está funcionando.' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-6 border border-gray-200 rounded-2xl bg-white">
                <span className="text-4xl font-bold text-gray-200">{item.step}</span>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Escolha seu plano</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Teste tudo grátis</h2>
            <p className="text-gray-500 mt-4">Cancele quando quiser. Sem taxas escondidas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 border border-gray-200 rounded-3xl bg-white">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-emerald-500" />
                <span className="text-emerald-600 font-semibold">Teste Grátis</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">R$ 0</span>
                <span className="text-gray-500">/30 dias</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['PDV completo', 'Produtos ilimitados', 'Relatórios básicos', 'Suporte por email'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => { setFormData({ ...formData, plano: 'gratis' }); setStep('form'); }}
                className="w-full py-3 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all">
                Começar Grátis
              </button>
            </div>

            <div className="p-8 border-2 border-emerald-500 rounded-3xl bg-white relative">
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">RECOMENDADO</div>
               <div className="flex items-center gap-2 mb-4">
                 <Crown className="w-5 h-5 text-amber-500" />
                 <span className="text-gray-900 font-semibold">Pro Mensal</span>
               </div>
               <div className="mb-6">
                 <span className="text-4xl font-bold text-gray-900">R$ 29,90</span>
                 <span className="text-gray-500">/mês</span>
               </div>
               <ul className="space-y-3 mb-8">
                 {['Tudo do plano grátis', 'Produtos ilimitados', 'Relatórios avançados', 'Suporte prioritário', 'Painel de controle'].map(f => (
                   <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                     <Check className="w-4 h-4 text-emerald-500" /> {f}
                   </li>
                 ))}
               </ul>
               <button onClick={() => { setFormData({ ...formData, plano: 'mensal' }); setStep('form'); }}
                 className="w-full py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all">
                 Assinar Mensal
               </button>
             </div>

            <div className="p-8 border border-emerald-200 rounded-3xl bg-white">
               <div className="flex items-center gap-2 mb-4">
                 <CalendarDays className="w-5 h-5 text-emerald-500" />
                 <span className="text-gray-900 font-semibold">Pro Anual</span>
                 <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">ECONOMIZE 47%</span>
               </div>
               <div className="mb-6">
                 <span className="text-4xl font-bold text-gray-900">R$ 15,90</span>
                 <span className="text-gray-500">/mês</span>
                 <p className="text-sm text-gray-400 mt-1">Cobrado anualmente (R$ 190,80)</p>
               </div>
               <ul className="space-y-3 mb-8">
                 {['Tudo do plano mensal', 'Economia de R$ 168/ano', 'Suporte VIP', 'Atualizações prioritárias'].map(f => (
                   <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                     <Check className="w-4 h-4 text-emerald-500" /> {f}
                   </li>
                 ))}
               </ul>
               <button onClick={() => { setFormData({ ...formData, plano: 'anual' }); setStep('form'); }}
                 className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all">
                 Assinar Anual
               </button>
             </div>
         </div>
           </div>
       </section>

       {/* 6. AUTORIDADE */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2">+5</p>
              <p className="text-gray-500 text-sm">Negócios ativos em uso</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2">30 dias</p>
               <p className="text-gray-500 text-sm">Para testar tudo</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2">100%</p>
              <p className="text-gray-500 text-sm">Sem burocracia</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA FINAL */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Pronto para organizar<br />sua gestão?
          </h2>
          <p className="text-gray-400 text-lg mb-10">Comece grátis. Cancele quando quiser.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setStep('form')}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-10 py-4 rounded-full transition-all text-lg"
            >
              <Sparkles className="w-5 h-5" /> Criar Conta Grátis
            </button>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium px-10 py-4 rounded-full transition-all">
              <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/images/icone.png" alt="Ágil Gestão" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-gray-900">Ágil <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">Gestão</span></span>
          </div>
          <p className="text-gray-400 text-sm text-center">© 2026 ÁGIL GESTAO. Todos os direitos reservados.<br />Desenvolvido por <a href="https://gssystem.vercel.app" target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium">GS System</a></p>
        </div>
      </footer>

      {/* WhatsApp floating */}
      <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1fbe5a] rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110">
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}

