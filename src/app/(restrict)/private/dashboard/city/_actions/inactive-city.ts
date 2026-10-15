'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const inactiveCityFormSchema = z.object({
  id: z.cuid(),
})

export type InactiveCityFormType = z.infer<typeof inactiveCityFormSchema>

export async function inactiveCity({ id }: InactiveCityFormType) {
  const session = await auth()

  if (!session?.user) {
    return {
      status: 401,
      error: 'Usuário não autenticado',
    }
  }

  // Gerenciar cidades é exclusivo de administradores (a página já restringe, mas a action pode ser chamada direto)
  if (session.user.role !== 'ADMIN') {
    return {
      status: 403,
      error: 'Apenas administradores podem gerenciar cidades',
    }
  }

  const schema = inactiveCityFormSchema.safeParse({
    id,
  })

  if (!schema.success) {
    return {
      status: 400,
      error: 'Ocorreu um erro ao inativar a cidade',
    }
  }

  const cityExists = await prisma.city.findUnique({
    where: {
      id: schema.data.id,
    },
  })

  if (!cityExists) {
    return {
      status: 404,
      error: 'Cidade não encontrada',
    }
  }

  try {
    await prisma.city.update({
      where: {
        id: schema.data.id,
      },
      data: {
        active: false,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/private/dashboard/city')
    revalidatePath('/')

    return {
      status: 200,
      message: 'Cidade inativada com sucesso',
    }
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      error: 'Ocorreu um erro ao inativar a cidade.',
    }
  }
}
