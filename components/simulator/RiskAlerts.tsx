'use client'

import type { RiskItem } from '@/lib/simulator-types'

interface RiskAlertsProps {
  risks: RiskItem[]
}

export function RiskAlerts({ risks }: RiskAlertsProps) {
  if (risks.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-2">
        <span className="text-emerald-600 text-base" aria-hidden>✓</span>
        <p className="text-sm text-emerald-700 font-medium">
          Nessun segnale di rischio rilevato. Il modello rientra nei parametri di riferimento Fit&amp;Fast.
        </p>
      </div>
    )
  }

  const critici = risks.filter((r) => r.livello === 'critico')
  const attenzione = risks.filter((r) => r.livello === 'attenzione')

  return (
    <div className="space-y-2">
      {critici.map((r, i) => (
        <div
          key={`critico-${i}`}
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 flex items-start gap-2"
          role="alert"
        >
          <span
            className="mt-0.5 shrink-0 rounded-full bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center"
            aria-label="Critico"
          >
            !
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700 mb-0.5">
              Rischio Critico
            </p>
            <p className="text-sm text-red-800 leading-relaxed">{r.messaggio}</p>
          </div>
        </div>
      ))}
      {attenzione.map((r, i) => (
        <div
          key={`attenzione-${i}`}
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 flex items-start gap-2"
          role="alert"
        >
          <span
            className="mt-0.5 shrink-0 rounded-full bg-amber-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center"
            aria-label="Attenzione"
          >
            ▲
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-0.5">
              Attenzione
            </p>
            <p className="text-sm text-amber-800 leading-relaxed">{r.messaggio}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
