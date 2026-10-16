import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildReport } from '@/lib/reports/builders'
import type { ReportFilters } from '@/lib/reports/filters'
import { getSaoPauloDateParts } from '@/utils/sao-paulo-date'

export async function getReportPreview(filters: ReportFilters) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN' || session.user.inactive) {
    redirect('/private/sign-in')
  }

  const now = new Date()

  const [report, cities, categories, firstCompany] = await Promise.all([
    buildReport(filters, now),
    prisma.city.findMany({ select: { slug: true, name: true, active: true }, orderBy: { name: 'asc' } }),
    prisma.category.findMany({ select: { slug: true, name: true, active: true }, orderBy: { name: 'asc' } }),
    prisma.company.findFirst({ select: { createdAt: true }, orderBy: { createdAt: 'asc' } }),
  ])

  const currentYear = getSaoPauloDateParts(now).year
  const firstYear = firstCompany ? Math.min(getSaoPauloDateParts(firstCompany.createdAt).year, currentYear) : currentYear

  return {
    report,
    options: {
      cities,
      categories,
      currentYear,
      years: Array.from({ length: currentYear - firstYear + 1 }, (_, index) => currentYear - index),
    },
  }
}

export type ReportPreviewOptions = Awaited<ReturnType<typeof getReportPreview>>['options']
