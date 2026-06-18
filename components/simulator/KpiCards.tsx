'use client'

import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { SimulatorInputs, SimulatorResults } from '@/lib/simulator-types'

interface KpiCardsProps {
  results: SimulatorResults
  inputs: SimulatorInputs
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
function fmtEur(n: number, decimals = 2) {
  return `€${fmt(n, decimals)}`
}
function fmtPerc(n: number) {
  return `${fmt(n, 1)}%`
}

type KpiStatus = 'ottimo' | 'buono' | 'attenzione' | 'critico' | 'neutro'

function getStatusColor(status: KpiStatus) {
  switch (status) {
    case 'ottimo':
    case 'buono':
      return 'text-emerald-700'
    case 'attenzione':
      return 'text-amber-600'
    case 'critico':
      return 'text-red-600'
    default:
      return 'text-foreground'
  }
}

function getStatusBg(status: KpiStatus) {
  switch (status) {
    case 'ottimo':
    case 'buono':
      return 'bg-emerald-50 border-emerald-200'
    case 'attenzione':
      return 'bg-amber-50 border-amber-200'
    case 'critico':
      return 'bg-red-50 border-red-200'
    default:
      return 'bg-card border-border'
  }
}

function getProgressColor(status: KpiStatus) {
  switch (status) {
    case 'ottimo':
    case 'buono':
      return '[&>div]:bg-emerald-500'
    case 'attenzione':
      return '[&>div]:bg-amber-500'
    case 'critico':
      return '[&>div]:bg-red-500'
    default:
      return ''
  }
}

function cogsStatus(p: number): KpiStatus {
  if (p <= 33) return 'ottimo'
  if (p <= 35) return 'buono'
  if (p <= 38) return 'attenzione'
  return 'critico'
}
function primeCostStatus(p: number): KpiStatus {
  if (p <= 55) return 'ottimo'
  if (p <= 60) return 'buono'
  if (p <= 65) return 'attenzione'
  return 'critico'
}
function ebitdaStatus(p: number): KpiStatus {
  if (p < 0) return 'critico'
  if (p < 10) return 'attenzione'
  if (p < 15) return 'buono'
  return 'ottimo'
}
function breakEvenStatus(be: number): KpiStatus {
  if (be <= 60) return 'ottimo'
  if (be <= 100) return 'buono'
  if (be <= 130) return 'attenzione'
  return 'critico'
}

interface KpiCardProps {
  titolo: string
  valore: string
  sottotitolo?: string
  status: KpiStatus
  progresso?: number
  progressoMax?: number
  tooltip: string
  badge?: string
}

function KpiCard({
  titolo,
  valore,
  sottotitolo,
  status,
  progresso,
  progressoMax = 100,
  tooltip,
  badge,
}: KpiCardProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'rounded-xl border p-4 cursor-default transition-all',
            getStatusBg(status)
          )}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-xs font-medium text-muted-foreground leading-tight">
              {titolo}
            </p>
            {badge && (
              <span
                className={cn(
                  'text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0',
                  status === 'ottimo' || status === 'buono'
                    ? 'bg-emerald-100 text-emerald-700'
                    : status === 'attenzione'
                      ? 'bg-amber-100 text-amber-700'
                      : status === 'critico'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-muted text-muted-foreground'
                )}
              >
                {badge}
              </span>
            )}
          </div>
          <p
            className={cn(
              'text-2xl font-bold tabular-nums leading-none',
              getStatusColor(status)
            )}
          >
            {valore}
          </p>
          {sottotitolo && (
            <p className="text-xs text-muted-foreground mt-1">{sottotitolo}</p>
          )}
          {progresso !== undefined && (
            <div className="mt-2">
              <Progress
                value={Math.min(100, (progresso / progressoMax) * 100)}
                className={cn('h-1.5', getProgressColor(status))}
              />
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[240px] text-xs leading-relaxed">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export function KpiCards({ results, inputs }: KpiCardsProps) {
  const cogsSt = cogsStatus(results.cogsPercentuale)
  const primeSt = primeCostStatus(results.primeCostPercentuale)
  const ebitdaSt = ebitdaStatus(results.ebitdaMarginPerc)
  const beSt = breakEvenStatus(results.breakEvenPastiGiorno)

  const cogsLabel =
    cogsSt === 'ottimo' ? 'Ottimo'
    : cogsSt === 'buono' ? 'Buono'
    : cogsSt === 'attenzione' ? 'Attenzione'
    : 'Critico'

  const primeLabel =
    primeSt === 'ottimo' ? 'Ottimo'
    : primeSt === 'buono' ? 'Buono'
    : primeSt === 'attenzione' ? 'Attenzione'
    : 'Critico'

  const ebitdaLabel =
    ebitdaSt === 'critico' ? 'Critico'
    : ebitdaSt === 'attenzione' ? 'Alto rischio'
    : ebitdaSt === 'buono' ? 'Buono'
    : 'Ottimo'

  const beLabel =
    beSt === 'ottimo' ? 'Raggiungibile'
    : beSt === 'buono' ? 'Moderato'
    : beSt === 'attenzione' ? 'Difficile'
    : 'Alto rischio'

  const pastiMensili = inputs.pastiGiornalieriMedi * inputs.giorniOperativiMese

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <KpiCard
        titolo="Ricavo Netto/Pasto"
        valore={fmtEur(results.ricavoNettoPerPasto)}
        sottotitolo={`Lordo: ${fmtEur(inputs.prezzoLordoCliente)} · IVA: ${fmtPerc(inputs.ivaPercentuale)}`}
        status="neutro"
        tooltip="Ricavo netto per singolo pasto, al netto dell'IVA. Formula: Prezzo lordo ÷ (1 + IVA%)."
      />
      <KpiCard
        titolo="COGS Effettivo"
        valore={fmtPerc(results.cogsPercentuale)}
        sottotitolo={`${fmtEur(results.cogsEffettivoPerPasto)}/pasto · Target ≤35%`}
        status={cogsSt}
        progresso={results.cogsPercentuale}
        progressoMax={50}
        badge={cogsLabel}
        tooltip="Costo del venduto effettivo (ingredienti + scarto + imballaggio medio) sul ricavo netto. Target zona sana: 30–33%."
      />
      <KpiCard
        titolo="Prime Cost"
        valore={fmtPerc(results.primeCostPercentuale)}
        sottotitolo={`${fmtEur(results.primeCostPerPasto)}/pasto · Target ≤65%`}
        status={primeSt}
        progresso={results.primeCostPercentuale}
        progressoMax={80}
        badge={primeLabel}
        tooltip="Prime cost = ingredienti + scarto + lavoro. Il limite massimo consigliato è 65% del ricavo netto."
      />
      <KpiCard
        titolo="Margine EBITDA"
        valore={fmtPerc(results.ebitdaMarginPerc)}
        sottotitolo={`${fmtEur(results.ebitdaMensile)}/mese`}
        status={ebitdaSt}
        progresso={Math.max(0, results.ebitdaMarginPerc)}
        progressoMax={30}
        badge={ebitdaLabel}
        tooltip="Margine EBITDA mensile sul ricavo netto aggiustato. Target minimo: 10%. Sotto 0 = modello insostenibile."
      />
      <KpiCard
        titolo="Ricavo Netto Mensile"
        valore={fmtEur(results.ricavoNettoPremiumAdjusted, 0)}
        sottotitolo={`${pastiMensili.toLocaleString('it-IT')} pasti/mese`}
        status="neutro"
        tooltip="Ricavo netto mensile totale inclusi i ricavi extra da ingredienti premium e proteine aggiuntive."
      />
      <KpiCard
        titolo="COGS Totale Mensile"
        valore={fmtEur(results.cogsEffettivoPerPasto * pastiMensili, 0)}
        sottotitolo={`Delivery: ${fmtEur(results.impactoDeliveryMensile, 0)}`}
        status={cogsSt}
        tooltip="Costo totale del venduto mensile (COGS × pasti). Include anche l'impatto costi delivery separato."
      />
      <KpiCard
        titolo="Margine Contributivo"
        valore={fmtPerc(results.margineContributivoPerc)}
        sottotitolo={`${fmtEur(results.margineContributivo, 0)}/mese`}
        status={results.margineContributivo > 0 ? 'buono' : 'critico'}
        tooltip="Ricavo netto premium − COGS − costi delivery. Mostra quanto resta per coprire i costi fissi."
      />
      <KpiCard
        titolo="Break-even Giornaliero"
        valore={`${results.breakEvenPastiGiorno.toFixed(0)} pasti`}
        sottotitolo={`Target attuale: ${inputs.pastiGiornalieriMedi} pasti/g`}
        status={beSt}
        progresso={Math.min(results.breakEvenPastiGiorno, 150)}
        progressoMax={150}
        badge={beLabel}
        tooltip="Numero minimo di pasti al giorno per coprire tutti i costi fissi. Sopra 130 pasti = alto rischio per il primo punto vendita."
      />
    </div>
  )
}
