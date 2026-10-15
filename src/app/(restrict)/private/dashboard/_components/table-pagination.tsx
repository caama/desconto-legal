'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

interface TablePaginationProps {
  // Rótulos do total, ex.: ['usuário', 'usuários']
  itemLabel: [singular: string, plural: string]
  page: number
  perPage: number
  totalCount: number
  isLoading?: boolean
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

export function TablePagination({
  itemLabel,
  page,
  perPage,
  totalCount,
  isLoading,
  onPageChange,
  onPerPageChange,
}: TablePaginationProps) {
  // Sem registros ainda é "Página 1 de 1", não "de 0"
  const pages = Math.max(Math.ceil(totalCount / perPage), 1)

  const firstRowOnPage = totalCount === 0 ? 0 : (page - 1) * perPage + 1
  const lastRowOnPage = Math.min(page * perPage, totalCount)

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-muted-foreground text-sm tabular-nums">
        {isLoading ? (
          `Carregando ${itemLabel[1]}...`
        ) : (
          <>
            Total: {totalCount} {totalCount === 1 ? itemLabel[0] : itemLabel[1]} · Exibindo {firstRowOnPage} a {lastRowOnPage}
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6">
        <div className="flex items-center gap-2">
          <p className="hidden whitespace-nowrap font-medium text-sm sm:block">Linhas por página</p>

          <Select value={`${perPage}`} onValueChange={value => onPerPageChange(Number(value))}>
            <SelectTrigger size="sm" className="w-18" aria-label="Linhas por página">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZE_OPTIONS.map(option => (
                <SelectItem key={option} value={`${option}`}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="whitespace-nowrap font-medium text-sm tabular-nums">
          Página {page} de {pages}
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
          >
            <span className="sr-only">Ir para a primeira página</span>
            <ChevronsLeft />
          </Button>

          <Button variant="outline" size="icon" className="size-8" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            <span className="sr-only">Ir para a página anterior</span>
            <ChevronLeft />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages}
          >
            <span className="sr-only">Ir para a próxima página</span>
            <ChevronRight />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => onPageChange(pages)}
            disabled={page >= pages}
          >
            <span className="sr-only">Ir para a última página</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
