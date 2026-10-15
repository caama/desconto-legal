'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, MapPin, SquarePen, Star, TriangleAlert } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { API } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { formatCityName } from '@/utils/format-city-name'
import { formatWhatsapp } from '@/utils/format-whatsapp'
import { getContractDuration, getContractStatus } from '@/utils/get-contract-duration'
import { CompaniesTableSkeleton } from './companies-skeleton'
import { InactiveCompany } from './inactive-company'
import { StatusTabs, useStatusParam } from './status-tabs'
import { PAGE_SIZE_OPTIONS, TablePagination } from './table-pagination'
import { TableSearch, useTableParams } from './table-search'

interface CompanyProps {
  companies: {
    id: string
    name: string
    email: string
    slug: string
    logoUrl: string | null
    city: { id: string; name: string }
    category: { id: string; name: string; icon: string }
    whatsapp: string
    active: boolean
    featured: boolean
    contractStart: string
    contractEnd: string
  }[]
  total: number
  activeCount: number
  inactiveCount: number
}

interface CitiesProps {
  cities: { id: string; name: string }[]
}

const ALL_CITIES = 'all'

export function Companies() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const { status, setStatus } = useStatusParam()
  const { page, perPage, search, setPage, setPerPage } = useTableParams(PAGE_SIZE_OPTIONS)
  const city = searchParams.get('city') || ''

  const { data, isLoading, isError } = useQuery({
    queryKey: ['companies', status, page, perPage, search, city],
    queryFn: async () => {
      const response = await API.get<CompanyProps>('/api/company/get-all-companies', {
        params: { page, perPage, search, city, status },
      })

      return response.data
    },
    staleTime: Number.POSITIVE_INFINITY,
  })

  const { data: citiesData } = useQuery({
    queryKey: ['cities', 'filter-options'],
    queryFn: async () => (await API.get<CitiesProps>('/api/cities/fetch-all-cities')).data,
    staleTime: Number.POSITIVE_INFINITY,
  })

  function handleCityChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === ALL_CITIES) params.delete('city')
    else params.set('city', value)
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  function handleEditCompany(id: string) {
    setEditingCompanyId(id)

    startTransition(() => {
      router.push(`/private/dashboard/company/${id}/update-company`)
    })
  }

  function handlePrefetchEditCompany(id: string) {
    router.prefetch(`/private/dashboard/company/${id}/update-company`)
  }

  const hasFilters = !!search || !!city

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <StatusTabs
          status={status}
          onChange={setStatus}
          activeCount={data?.activeCount}
          inactiveCount={data?.inactiveCount}
          labels={{ active: 'Ativas', inactive: 'Inativas' }}
          ariaLabel="Situação das empresas"
        />

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <Select value={city || ALL_CITIES} onValueChange={handleCityChange}>
            <SelectTrigger
              className="w-full *:data-[slot=select-value]:flex-1 *:data-[slot=select-value]:justify-start sm:w-48"
              aria-label="Filtrar por cidade"
            >
              <MapPin className="size-4" />
              <SelectValue placeholder="Todas as cidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CITIES}>Todas as cidades</SelectItem>
              {citiesData?.cities.map(option => (
                <SelectItem key={option.id} value={option.name}>
                  {formatCityName(option.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <TableSearch placeholder="Buscar empresa" ariaLabel="Buscar empresa pelo nome" />
        </div>
      </div>

      {isError ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/6 px-4 py-3.5 text-destructive"
        >
          <TriangleAlert className="mt-px size-4 shrink-0" />
          <span className="text-sm leading-snug">
            Não foi possível carregar as empresas agora. Recarregue a página e, se continuar assim, verifique sua conexão.
          </span>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Empresa</TableHead>
                  <TableHead className="hidden xl:table-cell">Cidade</TableHead>
                  <TableHead className="hidden xl:table-cell">Categoria</TableHead>
                  <TableHead className="hidden 2xl:table-cell">WhatsApp</TableHead>
                  <TableHead className="hidden sm:table-cell">Contrato</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <CompaniesTableSkeleton />}

                {data && data.companies.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                      {hasFilters
                        ? 'Nenhuma empresa encontrada para esses filtros.'
                        : status === 'active'
                          ? 'Nenhuma empresa ativa. Cadastre uma pelo botão "Nova empresa".'
                          : 'Nenhuma empresa inativa.'}
                    </TableCell>
                  </TableRow>
                )}

                {data?.companies.map(company => {
                  const { status: contractStatus } = getContractStatus(company.contractEnd)
                  const duration = getContractDuration(company.contractStart, company.contractEnd)
                  const isOpening = isPending && editingCompanyId === company.id

                  const contractBadge =
                    company.contractStart === null || company.contractEnd === null ? (
                      <Badge variant="outline" className="rounded-full text-muted-foreground">
                        Sem expiração
                      </Badge>
                    ) : (
                      <Badge variant={contractStatus} className="rounded-full">
                        {contractStatus === 'expired' ? 'Contrato Expirado' : duration}
                      </Badge>
                    )

                  return (
                    <TableRow key={company.id} className={cn(company.featured && 'bg-amber-50/40 hover:bg-amber-50/70')}>
                      <TableCell className="py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border bg-white">
                            <Image
                              src={company.logoUrl || '/assets/company-sem-logo.png'}
                              alt=""
                              fill
                              className="object-contain p-1"
                              sizes="40px"
                            />
                          </div>
                          <div className="flex min-w-0 max-w-52 flex-col gap-0.5 sm:max-w-72">
                            <span className="flex items-center gap-1.5">
                              <span className="truncate font-medium">{company.name || 'Empresa'}</span>
                              {company.featured && (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-1.5 font-semibold text-[10px] text-amber-800 leading-4 ring-1 ring-amber-200">
                                  <Star className="size-2.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                                  Destaque
                                </span>
                              )}
                            </span>
                            <span className="truncate text-muted-foreground text-xs">{company.email}</span>
                            <span className="truncate text-muted-foreground text-xs xl:hidden">
                              {formatCityName(company.city.name)} · {company.category.name}
                            </span>
                            {/* No mobile a coluna Contrato some; o status vem para baixo do nome */}
                            <span className="mt-1 sm:hidden">{contractBadge}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden whitespace-nowrap text-muted-foreground xl:table-cell">
                        {formatCityName(company.city.name)}
                      </TableCell>

                      <TableCell className="hidden xl:table-cell">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                          {company.category.icon && <span aria-hidden="true">{company.category.icon}</span>}
                          {company.category.name}
                        </span>
                      </TableCell>

                      <TableCell className="hidden whitespace-nowrap text-muted-foreground tabular-nums 2xl:table-cell">
                        {formatWhatsapp(company.whatsapp)}
                      </TableCell>

                      <TableCell className="hidden whitespace-nowrap sm:table-cell">{contractBadge}</TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                aria-label={`Editar ${company.name}`}
                                className="text-muted-foreground hover:text-foreground"
                                disabled={isOpening}
                                onClick={() => handleEditCompany(company.id)}
                                onMouseEnter={() => handlePrefetchEditCompany(company.id)}
                                onFocus={() => handlePrefetchEditCompany(company.id)}
                              >
                                {isOpening ? <Loader2 className="size-4 animate-spin" /> : <SquarePen className="size-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar empresa</TooltipContent>
                          </Tooltip>

                          <InactiveCompany company={company} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            itemLabel={['empresa', 'empresas']}
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
