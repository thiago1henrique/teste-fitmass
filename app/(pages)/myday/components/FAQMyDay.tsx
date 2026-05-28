import FAQBase, { type FAQItem } from '@/app/components/faq/FAQBase'

const faqs: FAQItem[] = [
  {
    question: 'Precisa ter a balança Bioscan para oferecer o MyDay?',
    answer:
      'Sim. O MyDay está incluído nos planos Fitmass que já contemplam a Bioscan. A integração entre os dados da balança e a IA é o principal diferencial do produto: academias parceiras Fitmass já têm tudo que precisam.',
  },
  {
    question: 'A academia precisa gerenciar alguma coisa no dia a dia?',
    answer:
      'Não. Você disponibiliza o link do WhatsApp para os alunos interessados, a IA cuida do restante. Não há painel para gerenciar, nem treinamento necessário para a equipe da academia.',
  },
  {
    question: 'Como a academia envia o repasse para o Fitmass?',
    answer:
      'Simples: já vem no boleto. O repasse ao Fitmass é incluído automaticamente na mensalidade do seu plano. Sem transferências, sem burocracia, sem nada extra pra gerenciar.',
  },
  {
    question: 'Posso oferecer o MyDay para todos os alunos ou tem limite?',
    answer:
      'Não há limite de alunos. Quanto mais alunos assinarem, maior a receita recorrente para a academia.',
  },
  {
    question: 'Qual a diferença entre o Premium e o Ultra além do repasse?',
    answer:
      'No plano Ultra sua academia deixa de ser mais uma e passa a ter identidade própria. Além de todas as funcionalidades do plano Premium: o app que o aluno usa leva sua logo e suas cores, o Bioscan vira vitrine da sua marca, pesquisas para entender seus alunos e automação de processos com API e webhooks. Mais retenção, mais diferencial, mais receita. Com a mesma estrutura que você já tem.',
  },
]

export default function FAQMyDay() {
  return (
    <FAQBase
      id="faq-myday"
      accentHex="#FF6A00"
      badge="Dúvidas Frequentes"
      heading="Perguntas Frequentes"
      subtitle="Tudo que você precisa saber sobre o MyDay."
      items={faqs}
    />
  )
}
