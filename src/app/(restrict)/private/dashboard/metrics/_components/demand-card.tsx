'use client'

import { useState } from 'react'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCount, formatDay, formatPercent, type MetricsData, NO_DATA_MARK } from '../_data/metrics-view'
import { BarSeriesChart } from './bar-series-chart'
import { SegmentedTabs } from './segmented-tabs'

type DemandSeries = 'views' | 'contacts'

type DemandCardProps = {
  className?: string
  demand: MetricsData['demand']
  year: number
}

export function DemandCard({ demand, year, className }: DemandCardProps) {
  const [series, setSeries] = useState<DemandSeries>('views')

  const data = demand[series].map(point => ({ ...point, key: point.month }))
  const hasData = demand.totalViews > 0 || demand.totalContacts > 0
  const firstYear = demand.firstStatDate ? new Date(demand.firstStatDate).getUTCFullYear() : null

  return (
    <Card className={cn('shadow-xs', className)}>
      <CardHeader>
        <CardTitle className="font-semibold text-base text-primary">Procura por mês</CardTitle>
        <CardDescription>
          Visitas à página da empresa e contatos pelo WhatsApp em {year}
          {demand.firstStatDate && ` · coleta desde ${formatDay(demand.firstStatDate)}`}
        </CardDescription>
        <CardAction>
          <SegmentedTabs
            value={series}
            onChange={setSeries}
            ariaLabel="Série do gráfico de procura"
            options={[
              { value: 'views', label: 'Visitas' },
              { value: 'contacts', label: 'Contatos' },
            ]}
          />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <dl className="grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground text-xs">Visitas</dt>
            <dd className="font-semibold text-foreground tabular-nums">{formatCount(demand.totalViews)}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground text-xs">Contatos</dt>
            <dd className="font-semibold text-foreground tabular-nums">{formatCount(demand.totalContacts)}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-muted-foreground text-xs">Conversão</dt>
            <dd className="font-semibold text-foreground tabular-nums">
              {demand.conversion === null ? NO_DATA_MARK : formatPercent(demand.conversion)}
            </dd>
          </div>
        </dl>

        {hasData ? (
          <BarSeriesChart data={data} seriesLabel={series === 'views' ? 'Visitas' : 'Contatos'} />
        ) : (
          <p className="flex h-60 items-center justify-center text-balance px-6 text-center text-muted-foreground text-sm">
            {!demand.firstStatDate
              ? 'A coleta de visitas e contatos ainda não registrou nenhuma procura. Os números aparecem assim que alguém abrir a página de uma empresa.'
              : firstYear !== null && year < firstYear
                ? `A coleta de procura começou em ${formatDay(demand.firstStatDate)}. Escolha ${firstYear} ou um ano posterior.`
                : `Nenhuma procura registrada em ${year} para este recorte.`}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
