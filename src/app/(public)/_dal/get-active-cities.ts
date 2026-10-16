'use server'

import type { City } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' })

export async function getActiveCities(): Promise<City[]> {
  const cities = await prisma.city.findMany({
    where: {
      active: true,
    },
  })

  if (!cities) {
    return []
  }

  // Sedes primeiro; dentro de cada grupo, ordem alfabética (collator pt-BR para tratar acentos)
  return cities.sort((a, b) => Number(b.isThirst) - Number(a.isThirst) || collator.compare(a.name, b.name))
}
