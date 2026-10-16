import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SeriesCardProps = {
  className?: string
  title: string
  description: string
  children: ReactNode
}

export function SeriesCard({ title, description, children, className }: SeriesCardProps) {
  return (
    <Card className={cn('shadow-xs', className)}>
      <CardHeader>
        <CardTitle className="font-semibold text-base text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  )
}
