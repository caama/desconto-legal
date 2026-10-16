import Image from 'next/image'
import type { ComponentProps } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getAvatarColor, getInitials } from '@/utils/avatar'
import type { CreatorRow } from '../_data/metrics-view'
import { RankingList } from './ranking-list'

type RankingCardProps = {
  className?: string
  title: string
  description: string
  items: ComponentProps<typeof RankingList>['items']
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

function CreatorAvatar({ creator }: { creator: CreatorRow }) {
  if (creator.image) {
    return (
      <Image
        src={creator.image}
        alt=""
        width={24}
        height={24}
        referrerPolicy="no-referrer"
        className="size-6 shrink-0 rounded-full ring-1 ring-border"
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full font-semibold text-[10px]',
        creator.id === 'sem-registro' ? 'bg-muted text-muted-foreground' : getAvatarColor(creator.id)
      )}
    >
      {creator.id === 'sem-registro' ? '?' : getInitials(creator.name)}
    </span>
  )
}

type CreatorsCardProps = {
  className?: string
  creators: CreatorRow[]
  year: number
}

export function CreatorsCard({ creators, year, className }: CreatorsCardProps) {
  return (
    <RankingCard
      className={className}
      title="Quem mais cadastrou"
      description={`Empresas cadastradas por usuário em ${year}. "Sem registro" reúne as cadastradas antes de o painel guardar o autor.`}
      items={creators.map(creator => ({ ...creator, leading: <CreatorAvatar creator={creator} /> }))}
      emptyMessage={`Nenhuma empresa cadastrada em ${year}.`}
    />
  )
}
