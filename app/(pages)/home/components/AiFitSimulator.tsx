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

interface MealMsg {
  id: string
  sender: 'user'
  type: 'meal'
  mealId: string
}

type Msg = TextMsg | MealMsg

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
  emoji: string
  label: string
  gradient: string
  identifiedItems: string[]
  analysis: AnalysisItem[]
}

// ── Data ──────────────────────────────────────────────────────────────────────

const MEALS: Meal[] = [
  {
    id: 'meal_1',
    emoji: '🍗',
    label: 'Frango & Arroz',
    gradient: 'linear-gradient(145deg,#78350f,#b45309)',
    identifiedItems: ['Frango grelhado', 'Arroz branco', 'Brócolis cozido'],
    analysis: [
      { item: 'Frango grelhado', qty: '150g', prot: 46.5, carb: 0,    fat: 5.4, kcal: 248 },
      { item: 'Arroz branco',    qty: '100g', prot: 2.7,  carb: 28.2, fat: 0.3, kcal: 130 },
      { item: 'Brócolis cozido', qty: '80g',  prot: 2.3,  carb: 3.4,  fat: 0.3, kcal: 28  },
    ],
  },
  {
    id: 'meal_2',
    emoji: '🥚',
    label: 'Ovos & Pão',
    gradient: 'linear-gradient(145deg,#92400e,#d97706)',
    identifiedItems: ['Ovos mexidos', 'Pão integral'],
    analysis: [
      { item: 'Ovos mexidos', qty: '100g', prot: 10,  carb: 2,  fat: 11,  kcal: 148 },
      { item: 'Pão integral', qty: '50g',  prot: 4,   carb: 20, fat: 1.5, kcal: 120 },
    ],
  },
  {
    id: 'meal_3',
    emoji: '🥗',
    label: 'Salada Fitness',
    gradient: 'linear-gradient(145deg,#14532d,#16a34a)',
    identifiedItems: ['Atum ao natural', 'Alface', 'Tomate cereja', 'Azeite'],
    analysis: [
      { item: 'Atum ao natural', qty: '120g', prot: 31.2, carb: 0,   fat: 1.2, kcal: 138 },
      { item: 'Alface',          qty: '50g',  prot: 0.7,  carb: 1.2, fat: 0.1, kcal: 9   },
      { item: 'Tomate cereja',   qty: '60g',  prot: 0.7,  carb: 2.9, fat: 0.2, kcal: 16  },
      { item: 'Azeite',          qty: '5ml',  prot: 0,    carb: 0,   fat: 5,   kcal: 44  },
    ],
  },
]

