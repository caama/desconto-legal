'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export type RecordStatus = 'active' | 'inactive'

// Aba de situação guardada na URL (?status=inactive); sem o parâmetro, mostra os ativos
export function useStatusParam() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const status: RecordStatus = searchParams.get('status') === 'inactive' ? 'inactive' : 'active'

  function setStatus(nextStatus: RecordStatus) {
    const params = new URLSearchParams(searchParams.toString())

    if (nextStatus === 'inactive') params.set('status', 'inactive')
    else params.delete('status')

    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  return { status, setStatus }
}

type StatusTabsProps = {
  status: RecordStatus
  onChange: (status: RecordStatus) => void
  activeCount?: number
  inactiveCount?: number
  labels: Record<RecordStatus, string>
  ariaLabel: string
}

export function StatusTabs({ status, onChange, activeCount, inactiveCount, labels, ariaLabel }: StatusTabsProps) {
  const tabs: { value: RecordStatus; count?: number }[] = [
    { value: 'active', count: activeCount },
    { value: 'inactive', count: inactiveCount },
  ]

  return (
    <div role="tablist" aria-label={ariaLabel} className="inline-flex rounded-lg bg-muted p-1">
      {tabs.map(tab => {
        const isSelected = status === tab.value

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(tab.value)}
            className={cn(
              'inline-flex h-8 items-center gap-2 rounded-md px-3 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              isSelected ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span
              className={cn('size-1.5 rounded-full', tab.value === 'active' ? 'bg-emerald-500' : 'bg-zinc-400')}
              aria-hidden="true"
            />
            {labels[tab.value]}
            <span
              className={cn(
                'min-w-5 rounded-full px-1.5 py-px text-center text-xs tabular-nums',
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'
              )}
            >
              {tab.count ?? '–'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
