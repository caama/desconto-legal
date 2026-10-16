import { SquarePen } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { CONTRACT_WINDOW_DAYS, type ContractRow, formatCount, formatDate } from '../_data/metrics-view'

type ContractsCardProps = {
  className?: string
  contracts: ContractRow[]
  withoutContractEnd: number
}

function ContractSituation({ daysLeft }: { daysLeft: number }) {
  if (daysLeft < 0) {
    const days = Math.abs(daysLeft)
    return <Badge variant="expired">Vencido há {days === 1 ? '1 dia' : `${days} dias`}</Badge>
  }

  if (daysLeft === 0) return <Badge variant="expired">Vence hoje</Badge>

  return (
    <Badge variant={daysLeft <= 30 ? 'warning' : 'active'}>{daysLeft === 1 ? 'Falta 1 dia' : `Faltam ${daysLeft} dias`}</Badge>
  )
}

export function ContractsCard({ contracts, withoutContractEnd, className }: ContractsCardProps) {
  return (
    <Card className={cn('gap-4 shadow-xs', className)}>
      <CardHeader>
        <CardTitle className="font-semibold text-base text-primary">Contratos para renovar</CardTitle>
        <CardDescription>
          Empresas ativas com contrato vencido ou vencendo em até {CONTRACT_WINDOW_DAYS} dias. Os contatos ajudam a decidir quais
          priorizar.
          {withoutContractEnd > 0 && (
            <>
              {' '}
              <strong className="font-medium text-amber-700 dark:text-amber-300">
                {withoutContractEnd === 1
                  ? '1 empresa ativa está sem data de fim de contrato.'
                  : `${withoutContractEnd} empresas ativas estão sem data de fim de contrato.`}
              </strong>
            </>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        {contracts.length === 0 ? (
          <p className="px-6 py-6 text-center text-muted-foreground text-sm">
            Nenhum contrato vencido ou vencendo nos próximos {CONTRACT_WINDOW_DAYS} dias.
          </p>
        ) : (
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Empresa</TableHead>
                  <TableHead className="hidden sm:table-cell">Fim do contrato</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="hidden text-right md:table-cell">Contatos</TableHead>
                  <TableHead className="w-12 pr-6">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {contracts.map(contract => (
                  <TableRow key={contract.id}>
                    <TableCell className="max-w-56 pl-6">
                      <p className="truncate font-medium text-foreground" title={contract.name}>
                        {contract.name}
                      </p>
                      <p className="truncate text-muted-foreground text-xs">
                        {contract.cityName}
                        <span className="sm:hidden"> · {formatDate(contract.contractEnd)}</span>
                      </p>
                    </TableCell>
                    <TableCell className="hidden tabular-nums sm:table-cell">{formatDate(contract.contractEnd)}</TableCell>
                    <TableCell>
                      <ContractSituation daysLeft={contract.daysLeft} />
                    </TableCell>
                    <TableCell className="hidden text-right tabular-nums md:table-cell">
                      {formatCount(contract.visitors)}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Button asChild variant="ghost" size="icon-sm" aria-label={`Editar ${contract.name}`}>
                        <Link href={contract.editUrl}>
                          <SquarePen className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