const INIT_MSG: TextMsg = {
  id: 'init',
  sender: 'bot',
  type: 'text',
  content: 'Olá! 👋 Envie uma foto da sua refeição e eu calculo os macros na hora.',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="self-start bg-white rounded-2xl rounded-tl-none px-3 py-2 shadow-sm inline-flex">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-[5px] h-[5px] rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

function Bubble({ msg, meals }: { msg: Msg; meals: Meal[] }) {
  if (msg.type === 'meal') {
    const meal = meals.find(m => m.id === msg.mealId)!
    return (
      <div className="self-end">
        <div
          className="w-[86px] h-[86px] rounded-2xl rounded-tr-none flex flex-col items-center justify-center gap-1 shadow-sm overflow-hidden"
          style={{ background: meal.gradient }}
        >
          <span className="text-[26px] leading-none">{meal.emoji}</span>
          <span className="text-white text-[7px] font-semibold text-center px-1 leading-tight">{meal.label}</span>
        </div>
      </div>
    )
  }

  const isUser = msg.sender === 'user'
  return (
    <div className={`max-w-[80%] ${isUser ? 'self-end' : 'self-start'}`}>
      <div
        className={`rounded-2xl px-2.5 py-2 text-[9px] leading-relaxed shadow-sm ${
          isUser
            ? 'bg-[#88BD23] text-white rounded-tr-none'
            : 'bg-white text-gray-800 rounded-tl-none'
        }`}
      >
        {msg.content.split('\n').map((line, i) => (
          <span key={i} className={`block ${line === '' ? 'h-1' : ''}`}>{line}</span>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AiFitSimulator() {
  const [simState, setSimState] = useState<SimState>('IDLE')
  const [messages, setMessages] = useState<Msg[]>([INIT_MSG])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)

  const listRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const msgCounter = useRef(0)

  // Auto-scroll to newest message
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  // Cleanup on unmount
  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  const delay = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }

  const nextId = () => `m${++msgCounter.current}`
  const push = (msg: Msg) => setMessages(prev => [...prev, msg])

  const selectMeal = (meal: Meal) => {
    if (simState !== 'IDLE') return
    setSelectedMeal(meal)
    setSimState('PROCESSING')
    push({ id: nextId(), sender: 'user', type: 'meal', mealId: meal.id })
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
    push({ id: nextId(), sender: 'user', type: 'text', content: 'Não' })
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
    setMessages([INIT_MSG])
    setSimState('IDLE')
    setSelectedMeal(null)
    setIsTyping(false)
  }

  return (
    <section id="ia-fit" className="py-16 px-4 bg-surface" aria-labelledby="ia-fit-heading">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT: copy ──────────────────────────────────────────────────── */}
        <div>
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            IA Alimentar
          </span>

          <h2
            id="ia-fit-heading"
            className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide leading-tight mb-6"
          >
            REGISTRE REFEIÇÕES<br />COM UMA FOTO.
          </h2>

          <p className="font-body text-contrast/70 text-lg leading-relaxed mb-8">
            A IA Fit analisa a foto da refeição e retorna macronutrientes detalhados — proteína, carboidrato, gordura e calorias — em segundos, diretamente no app com a sua marca.
          </p>

          <ul className="space-y-3">
            {[
              'Reconhecimento de alimentos por foto',
              'Cálculo automático de macronutrientes',
              'Histórico nutricional por aluno',
              'Integrado ao perfil de bioimpedância',
            ].map(feat => (
              <li key={feat} className="flex items-center gap-3 font-body text-contrast/70 text-sm">
                <span
                  className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <path d="M2 6.5l2.5 2.5 5.5-5" />
                  </svg>
                </span>
                {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT: phone mockup ──────────────────────────────────────────── */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative" style={{ width: 260, height: 548 }}>

            {/* Ambient glow */}
            <div
              className="absolute -inset-8 rounded-full blur-3xl -z-10 opacity-15 bg-accent"
              aria-hidden="true"
            />

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
              <div
                className="absolute inset-[5px] rounded-[2.3rem] overflow-hidden flex flex-col"
                style={{ backgroundColor: '#e5ddd5' }}
              >
                {/* Status bar */}
                <div
                  className="relative flex items-center justify-between px-5 pt-3 pb-0 shrink-0"
                  style={{ backgroundColor: '#075E54' }}
                >
                  <div
                    className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[58px] h-[15px] bg-black rounded-full"
                    aria-hidden="true"
                  />
                  <span className="text-white/70 text-[9px] font-semibold z-10">9:41</span>
                  <svg viewBox="0 0 22 11" fill="none" className="w-[15px] h-[8px] z-10" aria-hidden="true">
                    <rect x=".5" y=".5" width="18" height="10" rx="2" stroke="white" strokeOpacity=".6" />
                    <rect x="1.5" y="1.5" width="12" height="8" rx="1.2" fill="white" fillOpacity=".6" />
                    <path d="M20 3.5v4" stroke="white" strokeOpacity=".6" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Chat header */}
                <div
                  className="px-3 py-2 flex items-center gap-2 shrink-0"
                  style={{ backgroundColor: '#075E54' }}
                >
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">IA</span>
                  </div>
                  <div>
                    <div className="text-white text-[10px] font-bold">IA Fit</div>
                    <div className="text-white/55 text-[8px]">online</div>
                  </div>
                </div>

                {/* Message list */}
                <div
                  ref={listRef}
                  className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1.5"
                >
                  {messages.map(msg => (
                    <Bubble key={msg.id} msg={msg} meals={MEALS} />
                  ))}
                  {isTyping && <TypingDots />}
                </div>

                {/* Input area */}
                <div
                  className="shrink-0"
                  style={{ backgroundColor: '#f0f0f0', borderTop: '1px solid rgba(0,0,0,0.08)' }}
                >
                  {simState === 'IDLE' && (
                    <div className="p-2">
                      <p className="text-[7.5px] text-gray-400 text-center mb-1.5 font-semibold uppercase tracking-wide">
                        Escolha uma refeição
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {MEALS.map(meal => (
                          <button
                            key={meal.id}
                            onClick={() => selectMeal(meal)}
                            aria-label={meal.label}
                            className="flex flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 transition-transform active:scale-95"
                            style={{ background: meal.gradient }}
                          >
                            <span className="text-[22px] leading-none">{meal.emoji}</span>
                            <span className="text-white text-[7px] font-semibold text-center leading-tight px-0.5 mt-0.5">
                              {meal.label}
                            </span>
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
                        Não
                      </button>
                    </div>
                  )}

                  {simState === 'FINAL' && (
                    <div className="p-2">
                      <button
                        onClick={reset}
                        className="w-full py-2.5 rounded-xl text-[10px] font-bold text-white uppercase tracking-wider transition-transform active:scale-95 bg-accent"
                      >
                        ↺ Recomeçar
                      </button>
                    </div>
                  )}
                </div>

                {/* Home indicator */}
                <div
                  className="flex justify-center pb-2 pt-0.5 shrink-0"
                  style={{ backgroundColor: '#f0f0f0' }}
                >
                  <div className="w-12 h-0.75 rounded-full bg-black/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
