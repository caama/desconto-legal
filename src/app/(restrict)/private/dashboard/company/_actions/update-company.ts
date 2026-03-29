'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isValidCNPJ } from '@/utils/is-valid-cnpj'

const updateCompanyFormSchema = z
  .object({
    id: z.cuid(),
    name: z.string().trim().nonempty(),
    cnpj: z
      .string()
      .trim()
      .nonempty({ message: 'O CNPJ é obrigatório' })
      .transform(value => value.replace(/\D/g, '').slice(0, 14)) // limita aqui
      .refine(value => value.length === 14, {
        message: 'CNPJ incompleto',
      })
      .refine(
        value => {
          if (value.length < 14) return true // não valida enquanto digita
          return isValidCNPJ(value)
        },
        {
          message: 'CNPJ inválido',
        }
      ),
    responsible: z.string().trim().optional(),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z]+(?:-[a-z]+)*$/)
      .nonempty(),
    description: z.string().trim().nonempty(),
    logoUrl: z.url().optional(),
    publicImageId: z.string().optional(),
    phone: z.string().trim().optional(),
    whatsapp: z.string().trim().nonempty(),
    email: z.email().trim(),
    instagram: z.string().trim().nonempty(),
    address: z.string().trim().nonempty(),
    neighborhood: z.string().trim().nonempty(),
    zipCode: z.string().trim().nonempty(),
    discount: z.string().trim().nonempty(),
    benefits: z.string().trim().nonempty(),
    contractStart: z.coerce.date().optional(),
    contractEnd: z.coerce.date().optional(),
    featured: z.boolean().optional(),
    cityId: z.cuid(),
    categoryId: z.cuid(),
  })
  .refine(
    data => {
      if (!data.contractStart || !data.contractEnd) return true
      return data.contractEnd >= data.contractStart
    },
    {
      message: 'A data final não pode ser anterior à data inicial',
      path: ['contractEnd'],
    }
  )

export type UpdateFormType = z.infer<typeof updateCompanyFormSchema>

export async function updateCompany(data: UpdateFormType) {
  const session = await auth()

  if (!session?.user) {
    return {
      status: 401,
      error: 'Usuário não autenticado',
    }
  }

  const schema = updateCompanyFormSchema.safeParse(data)

  if (!schema.success) {
    return {
      status: 400,
      error: 'Dados inválidos, verifique os campos e tente novamente',
    }
  }

  const [slugExists, cnpjExists] = await Promise.all([
    prisma.company.findFirst({
      where: {
        slug: data.slug,
        NOT: {
          id: data.id,
        },
      },
    }),
    prisma.company.findFirst({
      where: {
        cnpj: data.cnpj,
        NOT: {
          id: data.id,
        },
      },
    }),
  ])

  if (slugExists || cnpjExists) {
    return {
      status: 400,
      error: 'Empresa já cadastrada no sistema.',
    }
  }

  try {
    await prisma.company.update({
      where: {
        id: data.id,
      },
      data,
    })

    revalidatePath('/private/dashboard')

    return {
      status: 200,
      message: 'Empresa atualizada com sucesso',
    }
  } catch (err) {
    console.log(err)

    return {
      status: 500,
      error: 'Ocorreu um erro ao atualizar a empresa',
    }
  }
}
