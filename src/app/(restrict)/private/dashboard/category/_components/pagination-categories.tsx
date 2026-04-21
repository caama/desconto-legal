'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface PaginationCategoriesProps {
  page: number
  totalCount: number
  onPageChange: (page: number) => Promise<void> | void
}

export function PaginationCategories({ page, totalCount, onPageChange }: PaginationCategoriesProps) {
  const perPage = 8
  const pages = Math.ceil(totalCount / perPage) || 1

  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-muted-foreground text-xs md:text-sm">Total de categorias: {totalCount}</span>

      <span className="font-medium text-muted-foreground text-xs md:text-sm">
        Página {page} de {pages}
      </span>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => onPageChange(1)} disabled={page === 1} size="icon-sm" className="rounded-sm">
              <ChevronsLeft className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border border-white/50 bg-primary font-medium">Primeira página</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => onPageChange(page - 1)} disabled={page === 1} size="icon-sm" className="rounded-sm">
              <ChevronLeft className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border border-white/50 bg-primary font-medium">Página anterior</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => onPageChange(page + 1)} disabled={page === pages} size="icon-sm" className="rounded-sm">
              <ChevronRight className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border border-white/50 bg-primary font-medium">Próxima página</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => onPageChange(pages)} disabled={page === pages} size="icon-sm" className="rounded-sm">
              <ChevronsRight className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border border-white/50 bg-primary font-medium">Última página</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
