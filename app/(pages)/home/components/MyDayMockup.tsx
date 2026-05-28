'use client'

import { useState, useEffect, useRef } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type SimState = 'IDLE' | 'PROCESSING' | 'ASKING' | 'FINAL'

interface TextMsg {
  id: string
  sender: 'user' | 'bot'
  type: 'text'
  content: string
}

interface PhotoMsg {
  id: string
  sender: 'user'
  type: 'photo'
  photoSrc: string
  mealId: string
}

type Msg = TextMsg | PhotoMsg

interface AnalysisItem {
  item: string
  qty: string
  prot: number
  carb: number
  fat: number
  kcal: number
}

interface Meal {
  id: string
  photoSrc: string
  label: string
  identifiedItems: string[]
  analysis: AnalysisItem[]
}

// ── Data ──────────────────────────────────────────────────────────────────────

const MEALS: Meal[] = [
  {
    id: 'meal_1',
    photoSrc: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&q=80&auto=format&fit=crop',
    label: 'Frango & Arroz',
    identifiedItems: ['Frango grelhado', 'Arroz branco', 'Brócolis cozido'],
    analysis: [
      { item: 'Frango grelhado', qty: '150g', prot: 46.5, carb: 0,    fat: 5.4, kcal: 248 },
      { item: 'Arroz branco',    qty: '100g', prot: 2.7,  carb: 28.2, fat: 0.3, kcal: 130 },
      { item: 'Brócolis cozido', qty: '80g',  prot: 2.3,  carb: 3.4,  fat: 0.3, kcal: 28  },
    ],
  },
  {
    id: 'meal_2',
    photoSrc: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&q=80&auto=format&fit=crop',
    label: 'Ovos & Café',
    identifiedItems: ['Ovos mexidos', 'Pão integral'],
    analysis: [
      { item: 'Ovos mexidos', qty: '100g', prot: 10,  carb: 2,  fat: 11,  kcal: 148 },
      { item: 'Pão integral', qty: '50g',  prot: 4,   carb: 20, fat: 1.5, kcal: 120 },
    ],
  },
  {
    id: 'meal_3',
    photoSrc: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80&auto=format&fit=crop',
    label: 'Salada Fitness',
    identifiedItems: ['Atum ao natural', 'Alface', 'Tomate cereja', 'Azeite'],
    analysis: [
      { item: 'Atum ao natural', qty: '120g', prot: 31.2, carb: 0,   fat: 1.2, kcal: 138 },
      { item: 'Alface',          qty: '50g',  prot: 0.7,  carb: 1.2, fat: 0.1, kcal: 9   },
      { item: 'Tomate cereja',   qty: '60g',  prot: 0.7,  carb: 2.9, fat: 0.2, kcal: 16  },
      { item: 'Azeite',          qty: '5ml',  prot: 0,    carb: 0,   fat: 5,   kcal: 44  },
    ],
  },
]

const MYDAY_AVATAR = '/pages/landingpage/aiSection/MyDay-icone.svg'

// ── Sub-components ────────────────────────────────────────────────────────────

function BotAvatar() {
  return (
    <img
      src={MYDAY_AVATAR}
      alt=""
      aria-hidden="true"
      className="w-7 h-7 rounded-full shrink-0 flex-none object-contain bg-white p-0.5"
    />
  )
}

