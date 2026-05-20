'use client'

import { useState } from 'react'

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type Tab = 'faq' | 'privacidade' | 'cookies'

interface PrivacySection {
  id: string
  title: string
  content?: string
  items?: { term: string; definition: string }[]
  table?: { dados: string; finalidade: string; hipotese: string }[]
  contact?: { name: string; email: string }
}

/* ─── FAQ LGPD ───────────────────────────────────────────────────────────────── */
const lgpdFaqs = [
  {
    question: 'O que é a Lei Geral de Proteção de Dados?',
    answer:
      'A LGPD é uma legislação brasileira que regula o tratamento de dados pessoais por pessoa natural ou jurídica (pública e privada), estabelecendo princípios e requisitos autorizadores para o tratamento de dados pessoais.',
  },
  {
    question: 'O que é um "tratamento" de dados pessoais?',
    answer:
      'É toda operação física ou digital realizada com dados pessoais: coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação, controle, modificação, comunicação, transferência, difusão ou extração. A simples guarda de dados pessoais já está sujeita à LGPD.',
  },
  {
    question: 'O que é um dado pessoal?',
    answer:
      'Dado pessoal é toda informação sobre pessoa natural que permita sua identificação direta (dado identificado) ou, em conjunto com outros dados, possa levar à sua identificação (dado identificável). A Lei também define dado pessoal sensível: aquele cujo tratamento pode ensejar discriminação, como orientação sexual, filiação a sindicato, convicção religiosa, dados de saúde, dados genéticos ou biométricos.',
  },
  {
    question: 'O que não é dado pessoal?',
    answer:
      'Dados de pessoas jurídicas (quando não identificam uma pessoa natural), dados anônimos e informações estratégicas de negócio, patentes e propriedade intelectual estão fora do escopo da LGPD.',
  },
  {
    question: 'A LGPD se aplica somente a dados digitais?',
    answer:
      'Não. A Lei abrange quaisquer dados pessoais, sejam eles presentes em suporte físico ou eletrônico.',
  },
  {
    question: 'Quais são os direitos do Titular de Dados Pessoais?',
    answer:
      'Você tem direito a: acesso às informações sobre finalidade, forma e duração do tratamento; confirmação da existência do tratamento; acesso aos seus dados; correção de dados incompletos, inexatos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade dos dados; eliminação dos dados tratados com base no consentimento; informações sobre a possibilidade de não fornecer consentimento; revogação do consentimento anteriormente fornecido.',
  },
  {
    question: 'Quais são os princípios da LGPD?',
    answer:
      'A LGPD elenca 10 princípios: finalidade, necessidade, transparência, adequação, livre acesso, qualidade dos dados, segurança, prevenção, não discriminação e responsabilização/prestação de contas. Os dados devem ser utilizados apenas para finalidades específicas, dentro do limite necessário, com informações claras e acessíveis aos titulares.',
  },
  {
    question: 'Como a Fitmass protege meus dados pessoais?',
    answer:
      'A Fitmass realiza diversas ações de conformidade: mantemos registro de todas as operações de tratamento; nomeamos um Encarregado de Proteção de Dados (DPO); criamos e aperfeiçoamos políticas internas e externas; adequamos contratos com fornecedores e parceiros com cláusulas de proteção de dados; realizamos treinamentos contínuos dos colaboradores; e monitoramos constantemente nosso programa de governança em Proteção de Dados.',
  },
]

