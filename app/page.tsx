'use client'

import { useState, useCallback } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScenarioSelector } from '@/components/simulator/ScenarioSelector'
import { InputPanel } from '@/components/simulator/InputPanel'
import { KpiCards } from '@/components/simulator/KpiCards'
import { RiskAlerts } from '@/components/simulator/RiskAlerts'
import { PLTable } from '@/components/simulator/PLTable'
import { InvestorSummary } from '@/components/simulator/InvestorSummary'
import { PerMealBreakdown } from '@/components/simulator/PerMealBreakdown'
import { calcolaSimulazione, getScenario } from '@/lib/simulator-engine'
import type { ScenarioId, SimulatorInputs } from '@/lib/simulator-types'

const STORAGE_PREFIX = 'fitfast:simulator-inputs:'

function getScenarioStorageKey(id: ScenarioId) {
  return `${STORAGE_PREFIX}${id}`
}

function loadScenarioInputs(id: ScenarioId): SimulatorInputs {
  const defaults = getScenario(id).defaults

  if (typeof window === 'undefined') {
    return defaults
  }

  try {
    const saved = window.localStorage.getItem(getScenarioStorageKey(id))
    if (!saved) {
      return defaults
    }

    const parsed = JSON.parse(saved) as Partial<SimulatorInputs>
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

function saveScenarioInputs(id: ScenarioId, inputs: SimulatorInputs) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(getScenarioStorageKey(id), JSON.stringify(inputs))
}

function clearScenarioInputs(id: ScenarioId) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(getScenarioStorageKey(id))
}

