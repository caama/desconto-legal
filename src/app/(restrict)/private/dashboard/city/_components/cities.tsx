'use client'

import { useQuery } from '@tanstack/react-query'
import { Inbox, MapPin } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { API } from '@/lib/axios'
import { CitiesSkeleton } from './cities-skeleton'
import { FilterCities } from './filter-cities'
import { NewCity } from './new-city'
import { PaginationCities } from './pagination-cities'
import { ToggleCity } from './toggle-city'
import { UpdateCities } from './update-cities'

interface CityProps {
  cities: {
    id: string
    name: string
    slug: string
    isThirst: boolean
    active: boolean
  }[]
  total: number
}

export function CitiesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = z.coerce.number().parse(searchParams.get('page') || '1')
  const name = searchParams.get('name') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['cities', page, name],
    queryFn: async () => {
      const response = await API.get<CityProps>('/api/cities/get-all-cities', {
        params: {
          page,
          name,
        },
      })

      return response.data
    },
    staleTime: Number.POSITIVE_INFINITY, // Significa que o cache nunca vai expirar
  })

  function handlePageChange(page: number) {
    // Cria uma instância de URLSearchParams baseada nos parâmetros de busca atuais
    const params = new URLSearchParams(searchParams.toString())

    // Atualiza o parâmetro "page" com o novo índice da página
    params.set('page', page.toString())

    // Atualiza a URL no navegador sem recarregar a página
    router.push(`?${params.toString()}`)
  }

  return (
    <main className="mx-auto">
      <Card className="mx-auto mt-8">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="font-bold text-lg md:text-2xl">Gerenciamento de Cidades</CardTitle>
            <CardDescription className="text-sm md:text-base">Gerencie todas as cidades do sistema</CardDescription>
          </div>

          {/* Componente de Nova Cidade  */}
          <NewCity />
        </CardHeader>

        <CardContent className="space-y-3 overflow-x-auto">
          {/* Componente de Filtragem de Cidades */}
          <FilterCities />

          <div className="rounded-sm border p-2">
            <Table className="w-full overflow-x-auto text-sm">
              {data?.cities.length === 0 && (
                <TableCaption className="pb-4 text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Inbox className="size-5" />
                    <p className="text-center text-sm">Nenhuma cidade cadastrada</p>
                  </div>
                </TableCaption>
              )}

              <TableHeader>
                <TableRow>
                  <TableHead className="w-64 px-6 py-4 md:px-2 md:py-3">Cidade</TableHead>
                  <TableHead className="hidden px-6 py-4 md:table-cell md:px-2 md:py-3">Slug</TableHead>
                  <TableHead className="hidden px-6 py-4 md:table-cell md:px-2 md:py-3">Tipo</TableHead>
                  <TableHead className="px-6 py-4 md:px-2 md:py-3">Status</TableHead>
                  <TableHead className="px-6 py-4 text-center md:px-2 md:py-3">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <CitiesSkeleton />}

                {data &&
                  data.cities.map(city => (
                    <TableRow key={city.id} className="py-5 hover:bg-muted/50">
                      {/* City Info */}
                      <TableCell className="px-6 py-4 font-medium md:px-2 md:py-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-4 text-primary" />
                          <span className="font-medium text-foreground">{city.name}</span>
                        </div>
                      </TableCell>

                      {/* Slug Info */}
                      <TableCell className="hidden px-6 py-4 font-medium md:table-cell md:px-2 md:py-3">
                        <code className="rounded-sm bg-muted px-2 py-1 text-muted-foreground text-xs">{city.slug}</code>
                      </TableCell>

                      {/* Tipo Info */}
                      <TableCell className="hidden px-6 py-4 font-medium md:table-cell md:px-2 md:py-3">
                        {city.isThirst ? (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
                            Sede
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
                            Subseção
                          </span>
                        )}
                      </TableCell>

                      {/* Status Info */}
                      <TableCell className="px-6 py-4 font-medium md:px-2 md:py-3">
                        {city.active ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 font-medium text-green-800 text-xs">
                            Ativa
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 font-medium text-red-800 text-xs">
                            Inativa
                          </span>
                        )}
                      </TableCell>

                      {/* Acões Info */}
                      <TableCell className="px-6 py-4 font-medium md:px-2 md:py-3">
                        <div className="flex items-center justify-center gap-2">
                          {/* Componente de edição da Cidade */}
                          <UpdateCities cities={city} />

                          {/* Componente de inativar e ativar Cidade */}
                          <ToggleCity city={city} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <PaginationCities page={page} onPageChange={handlePageChange} totalCount={data?.total ?? 0} />
        </CardContent>
      </Card>
    </main>
  )
}
