import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Download, Users, ShoppingCart, BarChart2,
  Copy, CheckCircle, Package, Scissors, Store, Truck,
  MessageCircle, Star, ChevronDown, Monitor, Lock, Mail,
  Phone, User, CreditCard, X, Menu, Clock, Shield, Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { register } from '../services/api';

const DOWNLOAD_URL = 'https://github.com/gnascimento2045/agil-gestao-desktop/releases/download/v1.0.0/Agil.Gestao.Setup.1.0.0.exe';
const WHATSAPP_URL = 'https://wa.me/5561992724480';

const DEMO_IMAGES = [
  { src: '/images/model/demo1.jpeg', label: 'Dashboard' },
  { src: '/images/model/demo2.jpeg', label: 'PDV — Nova Venda' },
  { src: '/images/model/demo3.jpeg', label: 'Forma de Pagamento' },
  { src: '/images/model/demo4.jpeg', label: 'Relatórios' },
  { src: '/images/model/demo5.jpeg', label: 'PDV — Carrinho' },
];

const SEGMENTOS = [
  { icon: Truck, label: 'Distribuidoras' },
  { icon: Store, label: 'Mercados' },
  { icon: Scissors, label: 'Barbearias' },
  { icon: Package, label: 'Comércios em geral' },
];

const FEATURES = [
  {
    icon: ShoppingCart,
    title: 'PDV Completo',
    desc: 'Frente de caixa rápida com leitura de código de barras, desconto e múltiplas formas de pagamento.',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: Package,
    title: 'Gestão de Produtos',
    desc: 'Cadastro, controle de estoque e precificação de forma simples e eficiente.',
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    icon: BarChart2,
    title: 'Relatórios',
    desc: 'Acompanhe produtos mais vendidos, resumo do dia e histórico de vendas.',
    color: 'from-indigo-600 to-indigo-800',
  },
  {
    icon: Users,
    title: 'Clientes Ilimitados',
    desc: 'Cadastre e gerencie sua base de clientes sem limite.',
    color: 'from-teal-600 to-teal-800',
  },
];

interface LicencaInfo {
  chave: string;
  dataExpiracao: string;
  diasRestantes: number;
}

