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

      {/* Overlay mobile */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      />

      <header
        suppressHydrationWarning
        className={`fixed w-full top-0 z-50 bg-contrast transition-shadow duration-300 ${
          scrolled || menuOpen ? 'shadow-lg shadow-black/25' : ''
        }`}
      >
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
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
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
                    {displayedItem.description && (
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
                        {displayedItem.description}
                      </p>
                    )}
                    {displayedItem.cta && (
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
                        {displayedItem.cta}
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

        {/* ── Menu mobile ─────────────────────────────────────────────────── */}
        <nav
          id="mobile-menu"
          aria-label="Navegação mobile"
          className={`relative z-50 md:hidden bg-contrast overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
            menuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-4 pb-4 pt-2 space-y-1 border-t border-white/10">
            {navLinks.map((link) => {
              if (link.dropdown) {
                const isActive = link.dropdown.some((item) => pathname === item.href)
                return (
                  <div key={link.label}>
                    <span
                      className={`flex items-center gap-3 font-body text-xs uppercase tracking-widest py-2 px-3 ${
                        isActive ? 'text-accent font-bold' : 'text-white/40'
                      }`}
                    >
                      {link.label}
                    </span>
                    {link.dropdown.map((item) => {
                      const itemActive = pathname === item.href
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 font-body text-sm py-2.5 px-5 rounded-lg transition-colors duration-200 ${
                            itemActive
                              ? 'text-accent font-semibold bg-white/5'
                              : 'text-white/75 hover:text-secondary hover:bg-white/5'
                          }`}
                        >
                          <span className="w-1 h-1 rounded-full bg-secondary shrink-0" aria-hidden="true" />
                          {item.label}
                        </a>
                      )
                    })}
                  </div>
                )
              }

              const isActive = pathname === link.href
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className={`flex items-center gap-3 font-body text-sm py-3 px-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'text-accent font-bold bg-white/5'
                      : 'text-white/80 hover:text-secondary hover:bg-white/5'
                  }`}
                >
                  <span className="w-1 h-1 rounded-full shrink-0 bg-accent" aria-hidden="true" />
                  {link.label}
                </a>
              )
            })}

            <div className="pt-3 border-t border-white/10">
              <a
                href={cta.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center font-body font-semibold text-xs uppercase tracking-widest px-5 py-3 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
              >
                {cta.label}
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
