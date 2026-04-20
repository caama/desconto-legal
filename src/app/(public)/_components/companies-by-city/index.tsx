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

export async function CompaniesByCityContent({ city, query, categories: rawCategories }: CompaniesByCityProps) {
  const companies = await getCompaniesByCity({ cityId: city.id, query, categories: rawCategories })

  const categories = await getActiveCategories(city.slug)

  return (
    <div className="min-h-screen bg-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Link href="/" className="group">
              <ArrowLeft className="group-hover:-translate-x-1 mr-2 size-4 text-foreground/80 transition-transform duration-200" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#22254D]">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground text-lg">{city.name}</h1>
                <p className="text-muted-foreground text-xs">
                  {city._count.companies} {city._count.companies === 1 ? 'empresa conveniada' : 'empresas conveniadas'}
                </p>
              </div>
            </div>
          </div>

          <Shared url={`${process.env.NEXT_PUBLIC_BASE_URL}/city/${city.slug}/companies`} />
        </div>
      </header>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="mb-8 rounded-lg bg-[#22254D] p-6 text-primary-foreground">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-muted bg-muted/10 text-muted">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-1 font-semibold text-muted">Empresas Conveniadas em {city.name}</h2>
              <p className="text-muted/90 text-sm">
                Apresente sua carteira da OAB-MA para garantir os descontos e benefícios exclusivos.
              </p>
            </div>
          </div>
        </div>

        {/* Client Component for Filtering */}
        <CompanyListClient companies={companies} categories={categories} />
      </section>
    </div>
  )
}