/* ─── Aviso de Privacidade ───────────────────────────────────────────────────── */
const privacySections: PrivacySection[] = [
  {
    id: '1',
    title: '1. Objetivo',
    content:
      'Este Aviso de Privacidade demonstra o compromisso da FITMASS com a segurança e a privacidade das informações dos Titulares de Dados Pessoais ("você"), esclarecendo como e quais informações são coletadas e tratadas quando você acessa nosso site, aplicativo ou interage com nossos ambientes e serviços.\n\nOutras aplicações utilizadas para entrar em contato com a FITMASS — como aplicações de comunicação de terceiros, de recrutamento e redes sociais — possuem termos de uso e políticas próprias, que deverão ser consultadas diretamente por você.',
  },
  {
    id: '2',
    title: '2. Definições',
    items: [
      { term: 'ANPD', definition: 'Autoridade Nacional de Proteção de Dados.' },
      {
        term: 'BALANÇAS FITMASS',
        definition:
          'Instrumento medidor de massa corpórea que realiza leitura de bioimpedância e antropometria com conectividade a dispositivos mobiles.',
      },
      {
        term: 'COACH',
        definition:
          'Educador Físico ou profissional correlato apto a analisar os resultados obtidos pelas Balanças Fitmass.',
      },
      {
        term: 'DPO / ENCARREGADO',
        definition:
          'Pessoa responsável pela comunicação entre a Fitmass, os Titulares e a ANPD.',
      },
      {
        term: 'LGPD',
        definition:
          'Lei Geral de Proteção de Dados (Lei nº 13.709/2018), legislação brasileira que dispõe sobre o tratamento de dados de pessoas físicas.',
      },
      {
        term: 'TITULAR DE DADOS',
        definition:
          'Você, pessoa natural a quem se referem os dados pessoais que são objeto de tratamento.',
      },
      {
        term: 'TRATAMENTO DE DADOS',
        definition:
          'Toda operação realizada pela Fitmass com seus dados pessoais: coleta, produção, reprodução, classificação, utilização, distribuição, arquivamento, eliminação, modificação, transferência, extração etc.',
      },
    ],
  },
  {
    id: '3',
    title: '3. Dados Pessoais Tratados',
    content:
      'Em nossas atividades diárias tratamos dados pessoais para interagir com nossos Clientes, Fornecedores e stakeholders. As informações coletadas são utilizadas para identificação, execução correta dos serviços e cumprimento de obrigações legais ou contratuais.',
    table: [
      {
        dados: 'Nome',
        finalidade: 'Contato ou identificação',
        hipotese: 'Consentimento, execução de contrato ou interesse legítimo (Art. 7, I, V ou IX)',
      },
      {
        dados: 'Telefone e e-mail',
        finalidade: 'Contato ou identificação',
        hipotese: 'Consentimento, execução de contrato ou interesse legítimo (Art. 7, I, V ou IX)',
      },
      {
        dados: 'Gênero, data de nascimento e foto',
        finalidade: 'Identificação',
        hipotese: 'Execução de contrato (Art. 7, inciso V)',
      },
      {
        dados: 'Altura, peso e impedâncias',
        finalidade: 'Medições físicas',
        hipotese: 'Execução de contrato (Art. 11, II, alínea d)',
      },
      {
        dados: 'Dados de cookies',
        finalidade: 'Operacionalização e estatística',
        hipotese: 'Consentimento ou interesse legítimo (Art. 7, I ou IX)',
      },
      {
        dados: 'Percentuais e índices corporais',
        finalidade: 'Apresentar resultados das medições físicas',
        hipotese: 'Execução de contrato (Art. 11, II, alínea d)',
      },
    ],
  },
  {
    id: '4',
    title: '4. Dados Pessoais Tratados no Website',
    content:
      'Utilizamos cookies para aprimorar a experiência do usuário e gerar estatísticas de tráfego. Utilizamos também recursos baseados em cache, que permitem manter cópias locais temporárias de arquivos estáticos.\n\nVocê pode desabilitar cookies e cache nas configurações do seu navegador, ou usando o modo privativo/anônimo. Isso pode afetar algumas funcionalidades do site.',
  },
  {
    id: '5',
    title: '5. Segurança dos Dados',
    content:
      'A FITMASS implementa medidas de segurança técnicas e administrativas para proteger seus dados contra acesso, uso e alterações não autorizadas: antivírus, firewalls e monitoramento constante das redes. Nosso site opera sob o protocolo HTTPS, que garante a criptografia das informações durante a transmissão.\n\nNossos servidores são mantidos pela Amazon Web Services (AWS), localizada no estado da Virgínia, Estados Unidos. Nenhuma medida oferece garantia absoluta, mas nos comprometemos a adotar as melhores práticas disponíveis.',
  },
  {
    id: '6',
    title: '6. Armazenamento e Compartilhamento dos Dados',
    content:
      'Para fins de auditoria, segurança e preservação de direitos, podemos manter o histórico de registro dos seus dados por período mais longo que o necessário para o atendimento, conforme estabelecido em lei.\n\nSeus dados normalmente não são compartilhados com terceiros, exceto quando exigido por determinação legal ou judicial, ou quando necessário para a operacionalização dos sistemas de TI (ex.: Amazon Web Services). Nesses casos, exigimos que os fornecedores tratem seus dados seguindo nossas instruções contratuais.\n\nCaso você deseje, é possível solicitar o compartilhamento dos seus dados com seu Coach para aprimorar seus treinos. Esse compartilhamento é validado por um código e pode ser encerrado a qualquer momento pelo aplicativo.',
  },
  {
    id: '7',
    title: '7. Direitos dos Titulares e Exercício',
    content:
      'Você pode solicitar: correção e atualização dos seus dados; confirmação da existência de tratamento; bloqueio ou exclusão dos seus dados (sujeito a bases legais que justifiquem a continuidade do tratamento); portabilidade dos dados.\n\nSolicitações desarrazoadas, não exigidas por lei, ou quando a identidade não foi satisfatoriamente validada poderão ser rejeitadas. A FITMASS empreenderá esforços para atender à sua solicitação no menor tempo possível.',
  },
  {
    id: '8',
    title: '8. Atualizações',
    content:
      'Este Aviso de Privacidade está sujeito a alterações a qualquer momento para cumprir mudanças legislativas, requisitos de órgãos reguladores ou necessidades operacionais. Faremos a devida divulgação sobre tais alterações.\n\nEm caso de reorganizações societárias (aquisição, cisão, fusão, incorporação), os dados pessoais continuarão a ser legitimamente tratados, nos limites das finalidades e condições para os quais foram originalmente coletados.',
  },
  {
    id: '9',
    title: '9. Contato do Encarregado de Proteção de Dados',
    content:
      'Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento dos seus dados pessoais, entre em contato com nosso DPO:',
    contact: { name: 'Becker Direito Empresarial', email: 'dpo@fitmass.com.br' },
  },
]

