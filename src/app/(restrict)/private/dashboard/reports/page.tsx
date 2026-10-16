import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { parseReportFilters, toReportQuery } from '@/lib/reports/filters'
import { ReportBoard } from './_components/report-board'
import { ReportPicker } from './_components/report-picker'
import { ReportSkeleton } from './_components/report-skeleton'

export const metadata: Metadata = {
  title: 'Relatórios | Desconto Legal',
}

type ReportsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/private/sign-in')
  }

  if (session.user.inactive) {
    redirect('/private/sign-in/blocked')
  }

  const filters = parseReportFilters(await searchParams)

  return (
    <div className="mt-2 space-y-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-semibold text-primary text-xl tracking-tight">Relatórios</h1>
        <p className="max-w-3xl text-muted-foreground text-sm leading-relaxed">
          Escolha o relatório, ajuste os filtros e confira a prévia. O PDF e o Excel saem com a identidade da CAAMA e exatamente
          os mesmos filtros.
        </p>
      </header>

      <ReportPicker filters={filters} />

      {/* A chave troca com o recorte: o esqueleto aparece enquanto o novo relatório é montado */}
      <Suspense key={`${filters.relatorio}?${toReportQuery(filters)}`} fallback={<ReportSkeleton />}>
        <ReportBoard filters={filters} />
      </Suspense>
    </div>
  )
}
