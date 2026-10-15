'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface PaginationCompaniesProps {
  page: number
  totalCount: number
  onPageChange: (page: number) => Promise<void> | void
}

export function PaginationCompanies({ page, totalCount, onPageChange }: PaginationCompaniesProps) {
  const perPage = 8
  const pages = Math.ceil(totalCount / perPage) || 1

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <span className="text-muted-foreground text-xs tabular-nums md:text-sm">
        Total de empresas: <span className="font-semibold text-foreground">{totalCount}</span>
      </span>

      <span className="text-muted-foreground text-xs tabular-nums md:text-sm">
        Página {page} de {pages}
      </span>

      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => onPageChange(1)} disabled={page === 1} size="icon-sm" variant="outline">
              <ChevronsLeft className="size-4" />
              <span className="sr-only">Primeira página</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Primeira página</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => onPageChange(page - 1)} disabled={page === 1} size="icon-sm" variant="outline">
              <ChevronLeft className="size-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Página anterior</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => onPageChange(page + 1)} disabled={page === pages} size="icon-sm" variant="outline">
              <ChevronRight className="size-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Próxima página</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => onPageChange(pages)} disabled={page === pages} size="icon-sm" variant="outline">
              <ChevronsRight className="size-4" />
              <span className="sr-only">Última página</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Última página</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
