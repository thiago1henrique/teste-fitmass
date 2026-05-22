import Image from 'next/image'

/* ─── Social icons ────────────────────────────────────────────────────────── */

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

/* ─── Contact icons ───────────────────────────────────────────────────────── */

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const navLinks = [
  { label: 'Home',      href: '/'          },
  { label: 'Produtos',  href: '/#produtos' },
  { label: 'Planos',    href: '/planos'    },
  { label: 'Sobre Nós', href: '/#sobre'    },
  { label: 'Blog',      href: '/blog'      },
  { label: 'Contato',   href: '/contato'   },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/fitmass.tech/',                                                                                         Icon: InstagramIcon },
  { label: 'YouTube',   href: 'https://www.youtube.com/@fitmass791',                                                                                              Icon: YouTubeIcon   },
  { label: 'WhatsApp',  href: 'https://wa.me/5541984810567?text=Ol%C3%A1,%20vim%20do%20site%20e%20gostaria%20de%20ter%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20Fitmass', Icon: WhatsAppIcon  },
  { label: 'Facebook',  href: 'https://www.facebook.com/fitmass.tech/',                                                                                           Icon: FacebookIcon  },
]

const contactItems = [
  {
    Icon: EmailIcon,
    label: 'E-mail',
    text: 'comercial@fitmass.com.br',
    href: 'mailto:comercial@fitmass.com.br',
  },
  {
    Icon: PhoneIcon,
    label: 'Telefone',
    text: '(41) 98481-0567',
    href: 'tel:+5541984810567',
  },
  {
    Icon: LocationIcon,
    label: 'Endereço',
    text: 'Curitiba, PR – Brasil',
    href: undefined,
  },
]

/* ─── Component ──────────────────────────────────────────────────────────── */

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="mb-6">
      <h3 className="font-title text-accent text-xs uppercase tracking-[0.2em]">
        {children}
      </h3>
      <div className="mt-2 h-px w-8 bg-accent/50" />
    </div>
  )
}

export default function Footer() {
  return (
    <footer>
      {/* Faixa decorativa no topo */}
      <div
        className="h-0.75 w-full"
        style={{
          background:
            'linear-gradient(90deg, #88BD23 0%, #25B6EB 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Corpo principal */}
      <div
        className="px-6 pt-12 pb-12 md:py-16 md:px-8"
        style={{
          background:
            'linear-gradient(145deg, #4d7a12 0%, #1e6650 40%, #0a2e1f 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-16">

          {/* Col 1 — Marca + Social */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left pb-10 border-b border-white/10 md:border-0 md:pb-0">
            <Image
              src="https://fitmass.com.br/wp-content/uploads/2023/05/Logo-Fitmass-branca.svg"
              alt="Fitmass"
              width={148}
              height={38}
              className="mb-4 h-9 w-auto"
            />
            <p className="font-title text-white/70 text-xs uppercase tracking-[0.18em] leading-relaxed mb-6">
              Tecnologia que retém alunos.
            </p>

            {/* Redes sociais */}
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-full bg-white/10 border border-white/15 hover:bg-secondary/20 hover:border-secondary/50 hover:text-secondary flex items-center justify-center text-white transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Navegação */}
          <div className="pt-10 pb-10 border-b border-white/10 md:border-0 md:pt-0 md:pb-0">
            <SectionHeading>Navegação</SectionHeading>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-4">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="font-body text-white/65 hover:text-secondary text-sm transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contato */}
          <div className="pt-10 md:pt-0">
            <SectionHeading>Contato</SectionHeading>
            <ul className="space-y-5">
              {contactItems.map(({ Icon, label, text, href }) => (
                <li key={label} className="flex items-start gap-3 text-white/65">
                  <span className="text-accent mt-0.5 shrink-0">
                    <Icon />
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className="font-body text-sm hover:text-secondary transition-colors leading-snug"
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="font-body text-sm leading-snug">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Barra inferior */}
      <div
        className="px-6 py-5 border-t border-white/8 md:px-8"
        style={{ background: '#060f09' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="font-body text-white/30 text-xs text-center sm:text-left">
            Fitmass S/A &nbsp;|&nbsp; CNPJ: 39.867.600/0001-97
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <p className="font-body text-white/30 text-xs text-center">
              © 2026 Fitmass. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-3">
              <a href="/privacidade" className="font-body text-white/40 hover:text-white/70 text-xs transition-colors whitespace-nowrap">
                Política de Privacidade
              </a>
              <span className="text-white/20 text-xs" aria-hidden="true">·</span>
              <a href="/termos" className="font-body text-white/40 hover:text-white/70 text-xs transition-colors whitespace-nowrap">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
