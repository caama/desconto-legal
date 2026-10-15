'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const userFormSchema = z.object({
  id: z.cuid(),
  name: z.string().trim().nonempty(),
  role: z.enum(['ADMIN', 'MEMBER']),
})

export type UserFormType = z.infer<typeof userFormSchema>

export async function updateProfile({ id, name, role }: UserFormType) {
  const session = await auth()

  if (!session?.user) {
    return {
      status: 401,
      error: 'Usuário não autenticado',
    }
  }

  // Gerenciar usuários é exclusivo de administradores (a página já restringe, mas a action pode ser chamada direto)
  if (session.user.role !== 'ADMIN') {
    return {
      status: 403,
      error: 'Apenas administradores podem gerenciar usuários',
    }
  }

  const schema = userFormSchema.safeParse({
    id,
    name,
    role,
  })

  if (!schema.success) {
    return {
      status: 400,
      error: 'Os campos obrigatórios devem ser preenchidos',
    }
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id,
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
        name,
        role,
      },
    })

    revalidatePath('/private/dashboard/users')

    return {
      status: 200,
      message: 'Usuário atualizado com sucesso',
    }
  } catch (err) {
    console.log(err)

    return {
      status: 500,
      error: 'Ocorreu um erro ao atualizar o perfil',
    }
  }
}
