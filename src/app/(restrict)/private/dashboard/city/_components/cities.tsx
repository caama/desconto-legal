'use client'

import { useQuery } from '@tanstack/react-query'
import { format, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Landmark, MapPin, TriangleAlert } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { API } from '@/lib/axios'
import { formatCityName } from '@/utils/format-city-name'
import { StatusTabs, useStatusParam } from '../../_components/status-tabs'
import { PAGE_SIZE_OPTIONS, TablePagination } from '../../_components/table-pagination'
import { TableSearch, useTableParams } from '../../_components/table-search'
import { CitiesSkeleton } from './cities-skeleton'
import { ToggleCity } from './toggle-city'
import { UpdateCities } from './update-cities'

interface CityProps {
  cities: {
    id: string
    name: string
    slug: string
    isThirst: boolean
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

export function CitiesContent() {
  const { status, setStatus } = useStatusParam()
  const { page, perPage, search, setPage, setPerPage } = useTableParams(PAGE_SIZE_OPTIONS)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cities', status, page, perPage, search],
    queryFn: async () => {
      const response = await API.get<CityProps>('/api/cities/get-all-cities', {
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
          ariaLabel="Situação das cidades"
        />

        <TableSearch placeholder="Busque pelo nome da cidade" ariaLabel="Buscar cidade pelo nome" />
      </div>

      {isError ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/6 px-4 py-3.5 text-destructive"
        >
          <TriangleAlert className="mt-px size-4 shrink-0" />
          <span className="text-sm leading-snug">
            Não foi possível carregar as cidades agora. Recarregue a página e, se continuar assim, verifique sua conexão.
          </span>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Cidade</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Empresas</TableHead>
                  <TableHead className="hidden lg:table-cell">Data da criação</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <CitiesSkeleton />}

                {data && data.cities.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-sm">
                      {search
                        ? 'Nenhuma cidade encontrada para essa busca.'
                        : status === 'active'
                          ? 'Nenhuma cidade ativa. Cadastre uma pelo botão "Nova Cidade".'
                          : 'Nenhuma cidade inativa.'}
                    </TableCell>
                  </TableRow>
                )}

                {data?.cities.map(city => (
                  <TableRow key={city.id}>
                    <TableCell className="py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary"
                          aria-hidden="true"
                        >
                          <MapPin className="size-4" />
                        </span>
                        <div className="flex min-w-0 max-w-52 flex-col gap-0.5 sm:max-w-72">
                          <span className="truncate font-medium">{formatCityName(city.name)}</span>
                          <span className="truncate text-muted-foreground text-xs">/{city.slug}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      {city.isThirst ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 font-medium text-primary text-xs">
                          <Landmark className="size-3.5" aria-hidden="true" />
                          Sede
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                          Subseção
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="hidden text-muted-foreground tabular-nums md:table-cell">
                      {city._count.companies} {city._count.companies === 1 ? 'empresa' : 'empresas'}
                    </TableCell>

                    <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
                      {formatCreatedAt(city.createdAt)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <UpdateCities cities={city} />
                        <ToggleCity city={city} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            itemLabel={['cidade', 'cidades']}
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
