'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isValidCNPJ } from '@/utils/is-valid-cnpj'

const newCompanyFormSchema = z
  .object({
    name: z.string().trim().nonempty({
      message: 'O nome é obrigatório',
    }),
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
      .regex(/^[a-z]+(?:-[a-z]+)*$/, {
        message: 'Use apenas letras minúsculas e hífens',
      })
      .nonempty(),
    description: z.string().trim().nonempty(),
    logoUrl: z.url().optional(),
    publicImageId: z.string().optional(),
    phone: z.string().trim().optional(),
    whatsapp: z.string().trim().nonempty({
      message: 'O WhatsApp é obrigatório',
    }),
    email: z
      .email({
        message: 'Insira um e-mail válido',
      })
      .trim(),
    instagram: z.string().trim().nonempty({
      message: 'O Instagram é obrigatório',
    }),
    address: z.string().trim().nonempty({
      message: 'O endereço é obrigatório',
    }),
    neighborhood: z.string().trim().nonempty({
      message: 'O bairro é obrigatório',
    }),
    zipCode: z.string().trim().nonempty({
      message: 'O CEP é obrigatório',
    }),
    discount: z.string().trim().nonempty({ message: 'O desconto é obrigatório' }),
    benefits: z.string().trim().nonempty({
      message: 'Os benefícios são obrigatórios',
    }),
    contractStart: z.coerce.date().optional(),
    contractEnd: z.coerce.date().optional(),
    featured: z.boolean().optional(),
    cityId: z.cuid({
      message: 'A cidade é obrigatória',
    }),
    categoryId: z.cuid({
      message: 'A categoria é obrigatória',
    }),
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

export type NewCompanyFormType = z.input<typeof newCompanyFormSchema>

export async function createCompany(data: NewCompanyFormType) {
  const session = await auth()

  if (!session?.user) {
    return {
      status: 401,
      error: 'Usuário não autenticado',
    }
  }

  const schema = newCompanyFormSchema.safeParse(data)

  if (!schema.success) {
    return {
      status: 400,
      error: 'Os campos obrigatórios devem ser preenchidos',
    }
  }

  const [slugExists, cnpjExists] = await Promise.all([
    prisma.company.findUnique({ where: { slug: data.slug } }),
    prisma.company.findUnique({ where: { cnpj: data.cnpj } }),
  ])

  if (slugExists || cnpjExists) {
    return {
      status: 400,
      error: 'Empresa já cadastrada no sistema.',
    }
  }

  try {
    await prisma.company.create({ data: schema.data })

    revalidatePath('/private/dashboard')

    return {
      status: 201,
      message: 'Empresa cadastrada com sucesso.',
    }
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      error: 'Erro ao cadastrar nova empresa.',
    }
  }
}
