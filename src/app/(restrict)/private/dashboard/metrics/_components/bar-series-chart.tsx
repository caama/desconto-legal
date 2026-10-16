'use client'

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { formatCount, NO_DATA_MARK } from '../_data/metrics-view'
import { buildChartValueLabel } from './chart-value-label'

export type BarSeriesPoint = {
  key: string | number
  label: string
  // Nulo quando o período ainda não chegou: mostra traço em vez de zero
  total: number | null
  value: number
}

type BarSeriesChartProps = {
  data: BarSeriesPoint[]
  seriesLabel: string
  // Barra em destaque; sem ela, destaca o maior valor
  highlightKey?: string | number
  maxBarSize?: number
}

// Uma série por gráfico: barras neutras e só uma em destaque, para a leitura achar o ponto que importa
export function BarSeriesChart({ data, seriesLabel, highlightKey, maxBarSize = 44 }: BarSeriesChartProps) {
  const chartConfig = { value: { label: seriesLabel } } satisfies ChartConfig
  const peak = data.reduce((accumulator, point) => Math.max(accumulator, point.total ?? 0), 0)

  function isHighlighted(point: BarSeriesPoint) {
    if (highlightKey !== undefined) return point.key === highlightKey
    return point.total !== null && point.total === peak && peak > 0
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
      <BarChart data={data} margin={{ top: 24 }} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />

        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval={0} />

        <ChartTooltip
          cursor={{ className: 'fill-muted/70' }}
          content={({ active, payload }) => {
            const point = payload?.[0]?.payload as BarSeriesPoint | undefined
            if (!active || !point) return null

            return (
              <div className="rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
                <p className="font-medium text-foreground">{point.label}</p>
                <p className="text-muted-foreground">
                  {seriesLabel}:{' '}
                  <span className="font-medium font-mono text-foreground tabular-nums">
                    {point.total === null ? NO_DATA_MARK : formatCount(point.total)}
                  </span>
                </p>
              </div>
            )
          }}
        />

        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={maxBarSize} minPointSize={2} isAnimationActive={false}>
          {data.map(point => (
            <Cell key={point.key} className={isHighlighted(point) ? 'fill-chart-4' : 'fill-muted-foreground/25'} />
          ))}

          <LabelList dataKey="value" content={buildChartValueLabel(data.map(point => point.total))} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
