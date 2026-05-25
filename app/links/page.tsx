import Image from 'next/image'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { ProfileHeader } from './components/ProfileHeader'
import { LinkGrid } from './components/LinkGrid'
import type { CategoryNode } from './components/LinkGrid'

export const metadata = {
  title: 'Links — Fitmass',
  description: 'Todos os links oficiais da Fitmass',
}

const profile = {
  title: 'Fitmass',
  subtitle: 'Transformando dados em bem-estar: Sua saúde, nossa tecnologia!',
}

const MOCK_TREE: CategoryNode[] = [
  {
    id: 'mock-redes', name: 'Redes Sociais', order: 0, hasTabs: false, children: [],
    links: [
      { id: 'mock-site',        title: 'Site Fitmass',       url: 'https://fitmass.com.br/',                                                                                                                                                                                                                                                      description: 'Conheça a Fitmass',                    icon: 'fitmass'   },
      { id: 'mock-instagram',   title: 'Instagram',           url: 'https://www.instagram.com/fitmass.tech/',                                                                                                                                                                                                                                       description: 'Siga a Fitmass no Instagram',           icon: 'instagram' },
      { id: 'mock-youtube',     title: 'YouTube',             url: 'https://www.youtube.com/@fitmass791/videos',                                                                                                                                                                                                                                    description: 'Assista nossos vídeos no YouTube',      icon: 'youtube'   },
      { id: 'mock-wa-comercial',title: 'Whatsapp Comercial',  url: 'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+Instagram+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+o+Fitmass&type=phone_number&app_absent=0', description: 'Fale com nosso time comercial',          icon: 'whatsapp'  },
      { id: 'mock-wa-suporte',  title: 'Whatsapp Suporte',    url: 'https://api.whatsapp.com/send/?phone=5541991197018&text=Ol%C3%A1%2C+vim+do+Instagram+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+o+Fitmass&type=phone_number&app_absent=0', description: 'Fale com nosso suporte',                  icon: 'whatsapp'  },
      { id: 'mock-facebook',    title: 'Facebook',            url: 'https://www.facebook.com/fitmass.tech/',                                                                                                                                                                                                                                       description: 'Curta a página da Fitmass no Facebook', icon: 'facebook'  },
    ],
  },
  {
    id: 'mock-apps', name: 'Aplicativos', order: 1, hasTabs: true, links: [],
    children: [
      {
        id: 'mock-fitmass-app', name: 'Fitmass App', order: 0, children: [],
        links: [
          { id: 'mock-playstore', title: 'Baixe pela Play Store', url: 'https://play.google.com/store/apps/details?id=br.com.fitmass&pcampaignid=web_share&pli=1', description: 'Disponível para Android', icon: 'playstore' },
          { id: 'mock-appstore',  title: 'Baixe pela App Store',  url: 'https://apps.apple.com/br/app/fitmass-app/id1528425505',                                   description: 'Disponível para iPhone',  icon: 'appstore'  },
        ],
      },
      {
        id: 'mock-fitmass-system', name: 'Fitmass System', order: 1,
        disabled: true, disabledLabel: 'Em breve', children: [], links: [],
      },
    ],
  },
]

