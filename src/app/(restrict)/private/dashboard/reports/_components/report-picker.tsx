import { ChartNoAxesColumn, FileClock, MapPinned, Store } from 'lucide-react'
import Link from 'next/link'
import { REPORTS, type ReportFilters, type ReportId, toReportQuery } from '@/lib/reports/filters'
import { cn } from '@/lib/utils'

const ICONS: Record<ReportId, React.ReactNode> = {
  empresas: <Store className="size-4" />,
  contratos: <FileClock className="size-4" />,
  procura: <ChartNoAxesColumn className="size-4" />,
  subsecoes: <MapPinned className="size-4" />,
}

// Trocar de relatório mantém só os filtros que o novo relatório lê
export function ReportPicker({ filters }: { filters: ReportFilters }) {
  return (
    <nav aria-label="Relatórios disponíveis" className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {REPORTS.map(report => {
        const isSelected = report.id === filters.relatorio
        const query = toReportQuery({ ...filters, relatorio: report.id })

        return (
          <Link
            key={report.id}
            href={query ? `?${query}` : '?'}
            scroll={false}
            aria-current={isSelected ? 'page' : undefined}
            className={cn(
              'flex items-start gap-3 rounded-xl border bg-card p-3.5 shadow-xs transition-colors',
              isSelected ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/40 hover:bg-muted/40'
            )}
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-lg',
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
            >
              {ICONS[report.id]}
            </span>

            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-medium text-foreground text-sm">{report.label}</span>
              <span className="text-muted-foreground text-xs leading-relaxed">{report.description}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
