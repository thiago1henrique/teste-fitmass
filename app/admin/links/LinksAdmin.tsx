'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Pencil, Trash2, X, ChevronDown, ChevronRight,
  ExternalLink, Link2, Layers, RefreshCw, Smartphone, GripVertical,
} from 'lucide-react'
import {
  createLinkCategory, updateLinkCategory, deleteLinkCategory,
  createLinkItem, updateLinkItem, deleteLinkItem,
  reorderLinkItems, toggleLinkItemDisabled, seedDefaultLinks,
} from '@/app/actions/links'
import { ICON_REGISTRY, getSocialMeta } from '@/app/links/socialIcons'

// ── Types ─────────────────────────────────────────────────────────────────────

interface CategoryData {
  id: string
  name: string
  order: number
  parentId: string | null
  hasTabs: boolean
  disabled: boolean
  disabledLabel: string | null
}

interface LinkData {
  id: string
  title: string
  url: string
  description: string | null
  icon: string | null
  categoryId: string
  order: number
  disabled: boolean
}

type CatModal =
  | { mode: 'create-top'; defaultHasTabs?: boolean }
  | { mode: 'create-sub'; parentId: string }
  | { mode: 'edit'; item: CategoryData }

type LinkModal =
  | { mode: 'create'; defaultCategoryId?: string }
  | { mode: 'edit'; item: LinkData }

// ── Modal shell ───────────────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, children }: {
  isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-title text-base uppercase text-contrast tracking-wide">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 -mr-1">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── Icon picker ───────────────────────────────────────────────────────────────

function IconPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div>
      <p className="font-body text-xs text-gray-500 mb-2">
        Ícone{' '}
        {value && (
          <button type="button" onClick={() => onChange('')} className="text-accent underline">
            limpar (auto)
          </button>
        )}
      </p>
      <div className="grid grid-cols-7 gap-1.5">
        {ICON_REGISTRY.map(({ id, label, Icon }) => (
          <button
            key={id} type="button"
            onClick={() => onChange(value === id ? '' : id)}
            title={label}
            className={`aspect-square flex items-center justify-center rounded-lg transition-all ${
              value === id
                ? 'bg-accent text-white ring-2 ring-accent ring-offset-1'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2 font-body text-sm text-contrast focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'

// ── Category form ─────────────────────────────────────────────────────────────

function CategoryForm({ modal, topLevel, onSubmit, onCancel }: {
  modal: CatModal
  topLevel: CategoryData[]
  onSubmit: (fd: FormData) => Promise<void>
  onCancel: () => void
}) {
  const editing = modal.mode === 'edit' ? modal.item : null
  const isTopLevel = modal.mode === 'create-top' || (modal.mode === 'edit' && !editing?.parentId)
  const defaultParent = modal.mode === 'create-sub' ? modal.parentId : (editing?.parentId ?? '')

  const [name, setName] = useState(editing?.name ?? '')
  const [order, setOrder] = useState(String(editing?.order ?? 0))
  const [parentId, setParentId] = useState(defaultParent)
  const [hasTabs, setHasTabs] = useState(
    editing?.hasTabs ?? (modal.mode === 'create-top' ? (modal.defaultHasTabs ?? false) : false)
  )
  const [disabled, setDisabled] = useState(editing?.disabled ?? false)
  const [disabledLabel, setDisabledLabel] = useState(editing?.disabledLabel ?? 'Em breve')
  const [isPending, start] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('name', name); fd.set('order', order)
    if (parentId) fd.set('parentId', parentId)
    fd.set('hasTabs', String(hasTabs))
    fd.set('disabled', String(disabled))
    fd.set('disabledLabel', disabledLabel)
    start(() => onSubmit(fd))
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Nome">
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Redes Sociais" />
      </Field>
      <Field label="Ordem">
        <input className={inputCls} type="number" value={order} onChange={(e) => setOrder(e.target.value)} min={0} />
      </Field>
      {modal.mode !== 'create-top' && (
        <Field label="Categoria pai">
          <select className={inputCls} value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">— Nenhuma (seção raiz) —</option>
            {topLevel.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
      )}
      {isTopLevel && (
        <div className="rounded-xl border border-gray-200 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-body text-sm font-semibold text-contrast">Exibir abas</p>
              <p className="font-body text-xs text-gray-400 mt-0.5">
                {hasTabs ? 'Sub-categorias aparecem como abas' : 'Links exibidos diretamente, sem abas'}
              </p>
            </div>
            <button
              type="button" onClick={() => setHasTabs((v) => !v)}
              className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${hasTabs ? 'bg-accent' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${hasTabs ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <input id="disabled-toggle" type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} className="w-4 h-4 accent-accent" />
        <label htmlFor="disabled-toggle" className="font-body text-sm text-gray-600">
          Desabilitar (mostra como &quot;Em breve&quot;)
        </label>
      </div>
      {disabled && (
        <Field label="Label do badge">
          <input className={inputCls} value={disabledLabel} onChange={(e) => setDisabledLabel(e.target.value)} placeholder="Em breve" />
        </Field>
      )}
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-accent text-white rounded-xl font-body text-sm font-semibold hover:bg-accent/90 disabled:opacity-50">
          {isPending ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}

// ── Link form ─────────────────────────────────────────────────────────────────

function LinkForm({ modal, categories, onSubmit, onCancel }: {
  modal: LinkModal
  categories: CategoryData[]
  onSubmit: (fd: FormData) => Promise<void>
  onCancel: () => void
}) {
  const editing = modal.mode === 'edit' ? modal.item : null
  const defaultCat = modal.mode === 'create' ? (modal.defaultCategoryId ?? '') : (editing?.categoryId ?? '')

  const [title, setTitle] = useState(editing?.title ?? '')
  const [url, setUrl] = useState(editing?.url ?? '')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [icon, setIcon] = useState(editing?.icon ?? '')
  const [categoryId, setCategoryId] = useState(defaultCat)
  const [isPending, start] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('title', title); fd.set('url', url); fd.set('description', description)
    if (icon) fd.set('icon', icon)
    fd.set('categoryId', categoryId)
    fd.set('order', String(editing?.order ?? 0))
    start(() => onSubmit(fd))
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <IconPicker value={icon} onChange={setIcon} />
      <Field label="Título">
        <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex: Instagram" />
      </Field>
      <Field label="URL">
        <input className={inputCls} type="url" value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://" />
      </Field>
      <Field label="Descrição (opcional)">
        <input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Siga a Fitmass no Instagram" />
      </Field>
      <Field label="Categoria / Aba">
        <select className={inputCls} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">— Selecione —</option>
          {categories.sort((a, b) => a.order - b.order).map((c) => (
            <option key={c.id} value={c.id}>{c.parentId ? `↳ ${c.name}` : c.name}</option>
          ))}
        </select>
      </Field>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-accent text-white rounded-xl font-body text-sm font-semibold hover:bg-accent/90 disabled:opacity-50">
          {isPending ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}

// ── Preview panel ─────────────────────────────────────────────────────────────

function PreviewPanel() {
  const [key, setKey] = useState(0)
  return (
    <div className="hidden xl:flex flex-col gap-3 sticky top-6 self-start">
      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 font-body text-xs font-semibold text-gray-400 uppercase tracking-widest">
          <Smartphone size={12} /> Preview
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setKey((k) => k + 1)}
            title="Recarregar preview"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw size={12} />
          </button>
          <a
            href="/links" target="_blank" rel="noopener noreferrer"
            title="Abrir /links em nova aba"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
      <div className="mx-auto" style={{ width: 360 }}>
        <div
          className="rounded-[2.4rem] border-[5px] border-gray-800 bg-gray-800 overflow-hidden shadow-2xl relative"
          style={{ height: 680 }}
        >
          <div className="absolute top-0 inset-x-0 flex justify-center z-10 pointer-events-none">
            <div className="w-24 h-5 bg-gray-800 rounded-b-2xl" />
          </div>
          <iframe key={key} src="/links" title="Preview /links" className="w-full h-full border-0 bg-[#0a0a0a]" />
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none">
            <div className="w-16 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
      <p className="text-center font-body text-[10px] text-gray-300">
        Clique em <RefreshCw size={9} className="inline" /> para atualizar após salvar
      </p>
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-title text-xs uppercase text-gray-400 tracking-widest">{title}</h2>
    </div>
  )
}

// ── Empty placeholder ─────────────────────────────────────────────────────────

function EmptyPlaceholder({ text, onAdd, addLabel }: {
  text: string; onAdd?: () => void; addLabel?: string
}) {
  return (
    <div className="flex items-center justify-between px-5 py-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
      <p className="font-body text-sm text-gray-400">{text}</p>
      {onAdd && (
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-accent hover:text-accent/80 transition-colors ml-4 shrink-0">
          <Plus size={12} /> {addLabel ?? 'Adicionar'}
        </button>
      )}
    </div>
  )
}

// ── Active toggle ─────────────────────────────────────────────────────────────

function ActiveToggle({ disabled, onClick, busy }: { disabled: boolean; onClick: () => void; busy: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      title={disabled ? 'Inativo — clique para ativar' : 'Ativo — clique para desativar'}
      className={`shrink-0 px-2 py-0.5 rounded-full font-body text-[10px] font-semibold transition-colors disabled:opacity-50 ${
        disabled
          ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          : 'bg-green-100 text-green-600 hover:bg-green-200'
      }`}
    >
      {disabled ? 'Inativo' : 'Ativo'}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LinksAdmin({
  categories,
  links,
}: {
  categories: CategoryData[]
  links: LinkData[]
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [seeding, setSeeding] = useState(false)
  const [catModal, setCatModal] = useState<CatModal | null>(null)
  const [linkModal, setLinkModal] = useState<LinkModal | null>(null)
  const [confirm, setConfirm] = useState<{ type: 'cat' | 'link'; id: string; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  // Drag state for Redes Sociais cards
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const topLevel = categories.filter((c) => !c.parentId).sort((a, b) => a.order - b.order)
  const flatCats = topLevel.filter((c) => !c.hasTabs)
  const tabCats = topLevel.filter((c) => c.hasTabs)
  const subTabsOf = (id: string) => categories.filter((c) => c.parentId === id).sort((a, b) => a.order - b.order)
  const linksOf = (catId: string) => links.filter((l) => l.categoryId === catId).sort((a, b) => a.order - b.order)

  function toggleCollapse(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  function refresh() { startTransition(() => router.refresh()) }

  async function handleCatSubmit(fd: FormData) {
    setError(null)
    const result = catModal?.mode === 'edit'
      ? await updateLinkCategory(catModal.item.id, fd)
      : await createLinkCategory(fd)
    if (result?.error) { setError(result.error); return }
    setCatModal(null); refresh()
  }

  async function handleLinkSubmit(fd: FormData) {
    setError(null)
    const result = linkModal?.mode === 'edit'
      ? await updateLinkItem(linkModal.item.id, fd)
      : await createLinkItem(fd)
    if (result?.error) { setError(result.error); return }
    setLinkModal(null); refresh()
  }

  async function handleSeed() {
    setSeeding(true); setError(null)
    const result = await seedDefaultLinks()
    setSeeding(false)
    if (result?.error) { setError(result.error); return }
    refresh()
  }

  async function handleDelete() {
    if (!confirm) return
    setDeleting(true); setError(null)
    try {
      const result = confirm.type === 'cat'
        ? await deleteLinkCategory(confirm.id)
        : await deleteLinkItem(confirm.id)
      if (result?.error) { setError(result.error); return }
      setConfirm(null); refresh()
    } catch {
      setError('Erro ao excluir. Tente novamente.')
    } finally {
      setDeleting(false)
    }
  }

  async function handleToggleDisabled(id: string, newDisabled: boolean) {
    setToggling(id); setError(null)
    const result = await toggleLinkItemDisabled(id, newDisabled)
    setToggling(null)
    if (result?.error) { setError(result.error); return }
    refresh()
  }

  async function handleDrop(targetId: string, catId: string) {
    const fromId = dragId
    setDragId(null); setDragOverId(null)
    if (!fromId || fromId === targetId) return

    const catLinks = linksOf(catId)
    const fromIdx = catLinks.findIndex((l) => l.id === fromId)
    const toIdx   = catLinks.findIndex((l) => l.id === targetId)
    if (fromIdx === -1 || toIdx === -1) return

    const reordered = [...catLinks]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)

    setError(null)
    const result = await reorderLinkItems(catId, reordered.map((l) => l.id))
    if (result?.error) { setError(result.error); return }
    refresh()
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
        <div>
          <h1 className="font-title text-3xl uppercase text-contrast tracking-wide">Links</h1>
          <p className="font-body text-contrast/50 text-sm mt-1">Gerencie a página fitmass.com.br/links</p>
        </div>
        <a
          href="/links" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 font-body text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ExternalLink size={14} /> Ver página
        </a>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-body text-sm flex items-center gap-2">
          <X size={14} /> {error}
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">

        {/* ── Left: admin ───────────────────────────────────────────────── */}
        <div className="space-y-10">

          {/* Seed banner */}
          {categories.length === 0 && (
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-body text-sm font-semibold text-contrast">Nenhum dado cadastrado ainda</p>
                <p className="font-body text-xs text-gray-500 mt-0.5">Importe os links padrão da Fitmass para começar rapidamente.</p>
              </div>
              <button
                onClick={handleSeed} disabled={seeding}
                className="shrink-0 inline-flex items-center gap-2 bg-accent text-white font-body font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-accent/90 disabled:opacity-50"
              >
                {seeding ? 'Importando…' : 'Importar dados padrão'}
              </button>
            </div>
          )}

          {/* ── Seção: Redes Sociais ───────────────────────────────────── */}
          <div>
            <SectionLabel title="Redes Sociais" />

            <div className="flex flex-col gap-4">
              {flatCats.length === 0 ? (
                <EmptyPlaceholder text="Sem cards" />
              ) : (
                flatCats.map((cat) => {
                  const catLinks = linksOf(cat.id)
                  const isCollapsed = collapsed.has(cat.id)
                  return (
                    <div key={cat.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

                      {/* Category header */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <button onClick={() => toggleCollapse(cat.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                          {isCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
                        </button>
                        <p className="font-body font-bold text-sm text-contrast flex-1">{cat.name}</p>
                        <button
                          onClick={() => setCatModal({ mode: 'edit', item: cat })}
                          className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setConfirm({ type: 'cat', id: cat.id, name: cat.name })}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Category body */}
                      {!isCollapsed && (
                        <div>
                          {catLinks.length === 0 ? (
                            <div className="flex items-center justify-between px-5 py-5">
                              <p className="font-body text-sm text-gray-400">Sem cards</p>
                              <button
                                onClick={() => setLinkModal({ mode: 'create', defaultCategoryId: cat.id })}
                                className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-accent hover:text-accent/80"
                              >
                                <Plus size={12} /> Adicionar card
                              </button>
                            </div>
                          ) : (
                            <>
                              {catLinks.map((link) => {
                                const { icon: Icon } = getSocialMeta(link.url, link.icon)
                                const isOver = dragOverId === link.id && dragId !== link.id
                                return (
                                  <div
                                    key={link.id}
                                    draggable
                                    onDragStart={() => setDragId(link.id)}
                                    onDragEnd={() => { setDragId(null); setDragOverId(null) }}
                                    onDragOver={(e) => { e.preventDefault(); setDragOverId(link.id) }}
                                    onDragLeave={() => setDragOverId(null)}
                                    onDrop={(e) => { e.preventDefault(); handleDrop(link.id, cat.id) }}
                                    className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0 transition-colors select-none ${
                                      isOver ? 'bg-accent/5 border-t-2 border-t-accent' : ''
                                    } ${dragId === link.id ? 'opacity-40' : ''}`}
                                  >
                                    <GripVertical size={14} className="text-gray-300 cursor-grab shrink-0" />
                                    <div className="w-8 h-8 rounded-lg bg-contrast flex items-center justify-center shrink-0 text-white">
                                      <Icon size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-body text-sm font-semibold text-contrast truncate">{link.title}</p>
                                      {link.description && <p className="font-body text-xs text-gray-400 truncate">{link.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button onClick={() => setLinkModal({ mode: 'edit', item: link })} className="font-body text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">Editar</button>
                                      <button onClick={() => setConfirm({ type: 'link', id: link.id, name: link.title })} className="font-body text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">Excluir</button>
                                    </div>
                                  </div>
                                )
                              })}
                              <button
                                onClick={() => setLinkModal({ mode: 'create', defaultCategoryId: cat.id })}
                                className="w-full flex items-center justify-center gap-2 py-3 text-xs font-body font-semibold text-accent hover:bg-accent/5 transition-colors border-t border-gray-100"
                              >
                                <Link2 size={12} /> Adicionar card em {cat.name}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* ── Seção: Abas ───────────────────────────────────────────── */}
          <div>
            <SectionLabel title="Abas" />

            <div className="flex flex-col gap-4">
              {tabCats.length === 0 ? (
                <EmptyPlaceholder
                  text="Sem abas cadastradas"
                  onAdd={() => setCatModal({ mode: 'create-top', defaultHasTabs: true })}
                  addLabel="Nova aba"
                />
              ) : (
                tabCats.map((cat) => {
                  const subs = subTabsOf(cat.id)
                  const isCollapsed = collapsed.has(cat.id)
                  return (
                    <div key={cat.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

                      {/* Tab category header */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <button onClick={() => toggleCollapse(cat.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                          {isCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
                        </button>
                        <p className="font-body font-bold text-sm text-contrast flex-1">{cat.name}</p>
                        <span className="flex items-center gap-1 font-body text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0">
                          <Layers size={9} /> abas
                        </span>
                        <button onClick={() => setCatModal({ mode: 'edit', item: cat })} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setConfirm({ type: 'cat', id: cat.id, name: cat.name })} className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Tab category body */}
                      {!isCollapsed && (
                        <div>
                          {subs.length === 0 && (
                            <p className="text-center text-gray-400 font-body text-xs py-6">Nenhuma aba ainda</p>
                          )}

                          {subs.map((sub) => {
                            const subLinks = linksOf(sub.id)
                            const subCollapsed = collapsed.has(sub.id)
                            return (
                              <div key={sub.id} className="border-b border-gray-100 last:border-b-0">
                                {/* Sub-tab header */}
                                <div className="flex items-center gap-3 px-5 py-3 bg-gray-50/60 hover:bg-gray-50 transition-colors">
                                  <button onClick={() => toggleCollapse(sub.id)} className="text-gray-300 hover:text-gray-500 shrink-0">
                                    {subCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                                  </button>
                                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                                    <Layers size={13} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-body text-sm font-semibold text-contrast truncate">{sub.name}</p>
                                    {sub.disabled ? (
                                      <span className="font-body text-xs text-amber-500">{sub.disabledLabel ?? 'Em breve'}</span>
                                    ) : (
                                      <p className="font-body text-xs text-gray-400">{subLinks.length} card{subLinks.length !== 1 ? 's' : ''}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button onClick={() => setCatModal({ mode: 'edit', item: sub })} className="font-body text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">Editar</button>
                                    <button onClick={() => setConfirm({ type: 'cat', id: sub.id, name: sub.name })} className="font-body text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">Excluir</button>
                                  </div>
                                </div>

                                {/* Sub-tab cards */}
                                {!subCollapsed && (
                                  <div className="pl-5 border-l-2 border-gray-100 ml-5">
                                    {subLinks.length === 0 ? (
                                      <div className="flex items-center justify-between px-4 py-4">
                                        <p className="font-body text-xs text-gray-400">Sem cards</p>
                                        <button
                                          onClick={() => setLinkModal({ mode: 'create', defaultCategoryId: sub.id })}
                                          className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-accent hover:text-accent/80"
                                        >
                                          <Plus size={11} /> Adicionar card
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        {subLinks.map((link) => {
                                          const { icon: Icon } = getSocialMeta(link.url, link.icon)
                                          return (
                                            <div key={link.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0">
                                              <div className="w-8 h-8 rounded-lg bg-contrast flex items-center justify-center shrink-0 text-white">
                                                <Icon size={14} />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="font-body text-sm font-semibold text-contrast truncate">{link.title}</p>
                                                {link.description && <p className="font-body text-xs text-gray-400 truncate">{link.description}</p>}
                                              </div>
                                              <div className="flex items-center gap-1.5 shrink-0">
                                                <ActiveToggle
                                                  disabled={link.disabled}
                                                  busy={toggling === link.id}
                                                  onClick={() => handleToggleDisabled(link.id, !link.disabled)}
                                                />
                                                <button onClick={() => setLinkModal({ mode: 'edit', item: link })} className="font-body text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">Editar</button>
                                                <button onClick={() => setConfirm({ type: 'link', id: link.id, name: link.title })} className="font-body text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">Excluir</button>
                                              </div>
                                            </div>
                                          )
                                        })}
                                        <button
                                          onClick={() => setLinkModal({ mode: 'create', defaultCategoryId: sub.id })}
                                          className="w-full flex items-center justify-center gap-2 py-3 text-xs font-body font-semibold text-accent hover:bg-accent/5 transition-colors border-t border-gray-100"
                                        >
                                          <Link2 size={11} /> Adicionar card em {sub.name}
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}

                          <button
                            onClick={() => setCatModal({ mode: 'create-sub', parentId: cat.id })}
                            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-body font-semibold text-accent hover:bg-accent/5 transition-colors border-t border-gray-100"
                          >
                            <Plus size={12} /> Nova aba
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* ── Right: preview ────────────────────────────────────────────── */}
        <PreviewPanel />
      </div>

      {/* ── Category modal ────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!catModal}
        onClose={() => setCatModal(null)}
        title={catModal?.mode === 'edit' ? 'Editar seção' : catModal?.mode === 'create-sub' ? 'Nova aba' : 'Nova seção'}
      >
        {catModal && (
          <CategoryForm modal={catModal} topLevel={topLevel} onSubmit={handleCatSubmit} onCancel={() => setCatModal(null)} />
        )}
      </Modal>

      {/* ── Link modal ────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!linkModal}
        onClose={() => setLinkModal(null)}
        title={linkModal?.mode === 'edit' ? 'Editar card' : 'Novo card'}
      >
        {linkModal && (
          <LinkForm modal={linkModal} categories={categories} onSubmit={handleLinkSubmit} onCancel={() => setLinkModal(null)} />
        )}
      </Modal>

      {/* ── Confirm delete ────────────────────────────────────────────────── */}
      <Modal isOpen={!!confirm} onClose={() => setConfirm(null)} title="Confirmar exclusão">
        <p className="font-body text-sm text-gray-600 mb-6">
          Tem certeza que deseja excluir <strong>{confirm?.name}</strong>?
          {confirm?.type === 'cat' && (
            <span className="block mt-1 text-gray-400 text-xs">Sub-abas e links vinculados também serão excluídos.</span>
          )}
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-xl font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
          <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-500 text-white rounded-xl font-body text-sm font-semibold hover:bg-red-600 disabled:opacity-50">
            {deleting ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
