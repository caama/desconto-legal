'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const activeCategoryFormSchema = z.object({
  id: z.cuid(),
})

export type ActiveCategoryFormType = z.infer<typeof activeCategoryFormSchema>

export async function activeCategory({ id }: ActiveCategoryFormType) {
  const session = await auth()

  if (!session?.user) {
    return {
      status: 401,
      error: 'Usuário não autenticado',
    }
  }

  // Gerenciar categorias é exclusivo de administradores (a página já restringe, mas a action pode ser chamada direto)
  if (session.user.role !== 'ADMIN') {
    return {
      status: 403,
      error: 'Apenas administradores podem gerenciar categorias',
    }
  }

  const schema = activeCategoryFormSchema.safeParse({
    id,
  })

  if (!schema.success) {
    return {
      status: 400,
      error: 'Ocorreu um erro ao ativar a categoria.',
    }
  }

  const categoryExists = await prisma.category.findUnique({
    where: {
      id: schema.data.id,
    },
  })

  if (!categoryExists) {
    return {
      status: 404,
      error: 'Categoria não encontrada',
    }
  }

  try {
    await prisma.category.update({
      where: {
        id: schema.data.id,
      },
      data: {
        active: true,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/private/dashboard/category')

    return {
      status: 200,
      message: 'Categoria ativada com sucesso',
    }
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      error: 'Ocorreu um erro ao ativar a categoria.',
    }
  }
}
