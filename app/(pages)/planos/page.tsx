import type { Metadata } from 'next'
import Planos from './Planos'

export const metadata: Metadata = {
  title: 'Planos Fitmass | Bioimpedância para Academias',
  description:
    'Aumente o ticket médio da sua academia com os planos Fitmass. Conheça a versão ULTRA: Bioimpedância Profissional + App White Label.',
  keywords: [
    'bioimpedância academia',
    'fitmass planos',
    'avaliação física profissional',
    'app white label academia',
  ],
  alternates: {
    canonical: 'https://fitmass.com.br/planos',
  },
  openGraph: {
    title: 'Planos Fitmass | Bioimpedância para Academias',
    description:
      'Aumente o ticket médio da sua academia com os planos Fitmass. Conheça a versão ULTRA: Bioimpedância Profissional + App White Label.',
    url: 'https://fitmass.com.br/planos',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function PlanosPage() {
  return <Planos />
}