export default function SimulatorePage() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('completo')
  const [inputs, setInputs] = useState<SimulatorInputs>(
    () => loadScenarioInputs('completo')
  )

  const handleScenarioChange = useCallback((id: ScenarioId) => {
    setScenarioId(id)
    setInputs(loadScenarioInputs(id))
  }, [])

  const handleInputChange = useCallback(
    (key: keyof SimulatorInputs, value: number) => {
      setInputs((prev) => {
        const next = { ...prev, [key]: value }
        saveScenarioInputs(scenarioId, next)
        return next
      })
    },
    [scenarioId]
  )

  const handleReset = useCallback(() => {
    clearScenarioInputs(scenarioId)
    setInputs(getScenario(scenarioId).defaults)
  }, [scenarioId])

  const scenario = getScenario(scenarioId)
  const results = calcolaSimulazione(inputs)

  return (
    <TooltipProvider delay={300}>
      <div className="min-h-screen bg-background">
        {/* Top header */}
        <header className="border-b border-border bg-card sticky top-0 z-30">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground text-xs font-bold">F</span>
              </div>
              <div>
                <span className="font-bold text-sm text-foreground leading-none">
                  Fit&amp;Fast
                </span>
                <span className="text-muted-foreground text-sm font-normal ml-2 hidden sm:inline">
                  Simulatore Finanziario &amp; Operativo
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden md:inline">Scenario attivo:</span>
              <span className="font-semibold text-foreground">{scenario.nome}</span>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ─── LEFT SIDEBAR: Scenario + Inputs ─────────────────────────── */}
            <aside className="w-full lg:w-80 xl:w-96 shrink-0">
              <div className="lg:sticky lg:top-20 space-y-5">
                {/* Scenario selector */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Scegli Scenario
                  </p>
                  <ScenarioSelector
                    selectedId={scenarioId}
                    onSelect={handleScenarioChange}
                  />
                </div>

                {/* Input parameters */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Parametri di Input
                    </p>
                  </div>
                  <InputPanel
                    inputs={inputs}
                    onChange={handleInputChange}
                    onReset={handleReset}
                  />
                </div>
              </div>
            </aside>

            {/* ─── MAIN CONTENT ────────────────────────────────────────────── */}
            <main className="flex-1 min-w-0 space-y-5">
              {/* Scenario title */}
              <div>
                <div className="flex flex-wrap items-start gap-3 mb-1">
                  <h1 className="text-xl font-bold text-foreground text-balance">
                    {scenario.nome}
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {scenario.descrizione}
                </p>
              </div>

              {/* KPI cards */}
              <section aria-label="Indicatori chiave di performance">
                <KpiCards results={results} inputs={inputs} />
              </section>

              {/* Risk alerts */}
              {results.risks.length > 0 && (
                <section aria-label="Segnali di rischio">
                  <div className="mb-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Segnali di Rischio
                    </p>
                  </div>
                  <RiskAlerts risks={results.risks} />
                </section>
              )}

              {results.risks.length === 0 && (
                <section aria-label="Stato scenario">
                  <RiskAlerts risks={[]} />
                </section>
              )}

              {/* Tabs: P&L, Anatomia Pasto */}
              <section aria-label="Analisi dettagliata">
                <Tabs defaultValue="pl" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="pl">Conto Economico</TabsTrigger>
                    <TabsTrigger value="pasto">Anatomia del Pasto</TabsTrigger>
                    <TabsTrigger value="operativo">Parametri Operativi</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pl">
                    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                          Conto Economico Mensile
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Proiezione mensile basata su{' '}
                          <strong className="text-foreground">
                            {inputs.pastiGiornalieriMedi} pasti/giorno
                          </strong>{' '}
                          per{' '}
                          <strong className="text-foreground">
                            {inputs.giorniOperativiMese} giorni
                          </strong>
                          . Tutti gli importi sono IVA esclusa salvo dove indicato.
                        </p>
                      </div>
                      <PLTable results={results} inputs={inputs} />
                    </div>
                  </TabsContent>

                  <TabsContent value="pasto">
                    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                      <PerMealBreakdown results={results} inputs={inputs} />
                    </div>
                  </TabsContent>

                  <TabsContent value="operativo">
                    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                      <OperativeDetails inputs={inputs} />
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              {/* Footer note */}
              <p className="text-xs text-muted-foreground pb-4">
                Tutti i dati sono simulazioni basate sui parametri inseriti e sui benchmark di riferimento Fit&amp;Fast. Non costituiscono consulenza finanziaria.
              </p>
            </main>

            {/* ─── RIGHT SIDEBAR: Investor summary ─────────────────────────── */}
            <aside className="w-full lg:w-72 xl:w-80 shrink-0">
              <div className="lg:sticky lg:top-20">
                <InvestorSummary
                  scenario={scenario}
                  results={results}
                  inputs={inputs}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

// ─── Operative details tab content ────────────────────────────────────────────
function OperativeDetails({
  inputs,
}: {
  inputs: SimulatorInputs
}) {
  const mixCustom = 100 - inputs.mixPiattiPrebilanciatiPerc

  function Status({ ok, warn, crit }: { ok: boolean; warn?: boolean; crit?: boolean }) {
    const color = crit ? 'bg-red-500' : warn ? 'bg-amber-500' : ok ? 'bg-emerald-500' : 'bg-muted'
    const label = crit ? 'Critico' : warn ? 'Attenzione' : ok ? 'OK' : '—'
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </span>
    )
  }

  interface InfoRowProps {
    label: string
    valore: string
    status?: React.ReactNode
    nota?: string
  }
  function InfoRow({ label, valore, status, nota }: InfoRowProps) {
    return (
      <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/60 last:border-0">
        <div>
          <p className="text-sm text-foreground">{label}</p>
          {nota && <p className="text-xs text-muted-foreground mt-0.5">{nota}</p>}
        </div>
        <div className="text-right shrink-0 space-y-0.5">
          <p className="text-sm font-semibold tabular-nums text-foreground">{valore}</p>
          {status}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Parametri Operativi e Menu Engineering
      </p>

      <div>
        <InfoRow
          label="Mix piatti prebilanciati"
          valore={`${inputs.mixPiattiPrebilanciatiPerc}%`}
          nota="Target ideale: 60–70%. Maggiore efficienza e minor scarto."
          status={
            <Status
              ok={inputs.mixPiattiPrebilanciatiPerc >= 60}
              warn={inputs.mixPiattiPrebilanciatiPerc < 60 && inputs.mixPiattiPrebilanciatiPerc >= 30}
              crit={inputs.mixPiattiPrebilanciatiPerc < 30}
            />
          }
        />
        <InfoRow
          label="Mix piatti personalizzati"
          valore={`${mixCustom}%`}
          nota="Soglia attenzione: >70%. Soglia critica: >80%."
          status={
            <Status
              ok={mixCustom <= 70}
              warn={mixCustom > 70 && mixCustom <= 80}
              crit={mixCustom > 80}
            />
          }
        />
        <InfoRow
          label="Tempo assemblaggio custom"
          valore={`${inputs.tempoAssemblaggioCustom} secondi`}
          nota="Target: 60–90s. Critico: >120s."
          status={
            <Status
              ok={inputs.tempoAssemblaggioCustom <= 90}
              warn={inputs.tempoAssemblaggioCustom > 90 && inputs.tempoAssemblaggioCustom <= 120}
              crit={inputs.tempoAssemblaggioCustom > 120}
            />
          }
        />
        <InfoRow
          label="Imballaggio in-store"
          valore={`€${inputs.costoImballaggio.toFixed(2)}/pasto`}
          nota="Soglia attenzione in-store: >€0.80."
          status={
            <Status
              ok={inputs.costoImballaggio <= 0.80}
              warn={inputs.costoImballaggio > 0.80}
            />
          }
        />
        {inputs.mixDeliveryPercentuale > 0 && (
          <InfoRow
            label="Imballaggio delivery extra"
            valore={`€${inputs.imballaggioDelivery.toFixed(2)}/ordine`}
            nota="Soglia attenzione delivery: >€1.10."
            status={
              <Status
                ok={inputs.imballaggioDelivery <= 1.10}
                warn={inputs.imballaggioDelivery > 1.10}
              />
            }
          />
        )}
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Principio Operativo Fit&amp;Fast
        </p>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p>
            Fit&amp;Fast non compete per varietà infinita di ingredienti, ma per{' '}
            <strong className="text-foreground">personalizzazione controllata</strong>: pochi ingredienti, alta rotazione, grammature controllate, macro trasparenti e personalizzazione guidata.
          </p>
          <p>
            I piatti prebilanciati (massa, mantenimento, dimagrimento) garantiscono throughput elevato e minor rischio di food cost. I piatti personalizzati devono rimanere entro il{' '}
            <strong className="text-foreground">30–40% del mix</strong> per mantenere un&apos;operatività sostenibile.
          </p>
          <p>
            Gli ingredienti premium (salmone, manzo, tonno, gamberetti, avocado, frutta secca) non devono mai essere inclusi nel prezzo base:{' '}
            <strong className="text-foreground">devono avere un surcharge dedicato</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
