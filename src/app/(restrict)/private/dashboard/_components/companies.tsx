'use client'

import { useQuery } from '@tanstack/react-query'
import { Edit2, Inbox, Loader2, MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { API } from '@/lib/axios'
import { formatWhatsapp } from '@/utils/format-whatsapp'
import { getContractStatus, getRemainingTime } from '@/utils/get-contract-duration'
import { CompaniesTableSkeleton } from './companies-skeleton'
import { FilterCompanies } from './filter-company'
import { InactiveCompany } from './inactive-company'
import { PaginationCompanies } from './pagination-company'

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

  const [editingCompanySlug, setEditingCompanySlug] = useState<string | null>(null)
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

  function handleEditCompany(slug: string) {
    setEditingCompanySlug(slug)

    startTransition(() => {
      router.push(`/private/dashboard/company/${slug}/update-company`)
    })
  }

  function handlePrefetchEditCompany(slug: string) {
    router.prefetch(`/private/dashboard/company/${slug}/update-company`)
  }

  return (
    <main className="mx-auto">
      <Card className="mx-auto mt-8">
        <CardHeader>
          <CardTitle className="font-bold text-lg md:text-2xl">Gerenciamento de Empresas</CardTitle>
          <CardDescription className="text-sm md:text-base">Gerencie todos as empresas do sistema</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 overflow-x-auto">
          <FilterCompanies />

          <div className="rounded-sm border p-2">
            <Table className="w-full overflow-x-auto text-sm">
              {data && data.companies.length === 0 && (
                <TableCaption className="pb-4 text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Inbox className="size-5" />
                    <p className="text-center text-sm">Nenhuma empresa cadastrada</p>
                  </div>
                </TableCaption>
              )}

              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4 text-left font-semibold text-foreground text-sm">Empresa</TableHead>
                  <TableHead className="hidden px-6 py-4 text-center font-semibold text-foreground text-sm md:table-cell">
                    Cidade
                  </TableHead>
                  <TableHead className="hidden px-6 py-4 text-center font-semibold text-foreground text-sm md:table-cell">
                    Categoria
                  </TableHead>
                  <TableHead className="px-6 py-4 text-center font-semibold text-foreground text-sm">WhatsApp</TableHead>
                  <TableHead className="px-6 py-4 text-center font-semibold text-foreground text-sm">Contrato</TableHead>
                  <TableHead className="px-6 py-4 text-left font-semibold text-foreground text-sm">Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <CompaniesTableSkeleton />}

                {data &&
                  data.companies.map(company => {
                    const { status } = getContractStatus(company.contractEnd)
                    const remaining = getRemainingTime(company.contractEnd)

                    return (
                      <TableRow key={company.id} className="transition-colors duration-200 hover:bg-primary/5">
                        {/* Company Info */}
                        <TableCell className="px-6 py-4 font-medium">
                          <div className="flex items-center gap-3">
                            <div className="relative size-10 rounded-full border">
                              <Image
                                src={company.logoUrl || '/assets/company-sem-logo.png'}
                                alt={company.name || 'Empresa'}
                                fill
                                className="rounded-full object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{company.name || 'Empresa'}</span>
                                {company.featured && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
                              </div>
                              <span className="text-muted-foreground text-xs">{company.email}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* City */}
                        <TableCell className="hidden px-6 py-4 text-center text-foreground md:table-cell">
                          <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm">
                            <MapPin className="size-3.5" />
                            <span>{company.city.name}</span>
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell className="hidden px-6 py-4 text-center text-foreground md:table-cell">
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 font-medium text-xs text-yellow-800">
                            {company.category.icon && <span className="mr-1.5">{company.category.icon}</span>}
                            {company.category.name}
                          </span>
                        </TableCell>

                        {/* WhatsApp */}
                        <TableCell className="px-6 py-4 text-center text-muted-foreground">
                          {formatWhatsapp(company.whatsapp)}
                        </TableCell>

                        {/* Tempo de contrato */}
                        <TableCell className="py-4 text-center text-muted-foreground">
                          {company.contractStart === null || company.contractEnd === null ? (
                            <Badge variant="outline">Sem expiração</Badge>
                          ) : (
                            <Badge variant={status}>{remaining}</Badge>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-6 py-4">
                          <Badge
                            className={
                              company.active
                                ? 'border-green-500 bg-green-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'border border-muted bg-muted text-muted-foreground'
                            }
                          >
                            {company.active ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Envia o usuário para a página de edição */}
                            <Button
                              variant="outline"
                              size="icon"
                              className="hover:bg-muted"
                              disabled={isPending && editingCompanySlug === company.slug}
                              onClick={() => handleEditCompany(company.slug)}
                              onMouseEnter={() => handlePrefetchEditCompany(company.slug)}
                              onFocus={() => handlePrefetchEditCompany(company.slug)}
                            >
                              {isPending && editingCompanySlug === company.slug ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Edit2 className="size-4" />
                              )}
                              <span className="sr-only">
                                {isPending && editingCompanySlug === company.slug ? 'Abrindo edição' : 'Editar'}
                              </span>
                            </Button>

                            {/* Componente de inativação */}
                            <InactiveCompany company={company} />
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
