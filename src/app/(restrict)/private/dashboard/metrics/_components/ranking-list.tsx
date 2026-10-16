import { cn } from '@/lib/utils'
import { formatCount, type RankedItem } from '../_data/metrics-view'

type RankingListProps = {
  items: RankedItem[]
  emptyMessage: string
}

// A barra mede contra o líder e o percentual contra o total: uma compara itens, o outro diz quanto passa por ali
export function RankingList({ items, emptyMessage }: RankingListProps) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-muted-foreground text-sm">{emptyMessage}</p>
  }

  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item, index) => {
        const isLeader = index === 0 && item.total > 0

        return (
          <li key={item.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    'truncate font-medium text-sm',
                    item.highlighted
                      ? 'text-primary underline decoration-2 decoration-chart-4 underline-offset-4'
                      : 'text-foreground'
                  )}
                  title={item.name}
                >
                  {item.name}
                </span>
              </span>

              <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                {formatCount(item.total)} · {Math.round(item.share)}%
              </span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full',
                  item.highlighted || (isLeader && !items.some(other => other.highlighted)) ? 'bg-chart-4' : 'bg-primary/50'
                )}
                style={{ width: `${item.width}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
