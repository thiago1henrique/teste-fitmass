import type { Metadata } from 'next'
import Home from './home/Home'

export const metadata: Metadata = {
  title: 'Fitmass | Bioimpedância de Precisão para Academias',
  description:
    'Eleve o nível da sua academia com a balança líder em tecnologia e o único software White Label do mercado.',
  alternates: {
    canonical: 'https://fitmass.com.br/',
  },
  robots: { index: true, follow: true },
}

export default function HomePage() {
  return <Home />
}
