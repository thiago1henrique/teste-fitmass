'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

type MonthlyData  = { month: string; posts: number }
type StatusData   = { name: string; value: number }
type WeekdayData  = { day: string; posts: number }
type AuthorData   = { name: string; posts: number }

const ACCENT    = '#88BD23'
const SECONDARY = '#25B6EB'
const MUTED     = '#e5e7eb'

/* ─── Bar chart: posts por mês ───────────────────────────────────────────── */

export function PostsByMonthChart({ data }: { data: MonthlyData[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-5">
        Posts por mês
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={28}>
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'inherit', fontSize: 11, fill: '#999' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontFamily: 'inherit', fontSize: 11, fill: '#999' }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{
              fontFamily: 'inherit',
              fontSize: 12,
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
            formatter={(v) => { const n = Number(v); return [`${n} post${n !== 1 ? 's' : ''}`, ''] }}
          />
          <Bar dataKey="posts" fill={ACCENT} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ─── Pie chart: distribuição por status ─────────────────────────────────── */

const STATUS_COLORS: Record<string, string> = {
  Publicados: ACCENT,
  Rascunhos: MUTED,
}

export function PostsByStatusChart({ data }: { data: StatusData[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-5">
        Status dos posts
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={88}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#ccc'} />
            ))}
          </Pie>
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => (
              <span style={{ fontFamily: 'inherit', fontSize: 12, color: '#555' }}>{v}</span>
            )}
          />
          <Tooltip
            contentStyle={{
              fontFamily: 'inherit',
              fontSize: 12,
              borderRadius: 10,
              border: '1px solid #e5e7eb',
            }}
            formatter={(v, name) => [`${v}`, String(name)]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ─── Bar chart: posts por dia da semana ─────────────────────────────────── */

export function PostsByWeekdayChart({ data }: { data: WeekdayData[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-5">
        Posts por dia da semana
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={28}>
          <XAxis
            dataKey="day"
            tick={{ fontFamily: 'inherit', fontSize: 11, fill: '#999' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontFamily: 'inherit', fontSize: 11, fill: '#999' }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{
              fontFamily: 'inherit',
              fontSize: 12,
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
            formatter={(v) => { const n = Number(v); return [`${n} post${n !== 1 ? 's' : ''}`, ''] }}
          />
          <Bar dataKey="posts" fill={SECONDARY} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ─── Horizontal bar chart: top autores por posts ────────────────────────── */

export function TopAuthorsChart({ data }: { data: AuthorData[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h3 className="font-title text-base uppercase text-contrast tracking-wide mb-5">
        Top autores
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" barSize={20}>
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontFamily: 'inherit', fontSize: 11, fill: '#999' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontFamily: 'inherit', fontSize: 11, fill: '#666' }}
            axisLine={false}
            tickLine={false}
            width={96}
          />
          <Tooltip
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{
              fontFamily: 'inherit',
              fontSize: 12,
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
            formatter={(v) => { const n = Number(v); return [`${n} post${n !== 1 ? 's' : ''}`, ''] }}
          />
          <Bar dataKey="posts" fill={ACCENT} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
