'use client'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import type { SimulatorInputs, SimulatorResults } from '@/lib/simulator-types'

interface PLTableProps {
  results: SimulatorResults
  inputs: SimulatorInputs
}

function fmtEur(n: number, decimals = 0) {
  return n.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
function fmtPerc(n: number) {
  return `${n.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
}

interface RowProps {
  label: string
  importo: number
  percentuale?: number
  indent?: boolean
  bold?: boolean
  positive?: boolean
  negative?: boolean
  separator?: boolean
  highlight?: 'green' | 'amber' | 'red' | 'blue'
}

function Row({
  label,
  importo,
  percentuale,
  indent = false,
  bold = false,
  positive,
  negative,
  highlight,
}: RowProps) {
  const isNeg = importo < 0 || negative
  const isPos = importo > 0 && positive

  return (
    <tr
      className={cn(
        'border-b border-border/50 last:border-0',
        highlight === 'green' && 'bg-emerald-50',
        highlight === 'amber' && 'bg-amber-50',
        highlight === 'red' && 'bg-red-50',
        highlight === 'blue' && 'bg-primary/5',
      )}
    >
      <td
        className={cn(
          'py-2.5 pr-4 text-sm',
          indent ? 'pl-6' : 'pl-1',
          bold ? 'font-semibold' : 'font-normal',
          'text-foreground'
        )}
      >
        {label}
      </td>
      <td
        className={cn(
          'py-2.5 text-right text-sm tabular-nums',
          bold ? 'font-semibold' : 'font-normal',
          isNeg ? 'text-red-600' : isPos ? 'text-emerald-600' : 'text-foreground'
        )}
      >
        {fmtEur(importo)}
      </td>
      <td className="py-2.5 text-right text-sm text-muted-foreground tabular-nums pl-4 w-24">
        {percentuale !== undefined ? fmtPerc(percentuale) : '—'}
      </td>
    </tr>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <tr>
      <td
        colSpan={3}
        className="pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground pl-1"
      >
        {label}
      </td>
    </tr>
  )
}

export function PLTable({ results, inputs }: PLTableProps) {
  const pastiMensili = inputs.pastiGiornalieriMedi * inputs.giorniOperativiMese
  const nettoBase = results.ricavoNettoPerPasto * pastiMensili
  const extraPremium = results.ricavoNettoPremiumAdjusted - nettoBase
  const cogsMensile = results.cogsEffettivoPerPasto * pastiMensili
  const costoLavoro = inputs.costoLavoro
  const costiFissiTotali = costoLavoro + inputs.affittoMensile + inputs.altriCostiFissi
  const costoScarto = results.costoScartoEffettivo * pastiMensili

  // Per-pasto breakdown
  const imballaggioMedioPerPasto =
    inputs.costoImballaggio +
    (inputs.mixDeliveryPercentuale / 100) * inputs.imballaggioDelivery
  const imballaggioMensile = imballaggioMedioPerPasto * pastiMensili

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full min-w-[400px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground pb-2 pl-1">
              Voce
            </th>
            <th className="text-right text-xs font-semibold uppercase tracking-widest text-muted-foreground pb-2">
              Importo/Mese
            </th>
            <th className="text-right text-xs font-semibold uppercase tracking-widest text-muted-foreground pb-2 pl-4 w-24">
              % Ricavo
            </th>
          </tr>
        </thead>
        <tbody>
          {/* RICAVI */}
          <SectionHeader label="Ricavi" />
          <Row
            label="Ricavo lordo cliente"
            importo={results.ricavoLordoMensile}
            indent
          />
          <Row
            label="IVA (a debito)"
            importo={-(results.ricavoLordoMensile - nettoBase)}
            indent
            negative
          />
          <Row
            label="Ricavo netto (IVA esclusa)"
            importo={nettoBase}
            percentuale={100}
            bold
          />
          <Row
            label="Extra ricavi premium/proteine"
            importo={extraPremium}
            percentuale={(extraPremium / results.ricavoNettoPremiumAdjusted) * 100}
            indent
            positive={extraPremium > 0}
          />
          <Row
            label="Ricavo netto totale rettificato"
            importo={results.ricavoNettoPremiumAdjusted}
            percentuale={100}
            bold
            highlight="blue"
          />

          {/* COGS */}
          <SectionHeader label="Costo del Venduto (COGS)" />
          <Row
            label="Costo ingredienti"
            importo={-(inputs.costoIngredienti * pastiMensili)}
            percentuale={(inputs.costoIngredienti / results.ricavoNettoPerPasto) * 100}
            indent
            negative
          />
          <Row
            label="Costo scarto ingredienti"
            importo={-costoScarto}
            percentuale={(results.costoScartoEffettivo / results.ricavoNettoPerPasto) * 100}
            indent
            negative
          />
          <Row
            label="Costo imballaggio (medio)"
            importo={-imballaggioMensile}
            percentuale={(imballaggioMedioPerPasto / results.ricavoNettoPerPasto) * 100}
            indent
            negative
          />
          <Row
            label="COGS effettivo totale"
            importo={-cogsMensile}
            percentuale={results.cogsPercentuale}
            bold
            negative
            highlight={
              results.cogsPercentuale > 38 ? 'red'
              : results.cogsPercentuale > 35 ? 'amber'
              : undefined
            }
          />

          {/* DELIVERY */}
          <SectionHeader label="Costi Delivery" />
          <Row
            label="Commissioni piattaforme delivery"
            importo={-results.impactoDeliveryMensile}
            percentuale={(results.impactoDeliveryMensile / results.ricavoNettoPremiumAdjusted) * 100}
            indent
            negative
          />

          {/* MARGINE CONTRIBUTIVO */}
          <tr>
            <td colSpan={3} className="pt-2 pb-1">
              <div className="h-px bg-border" />
            </td>
          </tr>
          <Row
            label="Margine Contributivo"
            importo={results.margineContributivo}
            percentuale={results.margineContributivoPerc}
            bold
            positive={results.margineContributivo > 0}
            negative={results.margineContributivo <= 0}
            highlight={results.margineContributivo > 0 ? 'green' : 'red'}
          />

          {/* COSTI FISSI */}
          <SectionHeader label="Costi Fissi" />
          <Row
            label="Costo del lavoro"
            importo={-costoLavoro}
            percentuale={(costoLavoro / results.ricavoNettoPremiumAdjusted) * 100}
            indent
            negative
          />
          <Row
            label="Affitto"
            importo={-inputs.affittoMensile}
            percentuale={(inputs.affittoMensile / results.ricavoNettoPremiumAdjusted) * 100}
            indent
            negative
          />
          <Row
            label="Altri costi fissi"
            importo={-inputs.altriCostiFissi}
            percentuale={(inputs.altriCostiFissi / results.ricavoNettoPremiumAdjusted) * 100}
            indent
            negative
          />
          <Row
            label="Totale costi fissi"
            importo={-costiFissiTotali}
            percentuale={(costiFissiTotali / results.ricavoNettoPremiumAdjusted) * 100}
            bold
            negative
          />

          {/* EBITDA */}
          <tr>
            <td colSpan={3} className="pt-2 pb-1">
              <div className="h-px bg-border" />
            </td>
          </tr>
          <Row
            label="EBITDA Mensile"
            importo={results.ebitdaMensile}
            percentuale={results.ebitdaMarginPerc}
            bold
            positive={results.ebitdaMensile > 0}
            negative={results.ebitdaMensile <= 0}
            highlight={
              results.ebitdaMensile < 0 ? 'red'
              : results.ebitdaMarginPerc < 10 ? 'amber'
              : 'green'
            }
          />
        </tbody>
      </table>
    </div>
  )
}
