'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Power, PowerOff, Calendar, Zap } from 'lucide-react'
import {
  getEvents,
  activateEvent,
  deactivateEvent,
  deleteEvent,
  isEventWithinRange,
  EVENTS_SYNC_EVENT,
} from '@/app/lib/events'
import { TEMPLATE_LABELS, TEMPLATE_PREVIEW_COLOR } from '@/app/lib/eventTemplates'
import type { FitmassEventData } from '@/app/types/events'

type EventStatus = 'ativo' | 'inativo' | 'expirado'

function getStatus(event: FitmassEventData): EventStatus {
  if (!isEventWithinRange(event)) return 'expirado'
  if (event.active) return 'ativo'
  return 'inativo'
}

const STATUS_CONFIG: Record<EventStatus, { label: string; className: string }> = {
  ativo:    { label: 'Ativo',    className: 'bg-green-100 text-green-700' },
  inativo:  { label: 'Inativo',  className: 'bg-gray-100 text-gray-600' },
  expirado: { label: 'Expirado', className: 'bg-red-100 text-red-600' },
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function loadEvents(): FitmassEventData[] {
  return getEvents().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function EventsListClient() {
  const [events, setEvents] = useState<FitmassEventData[]>([])

  useEffect(() => {
    function reload() {
      setEvents(loadEvents())
    }
    reload()
    window.addEventListener('storage', reload)
    window.addEventListener(EVENTS_SYNC_EVENT, reload)
    return () => {
      window.removeEventListener('storage', reload)
      window.removeEventListener(EVENTS_SYNC_EVENT, reload)
    }
  }, [])

  function handleToggle(event: FitmassEventData) {
    if (event.active) {
      deactivateEvent()
    } else {
      activateEvent(event.id)
    }
    setEvents(loadEvents())
  }

  function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return
    deleteEvent(id)
    setEvents(loadEvents())
  }

  const activeCount = events.filter((e) => e.active && isEventWithinRange(e)).length

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <h1 className="font-title text-3xl uppercase text-contrast tracking-wide">Eventos</h1>
          <p className="font-body text-contrast/50 text-sm mt-1">
            {events.length} evento(s) · {activeCount} ativo(s)
          </p>
        </div>
        <Link
          href="/admin/eventos/novo"
          className="inline-flex items-center gap-2 bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-5 py-3 rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Plus size={16} />
          Novo Evento
        </Link>
      </div>

      {/* Table card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
              <Zap size={24} className="text-accent" />
            </div>
            <div>
              <p className="font-body font-semibold text-contrast">Nenhum evento criado</p>
              <p className="font-body text-contrast/50 text-sm mt-1">
                Crie seu primeiro evento sazonal para personalizar o site.
              </p>
            </div>
            <Link
              href="/admin/eventos/novo"
              className="inline-flex items-center gap-2 bg-accent text-white font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-accent/90 transition-colors"
            >
              <Plus size={14} />
              Criar evento
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-gray-100 bg-surface/60">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-contrast/50">Evento</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-contrast/50">Template</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-contrast/50">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-contrast/50">Período</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-contrast/50">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => {
                  const status = getStatus(event)
                  const statusCfg = STATUS_CONFIG[status]
                  const previewColor = TEMPLATE_PREVIEW_COLOR[event.template]
                  return (
                    <tr key={event.id} className="hover:bg-surface/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: previewColor }} />
                          <span className="font-semibold text-contrast">{event.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-contrast/70">{TEMPLATE_LABELS[event.template]}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCfg.className}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-contrast/60">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="shrink-0 text-contrast/40" />
                          <span>{formatDate(event.startDate)} → {formatDate(event.endDate)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggle(event)}
                            disabled={status === 'expirado'}
                            title={event.active ? 'Desativar evento' : 'Ativar evento'}
                            className={`rounded-lg p-2 transition-colors ${
                              status === 'expirado'
                                ? 'cursor-not-allowed opacity-30'
                                : event.active
                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            {event.active ? <Power size={15} /> : <PowerOff size={15} />}
                          </button>
                          <Link
                            href={`/admin/eventos/${event.id}`}
                            title="Editar evento"
                            className="rounded-lg p-2 bg-gray-50 text-gray-500 hover:bg-accent hover:text-white transition-colors"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id)}
                            title="Excluir evento"
                            className="rounded-lg p-2 bg-gray-50 text-gray-500 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
