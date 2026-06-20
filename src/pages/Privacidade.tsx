import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight } from 'lucide-react';

export default function Privacidade() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade - Ágil Gestão</title>
        <meta name="description" content="Política de privacidade da Ágil Gestão. Saiba como tratamos seus dados pessoais." />
        <meta name="robots" content="index" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-8 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Voltar
          </Link>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
            <p className="text-sm text-gray-400 mb-8">Última atualização: junho de 2026</p>

            <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Introdução</h2>
                <p>
                  A Ágil Gestão ("nós", "nosso" ou "plataforma") leva a sério a privacidade dos seus
                  usuários. Esta Política de Privacidade explica como coletamos, usamos, armazenamos
                  e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de
                  Dados (LGPD - Lei nº 13.709/2018).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Dados coletados</h2>
                <p>Durante o cadastro e uso da plataforma, podemos coletar:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Nome completo ou nome da empresa</li>
                  <li>Endereço de email</li>
                  <li>Número de telefone / WhatsApp</li>
                  <li>CPF ou CNPJ</li>
                  <li>CEP, endereço, cidade, bairro, número e complemento</li>
                  <li>Dados de uso da plataforma (logs, funcionalidades acessadas)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Finalidade do uso dos dados</h2>
                <p>Seus dados são utilizados para:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Criar e gerenciar sua conta</li>
                  <li>Processar pagamentos e emitir licenças</li>
                  <li>Enviar comunicados relacionados ao serviço (confirmação de cadastro, alterações de plano, recuperação de senha)</li>
                  <li>Prestar suporte técnico</li>
                  <li>Cumprir obrigações legais e fiscais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Compartilhamento de dados</h2>
                <p>Compartilhamos seus dados com terceiros estritamente necessários para o funcionamento da plataforma:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Asaas</strong> — processamento de pagamentos (consulte a <a href="https://www.asaas.com/politica-privacidade" target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">política do Asaas</a>)</li>
                  <li><strong>Resend</strong> — envio de emails transacionais</li>
                  <li><strong>Cloudflare R2</strong> — armazenamento de arquivos e dados</li>
                </ul>
                <p className="mt-2">Não vendemos seus dados pessoais para terceiros.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Armazenamento e segurança</h2>
                <p>
                  Seus dados são armazenados em servidores seguros com criptografia em trânsito (TLS)
                  e em repouso. Adotamos medidas técnicas e organizacionais para proteger suas
                  informações contra acesso não autorizado, perda ou alteração.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Seus direitos (LGPD)</h2>
                <p>Você tem direito a:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Confirmar a existência de tratamento de seus dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Solicitar a portabilidade dos dados</li>
                  <li>Solicitar a eliminação dos dados tratados com seu consentimento</li>
                  <li>Revogar o consentimento a qualquer momento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Retenção de dados</h2>
                <p>
                  Mantemos seus dados enquanto sua conta estiver ativa ou pelo período exigido por
                  obrigações legais (fiscais, contábeis). Após o encerramento da conta, os dados
                  serão excluídos no prazo de 90 dias, exceto quando houver exigência legal de
                  retenção por prazo superior.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Cookies</h2>
                <p>
                  Utilizamos cookies essenciais para o funcionamento da plataforma (autenticação,
                  sessão). Não utilizamos cookies de rastreamento ou publicidade sem seu
                  consentimento explícito.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Contato</h2>
                <p>
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em
                  contato pelo email:{' '}
                  <a href="mailto:contato@agilgestao.com" className="text-emerald-600 hover:text-emerald-700 underline">
                    contato@agilgestao.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Alterações nesta política</h2>
                <p>
                  Esta política pode ser atualizada periodicamente. Recomendamos revisá-la
                  regularmente. O uso continuado da plataforma após alterações constitui aceitação
                  dos novos termos.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
