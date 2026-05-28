import FAQBase, { type FAQItem } from '@/app/components/faq/FAQBase'

const faqs: FAQItem[] = [
  {
    question: 'Como o Fitmass aumenta a retenção de alunos?',
    answer:
      'O aluno acompanha sua evolução com gráficos detalhados no app, criando engajamento contínuo e motivação para permanecer na academia. Academias que utilizam o Fitmass relatam redução significativa no churn de alunos.',
  },
  {
    question: 'O equipamento possui garantia?',
    answer:
      'Sim, todos os equipamentos Fitmass possuem garantia de 12 meses contra defeitos de fabricação e suporte técnico nacional incluso em todos os planos.',
  },
  {
    question: 'O software é realmente White Label?',
    answer:
      'Sim. Nos planos Premium, ULTRA e Enterprise o aplicativo é 100% personalizado com as cores, logo e domínio da sua academia — seus alunos nunca veem a marca Fitmass.',
  },
  {
    question: 'Como é feito o suporte técnico?',
    answer:
      'Oferecemos suporte via chat, e-mail e telefone conforme o plano contratado. O plano ULTRA e Enterprise conta com gerente de conta dedicado e onboarding presencial ou remoto.',
  },
  {
    question: 'Qual a entrega técnica e prazo de implementação?',
    answer:
      'O sistema é Plug & Play: a balança de bioimpedância conecta à sua rede e o software está pronto no mesmo dia. O processo de onboarding guiado garante que você comece a usar sem complicações técnicas.',
  },
]

export default function FAQHome() {
  return (
    <FAQBase
      id="faq"
      accentHex="#88BD23"
      badge="Dúvidas Frequentes"
      heading="Perguntas Frequentes"
      subtitle="Tudo que você precisa saber antes de começar."
      items={faqs}
    />
  )
}
