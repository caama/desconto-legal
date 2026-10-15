'use client'

import { useQuery } from '@tanstack/react-query'
import { format, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Layers, TriangleAlert } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { API } from '@/lib/axios'
import { StatusTabs, useStatusParam } from '../../_components/status-tabs'
import { PAGE_SIZE_OPTIONS, TablePagination } from '../../_components/table-pagination'
import { TableSearch, useTableParams } from '../../_components/table-search'
import { CategoriesTableSkeleton } from './categories-skeleton'
import { ToggleCategory } from './toggle-category'
import { UpdateCategories } from './update-categories'

interface CategoryProps {
  categories: {
    id: string
    name: string
    slug: string
    icon: string | null
    active: boolean
    createdAt: string
    _count: { companies: number }
  }[]
  total: number
  activeCount: number
  inactiveCount: number
}

function formatCreatedAt(value: string) {
  const date = parseISO(value)
  return isValid(date) ? format(date, 'dd MMM. yyyy', { locale: ptBR }) : '—'
}

export function CategoriesContent() {
  const { status, setStatus } = useStatusParam()
  const { page, perPage, search, setPage, setPerPage } = useTableParams(PAGE_SIZE_OPTIONS)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories', status, page, perPage, search],
    queryFn: async () => {
      const response = await API.get<CategoryProps>('/api/categories/get-all-categories', {
        params: { page, perPage, search, status },
      })

      return response.data
    },
    staleTime: Number.POSITIVE_INFINITY,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatusTabs
          status={status}
          onChange={setStatus}
          activeCount={data?.activeCount}
          inactiveCount={data?.inactiveCount}
          labels={{ active: 'Ativas', inactive: 'Inativas' }}
          ariaLabel="Situação das categorias"
        />

        <TableSearch placeholder="Busque pelo nome da categoria" ariaLabel="Buscar categoria pelo nome" />
      </div>

      {isError ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/6 px-4 py-3.5 text-destructive"
        >
          <TriangleAlert className="mt-px size-4 shrink-0" />
          <span className="text-sm leading-snug">
            Não foi possível carregar as categorias agora. Recarregue a página e, se continuar assim, verifique sua conexão.
          </span>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Categoria</TableHead>
                  <TableHead className="hidden md:table-cell">Empresas</TableHead>
                  <TableHead className="hidden lg:table-cell">Data da criação</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <CategoriesTableSkeleton />}

                {data && data.categories.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-sm">
                      {search
                        ? 'Nenhuma categoria encontrada para essa busca.'
                        : status === 'active'
                          ? 'Nenhuma categoria ativa. Cadastre uma pelo botão "Nova Categoria".'
                          : 'Nenhuma categoria inativa.'}
                    </TableCell>
                  </TableRow>
                )}

                {data?.categories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell className="py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-base"
                          aria-hidden="true"
                        >
                          {category.icon || <Layers className="size-4 text-muted-foreground" />}
                        </span>
                        <div className="flex min-w-0 max-w-52 flex-col gap-0.5 sm:max-w-72">
                          <span className="truncate font-medium">{category.name}</span>
                          <span className="truncate text-muted-foreground text-xs">/{category.slug}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden text-muted-foreground tabular-nums md:table-cell">
                      {category._count.companies} {category._count.companies === 1 ? 'empresa' : 'empresas'}
                    </TableCell>

                    <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
                      {formatCreatedAt(category.createdAt)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <UpdateCategories categories={category} />
                        <ToggleCategory category={category} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            itemLabel={['categoria', 'categorias']}
            page={page}
            perPage={perPage}
            totalCount={data?.total ?? 0}
            isLoading={isLoading}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}
    </div>
  )
}
