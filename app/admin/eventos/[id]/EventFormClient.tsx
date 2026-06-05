'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, Trash2, Save, Eye } from 'lucide-react'
import {
  getEvents,
  saveEvent,
  generateId,
} from '@/app/lib/events'
import {
  EVENT_TEMPLATES,
  TEMPLATE_LABELS,
  TEMPLATE_PREVIEW_COLOR,
  rgbToHex,
  hexToRgb,
  getThemeFromTemplate,
} from '@/app/lib/eventTemplates'
import type {
  FitmassEventData,
  EventTemplate,
  BannerSection,
  BannerPosition,
  BannerType,
} from '@/app/types/events'
import EventPromoPreview from './EventPromoPreview'

const TEMPLATES: EventTemplate[] = ['black-friday', 'natal', 'ano-novo', 'verao', 'lancamento', 'custom']

const POSITIONS: { value: BannerPosition; label: string }[] = [
  { value: 'after-hero',          label: 'Home — Após o hero' },
  { value: 'after-how-it-works',  label: 'Home — Após como funciona' },
  { value: 'after-testimonials',  label: 'Home — Após depoimentos' },
  { value: 'before-cta',          label: 'Home — Antes do CTA final' },
  { value: 'after-plans-hero',    label: 'Planos — Após o hero' },
  { value: 'after-plan-cards',    label: 'Planos — Após os cards' },
]

function defaultEvent(): FitmassEventData {
  const tmpl = EVENT_TEMPLATES['custom']
  const today = new Date()
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  return {
    id: generateId(),
    name: '',
    template: 'custom',
    active: false,
    startDate: today.toISOString().slice(0, 10),
    endDate: nextMonth.toISOString().slice(0, 10),
    theme: { ...tmpl.theme },
    promoStrip: { ...tmpl.promoStrip },
    banners: [],
    createdAt: new Date().toISOString(),
  }
}

interface Props {
  eventId: string
}