/* ─── Aviso de Cookies ───────────────────────────────────────────────────────── */
const cookieCategories = [
  {
    title: 'Cookies Necessários',
    description:
      'Essenciais para que nosso site funcione corretamente, permitindo que você navegue e utilize o site com todas as suas funcionalidades.',
  },
  {
    title: 'Cookies de Desempenho',
    description:
      'Permitem entender como você interage com o site, fornecendo informações sobre as áreas visitadas, tempo de permanência e eventuais problemas. Todos os dados são coletados e agregados anonimamente, sem identificação do titular.',
  },
  {
    title: 'Cookies de Conveniência',
    description:
      'Permitem que nosso site lembre das escolhas feitas por você, facilitando o acesso e utilização da plataforma em uma próxima visita. Podem coletar informações pessoais divulgadas pelo próprio titular e expiram dentro do período pré-definido de armazenagem.',
  },
]

const browserLinks = [
  { name: 'Google Chrome',  url: 'https://support.google.com/chrome/answer/95647' },
  { name: 'Firefox',        url: 'https://support.mozilla.org/pt-BR/kb/gerencie-configuracoes-de-armazenamento-local-de-s' },
  { name: 'Safari',         url: 'https://support.apple.com/pt-br/guide/safari/sfri11471/mac' },
  { name: 'Microsoft Edge', url: 'https://support.microsoft.com/pt-br/help/4027947/microsoft-edge-delete-cookies' },
  { name: 'Opera',          url: 'https://help.opera.com/en/latest/web-preferences/#cookies' },
]

/* ─── Constants ──────────────────────────────────────────────────────────────── */
const TABS: { id: Tab; label: string }[] = [
  { id: 'faq',         label: 'FAQ LGPD'             },
  { id: 'privacidade', label: 'Aviso de Privacidade' },
  { id: 'cookies',     label: 'Aviso de Cookies'     },
]

const SUBJECTS = [
  'Exercício de direito LGPD',
  'Acesso aos meus dados',
  'Correção de dados',
  'Solicitação de exclusão de dados',
  'Dúvida sobre privacidade',
  'Outro assunto',
]

