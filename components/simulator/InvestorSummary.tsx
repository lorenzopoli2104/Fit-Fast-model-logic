'use client'

import { cn } from '@/lib/utils'
import type { SimulatorInputs, SimulatorResults } from '@/lib/simulator-types'
import type { ScenarioConfig } from '@/lib/simulator-types'

interface InvestorSummaryProps {
  scenario: ScenarioConfig
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

function MetricRow({
  label,
  valore,
  sub,
  status,
}: {
  label: string
  valore: string
  sub?: string
  status?: 'ok' | 'warning' | 'danger'
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border/60 last:border-0">
      <span className="text-sm text-muted-foreground leading-snug">{label}</span>
      <div className="text-right shrink-0">
        <span
          className={cn(
            'text-sm font-semibold tabular-nums',
            status === 'ok' ? 'text-emerald-700'
            : status === 'warning' ? 'text-amber-600'
            : status === 'danger' ? 'text-red-600'
            : 'text-foreground'
          )}
        >
          {valore}
        </span>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function InvestorSummary({ scenario, results, inputs }: InvestorSummaryProps) {
  const pastiMensili = inputs.pastiGiornalieriMedi * inputs.giorniOperativiMese
  const ebitdaAnnuo = results.ebitdaMensile * 12
  const ricavoAnnuo = results.ricavoNettoPremiumAdjusted * 12

  const cogsStatus =
    results.cogsPercentuale > 38 ? 'danger'
    : results.cogsPercentuale > 35 ? 'warning'
    : 'ok'

  const primeStatus =
    results.primeCostPercentuale > 65 ? 'danger'
    : results.primeCostPercentuale > 60 ? 'warning'
    : 'ok'

  const ebitdaStatus =
    results.ebitdaMarginPerc < 0 ? 'danger'
    : results.ebitdaMarginPerc < 10 ? 'warning'
    : 'ok'

  const beStatus =
    results.breakEvenPastiGiorno > 130 ? 'danger'
    : results.breakEvenPastiGiorno > 100 ? 'warning'
    : 'ok'

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70 mb-1">
          Riepilogo per Investitori
        </p>
        <h3 className="text-lg font-bold text-primary-foreground leading-tight">
          {scenario.nome}
        </h3>
        <p className="text-xs text-primary-foreground/70 mt-0.5">{scenario.tag}</p>
      </div>

      <div className="p-5 space-y-1">
        {/* Pricing */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1 mt-1">
          Struttura Prezzi
        </p>
        <MetricRow
          label="Prezzo lordo cliente"
          valore={fmtEur(inputs.prezzoLordoCliente, 2)}
          sub={`IVA ${fmtPerc(inputs.ivaPercentuale)} inclusa`}
        />
        <MetricRow
          label="Ricavo netto per pasto"
          valore={fmtEur(results.ricavoNettoPerPasto, 2)}
          sub="IVA esclusa"
        />

        {/* Volume */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1 mt-3">
          Volume Operativo
        </p>
        <MetricRow
          label="Pasti al giorno"
          valore={`${inputs.pastiGiornalieriMedi} pasti`}
          sub={`${inputs.giorniOperativiMese} giorni/mese`}
        />
        <MetricRow
          label="Pasti mensili totali"
          valore={pastiMensili.toLocaleString('it-IT')}
        />
        <MetricRow
          label="Ricavo netto annuo stimato"
          valore={fmtEur(ricavoAnnuo)}
        />

        {/* Food cost */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1 mt-3">
          Food Cost e Costi
        </p>
        <MetricRow
          label="COGS effettivo / pasto"
          valore={fmtEur(results.cogsEffettivoPerPasto, 2)}
          sub={`${fmtPerc(results.cogsPercentuale)} del ricavo netto`}
          status={cogsStatus}
        />
        <MetricRow
          label="Prime cost %"
          valore={fmtPerc(results.primeCostPercentuale)}
          sub={`Max consigliato: 65%`}
          status={primeStatus}
        />
        <MetricRow
          label="Scarto ingredienti"
          valore={fmtPerc(inputs.percentualeScarto)}
          sub={`${fmtEur(results.costoScartoEffettivo, 2)}/pasto`}
        />

        {/* Delivery */}
        {inputs.mixDeliveryPercentuale > 0 && (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1 mt-3">
              Canale Delivery
            </p>
            <MetricRow
              label="Mix delivery"
              valore={fmtPerc(inputs.mixDeliveryPercentuale)}
              status={inputs.mixDeliveryPercentuale > 40 && inputs.mixDeliveryPercentuale < 100 ? 'warning' : undefined}
            />
            <MetricRow
              label="Commissione delivery"
              valore={fmtEur(inputs.commissioneDelivery, 2)}
              sub="per ordine"
            />
            <MetricRow
              label="Impatto delivery mensile"
              valore={fmtEur(results.impactoDeliveryMensile)}
            />
          </>
        )}

        {/* P&L */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1 mt-3">
          Performance Economica
        </p>
        <MetricRow
          label="Margine contributivo"
          valore={fmtPerc(results.margineContributivoPerc)}
          sub={fmtEur(results.margineContributivo)}
          status={results.margineContributivo > 0 ? 'ok' : 'danger'}
        />
        <MetricRow
          label="EBITDA mensile"
          valore={fmtEur(results.ebitdaMensile)}
          sub={`Margine: ${fmtPerc(results.ebitdaMarginPerc)}`}
          status={ebitdaStatus}
        />
        <MetricRow
          label="EBITDA annuo stimato"
          valore={fmtEur(ebitdaAnnuo)}
          status={ebitdaStatus}
        />
        <MetricRow
          label="Break-even giornaliero"
          valore={
            Number.isFinite(results.breakEvenPastiGiorno)
              ? `${results.breakEvenPastiGiorno.toFixed(0)} pasti/g`
              : 'Non raggiungibile'
          }
          sub={`Attuale target: ${inputs.pastiGiornalieriMedi} pasti/g`}
          status={beStatus}
        />

        {/* Operational */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1 mt-3">
          Parametri Operativi
        </p>
        <MetricRow
          label="Mix piatti prebilanciati"
          valore={fmtPerc(inputs.mixPiattiPrebilanciatiPerc)}
        />
        <MetricRow
          label="Mix piatti personalizzati"
          valore={fmtPerc(100 - inputs.mixPiattiPrebilanciatiPerc)}
          status={100 - inputs.mixPiattiPrebilanciatiPerc > 70 ? 'warning' : undefined}
        />
        <MetricRow
          label="Tempo assemblaggio custom"
          valore={`${inputs.tempoAssemblaggioCustom}s`}
          status={inputs.tempoAssemblaggioCustom > 120 ? 'danger' : inputs.tempoAssemblaggioCustom > 90 ? 'warning' : 'ok'}
        />

        {/* Risk count */}
        {results.risks.length > 0 && (
          <div className={cn(
            'mt-4 rounded-lg px-4 py-3 border',
            results.risks.some(r => r.livello === 'critico')
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          )}>
            <p className={cn(
              'text-sm font-semibold',
              results.risks.some(r => r.livello === 'critico') ? 'text-red-700' : 'text-amber-700'
            )}>
              {results.risks.filter(r => r.livello === 'critico').length} segnale/i critico/i
              {' · '}
              {results.risks.filter(r => r.livello === 'attenzione').length} di attenzione
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consultare la sezione &quot;Segnali di Rischio&quot; per i dettagli.
            </p>
          </div>
        )}

        {results.risks.length === 0 && (
          <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-700">
              Modello nei parametri di riferimento
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tutti gli indicatori rientrano nelle soglie Fit&amp;Fast.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
