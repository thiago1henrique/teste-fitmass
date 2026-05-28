import FAQBase, { type FAQItem } from '@/app/components/faq/FAQBase'

const faqs: FAQItem[] = [
  {
    question: 'Precisa baixar algum app?',
    answer:
      'Não. O MyDay funciona diretamente no WhatsApp que você já tem instalado. É só clicar no link e começar a conversar com a IA.',
  },
  {
    question: 'Preciso ter a balança Bioscan na minha academia para usar?',
    answer:
      'Não. O MyDay funciona para qualquer pessoa. Se sua academia tem a balança de bioimpedância Bioscan, os dados de bioimpedância chegam automaticamente para a IA, tornando o cálculo muito mais preciso. Mas você já pode começar sem ela.',
  },
  {
    question: 'Como a IA sabe os dados da minha avaliação?',
    answer: (
      <>
        O MyDay é integrado ao sistema da Fitmass. Quando você faz uma avaliação na balança de
        bioimpedância Bioscan da sua academia, os dados de composição corporal ficam disponíveis
        automaticamente para a IA, sem precisar digitar nada.
      </>
    ),
  },
  {
    question: 'O trial é realmente gratuito? Tem cobrança automática?',
    answer:
      'Sim, 7 dias 100% gratuitos. Não pedimos cartão de crédito. Ao final do período, você escolhe se quer continuar com um plano pago, sem cobrança automática.',
  },
  {
    question: 'A IA fica me mandando mensagem o tempo todo?',
    answer:
      'Não. A IA é proativa mas não invasiva, manda lembretes mas você pode configurar por onde e se quer receber, resumo semanal e alertas quando você saiu do plano. Tudo pode ser ajustado na conversa.',
  },
]

export default function FAQMyDayAluno() {
  return (
    <FAQBase
      id="faq-myday-aluno"
      accentHex="#FF6A00"
      badge="Dúvidas Frequentes"
      heading="Perguntas Frequentes"
      subtitle="Tudo que você precisa saber sobre o MyDay."
      items={faqs}
    />
  )
}
