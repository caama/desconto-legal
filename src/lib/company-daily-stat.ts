import { prisma } from '@/lib/prisma'
import { getSaoPauloDay } from '@/utils/sao-paulo-date'

type DailyStatField = 'views' | 'whatsappClicks'

// Soma 1 na procura do dia da empresa (uma linha por empresa por dia)
export async function incrementCompanyDailyStat(companyId: string, field: DailyStatField) {
  const date = getSaoPauloDay()

  try {
    await prisma.companyDailyStat.upsert({
      where: { companyId_date: { companyId, date } },
      create: { companyId, date, [field]: 1 },
      update: { [field]: { increment: 1 } },
    })
  } catch (error) {
    // Dois primeiros registros do dia ao mesmo tempo colidem na chave única: a linha já existe, basta somar
    if ((error as { code?: string }).code !== 'P2002') throw error

    await prisma.companyDailyStat.update({
      where: { companyId_date: { companyId, date } },
      data: { [field]: { increment: 1 } },
    })
  }
}
