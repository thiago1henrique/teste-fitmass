# Instrução: Rota `/links` no site Fitmass (Next.js)

Adicione a rota `/links` ao site Next.js existente. Esta rota é uma página pública estilo link-tree, com layout dark, efeitos de fumaça animada e cards com ícones sociais. **Não há painel admin** — os dados são estáticos em um arquivo de configuração.

---

## 1. Dependências

Instale apenas o que o projeto ainda não tiver:

```bash
npm install react-icons lucide-react
```

---

## 2. Fontes (AeroMatics)

Copie os três arquivos TTF para `public/fonts/`:

```
public/fonts/Aero Matics Light.ttf
public/fonts/Aero Matics Regular.ttf
public/fonts/Aero Matics Bold.ttf
```

Declare as fontes no CSS global (ou em `app/globals.css` se já existir):

```css
@font-face {
  font-family: 'AeroMatics';
  src: url('/fonts/Aero Matics Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'AeroMatics';
  src: url('/fonts/Aero Matics Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'AeroMatics';
  src: url('/fonts/Aero Matics Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

---

## 3. Design Tokens (Tailwind CSS v4)

No arquivo CSS global, adicione (ou mescle) o bloco `@theme` com os tokens Fitmass:

```css
@theme {
  --color-accent: #88BD23;
  --color-secondary: #25B6EB;
  --font-title: 'AeroMatics', 'Impact', 'Arial Black', sans-serif;
  --font-body: 'Encode Sans', Arial, sans-serif;

  --animate-blob-1: blob-drift-1 14s ease-in-out infinite;
  --animate-blob-2: blob-drift-2 18s ease-in-out infinite;
  --animate-blob-3: blob-drift-3 22s ease-in-out infinite;
}

@keyframes blob-drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  20%       { transform: translate(80px, -60px) scale(1.15); }
  40%       { transform: translate(40px, 100px) scale(0.88); }
  60%       { transform: translate(-60px, 60px) scale(1.2); }
  80%       { transform: translate(-30px, -40px) scale(0.92); }
}
@keyframes blob-drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25%       { transform: translate(-90px, 70px) scale(1.18); }
  50%       { transform: translate(-30px, -80px) scale(0.85); }
  75%       { transform: translate(100px, 20px) scale(1.12); }
}
@keyframes blob-drift-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(70px, -90px) scale(1.22); }
  66%       { transform: translate(-80px, 60px) scale(0.82); }
}
```

> **Se o projeto usa Tailwind CSS v3** (com `tailwind.config`), declare os tokens em `extend` conforme a sintaxe v3 e use `fontFamily`, `colors`, `animation`, e `keyframes` equivalentes.

---

## 4. Dados estáticos

Crie `app/links/data.ts`:

```ts
export interface Link {
  id: string
  title: string
  url: string
  description?: string
  categoryId?: string
  order: number
}

export interface Category {
  id: string
  name: string
  order: number
}

export interface Profile {
  title: string
  subtitle: string
  avatarUrl?: string
}

export const profile: Profile = {
  title: 'Fitmass',
  subtitle: 'Transformando dados em bem-estar: Sua saúde, nossa tecnologia!',
}

export const categories: Category[] = [
  { id: 'cat-redes-sociais', name: 'Redes Sociais', order: 0 },
]

export const links: Link[] = [
  {
    id: 'link-site',
    title: 'Site Fitmass',
    url: 'https://fitmass.com.br/',
    description: 'Conheça a Fitmass',
    categoryId: 'cat-redes-sociais',
    order: 0,
  },
  {
    id: 'link-instagram',
    title: 'Instagram',
    url: 'https://www.instagram.com/fitmass.tech/',
    description: 'Siga a Fitmass no Instagram',
    categoryId: 'cat-redes-sociais',
    order: 1,
  },
  {
    id: 'link-youtube',
    title: 'YouTube',
    url: 'https://www.youtube.com/@fitmass791/videos',
    description: 'Assista nossos vídeos no YouTube',
    categoryId: 'cat-redes-sociais',
    order: 2,
  },
  {
    id: 'link-whatsapp',
    title: 'WhatsApp',
    url: 'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+site+e+gostaria+de+ter+mais+informa%C3%A7%C3%B5es+sobre+o+Fitmass&type=phone_number&app_absent=0',
    description: 'Fale conosco pelo WhatsApp',
    categoryId: 'cat-redes-sociais',
    order: 3,
  },
  {
    id: 'link-facebook',
    title: 'Facebook',
    url: 'https://www.facebook.com/fitmass.tech/',
    description: 'Curta a página da Fitmass no Facebook',
    categoryId: 'cat-redes-sociais',
    order: 4,
  },
]
```

---

## 5. Utilitário de ícones sociais

Crie `app/links/socialIcons.tsx`:

```tsx
import type { ComponentType } from 'react'
import {
  FaInstagram, FaYoutube, FaWhatsapp, FaFacebook,
  FaTwitter, FaLinkedin, FaTiktok, FaTelegram, FaGlobe,
} from 'react-icons/fa'
import Image from 'next/image'

