'use server'

import { prisma } from '@/lib/prisma'

type GetCompanyBySlugProps = {
  slug: string
  citySlug: string
}

export async function getCompanyBySlug({ slug, citySlug }: GetCompanyBySlugProps) {
  const company = await prisma.company.findFirst({
    where: {
      slug,
      city: { slug: citySlug },
    },
    include: {
      city: true,
      category: true,
    },
  })

  if (!company) {
    return null
  }

  return company
}
