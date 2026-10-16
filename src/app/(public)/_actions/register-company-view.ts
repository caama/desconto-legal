'use server'

import { z } from 'zod'
import { incrementCompanyDailyStat } from '@/lib/company-daily-stat'
import { prisma } from '@/lib/prisma'

const registerCompanyViewSchema = z.object({
  companyId: z.cuid(),
})

// Conta a abertura da página de detalhes; falhar aqui nunca pode atrapalhar quem está navegando
export async function registerCompanyView({ companyId }: { companyId: string }) {
  const schema = registerCompanyViewSchema.safeParse({ companyId })

  if (!schema.success) return

  try {
    const company = await prisma.company.findUnique({
      where: { id: schema.data.companyId },
      select: { active: true },
    })

    if (!company?.active) return

    await incrementCompanyDailyStat(schema.data.companyId, 'views')
  } catch (error) {
    console.error('Erro ao registrar visita da empresa', error)
  }
}
