import type { Metadata } from 'next'
import MyDayAluno from './MyDayAluno'

export const metadata: Metadata = {
  title: 'MyDay para Alunos — Seu Personal de IA no WhatsApp | Fitmass',
  description: 'O Fitmass MyDay é uma IA que te acompanha no WhatsApp, controla seu déficit calórico com os dados reais da sua bioimpedância, registra treinos e manda seu progresso automaticamente.',
  alternates: { canonical: 'https://fitmass.com.br/myday/aluno' },
  openGraph: {
    title: 'MyDay para Alunos — Seu Personal de IA no WhatsApp | Fitmass',
    description: 'Sem app para baixar. Sem planilha para preencher. É só mandar mensagem.',
    url: 'https://fitmass.com.br/myday/aluno',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function MyDayAlunoPage() {
  return <MyDayAluno />
}
