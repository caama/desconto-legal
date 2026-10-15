import { ArrowRight, MapPin, Star, UserRound, UsersRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { CompanyWithRelations } from '../../_dal/get-companies-by-city'
import { InteractiveCard } from './interactive-card'

// Exibição do contador oculta a pedido da diretoria da CAAMA.
// A contagem e o destaque automático (20+ visitantes) continuam ativos em add-visitor-in-company.ts.
const SHOW_VISITORS = false

interface CompanyCardProps {
  company: CompanyWithRelations
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link
      href={`/city/${company.city.slug}/companies/${company.slug}/details`}
      className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <InteractiveCard>
        <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-[border-color,box-shadow] duration-300 ease-out group-hover:border-primary/25 group-hover:shadow-[0_22px_44px_-20px_color-mix(in_oklch,var(--primary)_45%,transparent)]">
          <div className="relative flex h-32 items-center justify-center border-border border-b bg-white px-8">
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={`Logo de ${company.name}`}
                width={240}
                height={110}
                className="h-auto max-h-16 w-auto max-w-full translate-x-(--logo-x) translate-y-(--logo-y) object-contain transition-[scale] duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                quality={100}
                priority
              />
            ) : (
              <span className="font-semibold text-2xl text-primary/30 uppercase tracking-tight" aria-hidden="true">
                {company.name.slice(0, 2)}
              </span>
            )}

            {company.featured && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-medium text-[11px] text-amber-800 ring-1 ring-amber-200">
                <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                Destaque
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="line-clamp-2 text-balance font-semibold text-base text-foreground leading-snug">{company.name}</h3>

            <div className="mt-2 space-y-1 text-muted-foreground text-xs">
              {company.category && (
                <p className="flex items-center gap-1.5">
                  {company.category.icon && <span aria-hidden="true">{company.category.icon}</span>}
                  <span className="truncate">{company.category.name}</span>
                </p>
              )}
              <p className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                <span className="line-clamp-1">{company.address}</span>
              </p>
            </div>

            {company.description && (
              <p className="mt-3 line-clamp-2 text-muted-foreground text-sm leading-relaxed">{company.description}</p>
            )}

            <div className="mt-auto pt-5">
              {company.discount && (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-primary/6 px-4 py-3 transition-colors duration-200 group-hover:bg-primary">
                  <span className="font-semibold text-primary text-sm tabular-nums transition-colors duration-200 group-hover:text-primary-foreground">
                    {company.discount}
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-primary transition-[transform,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-primary-foreground"
                    aria-hidden="true"
                  />
                </div>
              )}

              {SHOW_VISITORS && (
                <span className="mt-2.5 flex items-center justify-end gap-1 text-[11px] text-muted-foreground sm:text-xs">
                  {company.visitors === 1 ? (
                    <>
                      <UserRound className="h-3.5 w-3.5" />
                      {company.visitors} visitante
                    </>
                  ) : (
                    <>
                      <UsersRound className="mb-0.5 h-3.5 w-3.5" />
                      {company.visitors} visitantes
                    </>
                  )}
                </span>
              )}
            </div>
          </div>
        </article>
      </InteractiveCard>
    </Link>
  )
}
