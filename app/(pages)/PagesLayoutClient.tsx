'use client'

import { usePathname } from 'next/navigation'
import Header from '@/app/components/header/Header'

const navLinks = [
  { label: 'Início',   href: '/'       },
  {
    label: 'Produtos',
    dropdown: [
      {
        label: 'MyDay — IA no WhatsApp',
        href: '/myday',
        image: '/pages/landingpage/aiSection/MyDay-icone.svg',
        description: 'IA de acompanhamento nutricional que funciona direto no WhatsApp dos seus alunos. Sua academia monetiza a cada mensalidade paga.',
        cta: 'Confira',
      },
    ],
  },
  { label: 'Planos',   href: '/planos' },
  { label: 'Blog',     href: '/blog'   },
  { label: 'Contato',  href: '/contato' },
]

const cta = {
  label: 'Quero uma Demo',
  href: 'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+o+Fitmass&type=phone_number&app_absent=0',
}

export default function PagesLayoutClient() {
  const pathname = usePathname()
  const forceDark = pathname.startsWith('/blog') || pathname === '/privacidade' || pathname === '/contato' || pathname === '/checkout'
  return <Header navLinks={navLinks} cta={cta} forceDark={forceDark} />
}
