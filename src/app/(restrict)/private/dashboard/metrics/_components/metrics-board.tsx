import { CalendarClock, CalendarPlus, OctagonAlert, Store } from 'lucide-react'
import { formatCityName } from '@/utils/format-city-name'
import { getMetrics } from '../_dal/get-metrics'
import { formatCount } from '../_data/metrics-view'
import { BarSeriesChart } from './bar-series-chart'
import { ContractsCard } from './contracts-card'
import { CoverageCard } from './coverage-card'
import { DemandCard } from './demand-card'
import { MetricKpiCard } from './metric-kpi-card'
import { MetricsFilters } from './metrics-filters'
import { CreatorsCard, RankingCard } from './ranking-card'
import { SeriesCard } from './series-card'
import { TopCompaniesCard } from './top-companies-card'
import { WithoutDemandCard } from './without-demand-card'

type MetricsBoardProps = {
  year?: string
  citySlug?: string
}

export async function MetricsBoard({ year, citySlug }: MetricsBoardProps) {
  const metrics = await getMetrics({ year, citySlug })
  const { filters, kpis } = metrics

  const scopeLabel = filters.cityName ? formatCityName(filters.cityName) : 'Todas as subseções'
  const isCurrentYear = filters.year === filters.currentYear

  return (
    <div className="flex flex-col gap-5">
      <MetricsFilters
        year={filters.year}
        currentYear={filters.currentYear}
        yearOptions={filters.yearOptions}
        citySlug={filters.citySlug}
        cityOptions={filters.cityOptions}
      />

      <section aria-label="Indicadores" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricKpiCard
          icon={<Store className="size-3.5" />}
          label="Empresas ativas"
          value={formatCount(kpis.active)}
          caption={`${formatCount(kpis.inactive)} inativas · ${scopeLabel}`}
        />
        <MetricKpiCard
          icon={<CalendarPlus className="size-3.5" />}
          label={`Novas em ${filters.year}`}
          value={formatCount(kpis.newInYear)}
          delta={kpis.newDelta}
          caption={
            kpis.newDelta
              ? `Comparado a ${filters.year - 1}${isCurrentYear ? ', que já fechou' : ''}`
              : `Sem cadastros em ${filters.year - 1} para comparar`
          }
        />
        <MetricKpiCard
          icon={<CalendarClock className="size-3.5" />}
          label="Vencem em 90 dias"
          value={formatCount(kpis.expiring90)}
          caption={`${formatCount(kpis.expiring30)} em até 30 dias · ${formatCount(kpis.expiring60)} em até 60`}
        />
        <MetricKpiCard
          icon={<OctagonAlert className="size-3.5" />}
          label="Vencidos e ainda ativos"
          value={formatCount(kpis.expiredActive)}
          tone={kpis.expiredActive > 0 ? 'alert' : 'default'}
          caption={
            kpis.expiredActive > 0
              ? 'Aparecem no site sem contrato válido: renove ou inative'
              : 'Nenhuma empresa no ar com contrato vencido'
          }
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <SeriesCard title="Cadastros por ano" description={`Empresas cadastradas no painel · ${scopeLabel}`}>
          <BarSeriesChart
            data={metrics.byYear.map(item => ({
              key: item.year,
              label: String(item.year),
              total: item.total,
              value: item.total,
            }))}
            seriesLabel="Cadastros"
            highlightKey={filters.year}
            maxBarSize={72}
          />
        </SeriesCard>

        <SeriesCard title="Cadastros por mês" description={`Distribuição mensal em ${filters.year} · ${scopeLabel}`}>
          <BarSeriesChart data={metrics.byMonth.map(point => ({ ...point, key: point.month }))} seriesLabel="Cadastros" />
        </SeriesCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <DemandCard className="lg:col-span-3" demand={metrics.demand} year={filters.year} />
        <TopCompaniesCard
          className="lg:col-span-2"
          topInYear={metrics.topInYear}
          topAllTime={metrics.topAllTime}
          year={filters.year}
          cityName={filters.cityName}
        />
      </div>

      <ContractsCard contracts={metrics.contracts} withoutContractEnd={kpis.withoutContractEnd} />

      <div className="grid gap-5 lg:grid-cols-2">
        <RankingCard
          title="Empresas por subseção"
          description="Empresas ativas hoje, sempre entre todas as subseções, com a filtrada destacada"
          items={metrics.byCity}
          emptyMessage="Nenhuma subseção ativa."
        />
        <RankingCard
          title="Empresas por categoria"
          description={`Empresas ativas hoje · ${scopeLabel}`}
          items={metrics.byCategory}
          emptyMessage="Nenhuma empresa ativa neste recorte."
        />
      </div>

      <CoverageCard coverage={metrics.coverage} citiesWithoutCompanies={metrics.citiesWithoutCompanies} />

      <div className="grid gap-5 lg:grid-cols-2">
        <WithoutDemandCard companies={metrics.withoutDemand} />
        <CreatorsCard creators={metrics.creators} year={filters.year} />
      </div>
    </div>
  )
}
