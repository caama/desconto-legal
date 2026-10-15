'use client'

import { useQueries } from '@tanstack/react-query'
import { ArrowLeft, Building2, MapPin } from 'lucide-react'
import Link from 'next/link'
import { getActiveCategories } from '../../_dal/get-active-categories'
import { getCompaniesByCity } from '../../_dal/get-companies-by-city'
import { Shared } from '../header/shared'
import { CompanyListClient } from './company-list-client'

type CompaniesByCityProps = {
  city: {
    id: string
    name: string
    slug: string
    _count: {
      companies: number
    }
  }
  query: string
  categories: string | string[]
}

export function CompaniesByCityContent({ city, query, categories: rawCategories }: CompaniesByCityProps) {
  const [{ data: companies, isPending: isPendingCompanies }, { data: categories }] = useQueries({
    queries: [
      {
        queryKey: ['companies-by-city', city.id, query, rawCategories],
        queryFn: () => getCompaniesByCity({ cityId: city.id, query, categories: rawCategories }),
        enabled: !!city.id,
      },
      {
        queryKey: ['categories', city.slug],
        queryFn: () => getActiveCategories(city.slug),
        enabled: !!city.slug,
      },
    ],
  })

  return (
    <div className="min-h-screen bg-primary/4">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/85 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              aria-label="Voltar para a página inicial"
              className="group flex size-9 shrink-0 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Link>
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                <MapPin className="size-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate font-bold text-foreground text-lg leading-tight">{city.name}</h1>
                <p className="text-muted-foreground text-xs tabular-nums">
                  {city._count.companies} {city._count.companies === 1 ? 'empresa conveniada' : 'empresas conveniadas'}
                </p>
              </div>
            </div>
          </div>

          <Shared url={`${process.env.NEXT_PUBLIC_BASE_URL}/city/${city.slug}/companies`} />
        </div>
      </header>

      {/* Content */}
      <section className="container mx-auto px-4 py-8 sm:py-10">
        {/* Info Banner */}
        <div className="mb-8 flex items-start gap-4 rounded-xl bg-primary p-5 text-primary-foreground sm:items-center sm:p-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
            <Building2 className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-base sm:text-lg">Empresas Conveniadas em {city.name}</h2>
            <p className="mt-1 text-primary-foreground/80 text-sm">
              Apresente sua carteira da OAB-MA para garantir os descontos e benefícios exclusivos.
            </p>
          </div>
        </div>

        {/* Client Component for Filtering */}
        <CompanyListClient companies={companies ?? []} categories={categories ?? []} isLoading={isPendingCompanies} />
      </section>
    </div>
  )
}
