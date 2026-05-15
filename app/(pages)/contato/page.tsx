import type { Metadata } from 'next'
import Contato from './Contato'

export const metadata: Metadata = {
  title: 'Contato | Fitmass',
  description:
    'Entre em contato com a Fitmass e receba uma demonstração personalizada do nosso sistema de bioimpedância e app white label para academias.',
  alternates: {
    canonical: 'https://fitmass.com.br/contato',
  },
  openGraph: {
    title: 'Contato | Fitmass',
    description:
      'Entre em contato com a Fitmass e receba uma demonstração personalizada do nosso sistema de bioimpedância e app white label para academias.',
    url: 'https://fitmass.com.br/contato',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function ContatoPage() {
  return <Contato />
}
