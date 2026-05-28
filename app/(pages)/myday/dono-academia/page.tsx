import type { Metadata } from 'next'
import MyDay from '../MyDay'

export const metadata: Metadata = {
  title: 'MyDay para Academias — IA de Acompanhamento no WhatsApp | Fitmass',
  description: 'O Fitmass MyDay é uma IA de acompanhamento que funciona no WhatsApp dos seus alunos. Sua academia monetiza e fideliza com mais motivação.',
  alternates: { canonical: 'https://fitmass.com.br/myday/dono-academia' },
  openGraph: {
    title: 'MyDay para Academias — IA de Acompanhamento no WhatsApp | Fitmass',
    description: 'Monetize o acompanhamento dos seus alunos. IA no WhatsApp já inclusa no seu plano.',
    url: 'https://fitmass.com.br/myday/dono-academia',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function MyDayDonoAcademiaPage() {
  return <MyDay />
}
