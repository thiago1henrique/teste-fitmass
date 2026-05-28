'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MouseEvent } from 'react'

export type DropdownItem = {
  label: string
  href: string
  image?: string
  description?: string
  cta?: string
  altView?: { label: string; description: string; cta?: string }
}

export type NavLink =
  | { label: string; href: string; dropdown?: never }
  | { label: string; href?: never; dropdown: DropdownItem[] }

export type CtaConfig = { label: string; href: string }

interface HeaderProps {
  navLinks: NavLink[]
  cta?: CtaConfig
  forceDark?: boolean
}

// ── Mobile product card ───────────────────────────────────────────────────────
function MobileProductCard({
  item,
  onClose,
  animDelay,
  visible,
}: {
  item: DropdownItem
  onClose: () => void
  animDelay: number
  visible: boolean
}) {
  const [viewIndex, setViewIndex] = useState(0)
  const activeDesc = viewIndex === 1 && item.altView ? item.altView.description : item.description
  const activeCta  = viewIndex === 1 && item.altView?.cta ? item.altView.cta : item.cta

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
        transition: visible
          ? `opacity 420ms ease-out ${animDelay}ms, transform 520ms cubic-bezier(0.16,1,0.3,1) ${animDelay}ms`
          : 'none',
      }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,106,0,0.12) 0%, rgba(255,255,255,0.03) 70%, transparent 100%)',
          boxShadow: '0 0 0 1px rgba(255,106,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Header row */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          {item.image && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,106,0,0.18)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" aria-hidden="true" className="w-6 h-6 object-contain" />
            </div>
          )}
          <h3 className="font-title uppercase text-white text-base tracking-wide leading-tight">
            {item.label}
          </h3>
        </div>

        <div className="h-px mx-4 bg-white/8" aria-hidden="true" />

        <div className="p-4 flex flex-col gap-3">
          {/* Toggle */}
          {item.altView && (
            <div
              className="self-start flex items-center rounded-full p-0.5"
              style={{
                backgroundColor: 'rgba(255,106,0,0.12)',
                border: '1px solid rgba(255,106,0,0.22)',
              }}
            >
              {([{ label: 'Aluno', idx: 0 }, { label: item.altView.label, idx: 1 }] as const).map(
                ({ label, idx }) => (
                  <button
                    key={label}
                    onClick={() => setViewIndex(idx)}
                    className="px-3.5 rounded-full font-body font-semibold uppercase tracking-wide transition-all duration-300 cursor-pointer text-[11px]"
                    style={{
                      height: '32px',
                      backgroundColor: viewIndex === idx ? '#FF6A00' : 'transparent',
                      color: viewIndex === idx ? '#fff' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          )}

          {/* Description */}
          {activeDesc && (
            <p className="font-body text-[13px] text-white/50 leading-relaxed">{activeDesc}</p>
          )}

          {/* CTA */}
          {activeCta && (
            <a
              href={item.href}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 font-body font-semibold text-[11px] uppercase tracking-widest
                text-secondary border border-secondary/30 px-4 py-2.5 rounded-xl self-start
                transition-[background-color,border-color] duration-150 active:bg-secondary/10 active:border-secondary"
            >
              {activeCta}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Header({
  navLinks,
  cta = { label: 'Conhecer Planos', href: '/planos' },
  forceDark = false,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaMenuLabel, setMegaMenuLabel] = useState<string | null>(null)
  const [megaVisible, setMegaVisible] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [displayedItem, setDisplayedItem] = useState<DropdownItem | null>(null)
  const [cardVisible, setCardVisible] = useState(false)
  const [cardViewIndex, setCardViewIndex] = useState(0)
  const rafRef = useRef<number>(0)
  const cardRaf = useRef<number>(0)
  const cardHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  function openMegaMenu(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMegaMenuLabel(label)
  }

  function scheduledClose() {
    closeTimer.current = setTimeout(() => {
      setMegaMenuLabel(null)
      setHoveredItem(null)
    }, 120)
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  function closeMegaMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMegaMenuLabel(null)
    setHoveredItem(null)
  }

  function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
    const hashIndex = href.indexOf('#')
    if (hashIndex === -1) return
    const pagePath = href.slice(0, hashIndex) || '/'
    const anchor = href.slice(hashIndex + 1)
    if (pathname !== pagePath) return
    e.preventDefault()
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => setScrolled(window.scrollY > 60))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Fecha menu mobile no resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ESC fecha mega menu
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMegaMenu() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Fecha mega menu ao rolar
  useEffect(() => {
    if (!megaMenuLabel) return
    const onScroll = () => closeMegaMenu()
    window.addEventListener('scroll', onScroll, { passive: true, once: true } as EventListenerOptions)
    return () => window.removeEventListener('scroll', onScroll)
  }, [megaMenuLabel])

  // Fade-in suave dos itens do painel
  useEffect(() => {
    if (megaMenuLabel) {
      const t = setTimeout(() => setMegaVisible(true), 16)
      return () => clearTimeout(t)
    } else {
      setMegaVisible(false)
    }
  }, [megaMenuLabel])

  const activeMegaDropdown =
    megaMenuLabel
      ? (navLinks.find((l) => l.label === megaMenuLabel && l.dropdown)?.dropdown ?? [])
      : []

  const hoveredDropdownItem = activeMegaDropdown.find((i) => i.label === hoveredItem) ?? null

  // Anima a entrada/saída do preview card de forma suave:
  // 1. Popula o conteúdo imediatamente
  // 2. Aguarda o browser pintar (rAF) e só então inicia a transição
  // 3. No exit, executa a transição de saída primeiro, depois limpa o conteúdo
  useEffect(() => {
    if (hoveredDropdownItem) {
      if (cardHideTimer.current) clearTimeout(cardHideTimer.current)
      setDisplayedItem(hoveredDropdownItem)
      setCardViewIndex(0)
      cancelAnimationFrame(cardRaf.current)
      cardRaf.current = requestAnimationFrame(() => setCardVisible(true))
    } else {
      setCardVisible(false)
      cardHideTimer.current = setTimeout(() => setDisplayedItem(null), 220)
    }
    return () => cancelAnimationFrame(cardRaf.current)
  }, [hoveredDropdownItem])

  const megaOpen = megaMenuLabel !== null

  return (
    <>
      {/* Overlay fecha o mega menu ao clicar fora */}
      <div
        aria-hidden="true"
        onClick={closeMegaMenu}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          megaOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ── MOBILE MEGA MENU ──────────────────────────────────────────────── */}
      <div
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className="fixed inset-0 z-[60] md:hidden flex flex-col overflow-hidden"
        style={{
          background: '#050505',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: menuOpen
            ? 'transform 480ms cubic-bezier(0.32,0.72,0,1)'
            : 'transform 360ms cubic-bezier(0.4,0,1,1)',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {/* Atmospheric gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 55% at 85% -5%, rgba(136,189,35,0.13) 0%, transparent 55%), radial-gradient(ellipse 70% 45% at -5% 90%, rgba(37,182,235,0.09) 0%, transparent 55%)',
          }}
          aria-hidden="true"
        />

        {/* Logo + close */}
        <div className="relative flex items-center justify-between px-6 pt-6 pb-3 shrink-0">
          <Link
            href="/"
            aria-label="Ir para a página inicial Fitmass"
            onClick={() => setMenuOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-colorida.svg" alt="Fitmass" className="h-9 w-auto" />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-transform duration-150"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
            }}
          >
            <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="relative flex-1 overflow-y-auto">

          {/* Primary nav links */}
          <nav aria-label="Menu principal" className="px-6 pt-1 pb-5">
            {(navLinks.filter((l) => !l.dropdown) as Array<{ label: string; href: string }>).map(
              (link, index) => {
                const isActive = pathname === link.href
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => { handleAnchorClick(e, link.href); setMenuOpen(false) }}
                    className="flex items-center justify-between py-[14px]"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      opacity: menuOpen ? 1 : 0,
                      transform: menuOpen ? 'translateX(0)' : 'translateX(-20px)',
                      transition: menuOpen
                        ? `opacity 400ms ease-out ${100 + index * 55}ms, transform 480ms cubic-bezier(0.16,1,0.3,1) ${100 + index * 55}ms`
                        : 'none',
                    }}
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className="font-body text-[10px] font-bold tabular-nums leading-none"
                        style={{ color: isActive ? '#88BD23' : 'rgba(255,255,255,0.18)' }}
                      >
                        0{index + 1}
                      </span>
                      <span
                        className="font-title text-[2rem] uppercase tracking-wide leading-none"
                        style={{ color: isActive ? '#88BD23' : 'rgba(255,255,255,0.88)' }}
                      >
                        {link.label}
                      </span>
                    </div>
                    <svg
                      className="w-4 h-4 shrink-0 opacity-20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                )
              }
            )}
          </nav>

          {/* Product cards */}
          {(navLinks.filter((l) => l.dropdown) as Array<{ label: string; dropdown: DropdownItem[] }>).map(
            (link) => {
              const nonDropCount = navLinks.filter((x) => !x.dropdown).length
              return (
                <div key={link.label} className="px-6 pb-8">
                  <p
                    className="font-body text-[9px] uppercase tracking-[0.22em] text-white/25 mb-4"
                    style={{
                      opacity: menuOpen ? 1 : 0,
                      transition: menuOpen
                        ? `opacity 360ms ease-out ${100 + nonDropCount * 55 + 40}ms`
                        : 'none',
                    }}
                  >
                    {link.label}
                  </p>
                  <div className="flex flex-col gap-3">
                    {link.dropdown.map((item, idx) => (
                      <MobileProductCard
                        key={item.href}
                        item={item}
                        onClose={() => setMenuOpen(false)}
                        animDelay={100 + nonDropCount * 55 + 100 + idx * 80}
                        visible={menuOpen}
                      />
                    ))}
                  </div>
                </div>
              )
            }
          )}
        </div>

        {/* Bottom CTA */}
        <div
          className="relative shrink-0 px-6 py-5"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            opacity: menuOpen ? 1 : 0,
            transition: menuOpen ? 'opacity 360ms ease-out 380ms' : 'none',
          }}
        >
          <a
            href={cta.href}
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full font-body font-semibold text-sm uppercase tracking-widest
              bg-accent text-white rounded-2xl py-4 active:scale-[0.98] transition-transform duration-150"
            style={{ boxShadow: '0 8px 32px rgba(136,189,35,0.28)' }}
          >
            {cta.label}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>

      <header
        suppressHydrationWarning
        className={`fixed w-full top-0 z-50 transition-shadow duration-300 ${
          scrolled || menuOpen ? 'shadow-lg shadow-black/40' : ''
        }`}
        style={{ background: '#050505' }}
      >
        {/* Gradiente atmosférico — espelha o visual do mega menu */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 55% 120% at 96% 50%, rgba(136,189,35,0.09) 0%, transparent 60%), radial-gradient(ellipse 40% 120% at 4% 50%, rgba(37,182,235,0.07) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        {/* Linha decorativa bicolor */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-secondary/30 via-accent/50 to-secondary/30
            transition-opacity duration-300 ${scrolled || megaOpen ? 'opacity-0' : 'opacity-100'}`}
          aria-hidden="true"
        />

        {/* Inner row */}
        <div
          className={`relative z-50 max-w-6xl mx-auto px-4 flex items-center justify-between transition-[padding] duration-300 ease-in-out ${
            scrolled ? 'py-3' : 'py-5'
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Ir para a página inicial Fitmass"
            className="shrink-0"
            onClick={closeMegaMenu}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-colorida.svg"
              alt="Fitmass"
              className={`h-10 w-auto origin-left transition-transform duration-300 ease-in-out ${
                scrolled ? 'scale-72' : 'scale-100'
              }`}
            />
          </Link>

          {/* ── Nav desktop ───────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
            {navLinks.map((link) => {
              if (link.dropdown) {
                const isMegaOpen = megaMenuLabel === link.label
                const isActive = link.dropdown.some((item) => pathname === item.href)
                return (
                  <div
                    key={link.label}
                    onMouseEnter={() => openMegaMenu(link.label)}
                    onMouseLeave={scheduledClose}
                  >
                    <button
                      aria-expanded={isMegaOpen}
                      aria-haspopup="menu"
                      className={`flex items-center gap-1.5 font-body text-[0.9375rem] tracking-wide
                        transition-colors duration-200 ease-in-out ${
                          isActive
                            ? 'text-accent font-bold'
                            : isMegaOpen
                            ? 'text-secondary'
                            : 'text-white/65 hover:text-secondary'
                        }`}
                    >
                      {link.label}
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        aria-hidden="true"
                        suppressHydrationWarning
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )
              }

              const isActive = pathname === link.href
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { handleAnchorClick(e, link.href); closeMegaMenu() }}
                  className={`font-body text-[0.9375rem] tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-accent font-bold' : 'text-white/65 hover:text-secondary'
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <a
              href={cta.href}
              className="hidden md:inline-flex items-center font-body font-semibold text-xs uppercase tracking-widest
                bg-accent text-white hover:bg-accent/90 active:scale-95 rounded-xl px-5 py-2.5
                transition-[background-color,transform] duration-200 ease-in-out"
            >
              {cta.label}
            </a>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
            >
              <svg suppressHydrationWarning className={`w-5 h-5${menuOpen ? ' hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path suppressHydrationWarning strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg suppressHydrationWarning className={`w-5 h-5${!menuOpen ? ' hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path suppressHydrationWarning strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mega menu panel ─────────────────────────────────────────────── */}
        <div
          role="menu"
          aria-label={megaMenuLabel ? `Menu ${megaMenuLabel}` : undefined}
          onMouseEnter={cancelClose}
          onMouseLeave={() => { scheduledClose(); setHoveredItem(null) }}
          className={`border-t border-white/10 overflow-hidden
            transition-[max-height,opacity] duration-200 ease-in-out ${
            megaOpen
              ? `max-h-72 ${megaVisible ? 'opacity-100' : 'opacity-0'}`
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-7 flex gap-10 items-start">

            {/* Coluna esquerda: lista de produtos */}
            <div className="min-w-52 shrink-0">
              <p className="font-body text-[0.6rem] uppercase tracking-[0.18em] text-white/30 mb-4 px-3">
                {megaMenuLabel}
              </p>
              {activeMegaDropdown.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onClick={closeMegaMenu}
                  style={{
                    transitionDelay: megaVisible ? `${index * 55}ms` : '0ms',
                  }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl font-body text-[0.95rem]
                    transition-[opacity,transform,color,background-color] duration-200 ease-out ${
                    megaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'
                  } ${
                    hoveredItem === item.label
                      ? 'text-white bg-white/6'
                      : 'text-white/55 hover:text-white hover:bg-white/4'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  {item.label}
                </a>
              ))}
            </div>

            {/* Coluna direita: preview card — animação premium */}
            <div
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? 'translateX(0px) scale(1)' : 'translateX(14px) scale(0.97)',
                filter: cardVisible ? 'blur(0px)' : 'blur(5px)',
                transition: cardVisible
                  ? 'opacity 300ms cubic-bezier(0.16,1,0.3,1), transform 320ms cubic-bezier(0.16,1,0.3,1), filter 240ms ease-out'
                  : 'opacity 160ms ease-in, transform 160ms ease-in, filter 120ms ease-in',
                pointerEvents: cardVisible ? 'auto' : 'none',
                flex: 1,
              }}
            >
              {displayedItem && (
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                  {/* Imagem — scale-in com delay */}
                  {displayedItem.image && (
                    <div
                      className="w-28 h-28 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
                      style={{
                        background: 'radial-gradient(circle at 55% 35%, rgba(37,182,235,0.30) 0%, rgba(51,51,51,0.95) 65%)',
                        opacity: cardVisible ? 1 : 0,
                        transform: cardVisible ? 'scale(1)' : 'scale(0.85)',
                        transition: cardVisible
                          ? 'opacity 320ms cubic-bezier(0.16,1,0.3,1) 40ms, transform 360ms cubic-bezier(0.16,1,0.3,1) 40ms'
                          : 'none',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayedItem.image}
                        alt={displayedItem.label}
                        className="w-14 h-14 object-contain drop-shadow-[0_4px_16px_rgba(37,182,235,0.5)]"
                      />
                    </div>
                  )}
                  {/* Texto + CTA — stagger por elemento */}
                  <div className="flex flex-col gap-2 min-w-0">
                    <h3
                      style={{
                        opacity: cardVisible ? 1 : 0,
                        transform: cardVisible ? 'translateY(0px)' : 'translateY(10px)',
                        transition: cardVisible
                          ? 'opacity 280ms ease-out 60ms, transform 300ms cubic-bezier(0.16,1,0.3,1) 60ms'
                          : 'none',
                      }}
                      className="font-title uppercase text-white text-lg tracking-wide leading-tight"
                    >
                      {displayedItem.label}
                    </h3>
                    {displayedItem.altView && (
                      <div
                        style={{
                          opacity: cardVisible ? 1 : 0,
                          transform: cardVisible ? 'translateY(0px)' : 'translateY(10px)',
                          transition: cardVisible
                            ? 'opacity 280ms ease-out 90ms, transform 300ms cubic-bezier(0.16,1,0.3,1) 90ms'
                            : 'none',
                        }}
                        className="flex items-center"
                      >
                        <div
                          className="flex items-center rounded-full p-0.5"
                          style={{ backgroundColor: 'rgba(255,106,0,0.15)' }}
                        >
                          {[{ label: 'Aluno', idx: 0 }, { label: displayedItem.altView.label, idx: 1 }].map(({ label, idx }) => (
                            <button
                              key={label}
                              onClick={() => setCardViewIndex(idx)}
                              className="px-3 py-1 rounded-full font-body font-semibold uppercase tracking-wide transition-all duration-300 cursor-pointer text-xs"
                              style={{
                                backgroundColor: cardViewIndex === idx ? '#FF6A00' : 'transparent',
                                color: cardViewIndex === idx ? '#fff' : 'rgba(255,255,255,0.45)',
                              }}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {(displayedItem.description || displayedItem.altView) && (
                      <p
                        style={{
                          opacity: cardVisible ? 1 : 0,
                          transform: cardVisible ? 'translateY(0px)' : 'translateY(10px)',
                          transition: cardVisible
                            ? 'opacity 280ms ease-out 100ms, transform 300ms cubic-bezier(0.16,1,0.3,1) 100ms'
                            : 'none',
                        }}
                        className="font-body text-white/50 text-sm leading-relaxed"
                      >
                        {cardViewIndex === 1 && displayedItem.altView
                          ? displayedItem.altView.description
                          : displayedItem.description}
                      </p>
                    )}
                    {(displayedItem.cta || displayedItem.altView?.cta) && (
                      <a
                        href={displayedItem.href}
                        onClick={closeMegaMenu}
                        style={{
                          opacity: cardVisible ? 1 : 0,
                          transform: cardVisible ? 'translateY(0px)' : 'translateY(10px)',
                          transition: cardVisible
                            ? 'opacity 280ms ease-out 145ms, transform 300ms cubic-bezier(0.16,1,0.3,1) 145ms'
                            : 'none',
                        }}
                        className="mt-1 inline-flex items-center gap-1.5 font-body font-semibold text-xs uppercase tracking-widest
                          text-secondary border border-secondary/30 hover:border-secondary hover:bg-secondary/10
                          px-3.5 py-1.5 rounded-lg transition-[border-color,background-color] duration-150 self-start"
                      >
                        {cardViewIndex === 1 && displayedItem.altView?.cta
                          ? displayedItem.altView.cta
                          : displayedItem.cta}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </header>
    </>
  )
}
