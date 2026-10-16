import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatDelta, type MetricDelta } from '../_data/metrics-view'

type MetricKpiCardProps = {
  label: string
  value: string
  caption: ReactNode
  // `null` quando não há período anterior com que comparar: o card omite a variação
  delta?: MetricDelta | null
  tone?: 'default' | 'alert'
  icon?: ReactNode
}

export function MetricKpiCard({ label, value, caption, delta, tone = 'default', icon }: MetricKpiCardProps) {
  const isAlert = tone === 'alert'

  return (
    <Card className={cn('gap-0 py-5 shadow-xs', isAlert && 'border-red-200 bg-red-50/60 dark:border-red-900 dark:bg-red-950/30')}>
      <CardContent className="flex flex-col gap-1 px-5">
        <span
          className={cn(
            'flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider',
            isAlert && 'text-red-700 dark:text-red-300'
          )}
        >
          {icon}
          {label}
        </span>

        <div className="flex flex-wrap items-baseline gap-2">
          <strong
            className={cn(
              'font-semibold text-2xl text-primary tabular-nums tracking-tight',
              isAlert && 'text-red-700 dark:text-red-300'
            )}
          >
            {value}
          </strong>

          {!!delta && (
            <span
              className={cn(
                'font-medium text-xs tabular-nums',
                delta.direction === 'up' && 'text-green-600',
                delta.direction === 'down' && 'text-rose-700',
                delta.direction === 'flat' && 'text-muted-foreground'
              )}
            >
              {formatDelta(delta)}
            </span>
          )}
        </div>

        <span className="text-muted-foreground text-xs leading-relaxed">{caption}</span>
      </CardContent>
    </Card>
  )
}
