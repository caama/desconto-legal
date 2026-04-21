'use client'

import { useQuery } from '@tanstack/react-query'
import { Inbox } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { API } from '@/lib/axios'
import { PaginationCities } from '../../city/_components/pagination-cities'
import { CategoriesSkeleton } from './categories-skeleton'
import { FilterCategories } from './filter-categories'
import { NewCategory } from './new-category'
import { PaginationCategories } from './pagination-categories'
import { ToggleCategory } from './toggle-category'
import { UpdateCategories } from './update-categories'

interface CategoryProps {
  categories: {
    id: string
    name: string
    slug: string
    icon: string | null
    active: boolean
  }[]
  total: number
}

export function CategoriesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = z.coerce.number().parse(searchParams.get('page') || '1')
  const name = searchParams.get('name') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['categories', page, name],
    queryFn: async () => {
      const response = await API.get<CategoryProps>('/api/categories/get-all-categories', {
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
            <CardTitle className="font-bold text-lg md:text-2xl">Gerenciamento de Categorias</CardTitle>
            <CardDescription className="text-sm md:text-base">Gerencie todas as categorias do sistema</CardDescription>
          </div>

          {/* Componente de criar nova Categoria */}
          <NewCategory />
        </CardHeader>

        <CardContent className="space-y-3 overflow-x-auto">
          {/* Componente de Filtragem de Categorias */}
          <FilterCategories />

          <div className="rounded-sm border p-2">
            <Table className="w-full overflow-x-auto text-sm">
              {data?.categories.length === 0 && (
                <TableCaption className="pb-4 text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Inbox className="size-5" />
                    <p className="text-center text-sm">Nenhuma categoria cadastrada</p>
                  </div>
                </TableCaption>
              )}

              <TableHeader>
                <TableRow>
                  <TableHead className="w-64 px-6 py-4 md:px-2 md:py-3">Categoria</TableHead>
                  <TableHead className="hidden px-6 py-4 md:table-cell md:px-2 md:py-3">Slug</TableHead>
                  <TableHead className="hidden px-6 py-4 text-center md:table-cell md:px-2 md:py-3">Ícone</TableHead>
                  <TableHead className="px-6 py-4 text-center md:px-2 md:py-3">Status</TableHead>
                  <TableHead className="px-6 py-4 text-center md:px-2 md:py-3">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <CategoriesSkeleton />}

                {data &&
                  data.categories.map(category => (
                    <TableRow key={category.id}>
                      {/* Category Info */}
                      <TableCell className="px-6 py-4 font-medium md:px-2 md:py-3">
                        <span className="font-medium text-foreground">{category.name}</span>
                      </TableCell>

                      {/* Slug Info */}
                      <TableCell className="hidden px-6 py-4 font-medium md:table-cell md:px-2 md:py-3">
                        <code className="rounded-sm bg-muted px-2 py-1 text-muted-foreground text-xs">{category.slug}</code>
                      </TableCell>

                      {/* Ícone Info */}
                      <TableCell className="hidden px-6 py-4 text-center font-medium md:table-cell md:px-2 md:py-3">
                        {category.icon && (
                          <Badge variant="outline" className="size-7">
                            {category.icon}
                          </Badge>
                        )}
                      </TableCell>

                      {/* Status Info */}
                      <TableCell className="px-6 py-4 text-center font-medium md:px-2 md:py-3">
                        {category.active ? (
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
                          <UpdateCategories categories={category} />

                          {/* Componente de inativar e ativar Cidade */}
                          <ToggleCategory category={category} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <PaginationCategories page={page} onPageChange={handlePageChange} totalCount={data?.total ?? 0} />
        </CardContent>
      </Card>
    </main>
  )
}
