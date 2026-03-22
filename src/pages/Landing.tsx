import { useState } from 'react';
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
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Sucesso!</CardTitle>
            <CardDescription>Sua conta e licença foram criadas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Chave da Licença:</span>
                <Button variant="ghost" size="icon" onClick={handleCopyChave}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <code className="block bg-white p-3 rounded-lg font-mono text-lg font-semibold text-gray-900 break-all">
                {licencaChave}
              </code>
            </div>
            <Button asChild size="lg" className="w-full">
              <a href={DOWNLOAD_URL} download>
                <Download className="h-5 w-5 mr-2" />
                Baixar Agil Gestão (Grátis)
              </a>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <a href={DOWNLOAD_URL}>
                Baixar Agora
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {step === 'hero' ? (
        <div className="min-h-screen flex flex-col">
          <header className="px-4 lg:px-8 py-6">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="Agil Gestão" className="h-10 w-10" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Agil Gestão</h1>
              </div>
              <Button onClick={() => setStep('form')} className="gap-2">
                Criar Conta Grátis <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center px-4 py-12 lg:py-24">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div>
                <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent leading-tight mb-6">
                  Sistema de Vendas <br />
                  <span className="text-4xl lg:text-5xl">Completo e Rápido</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                  Controle PDV, produtos, clientes e vendas com o melhor sistema para seu negócio. 
                  Teste grátis até R$5.000 em vendas.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl shadow-lg">
                    <Users className="h-6 w-6 text-indigo-600" />
                    <span className="font-semibold">Clientes ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl shadow-lg">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                    <span className="font-semibold">Vendas rápidas</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="flex-1 gap-2 text-lg h-14" onClick={() => setStep('form')}>
                    <ArrowRight className="h-5 w-5" />
                    Começar Grátis
                  </Button>
                  <Button variant="outline" size="lg" asChild className="flex-1 h-14">
                    <a href={DOWNLOAD_URL} className="flex items-center gap-2 text-lg">
                      <Download className="h-5 w-5" />
                      Baixar Demo
                    </a>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img src="/images/icone.png" alt="Sistema PDV" className="w-full max-w-md lg:max-w-lg mx-auto drop-shadow-2xl rounded-3xl" />
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-12 lg:py-24">
          <Button variant="ghost" onClick={() => setStep('hero')} className="mb-8">
            ← Voltar ao início
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Criar Sua Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Nome da Loja
                    </label>
                    <Input 
                      name="nome" 
                      placeholder="Minha Loja LTDA" 
                      value={formData.nome}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="h-4 w-4 inline mr-1" />
                      Plano
                    </label>
                    <select 
                      name="plano" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formData.plano}
                      onChange={(e) => handlePlanoChange(e.target.value as any)}
                    >
                      <option value="gratis">Grátis (até R$5.000)</option>
                      <option value="mensal">Mensal - R$49,90</option>
                      <option value="anual">Anual - R$29,90/mês</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <Input 
                    type="email" 
                    name="email"
                    placeholder="contato@minhaloja.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Senha
                  </label>
                  <Input 
                    type="password" 
                    name="senha"
                    placeholder="••••••••" 
                    value={formData.senha}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Telefone (opcional)
                    </label>
                    <Input 
                      name="telefone" 
                      placeholder="(61) 99999-9999" 
                      value={formData.telefone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF/CNPJ (opcional)
                    </label>
                    <Input 
                      name="cpf_cnpj" 
                      placeholder="00.000.000/0000-00" 
                      value={formData.cpf_cnpj}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 text-lg" disabled={loading}>
                  {loading ? 'Criando...' : `Criar Conta ${formData.plano === 'gratis' ? '(Grátis)' : ''}`}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {planos.map((plano) => (
              <Card key={plano.id} className={plano.destaque ? "border-2 border-indigo-500" : ""}>
                <CardHeader>
                  <CardTitle>{plano.title}</CardTitle>
                  <CardDescription>{plano.subtitle}</CardDescription>
                  <div className="text-4xl font-bold text-gray-900 mt-4">{plano.price}</div>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <Button 
                    variant={formData.plano === plano.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handlePlanoChange(plano.id)}
                    size="lg"
                  >
                    {formData.plano === plano.id ? 'Selecionado' : 'Escolher'}
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