/* ─── Component ──────────────────────────────────────────────────────────────── */
export default function PrivacyPortal() {
  const [activeTab, setActiveTab] = useState<Tab>('faq')
  const [openFaq,   setOpenFaq]   = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', subject: SUBJECTS[0], message: '',
  })

  const toggleFaq = (i: number) => setOpenFaq((prev) => (prev === i ? null : i))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[Portal de Privacidade] ${form.subject}`)
    const body    = encodeURIComponent(
      `Nome: ${form.name}\nE-mail: ${form.email}\nAssunto: ${form.subject}\n\n${form.message}`
    )
    window.open(`mailto:dpo@fitmass.com.br?subject=${subject}&body=${body}`)
    setSubmitted(true)
  }

  return (
    <section id="portal" className="py-16 px-4 bg-surface">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 items-start">

        {/* ── Coluna esquerda: Formulário ───────────────────────────────── */}
        <div className="lg:sticky lg:top-24" id="contato">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="font-title text-2xl uppercase text-contrast tracking-wide mb-2">
              Fale com nosso DPO
            </h2>
            <p className="font-body text-contrast/60 text-sm mb-6 leading-relaxed">
              Exerça seus direitos como titular de dados ou tire suas dúvidas sobre
              privacidade. Seu contato será atendido por nosso Encarregado de Proteção de Dados.
            </p>

            {/* DPO info badge */}
            <div className="flex items-center gap-3 bg-accent/10 rounded-xl px-4 py-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-accent"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-body font-semibold text-contrast text-xs">
                  Becker Direito Empresarial
                </p>
                <a
                  href="mailto:dpo@fitmass.com.br"
                  className="font-body text-accent text-xs hover:underline"
                >
                  dpo@fitmass.com.br
                </a>
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-body font-semibold text-contrast mb-1">Mensagem preparada!</p>
                <p className="font-body text-contrast/55 text-sm">
                  Seu cliente de e-mail foi aberto. Envie a mensagem para finalizar o contato.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 font-body text-accent text-sm underline hover:no-underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Nome */}
                <div>
                  <label
                    htmlFor="privacy-name"
                    className="font-body text-contrast/70 text-xs font-semibold uppercase tracking-wider mb-1.5 block"
                  >
                    Nome completo *
                  </label>
                  <input
                    id="privacy-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full font-body text-sm text-contrast placeholder:text-contrast/35 bg-surface border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-colors"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label
                    htmlFor="privacy-email"
                    className="font-body text-contrast/70 text-xs font-semibold uppercase tracking-wider mb-1.5 block"
                  >
                    E-mail *
                  </label>
                  <input
                    id="privacy-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full font-body text-sm text-contrast placeholder:text-contrast/35 bg-surface border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-colors"
                  />
                </div>

                {/* Assunto */}
                <div>
                  <label
                    htmlFor="privacy-subject"
                    className="font-body text-contrast/70 text-xs font-semibold uppercase tracking-wider mb-1.5 block"
                  >
                    Assunto *
                  </label>
                  <select
                    id="privacy-subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full font-body text-sm text-contrast bg-surface border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-colors"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Mensagem */}
                <div>
                  <label
                    htmlFor="privacy-message"
                    className="font-body text-contrast/70 text-xs font-semibold uppercase tracking-wider mb-1.5 block"
                  >
                    Mensagem *
                  </label>
                  <textarea
                    id="privacy-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Descreva sua solicitação..."
                    className="w-full font-body text-sm text-contrast placeholder:text-contrast/35 bg-surface border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent text-white font-body font-bold text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all duration-200"
                >
                  Enviar Solicitação
                </button>

                <p className="font-body text-contrast/40 text-xs text-center">
                  Seus dados serão tratados conforme nossa política de privacidade e a LGPD.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ── Coluna direita: Tab switcher ──────────────────────────────── */}
        <div>
          {/* Tabs */}
          <div
            className="flex gap-2 flex-wrap mb-8"
            role="tablist"
            aria-label="Documentos de privacidade"
          >
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                aria-controls={`tabpanel-${id}`}
                onClick={() => setActiveTab(id)}
                className={`font-body font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'bg-white text-contrast/60 border border-gray-200 hover:text-contrast hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Panel: FAQ LGPD ── */}
          <div
            id="tabpanel-faq"
            role="tabpanel"
            className={activeTab === 'faq' ? '' : 'hidden'}
          >
            <dl className="space-y-3">
              {lgpdFaqs.map((faq, i) => {
                const isOpen = openFaq === i
                return (
                  <div
                    key={i}
                    className={`rounded-2xl overflow-hidden border transition-colors duration-200 ${
                      isOpen
                        ? 'border-accent/40 bg-white shadow-md shadow-accent/5'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <dt>
                      <button
                        onClick={() => toggleFaq(i)}
                        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-surface/60 transition-colors"
                        aria-expanded={isOpen}
                        aria-controls={`lgpd-answer-${i}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-title text-xs shrink-0 transition-colors ${
                            isOpen ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
                          }`}
                          aria-hidden="true"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-body font-semibold text-contrast text-sm flex-1">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-4 h-4 text-accent shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </dt>
                    <dd
                      id={`lgpd-answer-${i}`}
                      className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="pl-[3.75rem] pr-5 pb-4 font-body text-contrast/65 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>

          {/* ── Panel: Aviso de Privacidade ── */}
          <div
            id="tabpanel-privacidade"
            role="tabpanel"
            className={activeTab === 'privacidade' ? 'space-y-4' : 'hidden'}
          >
            {privacySections.map((section) => (
              <div key={section.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-3">
                  {section.title}
                </h3>

                {section.content && (
                  <div className="space-y-3">
                    {section.content.split('\n\n').map((para, i) => (
                      <p key={i} className="font-body text-contrast/65 text-sm leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {section.items && (
                  <dl className="space-y-2 mt-1">
                    {section.items.map(({ term, definition }) => (
                      <div key={term} className="flex gap-2 text-sm">
                        <dt className="font-body font-semibold text-contrast shrink-0">{term}:</dt>
                        <dd className="font-body text-contrast/65">{definition}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {section.table && (
                  <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-xs font-body min-w-[480px]">
                      <thead>
                        <tr className="bg-accent/10">
                          <th className="text-left font-semibold text-contrast px-4 py-3 border-b border-gray-200">
                            Dados Tratados
                          </th>
                          <th className="text-left font-semibold text-contrast px-4 py-3 border-b border-gray-200">
                            Finalidades
                          </th>
                          <th className="text-left font-semibold text-contrast px-4 py-3 border-b border-gray-200">
                            Hipóteses de Tratamento
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.map((row, i) => (
                          <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-surface/60">
                            <td className="px-4 py-3 text-contrast font-medium align-top">{row.dados}</td>
                            <td className="px-4 py-3 text-contrast/65 align-top">{row.finalidade}</td>
                            <td className="px-4 py-3 text-contrast/65 align-top">{row.hipotese}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.contact && (
                  <div className="mt-4 flex items-center gap-3 bg-accent/10 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-accent"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-contrast text-sm">
                        {section.contact.name}
                      </p>
                      <a
                        href={`mailto:${section.contact.email}`}
                        className="font-body text-accent text-sm hover:underline"
                      >
                        {section.contact.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Panel: Aviso de Cookies ── */}
          <div
            id="tabpanel-cookies"
            role="tabpanel"
            className={activeTab === 'cookies' ? 'space-y-4' : 'hidden'}
          >
            {/* Intro */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-3">
                O que são Cookies?
              </h3>
              <p className="font-body text-contrast/65 text-sm leading-relaxed">
                Cookies são pequenos pedaços de informações armazenados no seu computador.
                Coletamos cookies para funcionalidades específicas: autenticação do titular,
                conveniência (&ldquo;lembrar&rdquo; você e suas preferências) e estatísticas de navegação.
              </p>
              <p className="font-body text-contrast/65 text-sm leading-relaxed mt-3">
                O site da Fitmass utiliza por padrão o cookie{' '}
                <code className="bg-surface px-1.5 py-0.5 rounded text-contrast/80 font-mono text-xs">
                  _trf.src
                </code>{' '}
                fornecido pela RD Station para informações de origem de visita ao site, com
                validade de um ano. As informações são disponibilizadas de forma anônima, sem
                relação com um usuário identificado.
              </p>
            </div>

            {/* Categorias */}
            {cookieCategories.map((cat) => (
              <div key={cat.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  <h3 className="font-body font-semibold text-contrast">{cat.title}</h3>
                </div>
                <p className="font-body text-contrast/65 text-sm leading-relaxed pl-5">
                  {cat.description}
                </p>
              </div>
            ))}

            {/* Gerenciar por navegador */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-3">
                Gerenciar Cookies
              </h3>
              <p className="font-body text-contrast/65 text-sm leading-relaxed mb-4">
                Você pode, a qualquer momento, desabilitar cookies nas configurações do seu
                navegador. Veja as instruções diretas para os principais navegadores:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {browserLinks.map(({ name, url }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-body text-sm text-accent hover:text-accent/80 hover:underline transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {name}
                  </a>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="font-body text-contrast/50 text-xs">
                  Em caso de dúvidas sobre cookies ou privacidade, entre em contato com nosso
                  DPO:{' '}
                  <a href="mailto:dpo@fitmass.com.br" className="text-accent hover:underline">
                    dpo@fitmass.com.br
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
