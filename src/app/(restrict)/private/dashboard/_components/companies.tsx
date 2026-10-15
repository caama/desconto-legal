'use client'

import { useQuery } from '@tanstack/react-query'
import { Inbox, Loader2, MapPin, SquarePen, Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { API } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { formatWhatsapp } from '@/utils/format-whatsapp'
import { getContractDuration, getContractStatus } from '@/utils/get-contract-duration'
import { CompaniesTableSkeleton } from './companies-skeleton'
import { FilterCompanies } from './filter-company'
import { InactiveCompany } from './inactive-company'
import { PaginationCompanies } from './pagination-company'

const HEAD = 'h-11 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wide'
const CELL = 'px-4 py-3'

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
}

export function Companies() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const page = z.coerce.number().parse(searchParams.get('page') || '1')
  const name = searchParams.get('name') || ''
  const city = searchParams.get('city') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['companies', page, name, city],
    queryFn: async () => {
      const response = await API.get<CompanyProps>('/api/company/get-all-companies', {
        params: {
          page,
          name,
          city,
        },
      })

      return response.data
    },
    staleTime: Number.POSITIVE_INFINITY,
  })

  function handlePageChange(page: number) {
    // Cria uma instância de URLSearchParams baseada nos parâmetros de busca atuais
    const params = new URLSearchParams(searchParams.toString())

    // Atualiza o parâmetro "page" com o novo índice da página
    params.set('page', page.toString())

    // Atualiza a URL no navegador sem recarregar a página
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

  const hasFilters = !!name || !!city

  return (
    <main className="mx-auto">
      <Card className="mx-auto mt-8 gap-5">
        <CardHeader>
          <CardTitle className="font-bold text-lg md:text-2xl">Gerenciamento de Empresas</CardTitle>
          <CardDescription className="text-sm md:text-base">Gerencie todas as empresas do sistema</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <FilterCompanies />

          <div className="overflow-hidden rounded-lg border border-border">
            <Table className="text-sm">
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className={HEAD}>Empresa</TableHead>
                  <TableHead className={cn(HEAD, 'hidden xl:table-cell')}>Cidade</TableHead>
                  <TableHead className={cn(HEAD, 'hidden xl:table-cell')}>Categoria</TableHead>
                  <TableHead className={cn(HEAD, 'hidden 2xl:table-cell')}>WhatsApp</TableHead>
                  <TableHead className={HEAD}>Contrato</TableHead>
                  <TableHead className={HEAD}>Status</TableHead>
                  <TableHead className={cn(HEAD, 'text-right')}>Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <CompaniesTableSkeleton />}

                {data && data.companies.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="py-14">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-muted">
                          <Inbox className="size-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <p className="font-medium text-foreground">
                          {hasFilters ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {hasFilters
                            ? 'Ajuste ou remova os filtros para ver outros resultados.'
                            : 'Cadastre a primeira empresa conveniada.'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {data &&
                  data.companies.map(company => {
                    const { status } = getContractStatus(company.contractEnd)
                    const duration = getContractDuration(company.contractStart, company.contractEnd)
                    const isOpening = isPending && editingCompanyId === company.id

                    return (
                      <TableRow
                        key={company.id}
                        className={cn(
                          'transition-colors duration-150',
                          company.featured ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-muted/40'
                        )}
                      >
                        {/* Company Info */}
                        <TableCell className={CELL}>
                          <div className="flex min-w-56 items-center gap-3">
                            <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border bg-white">
                              <Image
                                src={company.logoUrl || '/assets/company-sem-logo.png'}
                                alt=""
                                fill
                                className="object-contain p-1"
                                sizes="40px"
                              />
                            </div>
                            <div className="min-w-0 max-w-64">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate font-medium text-foreground">{company.name || 'Empresa'}</span>
                                {company.featured && (
                                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 font-semibold text-[10px] text-amber-800 ring-1 ring-amber-200">
                                    <Star className="size-2.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                                    Destaque
                                  </span>
                                )}
                              </div>
                              <span className="block truncate text-muted-foreground text-xs">{company.email}</span>
                              <span className="mt-0.5 block truncate text-muted-foreground text-xs xl:hidden">
                                {company.city.name} · {company.category.name}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* City */}
                        <TableCell className={cn(CELL, 'hidden whitespace-nowrap text-muted-foreground xl:table-cell')}>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                            {company.city.name}
                          </span>
                        </TableCell>

                        {/* Category */}
                        <TableCell className={cn(CELL, 'hidden xl:table-cell')}>
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-0.5 font-medium text-foreground/80 text-xs">
                            {company.category.icon && <span aria-hidden="true">{company.category.icon}</span>}
                            {company.category.name}
                          </span>
                        </TableCell>

                        {/* WhatsApp */}
                        <TableCell
                          className={cn(CELL, 'hidden whitespace-nowrap text-muted-foreground tabular-nums 2xl:table-cell')}
                        >
                          {formatWhatsapp(company.whatsapp)}
                        </TableCell>

                        {/* Tempo de contrato */}
                        <TableCell className={cn(CELL, 'whitespace-nowrap')}>
                          {company.contractStart === null || company.contractEnd === null ? (
                            <Badge variant="outline" className="rounded-full text-muted-foreground">
                              Sem expiração
                            </Badge>
                          ) : (
                            <Badge variant={status} className="rounded-full">
                              {status === 'expired' ? 'Contrato Expirado' : duration}
                            </Badge>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell className={cn(CELL, 'whitespace-nowrap')}>
                          <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80 text-xs">
                            <span
                              className={cn('size-1.5 rounded-full', company.active ? 'bg-emerald-500' : 'bg-zinc-400')}
                              aria-hidden="true"
                            />
                            {company.active ? 'Ativa' : 'Inativa'}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className={CELL}>
                          <div className="flex justify-end">
                            <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 shadow-xs">
                              {/* Envia o usuário para a página de edição */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="size-7 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                                    disabled={isOpening}
                                    onClick={() => handleEditCompany(company.id)}
                                    onMouseEnter={() => handlePrefetchEditCompany(company.id)}
                                    onFocus={() => handlePrefetchEditCompany(company.id)}
                                  >
                                    {isOpening ? <Loader2 className="size-4 animate-spin" /> : <SquarePen className="size-4" />}
                                    <span className="sr-only">{isOpening ? 'Abrindo edição' : 'Editar empresa'}</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Editar empresa</TooltipContent>
                              </Tooltip>

                              <div className="h-4 w-px bg-border" aria-hidden="true" />

                              {/* Componente de inativação */}
                              <InactiveCompany company={company} />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </div>

          <PaginationCompanies page={page} totalCount={data?.total ?? 0} onPageChange={handlePageChange} />
        </CardContent>
      </Card>
    </main>
  )
}