function TypingDots() {
  return (
    <div className="self-start flex items-start gap-1 mb-0.5">
      <BotAvatar />
      <div className="bg-white rounded-2xl rounded-tl-none px-3 py-2 shadow-sm inline-flex">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.25 h-1.25 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Bubble({ msg }: { msg: Msg }) {
  if (msg.type === 'photo') {
    return (
      <div className="self-end relative mr-1">
        <div
          className="absolute top-0 -right-1.75 w-0 h-0"
          style={{ borderTop: '7px solid #dcf8c6', borderRight: '7px solid transparent' }}
        />
        <div
          className="rounded-2xl rounded-tr-none overflow-hidden shadow-md"
          style={{ backgroundColor: '#dcf8c6', padding: '2px' }}
        >
          <div className="relative rounded-xl overflow-hidden">
            <img src={msg.photoSrc} alt="Refeição" className="w-27.5 h-27.5 object-cover block" />
            <div className="absolute bottom-1 right-1.5 px-1 py-px">
              <span className="text-white text-[7px] leading-none drop-shadow" suppressHydrationWarning>
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isUser = msg.sender === 'user'
  return (
    <div className={`max-w-[82%] ${isUser ? 'self-end mr-1' : 'self-start ml-0 flex items-start gap-1'}`}>
      {!isUser && <BotAvatar />}
      <div className="relative">
        {!isUser && (
          <div
            className="absolute top-0 -left-1.75 w-0 h-0"
            style={{ borderTop: '7px solid #ffffff', borderLeft: '7px solid transparent' }}
          />
        )}
        {isUser && (
          <div
            className="absolute top-0 -right-1.75 w-0 h-0"
            style={{ borderTop: '7px solid #dcf8c6', borderRight: '7px solid transparent' }}
          />
        )}
        <div
          className={`rounded-2xl px-2.5 py-2 text-[9px] leading-relaxed shadow-sm ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}
          style={{ backgroundColor: isUser ? '#dcf8c6' : '#ffffff', color: '#111' }}
        >
          {!isUser && (
            <span className="block font-bold text-[9px] mb-1" style={{ color: '#FF6A00' }}>MyDay</span>
          )}
          {msg.content.split('\n').map((line, i) => (
            <span key={i} className={`block ${line === '' ? 'h-1' : ''}`}>{line}</span>
          ))}
          <div className="text-right mt-0.5 -mb-0.5">
            <span className="text-[6.5px] text-black/30 leading-none" suppressHydrationWarning>
              {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Owner Dashboard ───────────────────────────────────────────────────────────

const OWNER_STUDENTS = [
  { name: 'Ana Silva',    note: 'Almoço registrado',    time: '2min',  pct: 95, icon: '🥗' },
  { name: 'Carlos M.',   note: 'Meta de proteína!',     time: '12min', pct: 88, icon: '💪' },
  { name: 'Patrícia L.', note: 'Café da manhã',         time: '34min', pct: 72, icon: '☕' },
  { name: 'Roberto S.',  note: 'Jantar registrado',     time: '1h',    pct: 91, icon: '🍽️' },
]

function OwnerDashboard({ currentTime }: { currentTime: string }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#fafafa' }}>

      {/* Status bar */}
      <div
        className="relative flex items-center justify-between px-4 pt-2.5 pb-1 shrink-0"
        style={{ backgroundColor: '#FF6A00' }}
      >
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2.75 bg-black rounded-full" aria-hidden="true" />
        <div className="flex items-center gap-1.5 z-10" aria-hidden="true">
          <div className="flex items-end gap-px">
            {[2, 3, 4, 5, 6].map((h, i) => (
              <div key={i} className="w-0.5 rounded-sm bg-white" style={{ height: h, opacity: i < 4 ? 1 : 0.35 }} />
            ))}
          </div>
          <svg viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5" aria-hidden="true">
            <path d="M1.5 8.5C5.6 4.4 10.5 2.5 12 2.5s6.4 1.9 10.5 6l-1.5 1.5C17.6 6.6 14.9 4.5 12 4.5S6.4 6.6 3 10l-1.5-1.5z" opacity=".4"/>
            <path d="M5 12c1.9-1.9 4.3-3 7-3s5.1 1.1 7 3l-1.5 1.5C16 12 14.1 11 12 11s-4 1-5.5 2.5L5 12z" opacity=".7"/>
            <path d="M8.5 15.5C9.4 14.6 10.6 14 12 14s2.6.6 3.5 1.5L12 19l-3.5-3.5z"/>
          </svg>
        </div>
        <div className="z-10">
          <span className="text-[7.5px] font-bold text-white leading-none" suppressHydrationWarning>{currentTime}</span>
        </div>
      </div>

      {/* App header + stats */}
      <div className="px-3 pt-2.5 pb-3 shrink-0" style={{ backgroundColor: '#FF6A00' }}>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <div className="text-white/70 text-[7px] uppercase tracking-wide leading-tight">Gestor MyDay</div>
            <div className="text-white text-[11px] font-bold leading-tight">Power Fit Academia</div>
          </div>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[12px]">🏋️</div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'Alunos',     value: '47'  },
            { label: 'Refeições',  value: '124' },
            { label: 'Compliance', value: '91%' },
          ].map(s => (
            <div key={s.label} className="bg-white/20 rounded-xl px-1.5 py-1.5 text-center">
              <div className="text-white text-[13px] font-bold leading-tight">{s.value}</div>
              <div className="text-white/70 text-[6.5px] uppercase tracking-wide leading-tight mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <div className="flex-1 overflow-y-auto px-2.5 pt-2" style={{ backgroundColor: '#f0f0f0' }}>
        <p className="text-[7px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Atividade recente</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-2 py-1.5 mb-2 flex items-center gap-1.5">
          <span className="text-[11px] shrink-0">⚠️</span>
          <p className="text-[7.5px] font-semibold text-amber-700 flex-1 min-w-0 leading-tight">3 alunos sem registro hoje</p>
          <button className="shrink-0 text-[6.5px] font-bold text-white bg-amber-500 px-1.5 py-0.5 rounded-full">
            Avisar
          </button>
        </div>

        <div className="flex flex-col gap-1.5 pb-2">
          {OWNER_STUDENTS.map(s => (
            <div key={s.name} className="bg-white rounded-xl px-2 py-1.5 flex items-center gap-1.5 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-[10px]">
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[8px] font-bold text-gray-800 leading-tight truncate">{s.name}</div>
                <div className="text-[7px] text-gray-400 leading-tight truncate">{s.note}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[6.5px] text-gray-400 leading-none">{s.time}</div>
                <div
                  className="text-[7.5px] font-bold leading-none mt-0.5"
                  style={{ color: s.pct >= 80 ? '#16a34a' : '#d97706' }}
                >
                  {s.pct}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-2 pt-0.5 shrink-0" style={{ backgroundColor: '#f0f0f0' }}>
        <div className="w-12 h-0.75 rounded-full bg-black/20" />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

const PHONE_W = 260
const PHONE_H = 548

interface MyDayMockupProps {
  scale?: number
  onInteractChange?: (interacting: boolean) => void
  view?: 'aluno' | 'dono'
}

export default function MyDayMockup({ scale = 1, onInteractChange, view = 'aluno' }: MyDayMockupProps) {
  const [simState, setSimState] = useState<SimState>('IDLE')
  const [messages, setMessages] = useState<Msg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [currentTime, setCurrentTime] = useState('9:41')

  const listRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const msgCounter = useRef(0)

  useEffect(() => {
    function tick() {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  const delay = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }

  const nextId = () => `m${++msgCounter.current}`
  const push = (msg: Msg) => setMessages(prev => [...prev, msg])

  const selectMeal = (meal: Meal) => {
    if (simState !== 'IDLE') return
    onInteractChange?.(true)
    setSelectedMeal(meal)
    setSimState('PROCESSING')
    push({ id: nextId(), sender: 'user', type: 'photo', photoSrc: meal.photoSrc, mealId: meal.id })
    delay(() => setIsTyping(true), 500)
    delay(() => {
      setIsTyping(false)
      push({
        id: nextId(),
        sender: 'bot',
        type: 'text',
        content: `Identifiquei: ${meal.identifiedItems.join(', ')}.\n\nDeseja informar algum item adicional ou modo de preparo?`,
      })
      setSimState('ASKING')
    }, 2100)
  }

  const confirmNo = () => {
    if (simState !== 'ASKING' || !selectedMeal) return
    setSimState('PROCESSING')
    push({ id: nextId(), sender: 'user', type: 'text', content: 'Não, pode calcular!' })
    delay(() => setIsTyping(true), 400)
    delay(() => {
      setIsTyping(false)
      if (!selectedMeal) return
      const tot = selectedMeal.analysis.reduce(
        (a, i) => ({ p: a.p + i.prot, c: a.c + i.carb, f: a.f + i.fat, k: a.k + i.kcal }),
        { p: 0, c: 0, f: 0, k: 0 }
      )
      const lines = selectedMeal.analysis
        .map(i => `${i.item} (${i.qty})\nP${i.prot}g  C${i.carb}g  G${i.fat}g — ${i.kcal}kcal`)
        .join('\n\n')
      push({
        id: nextId(),
        sender: 'bot',
        type: 'text',
        content: `✅ Análise pronta!\n\n${lines}\n\n▸ TOTAL\nP${tot.p.toFixed(1)}g  C${tot.c.toFixed(1)}g  G${tot.f.toFixed(1)}g — ${tot.k.toFixed(0)}kcal`,
      })
      setSimState('FINAL')
    }, 2400)
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setMessages([])
    setSimState('IDLE')
    setSelectedMeal(null)
    setIsTyping(false)
    onInteractChange?.(false)
  }

  return (
    <div style={{ width: PHONE_W * scale, height: PHONE_H * scale, flexShrink: 0, position: 'relative' }}>
    <div style={{ transformOrigin: 'top left', transform: `scale(${scale})`, width: PHONE_W, height: PHONE_H, position: 'absolute', top: 0, left: 0 }}>

      {/* Ambient glow */}
      <div className="absolute -inset-8 rounded-full blur-3xl -z-10 opacity-20 bg-[#FF6A00]" aria-hidden="true" />

      {/* Phone shell */}
      <div
        className="absolute inset-0 rounded-[2.8rem] bg-[#1c1c1e]"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1), 0 32px 80px rgba(0,0,0,0.85)' }}
      >
        {/* Side buttons */}
        <div className="absolute -left-0.5  top-24   w-0.75 h-7  bg-[#111] rounded-l-full" aria-hidden="true" />
        <div className="absolute -left-0.5  top-34   w-0.75 h-7  bg-[#111] rounded-l-full" aria-hidden="true" />
        <div className="absolute -right-0.5 top-29   w-0.75 h-11 bg-[#111] rounded-r-full" aria-hidden="true" />

        {/* Screen */}
        <div className="absolute inset-1.25 rounded-[2.3rem] overflow-hidden flex flex-col bg-[#f0f0f0]">

          {view === 'dono' && (
            <div className="absolute inset-0 z-10">
              <OwnerDashboard currentTime={currentTime} />
            </div>
          )}

          {/* Status bar */}
          <div
            className="relative flex items-center justify-between px-4 pt-2.5 pb-1 shrink-0"
            style={{ backgroundColor: '#075E54' }}
          >
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2.75 bg-black rounded-full" aria-hidden="true" />
            <div className="flex items-center gap-1.5 z-10" aria-hidden="true">
              <div className="flex items-end gap-px">
                {[2, 3, 4, 5, 6].map((h, i) => (
                  <div key={i} className="w-0.5 rounded-sm bg-white" style={{ height: h, opacity: i < 4 ? 1 : 0.35 }} />
                ))}
              </div>
              {/* WiFi icon */}
              <svg viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5" aria-hidden="true">
                <path d="M1.5 8.5C5.6 4.4 10.5 2.5 12 2.5s6.4 1.9 10.5 6l-1.5 1.5C17.6 6.6 14.9 4.5 12 4.5S6.4 6.6 3 10l-1.5-1.5z" opacity=".4"/>
                <path d="M5 12c1.9-1.9 4.3-3 7-3s5.1 1.1 7 3l-1.5 1.5C16 12 14.1 11 12 11s-4 1-5.5 2.5L5 12z" opacity=".7"/>
                <path d="M8.5 15.5C9.4 14.6 10.6 14 12 14s2.6.6 3.5 1.5L12 19l-3.5-3.5z"/>
              </svg>
            </div>
            <div className="z-10 rounded px-1.5 py-0.5">
              <span className="text-[7.5px] font-bold text-white leading-none" suppressHydrationWarning>{currentTime}</span>
            </div>
          </div>

          {/* Chat header */}
          <div className="px-2 py-1.5 flex items-center gap-1.5 shrink-0" style={{ backgroundColor: '#075E54' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0 opacity-90" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <img src={MYDAY_AVATAR} alt="" aria-hidden="true" className="w-7 h-7 rounded-full shrink-0 object-contain bg-white p-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-white text-[10px] font-bold leading-tight truncate">MyDay</div>
              <div className="text-white/60 text-[7.5px] leading-tight">Fitmass</div>
            </div>
            <div className="flex items-center gap-2 shrink-0 opacity-90">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 10.73 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3" aria-hidden="true">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </div>
          </div>

          {/* Message list */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1.5"
            style={{
              backgroundImage: 'url(/pages/landingpage/aiSection/whatsapp-bg.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'repeat',
            }}
          >
            {messages.map(msg => (
              <Bubble key={msg.id} msg={msg} />
            ))}
            {isTyping && <TypingDots />}
          </div>

          {/* Input area */}
          <div className="shrink-0" style={{ backgroundColor: '#f0f0f0', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            {simState === 'IDLE' && (
              <div className="p-1.5">
                <p className="text-[7px] text-gray-400 text-center mb-1 font-semibold uppercase tracking-wide">
                  Toque em uma foto para enviar
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {MEALS.map(meal => (
                    <button
                      key={meal.id}
                      onClick={() => selectMeal(meal)}
                      aria-label={meal.label}
                      className="relative rounded-lg overflow-hidden transition-transform active:scale-95"
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      <img src={meal.photoSrc} alt={meal.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/25 flex items-end justify-center pb-1">
                        <span className="text-white text-[6.5px] font-semibold drop-shadow text-center leading-tight px-0.5">
                          {meal.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {simState === 'PROCESSING' && (
              <div className="p-3 flex justify-center">
                <span className="text-[8.5px] text-gray-400 italic">Processando...</span>
              </div>
            )}

            {simState === 'ASKING' && (
              <div className="p-2">
                <button
                  onClick={confirmNo}
                  className="w-full py-2.5 rounded-xl text-[10px] font-bold text-white uppercase tracking-wider transition-transform active:scale-95"
                  style={{ backgroundColor: '#075E54' }}
                >
                  Não, pode calcular!
                </button>
              </div>
            )}

            {simState === 'FINAL' && (
              <div className="p-2">
                <button
                  onClick={reset}
                  className="w-full py-2.5 rounded-xl text-[10px] font-bold text-white uppercase tracking-wider transition-transform active:scale-95"
                  style={{ backgroundColor: '#075E54' }}
                >
                  ↺ Recomeçar
                </button>
              </div>
            )}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2 pt-0.5 shrink-0" style={{ backgroundColor: '#f0f0f0' }}>
            <div className="w-12 h-0.75 rounded-full bg-black/20" />
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