type IconComponent = ComponentType<{ size?: number; className?: string }>

interface SocialMeta {
  icon: IconComponent
  color: string
}

function FitmassLogo({ size = 20 }: { size?: number; className?: string }) {
  return (
    <Image
      src="/fitmass_icon.svg"
      alt="Fitmass"
      width={size}
      height={size}
      style={{ filter: 'brightness(0) invert(1)' }}
      className="object-contain"
    />
  )
}

const PATTERNS: Array<{ pattern: RegExp } & SocialMeta> = [
  { pattern: /fitmass\.com\.br/i,        icon: FitmassLogo as IconComponent, color: '#ffffff' },
  { pattern: /instagram\.com/i,          icon: FaInstagram,                  color: '#ffffff' },
  { pattern: /youtube\.com|youtu\.be/i,  icon: FaYoutube,                    color: '#ffffff' },
  { pattern: /whatsapp\.com|wa\.me/i,    icon: FaWhatsapp,                   color: '#ffffff' },
  { pattern: /facebook\.com/i,           icon: FaFacebook,                   color: '#ffffff' },
  { pattern: /twitter\.com|x\.com/i,     icon: FaTwitter,                    color: '#ffffff' },
  { pattern: /linkedin\.com/i,           icon: FaLinkedin,                   color: '#ffffff' },
  { pattern: /tiktok\.com/i,             icon: FaTiktok,                     color: '#ffffff' },
  { pattern: /t\.me|telegram/i,          icon: FaTelegram,                   color: '#ffffff' },
]

export function getSocialMeta(url: string): SocialMeta {
  for (const { pattern, icon, color } of PATTERNS) {
    if (pattern.test(url)) return { icon, color }
  }
  return { icon: FaGlobe, color: '#ffffff' }
}
```

---

## 6. Componentes

### `app/links/components/Badge.tsx`

```tsx
import type { ReactNode } from 'react'

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </span>
  )
}
```

---

### `app/links/components/ProfileHeader.tsx`

```tsx
import Image from 'next/image'
import type { Profile } from '../data'

export function ProfileHeader({ profile }: { profile: Profile }) {
  const { title, subtitle, avatarUrl } = profile
  return (
    <header className="flex flex-col items-center text-center gap-4 py-10 px-4">
      <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden shrink-0">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={title} width={80} height={80} className="w-full h-full object-cover" />
        ) : (
          <Image src="/fitmass_icon.svg" alt="Fitmass" width={64} height={64} className="w-16 h-16 object-contain" />
        )}
      </div>
      {subtitle && (
        <p className="font-body text-base text-white/65 max-w-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  )
}
```

---

### `app/links/components/LinkCard.tsx`

```tsx
'use client'
import { ExternalLink } from 'lucide-react'
import type { Link } from '../data'
import { getSocialMeta } from '../socialIcons'

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

export function LinkCard({ link }: { link: Link }) {
  const { icon: Icon, color } = getSocialMeta(link.url)

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:border-accent/30 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
    >
      <div
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.08]"
        style={{ color }}
      >
        <Icon size={20} />
      </div>

      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-body font-semibold text-sm text-white group-hover:text-accent transition-colors duration-200 truncate">
          {link.title}
        </span>
        {link.description && (
          <span className="font-body text-xs text-white/50 leading-relaxed">
            {truncate(link.description, 100)}
          </span>
        )}
      </div>

      <ExternalLink
        size={16}
        className="shrink-0 text-white/30 group-hover:text-accent transition-colors duration-200"
      />
    </a>
  )
}
```

---

### `app/links/components/CategoryHeader.tsx`

```tsx
import { Badge } from './Badge'
import type { Category } from '../data'

