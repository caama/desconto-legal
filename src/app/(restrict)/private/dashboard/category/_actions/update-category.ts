'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const categoryFormSchema = z.object({
  id: z.cuid(),
  name: z.string().trim().nonempty({
    message: 'O nome é obrigatório',
  }),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z]+(?:-[a-z]+)*$/, {
      message: 'Use apenas letras minúsculas e hífens',
    })
    .nonempty(),
  icon: z.string().optional(),
})

export type CategoryFormType = z.infer<typeof categoryFormSchema>

export async function updateCategory({ id, name, slug, icon }: CategoryFormType) {
  const session = await auth()

  if (!session?.user) {
    return {
      status: 401,
      error: 'Usuário não autenticado',
    }
  }

  // Gerenciar categorias é exclusivo de administradores (a página já restringe, mas a action pode ser chamada direto)
  if (session.user.role !== 'ADMIN') {
    return {
      status: 403,
      error: 'Apenas administradores podem gerenciar categorias',
    }
  }

  const schema = categoryFormSchema.safeParse({
    id,
    name,
    slug,
    icon,
  })

  if (!schema.success) {
    return {
      status: 400,
      error: 'Os campos obrigatórios devem ser preenchidos',
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
        id: id,
      },
      data: {
        name,
        slug,
        icon,
      },
    })

    revalidatePath('/private/dashboard/category')

    return {
      status: 200,
      message: 'Categoria atualizada com sucesso',
    }
  } catch (err) {
    console.log(err)

    return {
      status: 500,
      error: 'Ocorreu um erro ao atualizar a categoria.',
    }
  }
}
