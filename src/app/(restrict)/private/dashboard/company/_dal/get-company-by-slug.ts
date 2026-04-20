'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type GetCompanyByIdProps = {
  id: string
}

export async function getCompanyById({ id }: GetCompanyByIdProps) {
  const session = await auth()

  if (!session?.user) {
    throw new Error('Usuário não autenticado')
  }

  const company = await prisma.company.findUnique({
    where: { id },
  })

  if (!company) {
    return null
  }

  return company
}
