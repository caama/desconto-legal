'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isValidCompanyDocument, normalizeCompanyDocument } from '@/utils/company-document'

const updateCompanyFormSchema = z
  .object({
    id: z.cuid(),
    name: z.string().trim().nonempty(),
    document: z
      .string()
      .trim()
      .nonempty({ message: 'O CPF ou CNPJ é obrigatório' })
      .transform(normalizeCompanyDocument)
      .refine(value => value.length === 11 || value.length === 14, {
        message: 'CPF ou CNPJ incompleto',
      })
      .refine(isValidCompanyDocument, {
        message: 'CPF ou CNPJ inválido',
      }),
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
    contractStart: z.coerce.date().nullable().optional(),
    contractEnd: z.coerce.date().nullable().optional(),
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

  const { document, ...rest } = schema.data

  const [slugExists, cnpjExists] = await Promise.all([
    prisma.company.findFirst({
      where: {
        slug: rest.slug,
        NOT: {
          id: rest.id,
        },
      },
    }),
    prisma.company.findFirst({
      where: {
        cnpj: document,
        NOT: {
          id: rest.id,
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
        id: rest.id,
      },
      data: {
        ...rest,
        contractStart: rest.contractStart ?? null,
        contractEnd: rest.contractEnd ?? null,
        cnpj: document,
      },
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
