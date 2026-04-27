'use client'

import { useState, useEffect, useRef } from 'react'
import { HexColorPicker } from 'react-colorful'

// ── Icons ─────────────────────────────────────────────────────────────────────

function DumbbellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="1" y="9.5" width="4" height="5" rx="1.5" />
      <rect x="19" y="9.5" width="4" height="5" rx="1.5" />
      <rect x="5" y="11" width="14" height="2" rx="1" />
    </svg>
  )
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13 2L4 14h7l-1 8 10-12h-7z" />
    </svg>
  )
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M2 18h20v2H2zm18-1L17 9l-5 5-5-5-3 8h16z" />
    </svg>
  )
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const LOGOS = [
  { label: 'Haltere', Icon: DumbbellIcon },
  { label: 'Relâmpago', Icon: LightningIcon },
  { label: 'Coroa', Icon: CrownIcon },
]

const PRESETS = [
  { name: 'Verde Fitmass', hex: '#88BD23' },
  { name: 'Azul Elétrico', hex: '#2563EB' },
  { name: 'Laranja', hex: '#F97316' },
]

const CUSTOM_IDX = PRESETS.length  // 3
const IMAGE_IDX = LOGOS.length    // 3

const METRICS = [
  { label: 'Massa Magra', value: '52.3 kg', pct: 72 },
  { label: 'Gordura', value: '18.2%', pct: 45 },
  { label: 'Hidratação', value: '61.4%', pct: 80 },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function PersonalizationSection() {
  const [logoIdx, setLogoIdx] = useState<number | null>(null)
  const [logoImage, setLogoImage] = useState<string | null>(null)
  const [colorIdx, setColorIdx] = useState(0)
  const [customHex, setCustomHex] = useState('#88BD23')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [domain, setDomain] = useState('')
  const [domainOpen, setDomainOpen] = useState(false)
  const [time, setTime] = useState('')

  const domainInputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  // ── Brasilia time ──────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => setTime(
      new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date())
    )
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])

  // ── Domain input focus ─────────────────────────────────────────────────────
  useEffect(() => {
    if (domainOpen) domainInputRef.current?.focus()
  }, [domainOpen])

  // ── Close color picker on outside click ───────────────────────────────────
  useEffect(() => {
    if (!pickerOpen) return
    const handleOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [pickerOpen])

  // ── Derived values ─────────────────────────────────────────────────────────
  const color = colorIdx < PRESETS.length ? PRESETS[colorIdx].hex : customHex
  const LogoIcon = logoIdx !== null && logoIdx < LOGOS.length ? LOGOS[logoIdx].Icon : null
  const showImage = logoIdx === IMAGE_IDX && !!logoImage
  const displayName = domain
    ? domain.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Sua Academia'

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setLogoImage(ev.target?.result as string)
      setLogoIdx(IMAGE_IDX)
    }
    reader.readAsDataURL(file)
  }

  const selectLogo = (i: number) => {
    if (i === IMAGE_IDX) {
      fileRef.current?.click()
      return
    }
    setLogoIdx(prev => (prev === i ? null : i))
    setLogoImage(null)
  }

  return (
    <section
      id="personalizacao"
      className="relative pt-16 pb-28 px-4 bg-contrast overflow-hidden"
      aria-labelledby="personalizacao-heading"
    >
      {/* Ambient glow — follows chosen color */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none opacity-20 transition-colors duration-700"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT: Controls ────────────────────────────────────────────────── */}
        <div>
          <p
            className="font-body font-semibold uppercase text-sm tracking-widest mb-4 transition-colors duration-300"
            style={{ color }}
          >
            White Label & Personalização
          </p>

          <h2
            id="personalizacao-heading"
            className="font-title text-4xl md:text-5xl uppercase text-white tracking-wide mb-6 leading-tight"
          >
            SUA MARCA,<br />NOSSA TECNOLOGIA.
          </h2>

          <p className="font-body text-white/75 text-lg leading-relaxed mb-2">
            O app do seu aluno leva a sua marca — cores, logo e domínio. Personalize ao vivo abaixo.
          </p>
          <p className="font-body text-white/40 text-sm leading-relaxed mb-8">
            Nos planos Premium, ULTRA e Enterprise o app é 100% White Label.
          </p>

          {/* ── Interactive tiles ─────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3 mb-8">

            {/* Tile 1 — Sua Logo */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col">
              <p className="font-body text-white/40 text-[9px] uppercase tracking-widest mb-2.5">Sua Logo</p>

              <div className="grid grid-cols-2 gap-1.5 flex-1">
                {LOGOS.map(({ label, Icon }, i) => (
                  <button
                    key={i}
                    onClick={() => selectLogo(i)}
                    aria-label={label}
                    aria-pressed={logoIdx === i && !showImage}
                    className="flex items-center justify-center rounded-lg h-9 transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: (logoIdx === i && !showImage) ? color : 'rgba(255,255,255,0.06)',
                      opacity: (logoIdx !== null && logoIdx !== i && !showImage) ? 0.4 : 1,
                    }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </button>
                ))}

                {/* Upload button */}
                <button
                  onClick={() => selectLogo(IMAGE_IDX)}
                  aria-label="Enviar imagem"
                  aria-pressed={showImage}
                  className="flex flex-col items-center justify-center rounded-lg h-9 transition-all duration-200 hover:scale-105 border border-dashed gap-0.5"
                  style={{
                    borderColor: showImage ? color : 'rgba(255,255,255,0.2)',
                    backgroundColor: showImage ? color + '25' : 'transparent',
                  }}
                >
                  {showImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={logoImage!} alt="" className="h-6 w-full object-contain rounded px-1" />
                  ) : (
                    <UploadIcon className="w-3.5 h-3.5 text-white/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Tile 2 — Suas Cores */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col">
              <p className="font-body text-white/40 text-[9px] uppercase tracking-widest mb-2.5">Suas Cores</p>

              <div className="grid grid-cols-2 gap-2 flex-1 items-center justify-items-center">
                {PRESETS.map(({ name, hex }, i) => (
                  <button
                    key={i}
                    onClick={() => setColorIdx(i)}
                    aria-label={name}
                    aria-pressed={colorIdx === i}
                    className="w-7 h-7 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: hex,
                      transform: colorIdx === i ? 'scale(1.2)' : undefined,
                      outline: colorIdx === i ? '2px solid white' : '2px solid transparent',
                      outlineOffset: '3px',
                    }}
                  />
                ))}

                {/* Custom color — react-colorful popover */}
                <div className="relative" ref={pickerRef}>
                  <button
                    onClick={() => { setColorIdx(CUSTOM_IDX); setPickerOpen(v => !v) }}
                    aria-label="Cor personalizada"
                    title="Cor personalizada"
                    className="w-7 h-7 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{
                      background: colorIdx === CUSTOM_IDX
                        ? customHex
                        : 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                      transform: colorIdx === CUSTOM_IDX ? 'scale(1.2)' : undefined,
                      outline: colorIdx === CUSTOM_IDX ? '2px solid white' : '2px solid transparent',
                      outlineOffset: '3px',
                    }}
                  />
                  {pickerOpen && (
                    <div className="absolute bottom-full right-0 mb-2 z-50 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                      <HexColorPicker
                        color={customHex}
                        onChange={hex => {
                          setCustomHex(hex)
                          setColorIdx(CUSTOM_IDX)
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tile 3 — Seu Domínio */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex flex-col">
              <p className="font-body text-white/40 text-[9px] uppercase tracking-widest mb-2.5">Seu Domínio</p>

              {domainOpen ? (
                <div className="flex flex-col gap-2 flex-1 justify-center">
                  <input
                    ref={domainInputRef}
                    type="text"
                    value={domain}
                    onChange={e => setDomain(e.target.value.replace(/[^a-z0-9-]/gi, '').toLowerCase())}
                    onKeyDown={e => { if (e.key === 'Enter') setDomainOpen(false) }}
                    placeholder="academia"
                    maxLength={16}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-white text-[10px] placeholder:text-white/25 focus:outline-none focus:border-white/40"
                  />
                  <span className="text-white/25 text-[8px]">.fitmass.app</span>
                  <button
                    onClick={() => setDomainOpen(false)}
                    className="text-left text-[9px] font-semibold transition-colors duration-200"
                    style={{ color }}
                  >
                    ✓ Confirmar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDomainOpen(true)}
                  className="w-full text-left group flex flex-col gap-2 flex-1 justify-center"
                >
                  <span className="font-mono text-[9px] text-white/35 group-hover:text-white/55 transition-colors break-all leading-relaxed">
                    {domain || 'sua-academia'}
                    <span className="text-white/20">.fitmass.app</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-white/30 group-hover:text-white/60 transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M16.768 3.696a2.5 2.5 0 013.536 3.536L7 20.5H3.5V17L16.768 3.696z" />
                    </svg>
                    <span className="text-[9px]">editar</span>
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* CTA */}
          <a
            href="/planos"
            className="inline-flex w-full justify-center items-center gap-2 text-white font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-colors duration-300"
            style={{ backgroundColor: color, }}
          >
            Ver Planos White Label
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* ── RIGHT: Phone Mockup ──────────────────────────────────────────── */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative" style={{ width: 252, height: 516 }}>

            {/* Ambient glow */}
            <div
              className="absolute -inset-8 rounded-full blur-3xl -z-10 opacity-25 transition-colors duration-700"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />

            {/* Phone shell */}
            <div
              className="absolute inset-0 rounded-[2.8rem] bg-[#1c1c1e]"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1), 0 32px 80px rgba(0,0,0,0.85)' }}
            >
              {/* Side buttons */}
              <div className="absolute -left-[2px]  top-[96px]  w-[3px] h-[28px] bg-[#111] rounded-l-full" aria-hidden="true" />
              <div className="absolute -left-[2px]  top-[136px] w-[3px] h-[28px] bg-[#111] rounded-l-full" aria-hidden="true" />
              <div className="absolute -right-[2px] top-[116px] w-[3px] h-[44px] bg-[#111] rounded-r-full" aria-hidden="true" />

              {/* Screen */}
              <div className="absolute inset-[5px] rounded-[2.3rem] overflow-hidden flex flex-col bg-[#0d0d13]">

                {/* Status bar */}
                <div className="relative flex items-center justify-between px-5 pt-3.5 pb-0.5 flex-shrink-0">
                  <span suppressHydrationWarning className="text-white/55 text-[9px] font-semibold tabular-nums">
                    {time || '–:–'}
                  </span>

                  {/* Dynamic island */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[68px] h-[18px] bg-black rounded-full flex items-center justify-center" aria-hidden="true">
                    <div className="w-[6px] h-[6px] rounded-full bg-zinc-900 border border-zinc-700/60" />
                  </div>

                  {/* Battery */}
                  <svg viewBox="0 0 22 11" fill="none" className="w-[18px] h-[9px]" aria-hidden="true">
                    <rect x=".5" y=".5" width="18" height="10" rx="2" stroke="white" strokeOpacity=".45" />
                    <rect x="1.5" y="1.5" width="12" height="8" rx="1.2" fill="white" fillOpacity=".45" />
                    <path d="M20 3.5v4" stroke="white" strokeOpacity=".45" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* App header */}
                <div
                  className="px-3 py-2.5 flex items-center justify-between flex-shrink-0 transition-colors duration-300"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-white text-[10px] font-bold tracking-wider uppercase truncate flex-1 mr-2">
                    {displayName}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                </div>

                {/* Domain badge */}
                <div
                  className="flex justify-center py-[3px] flex-shrink-0 transition-colors duration-300"
                  style={{ backgroundColor: color + '28' }}
                >
                  <span className="text-[7px] font-mono transition-colors duration-300" style={{ color }}>
                    {domain || 'sua-academia'}.fitmass.app
                  </span>
                </div>

                {/* Profile row */}
                <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2 flex-shrink-0">
                  <div
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                    style={{ backgroundColor: color + '30', border: `1px solid ${color}60` }}
                  >
                    <span className="text-[9px] font-bold transition-colors duration-300" style={{ color }}>JD</span>
                  </div>
                  <div>
                    <div className="text-white text-[9px] font-semibold">João Dias</div>
                    <div className="text-white/35 text-[8px]">Avaliação #247</div>
                  </div>
                </div>

                {/* Logo area */}
                <div className="px-3 pt-2.5 flex-shrink-0">
                  <div
                    className="h-[50px] rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: color + '20', border: `1px solid ${color}40` }}
                  >
                    {showImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={logoImage!}
                        alt="Logo personalizada"
                        className="h-9 max-w-[80%] object-contain"
                      />
                    ) : LogoIcon ? (
                      <div className="w-8 h-8 transition-all duration-300" style={{ color }}>
                        <LogoIcon className="w-full h-full" />
                      </div>
                    ) : (
                      <span
                        className="text-[8px] font-bold uppercase tracking-wider transition-colors duration-300"
                        style={{ color: color + 'AA' }}
                      >
                        Sua Logo Aqui
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="px-3 pt-2.5 flex-1 flex flex-col gap-2">
                  {METRICS.map(({ label, value, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between items-center mb-[3px]">
                        <span className="text-white/45 text-[8px]">{label}</span>
                        <span className="text-[8px] font-semibold transition-colors duration-300" style={{ color }}>
                          {value}
                        </span>
                      </div>
                      <div className="h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-3 pb-2 pt-2 flex-shrink-0">
                  <div
                    className="h-7 rounded-lg flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-white text-[8px] font-bold uppercase tracking-wider">
                      Ver Relatório Completo
                    </span>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-2 pt-0.5 flex-shrink-0">
                  <div className="w-[60px] h-1 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal → next section (bg-surface) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full" style={{ height: 72, display: 'block' }}>
          <polygon fill="#F8F8F8" points="0,72 1440,72 1440,0" />
        </svg>
      </div>
    </section>
  )
}
