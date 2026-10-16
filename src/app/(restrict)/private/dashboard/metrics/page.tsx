import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { MetricsBoard } from './_components/metrics-board'
import { MetricsNotice } from './_components/metrics-notice'
import { MetricsSkeleton } from './_components/metrics-skeleton'

export const metadata: Metadata = {
  title: 'Métricas | Desconto Legal',
}

type MetricsPageProps = {
  searchParams: Promise<{ ano?: string | string[]; subsecao?: string | string[] }>
}

const firstValue = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value)

export default async function MetricsPage({ searchParams }: MetricsPageProps) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/private/sign-in')
  }

  if (session.user.inactive) {
    redirect('/private/sign-in/blocked')
  }

  const params = await searchParams
  const year = firstValue(params.ano)
  const citySlug = firstValue(params.subsecao)

  return (
    <div className="mt-2 space-y-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-semibold text-primary text-xl tracking-tight">Métricas</h1>
        <p className="max-w-3xl text-muted-foreground text-sm leading-relaxed">
          Crescimento dos convênios, cobertura por subseção, contratos para renovar e as empresas que os advogados mais procuram,
          para orientar renovação e prospecção.
        </p>
      </header>

      <MetricsNotice />

      {/* A chave troca com o filtro: o esqueleto aparece enquanto o novo recorte é calculado */}
      <Suspense key={`${year ?? ''}-${citySlug ?? ''}`} fallback={<MetricsSkeleton />}>
        <MetricsBoard year={year} citySlug={citySlug} />
      </Suspense>
    </div>
  )
}
