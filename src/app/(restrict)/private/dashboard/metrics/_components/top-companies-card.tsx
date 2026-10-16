'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCount, formatPercent, type TopCompany } from '../_data/metrics-view'
import { SegmentedTabs } from './segmented-tabs'

type TopPeriod = 'year' | 'all'

type TopCompaniesCardProps = {
  className?: string
  topInYear: TopCompany[]
  topAllTime: TopCompany[]
  year: number
  cityName: string | null
}

export function TopCompaniesCard({ topInYear, topAllTime, year, cityName, className }: TopCompaniesCardProps) {
  // Abre no ano quando há coleta; sem ela, o acumulado é o único ranking com conteúdo
  const [period, setPeriod] = useState<TopPeriod>(topInYear.length > 0 ? 'year' : 'all')

  const companies = period === 'year' ? topInYear : topAllTime
  const max = companies[0]?.contacts ?? 0

  return (
    <Card className={cn('shadow-xs', className)}>
      <CardHeader>
        <CardTitle className="font-semibold text-base text-primary">Mais procuradas</CardTitle>
        <CardDescription>Top 5 por contatos no WhatsApp {cityName ? 'na subseção' : 'em todas as subseções'}</CardDescription>
        <CardAction>
          <SegmentedTabs
            value={period}
            onChange={setPeriod}
            ariaLabel="Período do ranking"
            options={[
              { value: 'year', label: String(year) },
              { value: 'all', label: 'Desde o início' },
            ]}
          />
        </CardAction>
      </CardHeader>

      <CardContent>
        {companies.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground text-sm">
            {period === 'year'
              ? `Nenhum contato registrado em ${year}. Veja "Desde o início" para o histórico acumulado.`
              : 'Nenhuma empresa ativa recebeu contato até agora.'}
          </p>
        ) : (
          <ol className="flex flex-col gap-3.5">
            {companies.map((company, index) => (
              <li key={company.id} className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full font-semibold text-xs tabular-nums',
                    index === 0 ? 'bg-chart-4 text-white' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {index + 1}
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <Link
                      href={company.publicUrl}
                      target="_blank"
                      className="group inline-flex min-w-0 items-center gap-1 font-medium text-foreground text-sm hover:text-primary"
                      title={`Abrir a página de ${company.name}`}
                    >
                      <span className="truncate">{company.name}</span>
                      <ArrowUpRight className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>

                    <span className="shrink-0 font-medium text-foreground text-xs tabular-nums">
                      {formatCount(company.contacts)} {company.contacts === 1 ? 'contato' : 'contatos'}
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full', index === 0 ? 'bg-chart-4' : 'bg-primary/50')}
                      style={{ width: `${max > 0 ? (company.contacts / max) * 100 : 0}%` }}
                    />
                  </div>

                  <span className="text-muted-foreground text-xs">
                    {company.cityName}
                    {company.views !== null &&
                      company.views > 0 &&
                      ` · ${formatCount(company.views)} visitas · ${formatPercent((company.contacts / company.views) * 100)} de conversão`}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
