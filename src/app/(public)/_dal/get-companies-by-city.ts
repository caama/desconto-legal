'use server'

import type { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

type GetCompaniesByCityProps = {
  cityId: string
  query?: string
  categories?: string | string[]
}

export type CompanyWithRelations = Prisma.CompanyGetPayload<{
  include: {
    city: {
      select: {
        slug: true
        name: true
      }
    }
    category: {
      select: {
        name: true
        icon: true
        _count: {
          select: {
            companies: true
          }
        }
      }
    }
  }
}>

export async function getCompaniesByCity({
  cityId,
  query,
  categories: rawCategories,
}: GetCompaniesByCityProps): Promise<CompanyWithRelations[]> {
  const categories = !rawCategories ? [] : Array.isArray(rawCategories) ? rawCategories : [rawCategories]

  const hasCategories = !!categories.length
  const hasQuery = !!query?.trim()

  return prisma.company.findMany({
    where: {
      cityId,
      categoryId: hasCategories ? { in: categories } : undefined,
      OR: hasQuery ? [{ name: { contains: query, mode: 'insensitive' } }] : undefined,
      active: true,
    },
    include: {
      city: {
        select: {
          slug: true,
          name: true,
        },
      },
      category: {
        select: {
          name: true,
          icon: true,
          _count: {
            select: {
              companies: {
                where: {
                  active: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      featured: 'desc',
    },
  })
}
