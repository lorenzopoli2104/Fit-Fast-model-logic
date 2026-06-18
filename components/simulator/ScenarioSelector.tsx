'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { SCENARI } from '@/lib/simulator-engine'
import type { ScenarioId } from '@/lib/simulator-types'

interface ScenarioSelectorProps {
  selectedId: ScenarioId
  onSelect: (id: ScenarioId) => void
}

export function ScenarioSelector({ selectedId, onSelect }: ScenarioSelectorProps) {
  const fisici = SCENARI.filter((s) => !s.isDarkKitchen)
  const dark = SCENARI.filter((s) => s.isDarkKitchen)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Negozio Fisico
        </p>
        <div className="grid grid-cols-1 gap-2">
          {fisici.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              selected={selectedId === s.id}
              onSelect={() => onSelect(s.id)}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Dark Kitchen
        </p>
        <div className="grid grid-cols-1 gap-2">
          {dark.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              selected={selectedId === s.id}
              onSelect={() => onSelect(s.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ScenarioCard({
  scenario,
  selected,
  onSelect,
}: {
  scenario: (typeof SCENARI)[0]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-lg border px-4 py-3 transition-all duration-150',
        'hover:border-primary/50 hover:bg-primary/5',
        selected
          ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
          : 'border-border bg-card'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            'text-sm font-semibold leading-tight',
            selected ? 'text-primary' : 'text-foreground'
          )}
        >
          {scenario.nome}
        </span>
        <Badge
          variant="outline"
          className={cn(
            'shrink-0 text-[10px] font-medium',
            scenario.isDarkKitchen
              ? 'border-amber-400/60 text-amber-600 bg-amber-50'
              : 'border-primary/30 text-primary bg-primary/5'
          )}
        >
          {scenario.tag}
        </Badge>
      </div>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {scenario.descrizione}
      </p>
    </button>
  )
}
