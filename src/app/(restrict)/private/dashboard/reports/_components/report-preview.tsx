import { FileDown, FileSpreadsheet, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { type ReportFilters, toReportQuery } from '@/lib/reports/filters'
import { formatCell, formatCount } from '@/lib/reports/format'
import type { Report } from '@/lib/reports/types'
import { cn } from '@/lib/utils'

const PREVIEW_LIMIT = 50

type ReportPreviewProps = {
  report: Report
  filters: ReportFilters
}

function DownloadButton({ href, disabled, children }: { href: string; disabled: boolean; children: React.ReactNode }) {
  if (disabled) {
    return (
      <Button variant="outline" disabled>
        {children}
      </Button>
    )
  }

  return (
    <Button asChild variant="outline">
      <a href={href} download>
        {children}
      </a>
    </Button>
  )
}

export function ReportPreview({ report, filters }: ReportPreviewProps) {
  const query = toReportQuery(filters)
  const suffix = query ? `?${query}` : ''
  const isEmpty = report.rows.length === 0

  // A prévia segue as colunas do PDF; as demais vão só para a planilha
  const columns = report.columns.filter(column => column.pdf !== false)
  const sheetOnly = report.columns.filter(column => column.pdf === false)
  const visibleRows = report.rows.slice(0, PREVIEW_LIMIT)

  return (
    <Card className="gap-4 shadow-xs">
      <CardHeader className="gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="font-semibold text-base text-primary">{report.title}</CardTitle>
          <CardDescription>{report.description}</CardDescription>
          <p className="text-muted-foreground text-xs">{report.filterLines.join(' · ')}</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <DownloadButton href={`/api/reports/${filters.relatorio}/pdf${suffix}`} disabled={isEmpty}>
            <FileDown className="size-4" />
            Baixar PDF
          </DownloadButton>
          <DownloadButton href={`/api/reports/${filters.relatorio}/xlsx${suffix}`} disabled={isEmpty}>
            <FileSpreadsheet className="size-4" />
            Baixar Excel
          </DownloadButton>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-0">
        {report.summary.length > 0 && (
          <dl className="mx-6 grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 lg:grid-cols-4">
            {report.summary.map(item => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground text-xs">{item.label}</dt>
                <dd className="font-semibold text-foreground tabular-nums">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {isEmpty ? (
          <p className="px-6 py-10 text-center text-muted-foreground text-sm">{report.emptyMessage}</p>
        ) : (
          <div className="overflow-x-auto border-y">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {columns.map((column, index) => (
                    <TableHead
                      key={column.key}
                      className={cn(
                        'whitespace-nowrap text-xs',
                        column.type !== 'text' && 'text-right',
                        index === 0 && 'pl-6',
                        index === columns.length - 1 && 'pr-6'
                      )}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {visibleRows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column, index) => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          'max-w-64 truncate text-xs',
                          column.type !== 'text' && 'text-right tabular-nums',
                          index === 0 && 'pl-6 font-medium text-foreground',
                          index === columns.length - 1 && 'pr-6'
                        )}
                        title={formatCell(column, row[column.key] ?? null)}
                      >
                        {formatCell(column, row[column.key] ?? null)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {report.totals && report.rows.length <= PREVIEW_LIMIT && (
                  <TableRow className="border-primary border-t-2 hover:bg-transparent">
                    {columns.map((column, index) => {
                      const value = report.totals?.[column.key] ?? null

                      return (
                        <TableCell
                          key={column.key}
                          className={cn(
                            'font-semibold text-xs',
                            column.type !== 'text' && 'text-right tabular-nums',
                            index === 0 && 'pl-6',
                            index === columns.length - 1 && 'pr-6'
                          )}
                        >
                          {value === null ? '' : formatCell(column, value)}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex flex-col gap-1.5 px-6 text-muted-foreground text-xs leading-relaxed">
          {!isEmpty && (
            <p>
              {report.rows.length > PREVIEW_LIMIT
                ? `Prévia com ${PREVIEW_LIMIT} de ${formatCount(report.rows.length)} linhas. Os arquivos trazem todas.`
                : `${formatCount(report.rows.length)} ${report.rows.length === 1 ? 'linha' : 'linhas'}.`}
            </p>
          )}

          {sheetOnly.length > 0 && (
            <p className="flex items-start gap-1.5">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <span>O Excel traz também: {sheetOnly.map(column => column.header).join(', ')}.</span>
            </p>
          )}

          {report.notes?.map(note => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
