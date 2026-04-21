'use client'

import { Building2, Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import type { CompanyWithRelations } from '../../_dal/get-companies-by-city'
import { CategoriesList } from './categories-list'
import { CompanyCard } from './company-card'

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
}

export function CompanyListClient({ companies, categories }: CompanyListClientProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [inputValue, setInputValue] = useState('')

  const debouncedInputValue = useDebounce(inputValue, 500)

  const currentCategories = searchParams.getAll('categories')
  const currentQuery = searchParams.get('query')

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

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar empresas..."
            className="peer pl-10 focus-visible:ring-1! focus-visible:ring-primary/90"
            value={inputValue}
            onChange={({ target }) => setInputValue(target.value)}
          />
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground transition-all duration-200 peer-focus:text-primary" />
        </div>

        <div>
          <p className="font-medium text-muted-foreground text-sm">Filtrar por categoria:</p>
        </div>

        <CategoriesList categories={categories} />
      </div>

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-300 border-dashed p-10 text-center text-gray-600">
          <Building2 className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="font-semibold text-gray-700 text-lg">Nenhuma empresa localizada</h3>

          <p className="mt-2 max-w-md text-gray-500 text-sm">Verifique o nome ou a categoria selecionada e tente novamente.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </>
  )
}
