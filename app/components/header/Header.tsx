'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MouseEvent } from 'react'

export type NavLink = { label: string; href: string }
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
  const rafRef = useRef<number>(0)
  const pathname = usePathname()

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

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header
      suppressHydrationWarning
      className={`fixed w-full top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-in-out ${
        scrolled || menuOpen || forceDark
          ? 'bg-contrast/97 backdrop-blur-md shadow-lg shadow-black/25'
          : 'bg-transparent backdrop-blur-sm'
      }`}
    >
      {/* Backdrop overlay para menu mobile */}
      <div
        className={`fixed inset-0 z-49 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Linha decorativa bicolor — visível apenas sem scroll */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-secondary/30 via-accent/50 to-secondary/30
          transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      />

      {/* Inner row */}
      <div
        className={`max-w-6xl mx-auto px-4 flex items-center justify-between transition-[padding] duration-300 ease-in-out ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Ir para a página inicial Fitmass"
          className="shrink-0"
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

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <a
                key={label}
                href={href}
                onClick={(e) => handleAnchorClick(e, href)}
                className={`font-body text-[0.9375rem] tracking-wide transition-colors duration-200 ${
                  isActive
                    ? 'text-accent font-bold'
                    : 'text-white/65 hover:text-secondary'
                }`}
              >
                {label}
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
            {/* Hamburger — always in DOM, hidden via CSS */}
            <svg suppressHydrationWarning className={`w-5 h-5${menuOpen ? ' hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path suppressHydrationWarning strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {/* X — always in DOM, hidden via CSS */}
            <svg suppressHydrationWarning className={`w-5 h-5${!menuOpen ? ' hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path suppressHydrationWarning strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <nav
        id="mobile-menu"
        aria-label="Navegação mobile"
        className={`md:hidden bg-contrast overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1 border-t border-white/10">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <a
                key={label}
                href={href}
                onClick={(e) => handleAnchorClick(e, href)}
                className={`flex items-center gap-3 font-body text-sm py-3 px-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-accent font-bold bg-white/5'
                    : 'text-white/80 hover:text-secondary hover:bg-white/5'
                }`}
              >
                <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-accent' : 'bg-accent'}`} aria-hidden="true" />
                {label}
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
  )
}
