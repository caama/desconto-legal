'use server'

import { prisma } from '@/lib/prisma'
import type { CompanyWithRelations } from './get-companies-by-city'

type GetRelatedCompaniesProps = {
  cityId: string
  categoryId: string
  excludeId: string
  take?: number
}

// Outras empresas ativas da mesma cidade: primeiro as da mesma categoria, depois as em destaque
export async function getRelatedCompanies({
  cityId,
  categoryId,
  excludeId,
  take = 3,
}: GetRelatedCompaniesProps): Promise<CompanyWithRelations[]> {
  const companies = await prisma.company.findMany({
    where: {
      cityId,
      active: true,
      id: { not: excludeId },
    },
    include: {
      city: { select: { slug: true, name: true } },
      category: {
        select: {
          name: true,
          icon: true,
          _count: { select: { companies: { where: { active: true } } } },
        },
      },
    },
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    take: 24,
  })

  return companies.sort((a, b) => Number(b.categoryId === categoryId) - Number(a.categoryId === categoryId)).slice(0, take)
}
