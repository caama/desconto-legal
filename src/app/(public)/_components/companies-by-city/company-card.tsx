import { MapPin, Star, Tag, UserRound, UsersRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShinyButton } from '@/components/ui/shiny-button'
import type { CompanyWithRelations } from '../../_dal/get-companies-by-city'

interface CompanyCardProps {
  company: CompanyWithRelations
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/city/${company.city.slug}/companies/${company.slug}/details`}>
      <Card className="group hover:-translate-y-1.25 flex h-full flex-col overflow-hidden border-slate-200/80 bg-white p-0 transition-all duration-300 hover:border-primary hover:shadow-lg">
        <div className="relative flex min-h-[14px] items-center justify-center border-slate-100 border-b bg-white px-5 py-5 sm:min-h-[14px] sm:px-6 sm:py-6">
          {company.logoUrl ? (
            <Image
              src={company.logoUrl}
              alt={company.name}
              width={240}
              height={110}
              className="h-auto max-h-[72px] w-auto max-w-full object-contain drop-shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-transform duration-300 group-hover:scale-[1.04] sm:max-h-[82px]"
              quality={100}
              priority
            />
          ) : (
            <div className="flex h-16 w-full max-w-[220px] items-center justify-center rounded-2xl border border-slate-200 border-dashed bg-slate-50 px-4 text-center text-slate-400 text-sm">
              Logo indisponivel
            </div>
          )}
        </div>

        <CardHeader className="space-y-1 px-4 sm:px-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-base leading-tight group-hover:text-primary sm:text-lg">{company.name}</CardTitle>
              <CardDescription className="mt-1.5 flex items-center gap-2 text-[11px] sm:text-xs">
                <MapPin className="size-3" />
                {company.address}
              </CardDescription>
            </div>
            <div className="flex flex-col items-center gap-3">
              {company.featured && (
                <Badge variant="secondary" className="shrink-0">
                  <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                  Destaque
                </Badge>
              )}
            </div>
          </div>

          {company.category && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
              <Tag className="h-3 w-3" />
              <span>{company.category.name}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex flex-1 flex-col px-4 pb-4 sm:px-5 sm:pb-5">
          {company.description && (
            <p className="mb-4 line-clamp-2 text-muted-foreground text-xs leading-relaxed sm:text-sm">{company.description}</p>
          )}

          {company.discount && (
            <ShinyButton className="mt-auto w-full rounded-xl bg-primary px-4 py-2.5 text-center sm:py-3">
              <p className="font-semibold text-sm text-white">{company.discount}</p>
            </ShinyButton>
          )}

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
        </CardContent>
      </Card>
    </Link>
  )
}