export default async function LinksPage() {
  const client = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
    authMode: 'apiKey',
  })

  let rawCategories: Awaited<ReturnType<typeof client.models.LinkCategory.list>>['data'] = []
  let rawLinks: Awaited<ReturnType<typeof client.models.LinkItem.list>>['data'] = []

  try {
    const [catResult, linkResult] = await Promise.all([
      client.models.LinkCategory.list({ limit: 200 }),
      client.models.LinkItem.list({ limit: 200 }),
    ])
    rawCategories = catResult.data ?? []
    rawLinks = linkResult.data ?? []
  } catch {
    // Models not yet deployed — fall back to mock
  }

  const categories = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    order: c.order ?? 0,
    parentId: c.parentId ?? null,
    hasTabs: c.hasTabs ?? null,
    disabled: c.disabled ?? false,
    disabledLabel: c.disabledLabel ?? null,
  }))

  const links = rawLinks.map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    description: l.description ?? null,
    icon: l.icon ?? null,
    categoryId: l.categoryId,
    order: l.order ?? 0,
  }))

  const topLevel = categories
    .filter((c) => !c.parentId)
    .sort((a, b) => a.order - b.order)

  const dbTree: CategoryNode[] = topLevel.map((cat) => ({
    id: cat.id,
    name: cat.name,
    order: cat.order,
    hasTabs: cat.hasTabs,
    disabled: cat.disabled,
    disabledLabel: cat.disabledLabel,
    children: categories
      .filter((c) => c.parentId === cat.id)
      .sort((a, b) => a.order - b.order)
      .map((child) => ({
        id: child.id,
        name: child.name,
        order: child.order,
        hasTabs: child.hasTabs,
        disabled: child.disabled,
        disabledLabel: child.disabledLabel,
        children: [],
        links: links.filter((l) => l.categoryId === child.id).sort((a, b) => a.order - b.order),
      })),
    links: links.filter((l) => l.categoryId === cat.id).sort((a, b) => a.order - b.order),
  }))

  const tree = dbTree.length > 0 ? dbTree : MOCK_TREE

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">

      {/* ── Volumetric smoke — 9 camadas ──────────────────────────────── */}

      {/* L1 — Atmosfera ambiente: haze enorme, muito difuso */}
      <div className="absolute inset-x-0 pointer-events-none" style={{
        top: '-220px', height: '900px',
        background: 'radial-gradient(ellipse 85% 60% at 50% 0%, rgba(136,189,35,.38) 0%, rgba(37,182,235,.32) 52%, transparent 82%)',
        filter: 'blur(160px)', opacity: .18,
        animation: 'smoke-c 30s ease-in-out infinite',
        willChange: 'transform',
      }} />

      {/* L2 — Corpo de fumaça verde (esquerda) */}
      <div className="absolute pointer-events-none" style={{
        top: '-80px', left: '-12%', width: '68%', height: '600px',
        background: 'radial-gradient(ellipse at 55% 45%, rgba(100,160,20,.9) 0%, rgba(55,105,5,.55) 45%, transparent 78%)',
        filter: 'blur(88px)', opacity: .34, borderRadius: '50%',
        animation: 'smoke-a 22s ease-in-out infinite',
        willChange: 'transform',
      }} />

      {/* L3 — Corpo de fumaça azul (direita) */}
      <div className="absolute pointer-events-none" style={{
        top: '-80px', right: '-12%', width: '68%', height: '600px',
        background: 'radial-gradient(ellipse at 45% 45%, rgba(20,140,210,.9) 0%, rgba(5,70,145,.55) 45%, transparent 78%)',
        filter: 'blur(88px)', opacity: .34, borderRadius: '50%',
        animation: 'smoke-b 28s ease-in-out infinite',
        willChange: 'transform',
      }} />

      {/* L4 — Feixe de luz neon verde */}
      <div className="absolute pointer-events-none" style={{
        top: '-25px', left: '2%', width: '54%', height: '440px',
        background: 'radial-gradient(ellipse at 48% 0%, rgba(196,255,30,.95) 0%, rgba(136,189,35,.55) 22%, rgba(75,135,8,.22) 55%, transparent 82%)',
        filter: 'blur(44px)', opacity: .58,
        animation: 'smoke-a 18s ease-in-out infinite, neon-flicker 5s ease-in-out infinite',
        willChange: 'transform, opacity',
      }} />

      {/* L5 — Feixe de luz neon azul */}
      <div className="absolute pointer-events-none" style={{
        top: '-25px', right: '2%', width: '54%', height: '440px',
        background: 'radial-gradient(ellipse at 52% 0%, rgba(80,225,255,.95) 0%, rgba(37,182,235,.55) 22%, rgba(8,95,175,.22) 55%, transparent 82%)',
        filter: 'blur(44px)', opacity: .52,
        animation: 'smoke-b 20s ease-in-out infinite, neon-flicker 6.5s ease-in-out infinite 1s',
        willChange: 'transform, opacity',
      }} />

      {/* L6 — Ponto de convergência (hotspot teal/branco no centro) */}
      <div className="absolute pointer-events-none" style={{
        top: '-12px', left: '20%', width: '60%', height: '210px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(230,255,255,.9) 0%, rgba(80,225,210,.52) 28%, rgba(37,182,235,.16) 60%, transparent 88%)',
        filter: 'blur(20px)', opacity: .42,
        animation: 'smoke-c 15s ease-in-out infinite, neon-flicker 4s ease-in-out infinite .5s',
        willChange: 'transform, opacity',
      }} />

      {/* L7 — Borda neon afiada verde (topo esquerdo) */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{
        width: '62%', height: '90px',
        background: 'radial-gradient(ellipse at 38% 0%, rgba(215,255,80,.85) 0%, rgba(136,189,35,.45) 38%, transparent 78%)',
        filter: 'blur(11px)', opacity: .65,
        animation: 'neon-flicker 3.5s ease-in-out infinite',
        willChange: 'opacity',
      }} />

      {/* L8 — Borda neon afiada azul (topo direito) */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{
        width: '62%', height: '90px',
        background: 'radial-gradient(ellipse at 62% 0%, rgba(100,235,255,.85) 0%, rgba(37,182,235,.45) 38%, transparent 78%)',
        filter: 'blur(11px)', opacity: .6,
        animation: 'neon-flicker 4.5s ease-in-out infinite .8s',
        willChange: 'opacity',
      }} />

      {/* L9 — Fios de fumaça (wisps horizontais) */}
      <div className="absolute pointer-events-none" style={{
        top: '145px', left: '6%', width: '88%', height: '72px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(136,189,35,.28) 22%, rgba(70,205,220,.24) 50%, rgba(37,182,235,.28) 78%, transparent 100%)',
        filter: 'blur(18px)', borderRadius: '50%',
        animation: 'wisp-drift 16s ease-in-out infinite',
        willChange: 'transform, opacity',
      }} />

      {/* Vinheta inferior — garante legibilidade dos cards */}
      <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

      <div className="relative max-w-xl mx-auto px-4 pb-16">
        <ProfileHeader profile={profile} />
        <LinkGrid tree={tree} />
      </div>

      <footer className="text-center pb-8 pt-4">
        <a
          href="https://fitmass.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 opacity-30 hover:opacity-60 transition-opacity"
        >
          <Image src="/logo-white.svg" alt="Fitmass" width={60} height={16} className="h-4 w-auto" />
        </a>
      </footer>
    </div>
  )
}
