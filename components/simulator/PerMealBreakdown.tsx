'use client'

import { cn } from '@/lib/utils'
import type { SimulatorInputs, SimulatorResults } from '@/lib/simulator-types'

interface PerMealBreakdownProps {
  results: SimulatorResults
  inputs: SimulatorInputs
}

function fmtEur(n: number) {
  return n.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

interface BarRowProps {
  label: string
  valore: number
  totale: number
  color: string
}

function BarRow({ label, valore, totale, color }: BarRowProps) {
  const pct = Math.min(100, (Math.abs(valore) / totale) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="w-36 shrink-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
      </div>
      <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${pct}%` }}
          aria-label={`${pct.toFixed(1)}%`}
        />
      </div>
      <div className="w-20 shrink-0 text-right">
        <p className="text-xs tabular-nums font-medium text-foreground">{fmtEur(valore)}</p>
      </div>
    </div>
  )
}

export function PerMealBreakdown({ results, inputs }: PerMealBreakdownProps) {
  const lordo = inputs.prezzoLordoCliente
  const iva = lordo - results.ricavoNettoPerPasto
  const netto = results.ricavoNettoPerPasto

  const imballaggioMedioPerPasto =
    inputs.costoImballaggio +
    (inputs.mixDeliveryPercentuale / 100) * inputs.imballaggioDelivery

  const deliveryPerPasto =
    results.commissioneDeliveryPerOrdine * (inputs.mixDeliveryPercentuale / 100)

  const costoLavoroPerPasto = inputs.costoLavoro / (inputs.pastiGiornalieriMedi * inputs.giorniOperativiMese)
  const altriCostiPerPasto =
    (inputs.affittoMensile + inputs.altriCostiFissi) /
    (inputs.pastiGiornalieriMedi * inputs.giorniOperativiMese)

  const utilePerPasto =
    netto -
    results.cogsEffettivoPerPasto -
    deliveryPerPasto -
    costoLavoroPerPasto -
    altriCostiPerPasto

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Anatomia di 1 Pasto (€ per pasto)
      </p>

      {/* Price stack */}
      <div className="space-y-2 pt-1">
        <BarRow label="Prezzo lordo cliente" valore={lordo} totale={lordo} color="bg-primary/30" />
        <BarRow label="IVA (a debito stato)" valore={iva} totale={lordo} color="bg-muted-foreground/30" />
        <BarRow label="Ricavo netto azienda" valore={netto} totale={lordo} color="bg-primary/70" />
      </div>

      <div className="h-px bg-border my-2" />

      {/* Cost breakdown */}
      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Composizione del costo per pasto</p>
      <div className="space-y-2">
        <BarRow label="Ingredienti" valore={inputs.costoIngredienti} totale={netto} color="bg-amber-400" />
        <BarRow label="Scarto ingredienti" valore={results.costoScartoEffettivo} totale={netto} color="bg-amber-600" />
        <BarRow label="Imballaggio (medio)" valore={imballaggioMedioPerPasto} totale={netto} color="bg-sky-400" />
        <BarRow label="Commissioni delivery" valore={deliveryPerPasto} totale={netto} color="bg-orange-400" />
        <BarRow label="Quota lavoro" valore={costoLavoroPerPasto} totale={netto} color="bg-violet-400" />
        <BarRow label="Quota costi fissi" valore={altriCostiPerPasto} totale={netto} color="bg-slate-400" />
        <div className="h-px bg-border my-1" />
        <BarRow
          label={utilePerPasto >= 0 ? "Utile operativo/pasto" : "Perdita/pasto"}
          valore={Math.abs(utilePerPasto)}
          totale={netto}
          color={utilePerPasto >= 0 ? "bg-emerald-500" : "bg-red-500"}
        />
      </div>

      {/* Summary pill */}
      <div className={cn(
        "mt-3 rounded-lg px-4 py-2.5 flex items-center justify-between",
        utilePerPasto >= 0 ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"
      )}>
        <p className="text-xs text-muted-foreground">Utile operativo per pasto</p>
        <p className={cn(
          "text-base font-bold tabular-nums",
          utilePerPasto >= 0 ? "text-emerald-700" : "text-red-700"
        )}>
          {fmtEur(utilePerPasto)}
        </p>
      </div>
    </div>
  )
}
