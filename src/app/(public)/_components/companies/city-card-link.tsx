'use client'

import { useRouter } from '@bprogress/next/app'
import { ExternalLink, LoaderCircle, MapPin } from 'lucide-react'
import { useTransition } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { City } from '@/generated/prisma/client'
import { cn } from '@/lib/utils'
import { AnimatedCard } from './animated-card'

type CityCardLinkProps = {
  city: City
}

export function CityCardLink({ city }: CityCardLinkProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const href = `/city/${city.slug}/companies`

  function handleNavigate() {
    if (isPending) {
      return
    }

    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <AnimatedCard>
      <button
        type="button"
        onClick={handleNavigate}
        onMouseEnter={() => router.prefetch(href)}
        className="block w-full text-left"
        aria-busy={isPending}
      >
        <Card className="group hover:-translate-y-1.25 relative overflow-hidden transition-all duration-300 hover:border-muted/70 hover:shadow-lg">
          <div className="absolute top-3 right-3 z-10">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-primary">
              <ExternalLink
                className="h-4 w-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground"
                strokeWidth={2.5}
              />
            </div>
          </div>

          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/15 via-primary/10 to-primary/5 text-primary shadow-sm transition-all duration-500 ease-out group-hover:rotate-3 group-hover:scale-110 group-hover:from-primary group-hover:via-primary group-hover:to-primary/90 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25">
              <MapPin className="size-6" />
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-foreground group-hover:text-primary">{city.name}</h4>
              {city.isThirst ? (
                <span className="flex items-center gap-1.5 text-primary text-xs">
                  <div className="size-2 animate-pulse rounded-full bg-primary" />
                  Sede
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <div className="size-2 rounded-full bg-muted-foreground" />
                  Subseção
                </span>
              )}
            </div>
          </CardContent>

          <span
            className={cn(
              buttonVariants({ size: 'sm' }),
              'pointer-events-none absolute right-4 bottom-4',
              isPending && 'opacity-90'
            )}
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                Acessando
              </>
            ) : (
              'Ver empresas'
            )}
          </span>
        </Card>
      </button>
    </AnimatedCard>
  )
}
