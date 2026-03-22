import { useState, useEffect} from 'react';
import { ArrowRight, Download, Users, CreditCard, Mail, Lock, Phone, User, Copy, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { register } from '../services/api';

const DOWNLOAD_URL = 'https://github.com/gnascimento2045/agil-gestao-desktop/releases/download/v1.0.0/Agil.Gestao.Setup.1.0.0.exe';

export default function Landing() {
  const [step, setStep] = useState<'hero' | 'form' | 'success'>('hero');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    cpf_cnpj: '',
    plano: 'gratis' as 'gratis' | 'mensal' | 'anual',
  });
  const [loading, setLoading] = useState(false);
  const [licencaChave, setLicencaChave] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const planos = [
    { id: 'gratis' as const, title: 'Grátis', subtitle: 'Até R$5.000 em vendas', price: 'R$0', dias: 30, destaque: true },
    { id: 'mensal' as const, title: 'Mensal', subtitle: 'Plano completo', price: 'R$49,90', dias: 30, destaque: false },
    { id: 'anual' as const, title: 'Anual', subtitle: 'Economize 40%', price: 'R$29,90/mês', dias: 360, destaque: false },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setLicencaChave(response.data.license.chave);
      toast.success('Conta criada com sucesso! Sua chave de licença foi gerada.');
      setStep('success');
    } catch (error: any) {
      toast.error(error.response?.data?.erro || 'Erro no registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyChave = () => {
    navigator.clipboard.writeText(licencaChave);
    toast.success('Chave copiada!');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-green-400 to-emerald-500 flex items-center justify-center px-4 py-12 backdrop-blur-sm">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/80 border-white/50 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-emerald-100/80 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg animate-pulse">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
            <CardTitle className="text-4xl bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent font-bold">Sucesso!</CardTitle>
            <CardDescription className="text-lg">Sua conta e licença foram criadas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-6 rounded-2xl border border-emerald-100 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg text-gray-800">Chave da Licença:</span>
                <Button variant="ghost" size="icon" onClick={handleCopyChave} className="hover:bg-emerald-100">
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
              <code className="block bg-gradient-to-r from-white to-gray-50 p-4 rounded-xl font-mono text-xl font-bold text-gray-900 break-all border border-emerald-200 shadow-md">
                {licencaChave}
              </code>
            </div>
            <Button asChild size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 h-16 text-lg shadow-xl">
              <a href={DOWNLOAD_URL} download>
                <Download className="h-6 w-6 mr-3" />
                Baixar Agil Gestão (Grátis)
              </a>
            </Button>
            <Button variant="outline" asChild className="w-full h-14 border-2 border-emerald-200 hover:bg-emerald-50">
              <a href={DOWNLOAD_URL}>
                🚀 Baixar Agora
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50/50 to-purple-50/30 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {step === 'hero' ? (
        <div className="min-h-screen flex flex-col">
          <header className="px-4 lg:px-8 py-6 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4 backdrop-blur-sm bg-white/80 rounded-2xl px-6 py-3 shadow-xl">
                <img src="/images/logo.png" alt="Agil Gestão" className="h-12 w-12 rounded-2xl shadow-lg animate-bounce-slow" loading="lazy" />
                <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent drop-shadow-lg">Agil Gestão</h1>
              </div>
              <Button onClick={() => setStep('form')} className="gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl h-14 px-8 text-lg font-bold animate-pulse-slow">
                Criar Conta Grátis 
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center px-4 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
              <div className="space-y-8 animate-fade-in-up">
                <h2 className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight mb-8 drop-shadow-2xl">
                  Sistema de Vendas <br className="hidden lg:block" />
                  <span className="text-5xl lg:text-6xl bg-gradient-to-r from-emerald-600 to-green-600 block">Completo e{' '}
                  <span className="inline-block animate-pulse bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Rápido</span>
                  </span>
                </h2>
                <p className="text-2xl text-gray-600 mb-12 max-w-xl leading-relaxed backdrop-blur-sm bg-white/60 rounded-2xl p-8 shadow-2xl">
                  Controle PDV, produtos, clientes e vendas com o melhor sistema para seu negócio.{' '}
                  <span className="font-bold text-emerald-600">Teste grátis até R$5.000 em vendas.</span>
                </p>
                <div className="grid lg:grid-cols-2 gap-6 mb-12">
                  <div className="flex items-center gap-4 p-6 bg-white/70 hover:bg-white backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/50">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <span className="text-xl font-bold text-gray-800">Clientes ilimitados</span>
                  </div>
                  <div className="flex items-center gap-4 p-6 bg-white/70 hover:bg-white backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/50">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-emerald-600" />
                    </div>
                    <span className="text-xl font-bold text-gray-800">Vendas instantâneas</span>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                  <Button size="lg" className="flex-1 gap-3 text-xl h-20 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-600 shadow-2xl hover:shadow-3xl font-bold backdrop-blur-sm" onClick={() => setStep('form')}>
                    <ArrowRight className="h-7 w-7" />
                    🚀 Começar Grátis Agora
                  </Button>
                  <Button variant="outline" size="lg" asChild className="flex-1 h-20 border-2 border-gray-200 hover:bg-white/80 backdrop-blur-sm text-lg font-bold shadow-xl hover:shadow-2xl">
                    <a href={DOWNLOAD_URL} className="flex items-center gap-3">
                      <Download className="h-6 w-6" />
                      Testar Demo Offline
                    </a>
                  </Button>
                </div>
              </div>
              <div className="relative animate-float">
                <img 
                  src="/images/icone.png" 
                  alt="Sistema PDV Agil Gestão" 
                  className="w-full max-w-2xl mx-auto drop-shadow-2xl rounded-3xl shadow-2xl hover:scale-105 transition-all duration-500 hover:rotate-3" 
                  loading="lazy"
                />
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-20 lg:py-32">
          <Button variant="ghost" onClick={() => setStep('hero')} className="mb-12 hover:bg-white/50 backdrop-blur-sm text-lg">
            ← Voltar ao início
          </Button>
          
          <Card className="backdrop-blur-xl bg-white/80 border-white/50 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-5xl bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent font-black">Criar Sua Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="h-6 w-6" />
                      Nome da Loja *
                    </label>
                    <Input 
                      name="nome" 
                      placeholder="Minha Loja LTDA" 
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="h-16 text-xl"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <CreditCard className="h-6 w-6" />
                      Plano *
                    </label>
                    <select 
                      name="plano" 
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white/50 backdrop-blur-sm text-xl font-semibold h-16"
                      value={formData.plano}
                      onChange={(e) => handlePlanoChange(e.target.value as any)}
                    >
                      <option value="gratis">🆓 Grátis (até R$5.000 vendas)</option>
                      <option value="mensal">💎 Mensal - R$49,90</option>
                      <option value="anual">👑 Anual - R$29,90/mês (40% OFF)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    Email *
                  </label>
                  <Input 
                    type="email" 
                    name="email"
                    placeholder="contato@minhaloja.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-16 text-xl"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Lock className="h-6 w-6" />
                    Senha *
                  </label>
                  <Input 
                    type="password" 
                    name="senha"
                    placeholder="••••••••" 
                    value={formData.senha}
                    onChange={handleInputChange}
                    className="h-16 text-xl"
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Phone className="h-6 w-6" />
                      Telefone
                    </label>
                    <Input 
                      name="telefone" 
                      placeholder="(61) 99999-9999" 
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="h-16 text-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      CPF/CNPJ
                    </label>
                    <Input 
                      name="cpf_cnpj" 
                      placeholder="00.000.000/0000-00" 
                      value={formData.cpf_cnpj}
                      onChange={handleInputChange}
                      className="h-16 text-xl"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-20 text-2xl font-black bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-2xl" disabled={loading}>
                  {loading ? '🔄 Criando...' : `✅ Criar Conta ${formData.plano === 'gratis' ? '(Grátis)' : ''}`}
                  <ArrowRight className="h-8 w-8 ml-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {planos.map((plano, index) => (
              <Card 
                key={plano.id} 
                className={`backdrop-blur-xl bg-white/70 hover:bg-white/90 border-2 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-rotate-1 ${plano.destaque ? "border-emerald-500 shadow-emerald-500/25 ring-4 ring-emerald-500/20" : "border-gray-200"}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <CardTitle className={`text-2xl font-black ${plano.destaque ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' : ''}`}>
                    {plano.title}
                  </CardTitle>
                  <CardDescription className="text-lg">{plano.subtitle}</CardDescription>
                  <div className={`text-5xl font-black mt-6 ${plano.destaque ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent drop-shadow-lg' : 'text-gray-900'}`}>
                    {plano.price}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-8">
                  <Button 
                    variant={formData.plano === plano.id ? "default" : "outline"}
                    className="w-full h-16 text-lg font-bold shadow-lg"
                    onClick={() => handlePlanoChange(plano.id)}
                    size="lg"
                  >
                    {formData.plano === plano.id ? '✅ Selecionado' : '👆 Escolher Plano'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
