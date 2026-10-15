'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const inactiveUserFormSchema = z.object({
  id: z.cuid(),
})

export type InactiveUserFormType = z.infer<typeof inactiveUserFormSchema>

export async function inactiveUser({ id }: InactiveUserFormType) {
  const session = await auth()

  if (!session?.user) {
    return {
      status: 401,
      error: 'Usuário não autenticado',
    }
  }

  // Gerenciar usuários é exclusivo de administradores (a página já restringe, mas a action pode ser chamada direto)
  if (session.user.role !== 'ADMIN') {
    return {
      status: 403,
      error: 'Apenas administradores podem gerenciar usuários',
    }
  }

  const schema = inactiveUserFormSchema.safeParse({
    id,
  })

  if (!schema.success) {
    return {
      status: 400,
      error: 'Ocorreu um erro ao inativar o usuário',
    }
  }

  // Impede que o administrador se tranque para fora do painel
  if (schema.data.id === session.user.id) {
    return {
      status: 400,
      error: 'Você não pode inativar o seu próprio cadastro',
    }
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: schema.data.id,
    },
  })

  if (!userExists) {
    return {
      status: 404,
      error: 'Usuário não encontrado',
    }
  }

  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        inactive: new Date(),
        updatedAt: new Date(),
      },
    })

    revalidatePath('/private/dashboard/users')

    return {
      status: 200,
      message: 'Usuário inativado com sucesso',
    }
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      error: 'Ocorreu um erro ao inativar o usuário',
    }
  }
}
