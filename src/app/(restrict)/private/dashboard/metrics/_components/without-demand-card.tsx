import { SquarePen } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatDate, type WithoutDemandRow } from '../_data/metrics-view'

type WithoutDemandCardProps = {
  className?: string
  companies: WithoutDemandRow[]
}

export function WithoutDemandCard({ companies, className }: WithoutDemandCardProps) {
  return (
    <Card className={cn('gap-4 shadow-xs', className)}>
      <CardHeader>
        <CardTitle className="font-semibold text-base text-primary">Sem nenhum contato</CardTitle>
        <CardDescription>
          Empresas ativas há mais de 30 dias que ainda não receberam contato pelo WhatsApp. Vale revisar a divulgação ou a
          renovação.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {companies.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground text-sm">Todas as empresas ativas já receberam contato.</p>
        ) : (
          <ul className="flex max-h-80 flex-col divide-y overflow-auto">
            {companies.map(company => (
              <li key={company.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground text-sm" title={company.name}>
                    {company.name}
                  </p>
                  <p className="truncate text-muted-foreground text-xs">
                    {company.cityName} · cadastrada em {formatDate(company.createdAt)}
                  </p>
                </div>

                <Link
                  href={company.editUrl}
                  aria-label={`Editar ${company.name}`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <SquarePen className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
