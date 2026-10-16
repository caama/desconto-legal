'use server'

import { z } from 'zod'
import { incrementCompanyDailyStat } from '@/lib/company-daily-stat'
import { prisma } from '@/lib/prisma'

type AddVisitorInCompanyProps = {
  companyId: string
}

const addVisitorInCompanySchema = z.object({
  companyId: z.cuid(),
})

export async function addVisitorInCompany({ companyId }: AddVisitorInCompanyProps) {
  const schema = addVisitorInCompanySchema.safeParse({
    companyId,
  })

  if (!schema.success) {
    return {
      status: 400,
      error: 'Ocorreu um erro ao adicionar visitante',
    }
  }

  // TODO: Verificar se a empresa existe
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  })

  // Empresa inativa não aparece no site: um clique que chegue para ela não conta
  if (!company || !company.active) {
    return {
      status: 404,
      error: 'Empresa não encontrada',
    }
  }

  // TODO: Atualizar o contador de visitantes
  await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      visitors: {
        increment: 1,
      },
    },
  })

  // Contato do dia, para as métricas por período; o total acima segue alimentando o destaque
  try {
    await incrementCompanyDailyStat(companyId, 'whatsappClicks')
  } catch (error) {
    console.error('Erro ao registrar contato diário da empresa', error)
  }

  // Verificar se a empresa deve ser destacada
  if (company.visitors && company.visitors >= 20 && !company.featured) {
    await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        featured: true,
      },
    })
  }

  // TODO: Retornar sucesso
  return {
    status: 200,
    message: 'Visitante adicionado com sucesso',
  }
}
