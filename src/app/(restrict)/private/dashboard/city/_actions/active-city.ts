'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const activeCityFormSchema = z.object({
  id: z.cuid(),
})

export type ActiveCityFormType = z.infer<typeof activeCityFormSchema>

export async function activeCity({ id }: ActiveCityFormType) {
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

  const schema = activeCityFormSchema.safeParse({
    id,
  })

  if (!schema.success) {
    return {
      status: 400,
      error: 'Ocorreu um erro ao ativar a cidade',
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
        active: true,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/private/dashboard/city')
    revalidatePath('/')

    return {
      status: 200,
      message: 'Cidade ativada com sucesso',
    }
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      error: 'Ocorreu um erro ao ativar a cidade.',
    }
  }
}
