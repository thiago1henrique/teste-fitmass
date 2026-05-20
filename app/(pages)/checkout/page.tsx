import { Suspense } from 'react'
import type { Metadata } from 'next'
import CheckoutForm from './_components/CheckoutForm'
import type { PlanDetails } from './_components/OrderSummary'

export const metadata: Metadata = {
  title: 'Checkout | Fitmass',
  description: 'Finalize sua assinatura e comece a transformar a gestão da sua academia.',
  robots: { index: false, follow: false },
}

// Dados dos planos disponíveis para venda via checkout
const PLANS: Record<string, PlanDetails> = {
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 599,
    billing: 'monthly',
    features: [
      'Dashboard de evolução dos alunos',
      'Exportação de dados das medições',
      'Integração com ERP da academia',
      'Gestão de créditos Bioscan',
      'Suporte prioritário',
      'Contas com níveis de acesso',
    ],
  },
  'premium-annual': {
    id: 'premium-annual',
    name: 'Premium Anual',
    price: 499,
    billing: 'annual',
    features: [
      'Dashboard de evolução dos alunos',
      'Exportação de dados das medições',
      'Integração com ERP da academia',
      'Gestão de créditos Bioscan',
      'Suporte prioritário',
      'Contas com níveis de acesso',
    ],
  },
  ultra: {
    id: 'ultra',
    name: 'ULTRA',
    price: 899,
    billing: 'monthly',
    features: [
      'Personalização do app da academia',
      'Personalização das telas do Bioscan',
      'Plotagem do Bioscan',
      'Pesquisas personalizadas pós-medição',
      'API de integração completa',
      'Webhooks para automações externas',
    ],
  },
  'ultra-annual': {
    id: 'ultra-annual',
    name: 'ULTRA Anual',
    price: 599,
    billing: 'annual',
    features: [
      'Personalização do app da academia',
      'Personalização das telas do Bioscan',
      'Plotagem do Bioscan',
      'Pesquisas personalizadas pós-medição',
      'API de integração completa',
      'Webhooks para automações externas',
    ],
  },
}

type Props = {
  searchParams: Promise<{ plan?: string; billing?: string }>
}

async function CheckoutContent({ searchParams }: Props) {
  const { plan = 'ultra', billing = 'monthly' } = await searchParams
  const planKey = billing === 'annual' ? `${plan}-annual` : plan
  const planDetails = PLANS[planKey] ?? PLANS['ultra']
  return <CheckoutForm plan={planDetails} />
}

export default function CheckoutPage({ searchParams }: Props) {
  return (
    <Suspense>
      <CheckoutContent searchParams={searchParams} />
    </Suspense>
  )
}