export default function Landing() {
  const [step, setStep] = useState<'landing' | 'form' | 'success'>('landing');
  const [activeDemo, setActiveDemo] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cpf_cnpj: '',
    plano: 'gratis' as any,
  });
  const [loading, setLoading] = useState(false);
  const [licencaInfo, setLicencaInfo] = useState<LicencaInfo | null>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo(prev => (prev + 1) % DEMO_IMAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        plano: 'gratis',
        telefone: formData.telefone || undefined,
        cpf_cnpj: formData.cpf_cnpj || undefined,
      };
      const response = await register(data);
      const { license } = response.data;
      setLicencaInfo({
        chave: license.chave,
        dataExpiracao: license.dataExpiracao,
        diasRestantes: license.diasRestantes ?? 7,
      });
      toast.success('Conta criada! Sua chave de licença foi gerada.');
      setStep('success');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro no registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyChave = () => {
    if (!licencaInfo) return;
    navigator.clipboard.writeText(licencaInfo.chave);
    toast.success('Chave copiada!');
  };

  const formatarData = (iso: string) => {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  // ── SUCCESS ──────────────────────────────────────────────
  if (step === 'success' && licencaInfo) {
    return (
      <div className="min-h-screen bg-[#0f1e3c] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Tudo certo!</h2>
          <p className="text-slate-400 mb-8">
            Sua conta foi criada com sucesso.
          </p>

          {/* Aviso de expiração */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 mb-6 text-left">
            <Calendar className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-semibold text-sm">
                Período de teste: {licencaInfo.diasRestantes} dias
              </p>
              <p className="text-amber-400/70 text-sm mt-0.5">
                Expira em <strong>{formatarData(licencaInfo.dataExpiracao)}</strong>. Após esse prazo, contrate um plano para continuar usando.
              </p>
            </div>
          </div>

          {/* Chave de licença */}
          <div className="bg-[#0a1628] rounded-2xl p-6 mb-6 text-left border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                Chave de Licença
              </span>
              <button
                onClick={handleCopyChave}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
              >
                <Copy className="w-4 h-4" /> Copiar
              </button>
            </div>
            <code className="block font-mono text-lg font-bold text-white break-all tracking-wider">
              {licencaInfo.chave}
            </code>
            <p className="text-slate-500 text-xs mt-3">
              Use essa chave para ativar o sistema após instalar.
            </p>
          </div>

          <a
            href={DOWNLOAD_URL}
            download
            className="flex items-center justify-center gap-3 w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-500/30 mb-3"
          >
            <Download className="w-5 h-5" />
            Baixar Agil Gestão
          </a>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium py-3 rounded-2xl transition-all mb-4 text-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            Precisa de ajuda? Fale no WhatsApp
          </a>

          <button onClick={() => setStep('landing')} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // ── FORM ──────────────────────────────────────────────
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-[#0f1e3c] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <button
            onClick={() => setStep('landing')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <X className="w-4 h-4" /> Fechar
          </button>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <img src="/images/logo.png" alt="Agil Gestão" className="h-12 w-12 rounded-xl" />
              <div>
                <h2 className="text-2xl font-bold text-white">Criar Conta Grátis</h2>
                <p className="text-emerald-400 text-sm font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 7 dias de teste sem cartão
                </p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  <User className="w-3.5 h-3.5 inline mr-1.5" />Nome da Loja *
                </label>
                <input
                  name="nome"
                  placeholder="Minha Loja"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  <Mail className="w-3.5 h-3.5 inline mr-1.5" />Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="contato@minhaloja.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  <Lock className="w-3.5 h-3.5 inline mr-1.5" />Senha *
                </label>
                <input
                  type="password"
                  name="senha"
                  placeholder="••••••••"
                  value={formData.senha}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    <Phone className="w-3.5 h-3.5 inline mr-1.5" />Telefone
                  </label>
                  <input
                    name="telefone"
                    placeholder="(61) 99999-9999"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    <CreditCard className="w-3.5 h-3.5 inline mr-1.5" />CPF/CNPJ
                  </label>
                  <input
                    name="cpf_cnpj"
                    placeholder="00.000.000/0001-00"
                    value={formData.cpf_cnpj}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex gap-3">
                <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-300">
                  Teste grátis por <strong>7 dias</strong>. Sem cartão de crédito.
                  Após o período, escolha um plano para continuar.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                {loading ? 'Criando...' : (
                  <><ArrowRight className="w-5 h-5" /> Começar Teste Grátis</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── LANDING ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f1e3c] text-white">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#0f1e3c]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Agil Gestão" className="h-9 w-9 rounded-lg" />
            <span className="font-bold text-lg tracking-tight">Ágil Gestão</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#demonstracao" className="hover:text-white transition-colors">Demonstração</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Suporte</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setStep('form')}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              Teste Grátis
            </button>
          </div>
          <button className="md:hidden text-slate-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#0f1e3c] border-t border-white/5 px-4 py-4 space-y-3 text-sm text-slate-300">
            <a href="#funcionalidades" className="block hover:text-white" onClick={() => setMenuOpen(false)}>Funcionalidades</a>
            <a href="#demonstracao" className="block hover:text-white" onClick={() => setMenuOpen(false)}>Demonstração</a>
            <a href="#planos" className="block hover:text-white" onClick={() => setMenuOpen(false)}>Planos</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="block hover:text-white">Suporte</a>
            <button onClick={() => setStep('form')} className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-xl">
              Teste Grátis
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Star className="w-3.5 h-3.5 fill-emerald-400" />
              7 dias grátis — sem cartão de crédito
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
              Sistema de Gestão para o seu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Negócio
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-lg">
              PDV, controle de estoque, relatórios e muito mais. Ideal para distribuidoras,
              mercados, barbearias e comércios em geral.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setStep('form')}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-500/25"
              >
                <ArrowRight className="w-5 h-5" /> Começar Grátis
              </button>
              <a
                href={DOWNLOAD_URL}
                download
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl transition-all"
              >
                <Download className="w-5 h-5" /> Baixar Agora
              </a>
            </div>

            <div className="flex flex-wrap gap-6 mt-10 text-sm text-slate-400">
              {SEGMENTOS.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-emerald-400" /> {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/10 rounded-3xl blur-2xl" />
            <div className="relative bg-[#162340] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-[#0a1628] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500/60 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500/60 rounded-full" />
                  <div className="w-3 h-3 bg-emerald-500/60 rounded-full" />
                </div>
                <span className="text-xs text-slate-500 mx-auto">Ágil Gestão</span>
              </div>
              <img
                src="/images/model/demo1.jpeg"
                alt="Dashboard Agil Gestão"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <a href="#funcionalidades" className="text-slate-500 hover:text-slate-300 transition-colors animate-bounce">
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className="py-24 px-4 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Tudo que você precisa</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Um sistema completo pensado para simplificar a gestão do seu negócio.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white/3 hover:bg-white/6 border border-white/8 rounded-2xl p-6 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMONSTRAÇÃO */}
      <section id="demonstracao" ref={demoRef} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Veja em ação</h2>
            <p className="text-slate-400 text-lg">Interface limpa e intuitiva para você e sua equipe.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {DEMO_IMAGES.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDemo(i)}
                  className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm font-medium border ${
                    activeDemo === i
                      ? 'bg-blue-600/20 border-blue-500/50 text-white'
                      : 'bg-white/3 border-white/8 text-slate-400 hover:text-white hover:bg-white/6'
                  }`}
                >
                  <Monitor className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              <div className="bg-[#162340] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-[#0a1628] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-red-500/60 rounded-full" />
                    <div className="w-2.5 h-2.5 bg-yellow-500/60 rounded-full" />
                    <div className="w-2.5 h-2.5 bg-emerald-500/60 rounded-full" />
                  </div>
                  <span className="text-xs text-slate-500 mx-auto">{DEMO_IMAGES[activeDemo].label}</span>
                </div>
                <img
                  key={activeDemo}
                  src={DEMO_IMAGES[activeDemo].src}
                  alt={DEMO_IMAGES[activeDemo].label}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-24 px-4 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Planos simples</h2>
            <p className="text-slate-400 text-lg">Comece grátis por 7 dias. Sem cartão de crédito.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Trial */}
            <div className="bg-gradient-to-b from-emerald-600/20 to-emerald-600/5 border-2 border-emerald-500/50 rounded-2xl p-7 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                COMECE AQUI
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-sm">Teste Grátis</span>
              </div>
              <div className="text-4xl font-black mb-1">R$ 0</div>
              <p className="text-slate-400 text-sm mb-6">7 dias sem restrições</p>
              <ul className="space-y-2.5 text-sm text-slate-300 mb-8">
                {['PDV completo', 'Produtos e estoque', 'Relatórios', 'Suporte via WhatsApp'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setStep('form')}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all"
              >
                Começar Grátis
              </button>
            </div>

            {/* Mensal */}
            <div className="bg-white/3 border border-white/10 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm">Mensal</span>
              </div>
              <div className="text-4xl font-black mb-1">
                R$ 49<span className="text-xl text-slate-400">,90/mês</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">Acesso completo</p>
              <ul className="space-y-2.5 text-sm text-slate-300 mb-8">
                {['Tudo do plano teste', 'Sem limite de vendas', 'Atualizações inclusas', 'Suporte prioritário'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Contratar
              </a>
            </div>

            {/* Anual */}
            <div className="bg-white/3 border border-white/10 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-semibold text-sm">Anual — 40% OFF</span>
              </div>
              <div className="text-4xl font-black mb-1">
                R$ 29<span className="text-xl text-slate-400">,90/mês</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">Cobrado anualmente</p>
              <ul className="space-y-2.5 text-sm text-slate-300 mb-8">
                {['Tudo do plano mensal', 'Economia de R$ 240/ano', 'Suporte VIP', 'Licença anual garantida'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Contratar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Pronto para começar?</h2>
          <p className="text-slate-400 text-lg mb-8">Baixe agora e teste por 7 dias sem compromisso.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setStep('form')}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/25"
            >
              <ArrowRight className="w-5 h-5" /> Criar Conta Grátis
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold text-lg px-8 py-4 rounded-2xl transition-all"
            >
              <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Agil Gestão" className="h-8 w-8 rounded-lg" />
            <span className="font-bold text-slate-300">Ágil Gestão</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Ágil Gestão. Todos os direitos reservados.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[#25D366] hover:text-[#1fbe5a] text-sm font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Suporte WhatsApp
          </a>
        </div>
      </footer>

      {/* WhatsApp floating button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1fbe5a] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/30 transition-all hover:scale-110"
        title="Suporte via WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}
