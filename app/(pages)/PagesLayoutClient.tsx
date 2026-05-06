'use client'

import { usePathname } from 'next/navigation'
import Header from '@/app/components/header/Header'

const navLinks = [
  { label: 'Início',  href: '/'               },
  { label: 'Planos',  href: '/planos'          },
  { label: 'Blog',    href: '/blog'            },
  { label: 'Contato', href: '/contato'          },
]

const cta = {
  label: 'Quero uma Demo',
  href: 'https://wa.me/5541984810567?text=Desejo%20conhecer%20mais%20sobre%20a%20Fitmass',
}

export default function PagesLayoutClient() {
  const pathname = usePathname()
  const forceDark = pathname.startsWith('/blog') || pathname === '/privacidade' || pathname === '/contato'
  return <Header navLinks={navLinks} cta={cta} forceDark={forceDark} />
}