export function CategoryHeader({ category }: { category: Category }) {
  return (
    <div className="flex justify-center pt-6 pb-2">
      <Badge>{category.name}</Badge>
    </div>
  )
}
```

---

### `app/links/components/EmptyState.tsx`

```tsx
import { Link2Off } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
        <Link2Off size={24} className="text-accent/60" />
      </div>
      <p className="font-body text-white/40 text-sm">
        Nenhum link foi adicionado ainda.
      </p>
    </div>
  )
}
```

---

### `app/links/components/LinkGrid.tsx`

```tsx
import type { Link, Category } from '../data'
import { LinkCard } from './LinkCard'
import { CategoryHeader } from './CategoryHeader'
import { EmptyState } from './EmptyState'

export function LinkGrid({ links, categories }: { links: Link[]; categories: Category[] }) {
  if (links.length === 0) return <EmptyState />

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)
  const uncategorized = links.filter(l => !l.categoryId).sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col gap-2 w-full">
      {uncategorized.map(link => (
        <LinkCard key={link.id} link={link} />
      ))}
      {sortedCategories.map(category => {
        const categoryLinks = links
          .filter(l => l.categoryId === category.id)
          .sort((a, b) => a.order - b.order)
        if (categoryLinks.length === 0) return null
        return (
          <div key={category.id} className="flex flex-col gap-2">
            <CategoryHeader category={category} />
            {categoryLinks.map(link => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
```

---

## 7. Página principal

Crie `app/links/page.tsx`:

```tsx
import Image from 'next/image'
import { ProfileHeader } from './components/ProfileHeader'
import { LinkGrid } from './components/LinkGrid'
import { profile, links, categories } from './data'

export const metadata = {
  title: 'Links — Fitmass',
  description: 'Todos os links oficiais da Fitmass',
}

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Fumaça volumétrica — camada base difusa */}
      <div
        className="absolute -top-48 left-0 right-0 h-[700px] rounded-[50%] opacity-20 blur-[160px] animate-blob-3 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--color-accent), var(--color-secondary))' }}
      />
      {/* Corpo principal da fumaça */}
      <div
        className="absolute -top-24 left-0 right-0 h-[520px] rounded-[50%] opacity-30 blur-[90px] animate-blob-1 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--color-accent) 5%, var(--color-secondary) 95%)' }}
      />
      {/* Crista neon — borda superior brilhante */}
      <div
        className="absolute -top-4 left-0 right-0 h-[200px] rounded-[50%] opacity-25 blur-[50px] animate-blob-2 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--color-accent) 0%, transparent 45%, transparent 55%, var(--color-secondary) 100%)' }}
      />

      {/* Vinheta inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

      <div className="relative max-w-xl mx-auto px-4 pb-16">
        <ProfileHeader profile={profile} />
        <LinkGrid links={links} categories={categories} />
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
```

---

## 8. Ativos estáticos

Copie para `public/`:

```
public/fitmass_icon.svg   — ícone quadrado usado no avatar fallback e no card do site
public/logo-white.svg     — logotipo horizontal branco usado no rodapé
```

---

## 9. Estrutura final de arquivos

```
app/
└── links/
    ├── page.tsx
    ├── data.ts
    ├── socialIcons.tsx
    └── components/
        ├── Badge.tsx
        ├── ProfileHeader.tsx
        ├── LinkCard.tsx
        ├── CategoryHeader.tsx
        ├── EmptyState.tsx
        └── LinkGrid.tsx

public/
├── fitmass_icon.svg
├── logo-white.svg
└── fonts/
    ├── Aero Matics Light.ttf
    ├── Aero Matics Regular.ttf
    └── Aero Matics Bold.ttf
```

---

## 10. Notas de compatibilidade

- Os blobs usam `style={{ background: 'linear-gradient(...)' }}` com `var(--color-accent)` e `var(--color-secondary)`. Se o Tailwind do projeto não declara esses custom properties via `@theme`, defina-os manualmente no CSS global:
  ```css
  :root {
    --color-accent: #88BD23;
    --color-secondary: #25B6EB;
  }
  ```
- `LinkCard` e `socialIcons.tsx` contêm `'use client'` pois usam componentes do lado cliente (ícones de terceiros com import dinâmico). `LinksPage` e os demais componentes são Server Components por padrão.
- A página não usa `useRouter`, `useState` ou qualquer hook — é totalmente renderizável no servidor.
