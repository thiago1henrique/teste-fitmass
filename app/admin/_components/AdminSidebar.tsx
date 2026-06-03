'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'aws-amplify/auth'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    adminOnly: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Posts',
    href: '/admin/posts',
    adminOnly: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Social',
    href: '/admin/social-export',
    adminOnly: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
  {
    label: 'Links',
    href: '/admin/links',
    adminOnly: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    label: 'Chat',
    href: '/admin/chat',
    adminOnly: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    label: 'Vendas',
    href: '/admin/vendas',
    adminOnly: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: 'Equipe',
    href: '/admin/team',
    adminOnly: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

function NavContent({
  pathname,
  isAdmin,
  userName,
  onClose,
  onLogout,
}: {
  pathname: string
  isAdmin: boolean
  userName: string
  onClose?: () => void
  onLogout: () => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://fitmass.com.br/wp-content/uploads/2023/05/Logo-Fitmass-branca.svg"
            alt="Fitmass"
            className="h-8 w-auto"
          />
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-1 -mr-1"
              aria-label="Fechar menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <span className="block font-body text-white/40 text-xs uppercase tracking-widest mt-2">Admin</span>
      </div>

      {/* User badge */}
      <div className="px-6 py-3 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
          <span className="font-body text-accent text-xs font-bold uppercase">
            {userName.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-body text-white/80 text-sm truncate">{userName}</p>
          <p className={`font-body text-xs uppercase tracking-widest ${isAdmin ? 'text-accent' : 'text-white/30'}`}>
            {isAdmin ? 'Admin' : 'Editor'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ label, href, icon, adminOnly }) => {
          if (adminOnly && !isAdmin) return null
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm transition-all duration-200 ${
                active
                  ? 'bg-accent/20 text-accent font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {icon}
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={onLogout}
          className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
    </>
  )
}

export default function AdminSidebar({ userRole, userName }: { userRole: string; userName: string }) {
  const pathname = usePathname()
  const router   = useRouter()
  const isAdmin  = userRole === 'ADMIN'
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navProps = { pathname, isAdmin, userName, onLogout: handleLogout }

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 h-14 bg-contrast border-b border-white/10 flex items-center gap-3 px-4">
        <button
          onClick={() => setOpen(true)}
          className="text-white/60 hover:text-white transition-colors p-1 -ml-1"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://fitmass.com.br/wp-content/uploads/2023/05/Logo-Fitmass-branca.svg"
          alt="Fitmass"
          className="h-6 w-auto"
        />
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-screen w-72 bg-contrast flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menu de navegação"
      >
        <NavContent {...navProps} onClose={() => setOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-contrast flex-col sticky top-0 h-screen overflow-y-auto">
        <NavContent {...navProps} />
      </aside>
    </>
  )
}
