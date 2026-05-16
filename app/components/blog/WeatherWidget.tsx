'use client'

import { useEffect, useState } from 'react'

type WeatherState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ok'; temp: number; code: number; city: string; time: string; date: string }

const WMO: Record<number, { label: string; emoji: string }> = {
  0:  { label: 'Céu limpo',           emoji: '☀️'  },
  1:  { label: 'Principalmente limpo', emoji: '🌤️' },
  2:  { label: 'Parcialmente nublado', emoji: '⛅'  },
  3:  { label: 'Nublado',             emoji: '☁️'  },
  45: { label: 'Neblina',             emoji: '🌫️' },
  48: { label: 'Neblina com gelo',    emoji: '🌫️' },
  51: { label: 'Garoa fraca',         emoji: '🌦️' },
  53: { label: 'Garoa moderada',      emoji: '🌦️' },
  55: { label: 'Garoa intensa',       emoji: '🌧️' },
  61: { label: 'Chuva fraca',         emoji: '🌧️' },
  63: { label: 'Chuva moderada',      emoji: '🌧️' },
  65: { label: 'Chuva forte',         emoji: '🌧️' },
  71: { label: 'Neve fraca',          emoji: '🌨️' },
  73: { label: 'Neve moderada',       emoji: '❄️'  },
  75: { label: 'Neve forte',          emoji: '❄️'  },
  80: { label: 'Chuva passageira',    emoji: '🌦️' },
  81: { label: 'Chuva moderada',      emoji: '🌧️' },
  82: { label: 'Chuva intensa',       emoji: '⛈️' },
  95: { label: 'Tempestade',          emoji: '⛈️' },
  99: { label: 'Tempestade c/ granizo', emoji: '⛈️' },
}

function getWmo(code: number) {
  return WMO[code] ?? { label: 'Variável', emoji: '🌡️' }
}

export default function WeatherWidget() {
  const [state, setState] = useState<WeatherState>({ status: 'loading' })

  useEffect(() => {
    if (!navigator.geolocation) {
      const setError = () => setState({ status: 'error' })
      setError()
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords
        try {
          const [wRes, gRes] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`,
            ),
            fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
              { headers: { 'Accept-Language': 'pt-BR' } },
            ),
          ])

          const w = await wRes.json()
          const g = await gRes.json()

          const city =
            g.address?.city ?? g.address?.town ?? g.address?.village ?? g.address?.state ?? 'Sua região'

          const now = new Date()
          setState({
            status: 'ok',
            temp: Math.round(w.current.temperature_2m),
            code: w.current.weather_code,
            city,
            time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            date: now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
          })
        } catch {
          setState({ status: 'error' })
        }
      },
      () => setState({ status: 'error' }),
      { timeout: 8000 },
    )
  }, [])

  if (state.status === 'error') return null

  if (state.status === 'loading') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse">
        <div className="bg-contrast h-9" />
        <div className="p-4 space-y-2">
          <div className="h-12 bg-gray-100 rounded w-28" />
          <div className="h-3 bg-gray-100 rounded w-36" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
      </div>
    )
  }

  const { temp, code, city, time, date } = state
  const { label, emoji } = getWmo(code)

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="bg-contrast px-4 py-2 flex items-center justify-between">
        <span className="font-body text-[11px] font-bold uppercase tracking-widest text-white/60">
          Previsão do Tempo
        </span>
        <span className="text-base leading-none">{emoji}</span>
      </div>
      <div className="p-4">
        <div className="flex items-end gap-3 mb-3">
          <span className="font-title text-5xl text-contrast leading-none">{temp}°</span>
          <div className="pb-0.5">
            <p className="font-body text-sm font-semibold text-contrast leading-tight">{label}</p>
            <p className="font-body text-xs text-contrast/50">{city}</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-0.5">
          <p className="font-body text-xs text-contrast/40 capitalize">{date}</p>
          <p className="font-body text-xs text-contrast/40">{time}</p>
        </div>
      </div>
    </div>
  )
}
