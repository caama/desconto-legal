'use client'

import { Search, SearchX, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { CategoriesListSkeleton } from '@/app/(restrict)/private/dashboard/category/_components/categories-skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/use-debounce'
import type { CompanyWithRelations } from '../../_dal/get-companies-by-city'
import { CategoriesList } from './categories-list'
import { CompanyCard } from './company-card'
import { CompanyCardSkeleton } from './company-card-skeleton'

type CompanyListClientProps = {
  companies: CompanyWithRelations[]
  categories: {
    id: string
    name: string
    icon: string | null
    _count: {
      companies: number
    }
  }[]
  isLoading?: boolean
}

const GRID_CLASSES = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'

export function CompanyListClient({ companies, categories, isLoading }: CompanyListClientProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentCategories = searchParams.getAll('categories')
  const currentQuery = searchParams.get('query')

  // Mantém o termo da URL no campo ao recarregar ou compartilhar o link
  const [inputValue, setInputValue] = useState(currentQuery ?? '')

  const debouncedInputValue = useDebounce(inputValue, 500)

  const hasFilters = !!currentQuery || currentCategories.length > 0

  useEffect(() => {
    if (currentQuery === debouncedInputValue) return
    if (!currentQuery && !debouncedInputValue) return

    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          query: debouncedInputValue,
          categories: currentCategories,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    )

    router.push(url)
  }, [currentQuery, currentCategories, debouncedInputValue, pathname, router])

  function handleClearFilters() {
    setInputValue('')
    router.push(pathname)
  }

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Buscar empresa pelo nome"
            aria-label="Buscar empresa pelo nome"
            className="h-11 rounded-lg bg-card pr-10 pl-10 shadow-xs focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
            value={inputValue}
            onChange={({ target }) => setInputValue(target.value)}
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Limpar busca"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          <p className="font-medium text-muted-foreground text-xs">Filtrar por categoria</p>
          {isLoading ? <CategoriesListSkeleton /> : <CategoriesList categories={categories} />}
        </div>
      </div>

      <div className="mb-4 flex min-h-8 items-center justify-between gap-4">
        {isLoading ? (
          <Skeleton className="h-4 w-36" />
        ) : (
          <p className="text-muted-foreground text-sm" aria-live="polite">
            <span className="font-semibold text-foreground tabular-nums">{companies.length}</span>{' '}
            {companies.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
          </p>
        )}

        {hasFilters && !isLoading && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
            Limpar filtros
          </Button>
        )}
      </div>

      {isLoading && (
        <div className={GRID_CLASSES}>
          {Array.from({ length: 6 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && companies.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border border-dashed bg-card px-6 py-14 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/6">
            <SearchX className="size-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="font-semibold text-base text-foreground">Nenhuma empresa encontrada</h3>
          <p className="mt-1.5 max-w-sm text-muted-foreground text-sm">
            {hasFilters
              ? 'Nenhum convênio corresponde à busca ou às categorias selecionadas.'
              : 'Ainda não há empresas conveniadas nesta cidade.'}
          </p>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-5">
              Limpar filtros
            </Button>
          )}
        </div>
      )}

      {!isLoading && companies.length > 0 && (
        <div className={GRID_CLASSES}>
          {companies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </>
  )
}
