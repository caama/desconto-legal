'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const newCategoryFormSchema = z.object({
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

type NewCategoryFormType = z.infer<typeof newCategoryFormSchema>

export async function createCategory({ name, slug, icon }: NewCategoryFormType) {
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

  const schema = newCategoryFormSchema.safeParse({
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
      slug,
    },
  })

  if (categoryExists) {
    return {
      status: 400,
      error: 'Categoria já cadastrada no sistema.',
    }
  }

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        icon,
      },
    })

    revalidatePath('/private/dashboard/category')

    return {
      status: 201,
      message: 'Categoria cadastrada com sucesso.',
    }
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      error: 'Erro ao cadastrar categoria.',
    }
  }
}
