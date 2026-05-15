'use client'

import { useRef, useEffect, useCallback, useState } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}

const SIZE_PRESETS = [
  { label: 'S',  value: '14px' },
  { label: 'M',  value: '20px' },
  { label: 'L',  value: '28px' },
  { label: 'XL', value: '40px' },
]

export default function RichTextField({ value, onChange, placeholder, minHeight = 72 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [toolbar, setToolbar] = useState<{ top: number; left: number } | null>(null)
  const [formats, setFormats] = useState({ bold: false, italic: false })
  // track whether we caused the change to avoid infinite loops
  const isInternalChange = useRef(false)

  // Sync prop → DOM only when not focused
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (document.activeElement === el) return
    if (el.innerHTML !== value) {
      isInternalChange.current = true
      el.innerHTML = value
    }
  }, [value])

  const updateToolbar = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setToolbar(null)
      return
    }
    const range = sel.getRangeAt(0)
    const el = editorRef.current
    if (!el || !el.contains(range.commonAncestorContainer)) {
      setToolbar(null)
      return
    }

    const selRect = range.getBoundingClientRect()
    const elRect  = el.getBoundingClientRect()
    setToolbar({
      top:  selRect.top - elRect.top - 48,
      left: Math.max(0, Math.min(
        selRect.left - elRect.left + selRect.width / 2 - 100,
        elRect.width - 208,
      )),
    })
    setFormats({
      bold:   document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
    })
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', updateToolbar)
    return () => document.removeEventListener('selectionchange', updateToolbar)
  }, [updateToolbar])

  function execFmt(cmd: string) {
    editorRef.current?.focus()
    document.execCommand(cmd, false)
    onChange(editorRef.current?.innerHTML ?? '')
    setTimeout(updateToolbar, 0)
  }

  function applySize(size: string) {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return

    const range = sel.getRangeAt(0)
    // Remove existing size spans inside selection
    document.execCommand('removeFormat', false)

    // Re-apply selection (removeFormat may collapse it)
    sel.removeAllRanges()
    sel.addRange(range)

    const span = document.createElement('span')
    span.style.fontSize = size
    try {
      range.surroundContents(span)
    } catch {
      const frag = range.extractContents()
      span.appendChild(frag)
      range.insertNode(span)
    }
    onChange(editorRef.current?.innerHTML ?? '')
    setTimeout(updateToolbar, 0)
  }

  function clearFmt() {
    editorRef.current?.focus()
    document.execCommand('removeFormat', false)
    onChange(editorRef.current?.innerHTML ?? '')
    setToolbar(null)
  }

  function handleInput() {
    onChange(editorRef.current?.innerHTML ?? '')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // Prevent Enter from creating new blocks (optional — allows simple multiline)
    if (e.key === 'Enter' && e.shiftKey) e.preventDefault()
  }

  return (
    <div className="relative">
      {/* Floating format toolbar */}
      {toolbar && (
        <div
          className="absolute z-50 flex items-center gap-0.5 bg-[#1a1a1a] rounded-xl px-2 py-1.5 shadow-2xl border border-white/10 select-none"
          style={{ top: toolbar.top, left: toolbar.left, minWidth: 208 }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Bold */}
          <button
            onClick={() => execFmt('bold')}
            className={`w-8 h-7 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${
              formats.bold ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/15 hover:text-white'
            }`}
            title="Negrito (Ctrl+B)"
          >
            B
          </button>
          {/* Italic */}
          <button
            onClick={() => execFmt('italic')}
            className={`w-8 h-7 flex items-center justify-center rounded-lg italic text-sm transition-colors ${
              formats.italic ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/15 hover:text-white'
            }`}
            title="Itálico (Ctrl+I)"
          >
            I
          </button>

          <div className="w-px h-4 bg-white/15 mx-1" />

          {/* Font sizes */}
          {SIZE_PRESETS.map(({ label, value: sz }) => (
            <button
              key={label}
              onClick={() => applySize(sz)}
              className="w-8 h-7 flex items-center justify-center rounded-lg text-xs font-semibold text-white/70 hover:bg-white/15 hover:text-white transition-colors"
              title={`Tamanho ${label} (${sz})`}
            >
              {label}
            </button>
          ))}

          <div className="w-px h-4 bg-white/15 mx-1" />

          {/* Clear formatting */}
          <button
            onClick={clearFmt}
            className="w-8 h-7 flex items-center justify-center rounded-lg transition-colors text-white/40 hover:bg-white/15 hover:text-white"
            title="Limpar formatação"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="relative w-full p-3 border border-gray-200 rounded-xl font-body text-sm text-contrast focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
      />
    </div>
  )
}
