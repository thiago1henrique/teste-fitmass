import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import {
  ReceitaSemanalChart, ReceitaMensalChart,
  ReceitaPorPlanoChart, MetodoPagamentoChart,
} from './_components/VendasCharts'
import AssinantesTable from './_components/AssinantesTable'

export const metadata = { title: 'Vendas | Admin Fitmass' }

// ─── Types ───────────────────────────────────────────────────────────────────

type Venda = {
  id: string
  customerName: string
  customerEmail: string
  plan: 'BÁSICO' | 'PRO' | 'ULTRA'
  amount: number
  paymentMethod: 'pix' | 'credit_card' | 'boleto'
  status: 'paid' | 'pending' | 'failed'
  createdAt: string
}

export type Assinante = {
  id: string
  name: string
  email: string
  plan: 'BÁSICO' | 'PRO' | 'ULTRA'
  paymentMethod: 'pix' | 'credit_card' | 'boleto'
  status: 'ativo' | 'inativo'
  startDate: string
  nextPayment: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_VENDAS: Venda[] = [
  // Dezembro 2025
  { id: 'v1',  customerName: 'Ana Paula Silva',   customerEmail: 'ana@email.com',       plan: 'ULTRA',  amount: 89900, paymentMethod: 'credit_card', status: 'paid',    createdAt: '2025-12-05T10:00:00Z' },
  { id: 'v2',  customerName: 'Carlos Mendes',      customerEmail: 'carlos@email.com',    plan: 'PRO',    amount: 59900, paymentMethod: 'pix',         status: 'paid',    createdAt: '2025-12-12T14:30:00Z' },
  { id: 'v3',  customerName: 'Fernanda Costa',     customerEmail: 'fernanda@email.com',  plan: 'BÁSICO', amount: 29900, paymentMethod: 'boleto',      status: 'paid',    createdAt: '2025-12-20T09:00:00Z' },
  // Janeiro 2026
  { id: 'v4',  customerName: 'Ricardo Oliveira',   customerEmail: 'ricardo@email.com',   plan: 'ULTRA',  amount: 89900, paymentMethod: 'pix',         status: 'paid',    createdAt: '2026-01-08T11:00:00Z' },
  { id: 'v5',  customerName: 'Juliana Santos',     customerEmail: 'juliana@email.com',   plan: 'PRO',    amount: 59900, paymentMethod: 'credit_card', status: 'paid',    createdAt: '2026-01-15T16:00:00Z' },
  { id: 'v6',  customerName: 'Paulo Ferreira',     customerEmail: 'paulo@email.com',     plan: 'BÁSICO', amount: 29900, paymentMethod: 'boleto',      status: 'failed',  createdAt: '2026-01-22T10:00:00Z' },
  // Fevereiro 2026
  { id: 'v7',  customerName: 'Marcos Lima',        customerEmail: 'marcos@email.com',    plan: 'ULTRA',  amount: 89900, paymentMethod: 'credit_card', status: 'paid',    createdAt: '2026-02-03T13:00:00Z' },
  { id: 'v8',  customerName: 'Beatriz Rodrigues',  customerEmail: 'beatriz@email.com',   plan: 'PRO',    amount: 59900, paymentMethod: 'pix',         status: 'paid',    createdAt: '2026-02-14T15:00:00Z' },
  { id: 'v9',  customerName: 'Diego Alves',        customerEmail: 'diego@email.com',     plan: 'PRO',    amount: 59900, paymentMethod: 'credit_card', status: 'paid',    createdAt: '2026-02-25T10:00:00Z' },
  // Março 2026
  { id: 'v10', customerName: 'Camila Pereira',     customerEmail: 'camila@email.com',    plan: 'ULTRA',  amount: 89900, paymentMethod: 'pix',         status: 'paid',    createdAt: '2026-03-07T09:30:00Z' },
  { id: 'v11', customerName: 'Thiago Nunes',       customerEmail: 'thiago@email.com',    plan: 'BÁSICO', amount: 29900, paymentMethod: 'boleto',      status: 'paid',    createdAt: '2026-03-14T11:00:00Z' },
  { id: 'v12', customerName: 'Larissa Martins',    customerEmail: 'larissa@email.com',   plan: 'PRO',    amount: 59900, paymentMethod: 'credit_card', status: 'paid',    createdAt: '2026-03-21T14:00:00Z' },
  { id: 'v13', customerName: 'Rafael Souza',       customerEmail: 'rafael@email.com',    plan: 'ULTRA',  amount: 89900, paymentMethod: 'pix',         status: 'paid',    createdAt: '2026-03-28T16:00:00Z' },
  // Abril 2026
  { id: 'v14', customerName: 'Patrícia Gomes',     customerEmail: 'patricia@email.com',  plan: 'PRO',    amount: 59900, paymentMethod: 'credit_card', status: 'paid',    createdAt: '2026-04-05T10:00:00Z' },
  { id: 'v15', customerName: 'Bruno Carvalho',     customerEmail: 'bruno@email.com',     plan: 'BÁSICO', amount: 29900, paymentMethod: 'pix',         status: 'paid',    createdAt: '2026-04-10T13:00:00Z' },
  { id: 'v16', customerName: 'Amanda Ribeiro',     customerEmail: 'amanda@email.com',    plan: 'ULTRA',  amount: 89900, paymentMethod: 'credit_card', status: 'paid',    createdAt: '2026-04-18T15:00:00Z' },
  { id: 'v17', customerName: 'Lucas Barros',       customerEmail: 'lucas@email.com',     plan: 'PRO',    amount: 59900, paymentMethod: 'boleto',      status: 'pending', createdAt: '2026-04-25T10:00:00Z' },
  // Maio 2026
  { id: 'v18', customerName: 'Vanessa Campos',     customerEmail: 'vanessa@email.com',   plan: 'ULTRA',  amount: 89900, paymentMethod: 'pix',         status: 'paid',    createdAt: '2026-05-02T11:00:00Z' },
  { id: 'v19', customerName: 'Eduardo Rocha',      customerEmail: 'eduardo@email.com',   plan: 'PRO',    amount: 59900, paymentMethod: 'credit_card', status: 'paid',    createdAt: '2026-05-10T14:00:00Z' },
  { id: 'v20', customerName: 'Priscila Torres',    customerEmail: 'priscila@email.com',  plan: 'BÁSICO', amount: 29900, paymentMethod: 'pix',         status: 'paid',    createdAt: '2026-05-17T09:00:00Z' },
  { id: 'v21', customerName: 'Henrique Dias',      customerEmail: 'henrique@email.com',  plan: 'ULTRA',  amount: 89900, paymentMethod: 'credit_card', status: 'paid',    createdAt: '2026-05-24T16:00:00Z' },
]

const MOCK_ASSINANTES: Assinante[] = [
  { id: 'a1',  name: 'Ana Paula Silva',   email: 'ana@email.com',       plan: 'ULTRA',  paymentMethod: 'credit_card', status: 'ativo',   startDate: '2025-12-05', nextPayment: '2026-06-05' },
  { id: 'a2',  name: 'Carlos Mendes',     email: 'carlos@email.com',    plan: 'PRO',    paymentMethod: 'pix',         status: 'ativo',   startDate: '2025-12-12', nextPayment: '2026-06-12' },
  { id: 'a3',  name: 'Fernanda Costa',    email: 'fernanda@email.com',  plan: 'BÁSICO', paymentMethod: 'boleto',      status: 'inativo', startDate: '2025-12-20', nextPayment: '—' },
  { id: 'a4',  name: 'Ricardo Oliveira',  email: 'ricardo@email.com',   plan: 'ULTRA',  paymentMethod: 'pix',         status: 'ativo',   startDate: '2026-01-08', nextPayment: '2026-06-08' },
  { id: 'a5',  name: 'Juliana Santos',    email: 'juliana@email.com',   plan: 'PRO',    paymentMethod: 'credit_card', status: 'ativo',   startDate: '2026-01-15', nextPayment: '2026-06-15' },
  { id: 'a6',  name: 'Paulo Ferreira',    email: 'paulo@email.com',     plan: 'BÁSICO', paymentMethod: 'boleto',      status: 'inativo', startDate: '2026-01-22', nextPayment: '—' },
  { id: 'a7',  name: 'Marcos Lima',       email: 'marcos@email.com',    plan: 'ULTRA',  paymentMethod: 'credit_card', status: 'ativo',   startDate: '2026-02-03', nextPayment: '2026-06-03' },
  { id: 'a8',  name: 'Beatriz Rodrigues', email: 'beatriz@email.com',   plan: 'PRO',    paymentMethod: 'pix',         status: 'ativo',   startDate: '2026-02-14', nextPayment: '2026-06-14' },
  { id: 'a9',  name: 'Diego Alves',       email: 'diego@email.com',     plan: 'PRO',    paymentMethod: 'credit_card', status: 'ativo',   startDate: '2026-02-25', nextPayment: '2026-06-25' },
  { id: 'a10', name: 'Camila Pereira',    email: 'camila@email.com',    plan: 'ULTRA',  paymentMethod: 'pix',         status: 'ativo',   startDate: '2026-03-07', nextPayment: '2026-06-07' },
  { id: 'a11', name: 'Thiago Nunes',      email: 'thiago@email.com',    plan: 'BÁSICO', paymentMethod: 'boleto',      status: 'ativo',   startDate: '2026-03-14', nextPayment: '2026-06-14' },
  { id: 'a12', name: 'Larissa Martins',   email: 'larissa@email.com',   plan: 'PRO',    paymentMethod: 'credit_card', status: 'inativo', startDate: '2026-03-21', nextPayment: '—' },
  { id: 'a13', name: 'Rafael Souza',      email: 'rafael@email.com',    plan: 'ULTRA',  paymentMethod: 'pix',         status: 'ativo',   startDate: '2026-03-28', nextPayment: '2026-06-28' },
  { id: 'a14', name: 'Patrícia Gomes',    email: 'patricia@email.com',  plan: 'PRO',    paymentMethod: 'credit_card', status: 'ativo',   startDate: '2026-04-05', nextPayment: '2026-07-05' },
  { id: 'a15', name: 'Bruno Carvalho',    email: 'bruno@email.com',     plan: 'BÁSICO', paymentMethod: 'pix',         status: 'ativo',   startDate: '2026-04-10', nextPayment: '2026-07-10' },
  { id: 'a16', name: 'Amanda Ribeiro',    email: 'amanda@email.com',    plan: 'ULTRA',  paymentMethod: 'credit_card', status: 'ativo',   startDate: '2026-04-18', nextPayment: '2026-07-18' },
  { id: 'a17', name: 'Lucas Barros',      email: 'lucas@email.com',     plan: 'PRO',    paymentMethod: 'boleto',      status: 'inativo', startDate: '2026-04-25', nextPayment: '—' },
  { id: 'a18', name: 'Vanessa Campos',    email: 'vanessa@email.com',   plan: 'ULTRA',  paymentMethod: 'pix',         status: 'ativo',   startDate: '2026-05-02', nextPayment: '2026-06-02' },
  { id: 'a19', name: 'Eduardo Rocha',     email: 'eduardo@email.com',   plan: 'PRO',    paymentMethod: 'credit_card', status: 'ativo',   startDate: '2026-05-10', nextPayment: '2026-06-10' },
  { id: 'a20', name: 'Priscila Torres',   email: 'priscila@email.com',  plan: 'BÁSICO', paymentMethod: 'pix',         status: 'ativo',   startDate: '2026-05-17', nextPayment: '2026-06-17' },
  { id: 'a21', name: 'Henrique Dias',     email: 'henrique@email.com',  plan: 'ULTRA',  paymentMethod: 'credit_card', status: 'ativo',   startDate: '2026-05-24', nextPayment: '2026-06-24' },
]

// ─── Data builders ────────────────────────────────────────────────────────────

function buildMonthlyData(vendas: Venda[]) {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    const paid = vendas.filter(v => {
      if (v.status !== 'paid') return false
      const vd = new Date(v.createdAt)
      return vd.getFullYear() === d.getFullYear() && vd.getMonth() === d.getMonth()
    })
    return { month: label, receita: paid.reduce((s, v) => s + v.amount, 0) / 100, vendas: paid.length }
  })
}

