'use client'

import { useEffect, useState } from 'react'

const profiles = [
  {
    gordura: '18,5%',
    massa: '42,3 kg',
    hidratacao: '62,4%',
    bars: [55, 78, 62, 84, 70, 88],
  },
  {
    gordura: '24,3%',
    massa: '35,8 kg',
    hidratacao: '57,1%',
    bars: [48, 68, 54, 74, 62, 78],
  },
  {
    gordura: '14,2%',
    massa: '48,6 kg',
    hidratacao: '67,8%',
    bars: [62, 88, 70, 92, 78, 96],
  },
]

const numAnim: React.CSSProperties = { animation: 'number-in 0.35s ease forwards' }
const floatBase = 'hidden lg:flex absolute z-20 flex-col gap-0.5 bg-black/80 backdrop-blur-sm px-3.5 py-2.5 rounded-xl pointer-events-none select-none'

export default function HeroBadges() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % profiles.length), 4000)
    return () => clearInterval(timer)
  }, [])

  const p = profiles[idx]

  return (
    <>
      {/* Gordura Corporal — top right */}
      <div
        className={`${floatBase} right-8 top-[16%] border border-accent/40`}
        style={{ animation: 'badge-float 4s ease-in-out infinite' }}
        aria-hidden="true"
      >
        <span className="font-body text-white/50 text-[0.52rem] uppercase tracking-widest">Gordura Corporal</span>
        <span key={`g-${idx}`} className="font-title text-accent text-lg leading-none font-bold" style={numAnim}>
          {p.gordura}
        </span>
      </div>

      {/* Massa Muscular — left middle */}
      <div
        className={`${floatBase} left-8 top-[40%] border border-secondary/40`}
        style={{ animation: 'badge-float 5.5s ease-in-out infinite 0.8s' }}
        aria-hidden="true"
      >
        <span className="font-body text-white/50 text-[0.52rem] uppercase tracking-widest">Massa Muscular</span>
        <span key={`m-${idx}`} className="font-title text-secondary text-lg leading-none font-bold" style={numAnim}>
          {p.massa}
        </span>
      </div>

      {/* Mini bar chart — right center */}
      <div
        className={`${floatBase} right-6 top-[46%] gap-2 border border-white/10`}
        style={{ animation: 'badge-float 5s ease-in-out infinite 1.2s' }}
        aria-hidden="true"
      >
        <span className="font-body text-white/40 text-[0.48rem] uppercase tracking-widest">Composição</span>
        <div className="flex items-end gap-[3px]" style={{ height: 32 }}>
          {p.bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: `${Math.max(4, h * 0.33)}px`,
                background: i % 2 === 0 ? 'rgba(136,189,35,0.82)' : 'rgba(37,182,235,0.62)',
                borderRadius: 2,
                transition: 'height 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Hidratação — bottom right */}
      <div
        className={`${floatBase} right-8 bottom-[20%] border border-white/20`}
        style={{ animation: 'badge-float 6s ease-in-out infinite 1.6s' }}
        aria-hidden="true"
      >
        <span className="font-body text-white/50 text-[0.52rem] uppercase tracking-widest">Hidratação</span>
        <span key={`h-${idx}`} className="font-title text-white text-lg leading-none font-bold" style={numAnim}>
          {p.hidratacao}
        </span>
      </div>
    </>
  )
}
