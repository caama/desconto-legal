import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { RankedItem } from '../_data/metrics-view'
import { RankingList } from './ranking-list'

type RankingCardProps = {
  className?: string
  title: string
  description: string
  items: RankedItem[]
  emptyMessage: string
}

export function RankingCard({ title, description, items, emptyMessage, className }: RankingCardProps) {
  return (
    <Card className={cn('gap-4 shadow-xs', className)}>
      <CardHeader>
        <CardTitle className="font-semibold text-base text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <RankingList items={items} emptyMessage={emptyMessage} />
      </CardContent>
    </Card>
  )
}
