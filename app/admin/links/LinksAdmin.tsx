'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, ChevronRight, ExternalLink } from 'lucide-react'
import {
  createLinkCategory, updateLinkCategory, deleteLinkCategory,
  createLinkItem, updateLinkItem, deleteLinkItem,
  seedDefaultLinks,
} from '@/app/actions/links'
import { ICON_REGISTRY, getSocialMeta } from '@/app/links/socialIcons'

// ── Types ─────────────────────────────────────────────────────────────────────

interface CategoryData {
  id: string
  name: string
  order: number
  parentId: string | null
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
}

type CatModal =
  | { mode: 'create-top' }
  | { mode: 'create-sub'; parentId: string }
  | { mode: 'edit'; item: CategoryData }

type LinkModal =
  | { mode: 'create'; defaultCategoryId?: string }
  | { mode: 'edit'; item: LinkData }

// ── Modal shell ───────────────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, children }: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-title text-base uppercase text-contrast tracking-wide">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1">
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
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-accent underline"
          >
            limpar (auto)
          </button>
        )}
      </p>
      <div className="grid grid-cols-7 gap-1.5">
        {ICON_REGISTRY.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
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
      <label className="block font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
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
  const defaultParent = modal.mode === 'create-sub' ? modal.parentId : (editing?.parentId ?? '')

  const [name, setName] = useState(editing?.name ?? '')
  const [order, setOrder] = useState(String(editing?.order ?? 0))
  const [parentId, setParentId] = useState(defaultParent)
  const [disabled, setDisabled] = useState(editing?.disabled ?? false)
  const [disabledLabel, setDisabledLabel] = useState(editing?.disabledLabel ?? 'Em breve')
  const [isPending, start] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('name', name)
    fd.set('order', order)
    if (parentId) fd.set('parentId', parentId)
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
        <Field label="Categoria pai (aba dentro de outra)">
          <select className={inputCls} value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">— Nenhuma (categoria raiz) —</option>
            {topLevel.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
      )}

      <div className="flex items-center gap-3">
        <input
          id="disabled-toggle"
          type="checkbox"
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
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
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-accent text-white rounded-xl font-body text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50">
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
  const [order, setOrder] = useState(String(editing?.order ?? 0))
  const [isPending, start] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('title', title)
    fd.set('url', url)
    fd.set('description', description)
    if (icon) fd.set('icon', icon)
    fd.set('categoryId', categoryId)
    fd.set('order', order)
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
            <option key={c.id} value={c.id}>
              {c.parentId ? `↳ ${c.name}` : c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Ordem">
        <input className={inputCls} type="number" value={order} onChange={(e) => setOrder(e.target.value)} min={0} />
      </Field>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-accent text-white rounded-xl font-body text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50">
          {isPending ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
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
  const [, start] = useTransition()

  const [seeding, setSeeding] = useState(false)

  const [catModal, setCatModal] = useState<CatModal | null>(null)
  const [linkModal, setLinkModal] = useState<LinkModal | null>(null)
  const [confirm, setConfirm] = useState<{ type: 'cat' | 'link'; id: string; name: string } | null>(null)
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const topLevel = categories.filter((c) => !c.parentId).sort((a, b) => a.order - b.order)
  const subTabsOf = (id: string) => categories.filter((c) => c.parentId === id).sort((a, b) => a.order - b.order)
  const filteredLinks = (selectedCat === 'all' ? links : links.filter((l) => l.categoryId === selectedCat))
    .sort((a, b) => a.order - b.order)

  function refresh() {
    start(() => router.refresh())
  }

  async function handleCatSubmit(fd: FormData) {
    setError(null)
    const result =
      catModal?.mode === 'edit'
        ? await updateLinkCategory(catModal.item.id, fd)
        : await createLinkCategory(fd)
    if (result?.error) { setError(result.error); return }
    setCatModal(null)
    refresh()
  }

  async function handleLinkSubmit(fd: FormData) {
    setError(null)
    const result =
      linkModal?.mode === 'edit'
        ? await updateLinkItem(linkModal.item.id, fd)
        : await createLinkItem(fd)
    if (result?.error) { setError(result.error); return }
    setLinkModal(null)
    refresh()
  }

  async function handleSeed() {
    setSeeding(true)
    setError(null)
    const result = await seedDefaultLinks()
    setSeeding(false)
    if (result?.error) { setError(result.error); return }
    refresh()
  }

  async function handleDelete() {
    if (!confirm) return
    setDeleting(true)
    setError(null)
    try {
      if (confirm.type === 'cat') await deleteLinkCategory(confirm.id)
      else await deleteLinkItem(confirm.id)
      setConfirm(null)
      refresh()
    } catch {
      setError('Erro ao excluir. Tente novamente.')
    } finally {
      setDeleting(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
        <div>
          <h1 className="font-title text-3xl uppercase text-contrast tracking-wide">Links</h1>
          <p className="font-body text-contrast/50 text-sm mt-1">Gerencie a página fitmass.com.br/links</p>
        </div>
        <a
          href="/links"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 font-body text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ExternalLink size={14} />
          Ver página
        </a>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-body text-sm flex items-center gap-2">
          <X size={14} />
          {error}
        </div>
      )}

      {categories.length === 0 && (
        <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-sm font-semibold text-contrast">Nenhum dado cadastrado ainda</p>
            <p className="font-body text-xs text-gray-500 mt-0.5">
              Importe os links padrão da Fitmass para começar rapidamente.
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="shrink-0 inline-flex items-center gap-2 bg-accent text-white font-body font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {seeding ? 'Importando…' : 'Importar dados padrão'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* ── Categorias panel ───────────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-body font-bold text-xs text-contrast uppercase tracking-widest">
              Categorias / Abas
            </h2>
            <button
              onClick={() => setCatModal({ mode: 'create-top' })}
              className="flex items-center gap-1 text-xs font-body font-semibold text-accent hover:text-accent/70 transition-colors"
            >
              <Plus size={13} /> Nova
            </button>
          </div>

          <div className="p-2 divide-y divide-gray-50">
            {topLevel.length === 0 && (
              <p className="text-center text-gray-400 font-body text-xs py-8">
                Nenhuma categoria ainda
              </p>
            )}

            {topLevel.map((cat) => {
              const subs = subTabsOf(cat.id)
              return (
                <div key={cat.id}>
                  {/* Top-level row */}
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl group hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold text-contrast truncate">{cat.name}</p>
                      <p className="font-body text-xs text-gray-400">ordem {cat.order}</p>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => setCatModal({ mode: 'create-sub', parentId: cat.id })}
                        title="Adicionar sub-aba"
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-accent transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => setCatModal({ mode: 'edit', item: cat })}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => setConfirm({ type: 'cat', id: cat.id, name: cat.name })}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Sub-tabs */}
                  {subs.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-2 px-3 py-2 pl-7 rounded-xl group hover:bg-gray-50 transition-colors">
                      <ChevronRight size={11} className="text-gray-300 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-contrast truncate">{sub.name}</p>
                        {sub.disabled && (
                          <p className="font-body text-xs text-gray-400">{sub.disabledLabel ?? 'Em breve'}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => setCatModal({ mode: 'edit', item: sub })}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => setConfirm({ type: 'cat', id: sub.id, name: sub.name })}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Links panel ────────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-body font-bold text-xs text-contrast uppercase tracking-widest">
              Links — {links.length} total
            </h2>
            <button
              onClick={() => setLinkModal({ mode: 'create', defaultCategoryId: selectedCat !== 'all' ? selectedCat : undefined })}
              className="flex items-center gap-1 text-xs font-body font-semibold text-accent hover:text-accent/70 transition-colors"
            >
              <Plus size={13} /> Novo link
            </button>
          </div>

          {/* Category filter */}
          <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto no-scrollbar border-b border-gray-50">
            <button
              onClick={() => setSelectedCat('all')}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-body font-semibold transition-colors ${
                selectedCat === 'all' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {[...topLevel, ...categories.filter((c) => c.parentId)].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-body font-semibold transition-colors ${
                  selectedCat === cat.id ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat.parentId ? `↳ ${cat.name}` : cat.name}
              </button>
            ))}
          </div>

          {/* Links list */}
          <div className="divide-y divide-gray-50">
            {filteredLinks.length === 0 && (
              <p className="text-center text-gray-400 font-body text-xs py-10">
                Nenhum link nesta categoria
              </p>
            )}

            {filteredLinks.map((link) => {
              const { icon: Icon } = getSocialMeta(link.url, link.icon)
              const cat = categories.find((c) => c.id === link.categoryId)
              return (
                <div key={link.id} className="flex items-center gap-3 px-4 py-3 group hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-contrast flex items-center justify-center shrink-0 text-white">
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-contrast truncate">{link.title}</p>
                    <p className="font-body text-xs text-gray-400 truncate">{link.url}</p>
                  </div>
                  {cat && (
                    <span className="shrink-0 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500 font-body hidden sm:block">
                      {cat.name}
                    </span>
                  )}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => setLinkModal({ mode: 'edit', item: link })}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setConfirm({ type: 'link', id: link.id, name: link.title })}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Category modal ──────────────────────────────────────────────── */}
      <Modal
        isOpen={!!catModal}
        onClose={() => setCatModal(null)}
        title={
          catModal?.mode === 'edit' ? 'Editar categoria'
          : catModal?.mode === 'create-sub' ? 'Nova sub-aba'
          : 'Nova categoria'
        }
      >
        {catModal && (
          <CategoryForm
            modal={catModal}
            topLevel={topLevel}
            onSubmit={handleCatSubmit}
            onCancel={() => setCatModal(null)}
          />
        )}
      </Modal>

      {/* ── Link modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!linkModal}
        onClose={() => setLinkModal(null)}
        title={linkModal?.mode === 'edit' ? 'Editar link' : 'Novo link'}
      >
        {linkModal && (
          <LinkForm
            modal={linkModal}
            categories={categories}
            onSubmit={handleLinkSubmit}
            onCancel={() => setLinkModal(null)}
          />
        )}
      </Modal>

      {/* ── Confirm delete ─────────────────────────────────────────────── */}
      <Modal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        title="Confirmar exclusão"
      >
        <p className="font-body text-sm text-gray-600 mb-6">
          Tem certeza que deseja excluir <strong>{confirm?.name}</strong>?
          {confirm?.type === 'cat' && (
            <span className="block mt-1 text-gray-400 text-xs">
              Sub-abas e links vinculados também serão excluídos.
            </span>
          )}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setConfirm(null)}
            className="px-4 py-2 border border-gray-200 rounded-xl font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-500 text-white rounded-xl font-body text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
