'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

export type MonthlyPoint  = { month: string; receita: number; vendas: number }
export type WeeklyPoint   = { week: string;  receita: number; vendas: number }
export type PlanPoint     = { plan: string;  receita: number; vendas: number }
export type PaymentPoint  = { name: string;  value: number }

type Props = {
  monthly:   MonthlyPoint[]
  weekly:    WeeklyPoint[]
  byPlan:    PlanPoint[]
  byPayment: PaymentPoint[]
}

const ACCENT    = '#88BD23'
const SECONDARY = '#25B6EB'
const TERTIARY  = '#f59e0b'
const MUTED     = '#e5e7eb'

const PAYMENT_COLORS: Record<string, string> = {
  PIX:     ACCENT,
  Cartão:  SECONDARY,
  Boleto:  TERTIARY,
}

const TOOLTIP_STYLE = {
  fontFamily: 'inherit',
  fontSize: 12,
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
}

const AXIS_TICK = { fontFamily: 'inherit', fontSize: 11, fill: '#999' }

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function ReceitaSemanalChart({ data }: { data: WeeklyPoint[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-5">
        Receita semanal
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={28}>
          <XAxis dataKey="week" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis
            tick={AXIS_TICK} axisLine={false} tickLine={false} width={56}
            tickFormatter={(v) => `R$${Math.round(v / 1000)}k`}
          />
          <Tooltip
            cursor={{ fill: '#f3f4f6' }} contentStyle={TOOLTIP_STYLE}
            formatter={(v) => [fmt(Number(v)), 'Receita']}
          />
          <Bar dataKey="receita" fill={ACCENT} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ReceitaMensalChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-5">
        Receita mensal
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={22}>
          <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis
            tick={AXIS_TICK} axisLine={false} tickLine={false} width={56}
            tickFormatter={(v) => `R$${Math.round(v / 1000)}k`}
          />
          <Tooltip
            cursor={{ fill: '#f3f4f6' }} contentStyle={TOOLTIP_STYLE}
            formatter={(v) => [fmt(Number(v)), 'Receita']}
          />
          <Bar dataKey="receita" fill={SECONDARY} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ReceitaPorPlanoChart({ data }: { data: PlanPoint[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-5">
        Receita por plano
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" barSize={24}>
          <XAxis
            type="number" tick={AXIS_TICK} axisLine={false} tickLine={false}
            tickFormatter={(v) => `R$${Math.round(v / 1000)}k`}
          />
          <YAxis
            type="category" dataKey="plan" axisLine={false} tickLine={false} width={60}
            tick={{ fontFamily: 'inherit', fontSize: 11, fill: '#666' }}
          />
          <Tooltip
            cursor={{ fill: '#f3f4f6' }} contentStyle={TOOLTIP_STYLE}
            formatter={(v, name) => name === 'receita' ? [fmt(Number(v)), 'Receita'] : [`${v} vendas`, 'Vendas']}
          />
          <Bar dataKey="receita" fill={ACCENT} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MetodoPagamentoChart({ data }: { data: PaymentPoint[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-5">
        Método de pagamento
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={88} paddingAngle={3} dataKey="value">
            {data.map((entry) => (
              <Cell key={entry.name} fill={PAYMENT_COLORS[entry.name] ?? MUTED} />
            ))}
          </Pie>
          <Legend
            iconType="circle" iconSize={8}
            formatter={(v) => <span style={{ fontFamily: 'inherit', fontSize: 12, color: '#555' }}>{v}</span>}
          />
          <Tooltip
            contentStyle={{ ...TOOLTIP_STYLE }}
            formatter={(v, name) => [`${v} vendas`, String(name)]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
