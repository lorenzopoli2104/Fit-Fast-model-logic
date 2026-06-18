'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { SimulatorInputs } from '@/lib/simulator-types'

interface InputPanelProps {
  inputs: SimulatorInputs
  onChange: (key: keyof SimulatorInputs, value: number) => void
  onReset: () => void
}

interface FieldDef {
  key: keyof SimulatorInputs
  label: string
  unit: string
  min: number
  max: number
  step: number
  tooltip: string
}

const SEZIONI: { titolo: string; campi: FieldDef[] }[] = [
  {
    titolo: 'Prezzi e IVA',
    campi: [
      { key: 'prezzoLordoCliente', label: 'Prezzo lordo cliente', unit: '€', min: 8, max: 30, step: 0.10, tooltip: 'Prezzo pagato dal cliente IVA inclusa.' },
      { key: 'ivaPercentuale', label: 'Aliquota IVA', unit: '%', min: 4, max: 22, step: 1, tooltip: 'Aliquota IVA applicata. Default 10% per alimenti.' },
    ],
  },
  {
    titolo: 'Costi Ingredienti e Imballaggio',
    campi: [
      { key: 'costoIngredienti', label: 'Costo ingredienti/pasto', unit: '€', min: 0.50, max: 10, step: 0.05, tooltip: 'Costo medio ingredienti per singolo pasto, IVA esclusa.' },
      { key: 'costoImballaggio', label: 'Imballaggio in-store/pasto', unit: '€', min: 0.10, max: 2.00, step: 0.05, tooltip: 'Costo imballaggio per pasto consumato in sede o asporto standard.' },
      { key: 'percentualeScarto', label: 'Scarto ingredienti', unit: '%', min: 1, max: 20, step: 0.5, tooltip: 'Percentuale di scarto applicata al costo ingredienti. Include sprechi, errori di grammatura e produzione eccessiva.' },
    ],
  },
  {
    titolo: 'Costi Fissi Mensili',
    campi: [
      { key: 'costoLavoro', label: 'Costo del lavoro mensile', unit: '€', min: 1000, max: 30000, step: 100, tooltip: 'Costo totale del personale mensile, inclusi contributi e oneri.' },
      { key: 'affittoMensile', label: 'Affitto mensile', unit: '€', min: 0, max: 10000, step: 50, tooltip: 'Canone di locazione mensile. Per dark kitchen è solitamente molto inferiore.' },
      { key: 'altriCostiFissi', label: 'Altri costi fissi mensili', unit: '€', min: 0, max: 10000, step: 50, tooltip: 'Utenze, software, marketing fisso, assicurazioni e altri costi fissi mensili.' },
    ],
  },
  {
    titolo: 'Volume Operativo',
    campi: [
      { key: 'pastiGiornalieriMedi', label: 'Pasti al giorno (media)', unit: 'pasti', min: 10, max: 500, step: 5, tooltip: 'Numero medio di pasti venduti al giorno.' },
      { key: 'giorniOperativiMese', label: 'Giorni operativi/mese', unit: 'giorni', min: 15, max: 31, step: 1, tooltip: 'Numero di giorni di apertura al mese.' },
    ],
  },
  {
    titolo: 'Delivery',
    campi: [
      { key: 'mixDeliveryPercentuale', label: 'Mix delivery', unit: '%', min: 0, max: 100, step: 5, tooltip: 'Percentuale degli ordini totali gestita via delivery (es. piattaforme di consegna).' },
      { key: 'commissioneDelivery', label: 'Commissione delivery/ordine', unit: '€', min: 0, max: 8, step: 0.10, tooltip: 'Commissione media pagata alla piattaforma di delivery per ogni ordine. Di solito 25–30% del valore o €3.00–€3.50.' },
      { key: 'imballaggioDelivery', label: 'Imballaggio extra delivery', unit: '€', min: 0, max: 3, step: 0.05, tooltip: 'Costo aggiuntivo di imballaggio per gli ordini delivery rispetto al canale in-store.' },
    ],
  },
  {
    titolo: 'Mix Menu e Operazioni',
    campi: [
      { key: 'mixPiattiPrebilanciatiPerc', label: 'Mix piatti prebilanciati', unit: '%', min: 0, max: 100, step: 5, tooltip: 'Percentuale di ordini con piatti prebilanciati rispetto ai piatti completamente personalizzati. Più alto = maggiore efficienza operativa.' },
      { key: 'tempoAssemblaggioCustom', label: 'Tempo assemblaggio custom', unit: 'sec', min: 30, max: 200, step: 5, tooltip: 'Tempo medio di assemblaggio in secondi per un piatto completamente personalizzato. Target: 60–90s. Oltre 120s = rischio critico.' },
    ],
  },
  {
    titolo: 'Ingredienti Premium e Surcharghe',
    campi: [
      { key: 'surchargeIngredientiPremium', label: 'Surcharge ingredienti premium', unit: '€', min: 0, max: 5, step: 0.10, tooltip: 'Prezzo extra applicato per ingredienti premium (salmone, manzo, tonno, gamberetti, avocado, frutta secca). Obbligatorio per sostenere il food cost.' },
      { key: 'surchargeProteineExtra', label: 'Surcharge proteina extra', unit: '€', min: 0, max: 5, step: 0.10, tooltip: 'Prezzo extra per porzione aggiuntiva di proteine.' },
      { key: 'percentualeOrdiniPremium', label: '% ordini con premium', unit: '%', min: 0, max: 100, step: 5, tooltip: 'Percentuale degli ordini totali che include ingredienti premium o extra proteine. Influenza il ricavo medio per pasto.' },
    ],
  },
]

export function InputPanel({ inputs, onChange, onReset }: InputPanelProps) {
  return (
    <div className="space-y-5">
      {SEZIONI.map((sezione, idx) => (
        <div key={sezione.titolo}>
          {idx > 0 && <Separator className="mb-4" />}
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            {sezione.titolo}
          </p>
          <div className="space-y-3">
            {sezione.campi.map((campo) => (
              <FieldRow
                key={campo.key}
                campo={campo}
                value={inputs[campo.key] as number}
                onChange={(v) => onChange(campo.key, v)}
              />
            ))}
          </div>
        </div>
      ))}

      <Separator />
      <button
        onClick={onReset}
        className="w-full rounded-md border border-border bg-card py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        Ripristina valori predefiniti scenario
      </button>
    </div>
  )
}

function FieldRow({
  campo,
  value,
  onChange,
}: {
  campo: FieldDef
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Label
              htmlFor={campo.key}
              className="text-xs text-foreground cursor-help inline-flex items-center gap-1 truncate"
            >
              {campo.label}
              <span className="text-muted-foreground text-[10px]">ⓘ</span>
            </Label>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[220px] text-xs leading-relaxed">
            {campo.tooltip}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Input
          id={campo.key}
          type="number"
          min={campo.min}
          max={campo.max}
          step={campo.step}
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value)
            if (!isNaN(v)) onChange(Math.min(campo.max, Math.max(campo.min, v)))
          }}
          className="h-8 w-24 text-right text-sm tabular-nums"
        />
        <span className="text-xs text-muted-foreground w-8 shrink-0">{campo.unit}</span>
      </div>
    </div>
  )
}
