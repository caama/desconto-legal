import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { type CoverageMatrix, formatCount } from '../_data/metrics-view'

type CoverageCardProps = {
  className?: string
  coverage: CoverageMatrix
  citiesWithoutCompanies: string[]
}

// Uma cor só, do claro ao escuro, pela quantidade; a célula vazia fica tracejada para a lacuna saltar aos olhos
function cellStyle(value: number, max: number) {
  if (value === 0 || max === 0) return undefined
  const intensity = 10 + Math.round((value / max) * 30)

  return { backgroundColor: `color-mix(in oklch, var(--chart-3) ${intensity}%, transparent)` }
}

export function CoverageCard({ coverage, citiesWithoutCompanies, className }: CoverageCardProps) {
  const max = coverage.rows.reduce((accumulator, row) => Math.max(accumulator, ...row.cells), 0)

  return (
    <Card className={cn('gap-4 shadow-xs', className)}>
      <CardHeader>
        <CardTitle className="font-semibold text-base text-primary">Cobertura por subseção e categoria</CardTitle>
        <CardDescription>
          Empresas ativas em cada combinação. Células vazias mostram onde falta convênio, um ponto de partida para a prospecção.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {coverage.categories.length === 0 || coverage.rows.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground text-sm">
            Cadastre cidades e categorias ativas para ver a cobertura.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full border-separate border-spacing-0.5 text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 bg-card px-3 py-2 text-left font-medium text-muted-foreground text-xs"
                  >
                    Subseção
                  </th>
                  {coverage.categories.map(category => (
                    <th
                      key={category.id}
                      scope="col"
                      className="min-w-20 px-2 py-2 text-center font-medium text-muted-foreground text-xs"
                    >
                      {category.name}
                    </th>
                  ))}
                  <th scope="col" className="px-3 py-2 text-right font-medium text-muted-foreground text-xs">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {coverage.rows.map(row => (
                  <tr key={row.id}>
                    <th
                      scope="row"
                      className={cn(
                        'sticky left-0 z-10 whitespace-nowrap bg-card px-3 py-1.5 text-left font-medium text-xs',
                        row.highlighted
                          ? 'text-primary underline decoration-2 decoration-chart-4 underline-offset-4'
                          : 'text-foreground'
                      )}
                    >
                      {row.name}
                    </th>
                    {row.cells.map((value, index) => (
                      <td
                        key={coverage.categories[index]?.id}
                        style={cellStyle(value, max)}
                        title={`${row.name} · ${coverage.categories[index]?.name}: ${value}`}
                        className={cn(
                          'h-8 rounded-md text-center text-xs tabular-nums',
                          value === 0
                            ? 'border border-muted-foreground/25 border-dashed text-muted-foreground/60'
                            : 'font-medium text-foreground'
                        )}
                      >
                        {value === 0 ? '–' : formatCount(value)}
                      </td>
                    ))}
                    <td className="px-3 text-right font-semibold text-foreground text-xs tabular-nums">
                      {formatCount(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {citiesWithoutCompanies.length > 0 && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/8 px-3 py-2 text-muted-foreground text-xs leading-relaxed">
            <strong className="font-semibold text-foreground">
              {citiesWithoutCompanies.length === 1
                ? '1 subseção sem nenhuma empresa ativa: '
                : `${citiesWithoutCompanies.length} subseções sem nenhuma empresa ativa: `}
            </strong>
            {citiesWithoutCompanies.join(', ')}.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
