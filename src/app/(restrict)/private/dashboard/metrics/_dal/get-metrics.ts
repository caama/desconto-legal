import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSaoPauloDateParts } from '@/utils/sao-paulo-date'
import { buildMetrics, buildYearOptions } from '../_data/metrics-view'

type GetMetricsProps = {
  // Valores crus da URL: o que for inválido cai no padrão (ano corrente, todas as subseções)
  year?: string
  citySlug?: string
}

export async function getMetrics({ year, citySlug }: GetMetricsProps) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN' || session.user.inactive) {
    redirect('/private/sign-in')
  }

  const now = new Date()

  // Volume pequeno (centenas de empresas): buscar o mínimo e agregar em TypeScript sai mais simples que SQL com fuso
  const [companies, cities, categories, firstStat] = await Promise.all([
    prisma.company.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        active: true,
        createdAt: true,
        contractEnd: true,
        visitors: true,
        cityId: true,
        categoryId: true,
      },
    }),
    prisma.city.findMany({
      select: { id: true, name: true, slug: true, active: true },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({ select: { id: true, name: true, active: true } }),
    prisma.companyDailyStat.findFirst({ select: { date: true }, orderBy: { date: 'asc' } }),
  ])

  const firstCompanyAt = companies.reduce<Date | null>(
    (accumulator, company) => (!accumulator || company.createdAt < accumulator ? company.createdAt : accumulator),
    null
  )

  const yearOptions = buildYearOptions(firstCompanyAt, now)
  const currentYear = getSaoPauloDateParts(now).year
  const parsedYear = Number(year)
  const selectedYear = yearOptions.includes(parsedYear) ? parsedYear : currentYear

  const selectedCity = cities.find(city => city.slug === citySlug) ?? null

  // Colunas @db.Date são lidas como meia-noite UTC: o intervalo do ano também é em UTC
  const dailyStats = await prisma.companyDailyStat.findMany({
    where: {
      date: {
        gte: new Date(Date.UTC(selectedYear, 0, 1)),
        lt: new Date(Date.UTC(selectedYear + 1, 0, 1)),
      },
    },
    select: { companyId: true, date: true, views: true, whatsappClicks: true },
  })

  const metrics = buildMetrics({
    now,
    year: selectedYear,
    selectedCityId: selectedCity?.id ?? null,
    companies,
    cities,
    categories,
    dailyStats,
    firstStatDate: firstStat?.date ?? null,
  })

  return {
    ...metrics,
    filters: {
      year: selectedYear,
      currentYear,
      yearOptions,
      citySlug: selectedCity?.slug ?? null,
      cityName: selectedCity?.name ?? null,
      cityOptions: cities.map(city => ({ slug: city.slug, name: city.name, active: city.active })),
    },
  }
}

export type MetricsResult = Awaited<ReturnType<typeof getMetrics>>
