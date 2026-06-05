'use client'

import { useEffect, useState } from 'react'

interface Props {
  endDate: string
  textColor?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(endDate: string): TimeLeft | null {
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export default function EventCountdown({ endDate, textColor }: Props) {
  const [left, setLeft] = useState<TimeLeft | null>(() => calcTimeLeft(endDate))

  useEffect(() => {
    const id = setInterval(() => {
      setLeft(calcTimeLeft(endDate))
    }, 1000)
    return () => clearInterval(id)
  }, [endDate])

  if (!left) return null

  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-sm font-semibold tabular-nums"
      style={textColor ? { color: textColor } : undefined}
      aria-label={`Termina em ${left.days} dias, ${left.hours} horas, ${left.minutes} minutos e ${left.seconds} segundos`}
    >
      {left.days > 0 && <><span>{left.days}d</span><span className="opacity-40">:</span></>}
      <span>{pad(left.hours)}h</span>
      <span className="opacity-40">:</span>
      <span>{pad(left.minutes)}m</span>
      <span className="opacity-40">:</span>
      <span>{pad(left.seconds)}s</span>
    </span>
  )
}