export default function EventFormClient({ eventId }: Props) {
  const router = useRouter()
  const isNew = eventId === 'novo'

  const [form, setForm] = useState<FitmassEventData>(() => {
    if (eventId !== 'novo') {
      const found = getEvents().find((e) => e.id === eventId)
      if (found) return found
    }
    return defaultEvent()
  })
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(true)

  function update<K extends keyof FitmassEventData>(key: K, value: FitmassEventData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateTheme(field: keyof FitmassEventData['theme'], hex: string) {
    setForm((prev) => ({ ...prev, theme: { ...prev.theme, [field]: hexToRgb(hex) } }))
  }

  function updatePromo(field: keyof FitmassEventData['promoStrip'], value: string) {
    setForm((prev) => ({ ...prev, promoStrip: { ...prev.promoStrip, [field]: value } }))
  }

  function selectTemplate(t: EventTemplate) {
    const tmpl = EVENT_TEMPLATES[t]
    setForm((prev) => ({
      ...prev,
      template: t,
      name: prev.name || tmpl.name,
      theme: { ...getThemeFromTemplate(t) },
      promoStrip: { ...tmpl.promoStrip },
    }))
  }

  function addBanner() {
    const banner: BannerSection = {
      id: generateId(),
      position: 'after-hero',
      type: 'divider',
      text: 'Promoção especial — aproveite!',
      bgColor: '#333333',
      textColor: '#FFFFFF',
    }
    setForm((prev) => ({ ...prev, banners: [...prev.banners, banner] }))
  }

  function updateBanner(id: string, field: keyof BannerSection, value: string) {
    setForm((prev) => ({
      ...prev,
      banners: prev.banners.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      ),
    }))
  }

  function removeBanner(id: string) {
    setForm((prev) => ({ ...prev, banners: prev.banners.filter((b) => b.id !== id) }))
  }

  function handleSave() {
    if (!form.name.trim()) { alert('Informe o nome do evento.'); return }
    if (!form.startDate || !form.endDate) { alert('Informe as datas de início e fim.'); return }
    if (form.startDate > form.endDate) { alert('A data de início deve ser anterior à data de fim.'); return }
    setSaving(true)
    saveEvent(form)
    setTimeout(() => router.push('/admin/eventos'), 300)
  }

  const accentHex = rgbToHex(form.theme.accent)
  const secondaryHex = rgbToHex(form.theme.secondary)
  const surfaceHex = rgbToHex(form.theme.surface)

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/admin/eventos')}
          className="flex items-center gap-1 text-contrast/50 hover:text-contrast transition-colors text-sm font-body"
        >
          <ChevronLeft size={16} />
          Eventos
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <h1 className="font-title text-2xl uppercase text-contrast tracking-wide">
          {isNew ? 'Novo Evento' : 'Editar Evento'}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 border border-gray-200 text-contrast/70 font-body text-sm px-4 py-2.5 rounded-xl hover:border-accent hover:text-accent transition-colors"
          >
            <Eye size={15} />
            {showPreview ? 'Ocultar preview' : 'Mostrar preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-5 py-2.5 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-[1fr_380px]' : 'grid-cols-1 max-w-2xl'}`}>
        {/* Form */}
        <div className="flex flex-col gap-6">

          {/* 1. Nome e Datas */}
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-title uppercase tracking-wide text-contrast text-lg mb-5">Informações</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label className="label-field">Nome do Evento</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="ex: Black Friday 2025"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Data de Início</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update('startDate', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Data de Fim</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => update('endDate', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </section>

          {/* 2. Template */}
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-title uppercase tracking-wide text-contrast text-lg mb-5">Template</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TEMPLATES.map((t) => {
                const selected = form.template === t
                const color = TEMPLATE_PREVIEW_COLOR[t]
                return (
                  <button
                    key={t}
                    onClick={() => selectTemplate(t)}
                    className={`flex flex-col gap-2 rounded-xl border-2 p-3.5 text-left transition-all ${
                      selected
                        ? 'border-accent shadow-sm bg-accent/5'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <span
                      className="h-5 w-full rounded-md"
                      style={{ backgroundColor: color }}
                    />
                    <span className={`font-body text-xs font-semibold ${selected ? 'text-accent' : 'text-contrast/70'}`}>
                      {TEMPLATE_LABELS[t]}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* 3. Cores do Tema */}
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-title uppercase tracking-wide text-contrast text-lg mb-5">Cores do Tema</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <ColorField
                label="Cor Principal (accent)"
                value={accentHex}
                onChange={(hex) => updateTheme('accent', hex)}
                hint="Botões, links, destaques"
              />
              <ColorField
                label="Cor Secundária"
                value={secondaryHex}
                onChange={(hex) => updateTheme('secondary', hex)}
                hint="Elementos de apoio"
              />
              <ColorField
                label="Fundo (surface)"
                value={surfaceHex}
                onChange={(hex) => updateTheme('surface', hex)}
                hint="Fundo de seções e cards"
              />
            </div>
          </section>

          {/* 4. Faixa Promocional */}
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-title uppercase tracking-wide text-contrast text-lg mb-5">Faixa Promocional</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field">Texto da Faixa</label>
                <input
                  type="text"
                  value={form.promoStrip.text}
                  onChange={(e) => updatePromo('text', e.target.value)}
                  placeholder="ex: 🔥 Black Friday — até 50% OFF!"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Texto do Botão</label>
                <input
                  type="text"
                  value={form.promoStrip.linkText}
                  onChange={(e) => updatePromo('linkText', e.target.value)}
                  placeholder="ex: Ver Planos"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Link do Botão</label>
                <input
                  type="text"
                  value={form.promoStrip.link}
                  onChange={(e) => updatePromo('link', e.target.value)}
                  placeholder="ex: /planos"
                  className="input-field"
                />
              </div>
              <ColorField
                label="Cor de Fundo"
                value={form.promoStrip.bgColor}
                onChange={(hex) => updatePromo('bgColor', hex)}
              />
              <ColorField
                label="Cor do Texto"
                value={form.promoStrip.textColor}
                onChange={(hex) => updatePromo('textColor', hex)}
              />
              <div className="sm:col-span-2">
                <label className="label-field">Fim do Countdown (data/hora)</label>
                <input
                  type="datetime-local"
                  value={form.promoStrip.countdownEnd?.slice(0, 16) ?? ''}
                  onChange={(e) => updatePromo('countdownEnd', new Date(e.target.value).toISOString())}
                  className="input-field"
                />
              </div>
            </div>
          </section>

          {/* 5. Banners */}
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-title uppercase tracking-wide text-contrast text-lg">Banners</h2>
              <button
                onClick={addBanner}
                className="inline-flex items-center gap-1.5 border border-accent text-accent font-body text-sm px-3 py-1.5 rounded-lg hover:bg-accent hover:text-white transition-colors"
              >
                <Plus size={14} />
                Adicionar Banner
              </button>
            </div>

            {form.banners.length === 0 ? (
              <p className="font-body text-contrast/40 text-sm text-center py-6">
                Nenhum banner configurado. Banners são opcionais.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {form.banners.map((banner, i) => (
                  <div key={banner.id} className="border border-gray-100 rounded-xl p-4 bg-surface/40">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-body font-semibold text-contrast/70 text-sm">Banner {i + 1}</span>
                      <button
                        onClick={() => removeBanner(banner.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Remover banner"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="label-field">Posição</label>
                        <select
                          value={banner.position}
                          onChange={(e) => updateBanner(banner.id, 'position', e.target.value as BannerPosition)}
                          className="input-field"
                        >
                          {POSITIONS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label-field">Tipo</label>
                        <select
                          value={banner.type}
                          onChange={(e) => updateBanner(banner.id, 'type', e.target.value as BannerType)}
                          className="input-field"
                        >
                          <option value="divider">Faixa de Texto</option>
                          <option value="horizontal">Imagem Horizontal</option>
                        </select>
                      </div>

                      {banner.type === 'horizontal' ? (
                        <>
                          <div className="sm:col-span-2">
                            <label className="label-field">URL da Imagem</label>
                            <input
                              type="url"
                              value={banner.imageUrl ?? ''}
                              onChange={(e) => updateBanner(banner.id, 'imageUrl', e.target.value)}
                              placeholder="https://..."
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="label-field">Link (opcional)</label>
                            <input
                              type="text"
                              value={banner.link ?? ''}
                              onChange={(e) => updateBanner(banner.id, 'link', e.target.value)}
                              placeholder="/planos"
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="label-field">Texto alternativo</label>
                            <input
                              type="text"
                              value={banner.altText ?? ''}
                              onChange={(e) => updateBanner(banner.id, 'altText', e.target.value)}
                              placeholder="Descrição da imagem"
                              className="input-field"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="sm:col-span-2">
                            <label className="label-field">Texto da Faixa</label>
                            <input
                              type="text"
                              value={banner.text ?? ''}
                              onChange={(e) => updateBanner(banner.id, 'text', e.target.value)}
                              placeholder="ex: Promoção especial!"
                              className="input-field"
                            />
                          </div>
                          <ColorField
                            label="Cor de Fundo"
                            value={banner.bgColor ?? '#333333'}
                            onChange={(hex) => updateBanner(banner.id, 'bgColor', hex)}
                          />
                          <ColorField
                            label="Cor do Texto"
                            value={banner.textColor ?? '#FFFFFF'}
                            onChange={(hex) => updateBanner(banner.id, 'textColor', hex)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="lg:sticky lg:top-6 h-fit">
            <EventPromoPreview form={form} />
          </div>
        )}
      </div>

      <style>{`
        .label-field {
          display: block;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgb(51 51 51 / 0.5);
          margin-bottom: 0.375rem;
        }
        .input-field {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.625rem;
          padding: 0.5rem 0.75rem;
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: #333;
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-field:focus {
          border-color: #88BD23;
          box-shadow: 0 0 0 3px rgb(136 189 35 / 0.1);
        }
        select.input-field {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

function ColorField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
  hint?: string
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative h-10 w-10 shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer rounded-lg border border-gray-200 opacity-0"
          />
          <span
            className="block h-10 w-10 rounded-lg border border-gray-200 shadow-sm"
            style={{ backgroundColor: value }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value)
          }}
          maxLength={7}
          className="input-field font-mono"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-contrast/40 font-body">{hint}</p>}
    </div>
  )
}
