'use client'

import { cn } from '@/lib/utils'

type SegmentedTabsProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
  ariaLabel: string
}

// Alternância local dentro de um card (não vai para a URL: só muda a leitura, não o recorte dos dados)
export function SegmentedTabs<T extends string>({ value, onChange, options, ariaLabel }: SegmentedTabsProps<T>) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="inline-flex shrink-0 rounded-lg bg-muted p-0.5">
      {options.map(option => {
        const isSelected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex h-7 items-center rounded-md px-2.5 font-medium text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              isSelected ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