function buildWeeklyData(vendas: Venda[]) {
  const now = new Date()
  return Array.from({ length: 4 }, (_, i) => {
    const weekEnd = new Date(now)
    weekEnd.setDate(now.getDate() - i * 7)
    weekEnd.setHours(23, 59, 59, 999)
    const weekStart = new Date(weekEnd)
    weekStart.setDate(weekEnd.getDate() - 6)
    weekStart.setHours(0, 0, 0, 0)
    const label = weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    const paid = vendas.filter(v => {
      if (v.status !== 'paid') return false
      const vd = new Date(v.createdAt)
      return vd >= weekStart && vd <= weekEnd
    })
    return { week: label, receita: paid.reduce((s, v) => s + v.amount, 0) / 100, vendas: paid.length }
  }).reverse()
}

function buildPlanData(vendas: Venda[]) {
  return (['BÁSICO', 'PRO', 'ULTRA'] as const).map(plan => {
    const paid = vendas.filter(v => v.plan === plan && v.status === 'paid')
    return { plan, receita: paid.reduce((s, v) => s + v.amount, 0) / 100, vendas: paid.length }
  })
}

function buildPaymentData(vendas: Venda[]) {
  const labels: Record<string, string> = { credit_card: 'Cartão', pix: 'PIX', boleto: 'Boleto' }
  const counts: Record<string, number> = {}
  for (const v of vendas.filter(v => v.status === 'paid')) {
    const label = labels[v.paymentMethod]
    counts[label] = (counts[label] ?? 0) + 1
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: boolean
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <p className={`font-title text-3xl uppercase tracking-wide ${accent ? 'text-accent' : 'text-contrast'}`}>
        {value}
      </p>
      <p className="font-body text-contrast/50 text-sm mt-1">{label}</p>
      {sub && <p className="font-body text-xs text-contrast/30 mt-0.5">{sub}</p>}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function VendasPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const paidVendas = MOCK_VENDAS.filter(v => v.status === 'paid')
  const totalReceita = paidVendas.reduce((s, v) => s + v.amount, 0) / 100
  const ticketMedio = paidVendas.length > 0 ? totalReceita / paidVendas.length : 0
  const assinantesAtivos = MOCK_ASSINANTES.filter(a => a.status === 'ativo').length

  const monthly   = buildMonthlyData(MOCK_VENDAS)
  const weekly    = buildWeeklyData(MOCK_VENDAS)
  const byPlan    = buildPlanData(MOCK_VENDAS)
  const byPayment = buildPaymentData(MOCK_VENDAS)

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-title text-3xl uppercase text-contrast tracking-wide">Vendas</h1>
        <p className="font-body text-contrast/50 text-sm mt-1">Visão geral de receita e assinantes — dados mockados</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de vendas"      value={String(paidVendas.length)} />
        <StatCard label="Receita total"        value={fmt(totalReceita)}         accent />
        <StatCard label="Ticket médio"         value={fmt(ticketMedio)} />
        <StatCard label="Assinantes ativos"    value={String(assinantesAtivos)}  sub={`de ${MOCK_ASSINANTES.length} cadastrados`} />
      </div>

      {/* Charts — row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReceitaSemanalChart data={weekly} />
        <ReceitaMensalChart  data={monthly} />
      </div>

      {/* Charts — row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReceitaPorPlanoChart  data={byPlan} />
        <MetodoPagamentoChart  data={byPayment} />
      </div>

      {/* Assinantes table */}
      <AssinantesTable assinantes={MOCK_ASSINANTES} />
    </div>
  )
}
