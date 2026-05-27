'use client'

import { useState } from 'react'
import { Download, Search } from 'lucide-react'
import type { Assinante } from '../page'

const METHOD_LABEL: Record<Assinante['paymentMethod'], string> = {
  credit_card: 'Cartão',
  pix: 'PIX',
  boleto: 'Boleto',
}

const PLAN_COLOR: Record<Assinante['plan'], string> = {
  'BÁSICO':  'bg-gray-100 text-gray-600',
  'PRO':     'bg-secondary/10 text-secondary',
  'ULTRA':   'bg-accent/10 text-accent',
}

function fmtDate(iso: string) {
  if (iso === '—') return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function exportCSV(data: Assinante[]) {
  const headers = ['Nome', 'E-mail', 'Plano', 'Método', 'Status', 'Início', 'Próx. Cobrança']
  const rows = data.map(a => [
    a.name,
    a.email,
    a.plan,
    METHOD_LABEL[a.paymentMethod],
    a.status,
    fmtDate(a.startDate),
    fmtDate(a.nextPayment),
  ])
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `assinantes-fitmass-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function AssinantesTable({ assinantes }: { assinantes: Assinante[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos')

  const filtered = assinantes.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h3 className="font-title text-base uppercase text-contrast tracking-wide">
          Assinantes ({filtered.length})
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-contrast/30" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="font-body text-sm pl-9 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-contrast placeholder:text-contrast/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition w-full sm:w-64"
            />
          </div>
          {/* Status filter */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-body">
            {(['todos', 'ativo', 'inativo'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-3 py-2 capitalize transition-colors ${
                  statusFilter === opt
                    ? 'bg-accent text-white font-semibold'
                    : 'text-contrast/50 hover:text-contrast hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {/* CSV export */}
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 font-body text-sm text-contrast/60 hover:text-accent hover:border-accent/40 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-gray-50">
              {['Nome', 'E-mail', 'Plano', 'Método', 'Status', 'Início', 'Próx. Cobrança'].map(col => (
                <th key={col} className="px-5 py-3 text-left font-semibold text-xs uppercase tracking-widest text-contrast/30">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-contrast/30">
                  Nenhum assinante encontrado.
                </td>
              </tr>
            ) : (
              filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-contrast font-medium whitespace-nowrap">{a.name}</td>
                  <td className="px-5 py-3.5 text-contrast/60 whitespace-nowrap">{a.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${PLAN_COLOR[a.plan]}`}>
                      {a.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-contrast/60 whitespace-nowrap">{METHOD_LABEL[a.paymentMethod]}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      a.status === 'ativo' ? 'text-accent' : 'text-contrast/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${a.status === 'ativo' ? 'bg-accent' : 'bg-gray-300'}`} />
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-contrast/50 whitespace-nowrap">{fmtDate(a.startDate)}</td>
                  <td className="px-5 py-3.5 text-contrast/50 whitespace-nowrap">{fmtDate(a.nextPayment)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
