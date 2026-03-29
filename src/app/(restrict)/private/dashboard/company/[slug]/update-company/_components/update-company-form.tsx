'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { isValidCNPJ } from '@/utils/is-valid-cnpj'

const updateCompanyFormSchema = z
  .object({
    id: z.cuid(),
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
    description: z.string().trim().nonempty({
      message: 'A descrição é obrigatória',
    }),
    logoUrl: z.string().optional(),
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
    contractStart: z.date().optional(),
    contractEnd: z.date().optional(),
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

export type UpdateCompanyFormType = z.infer<typeof updateCompanyFormSchema>

export function useUpdateCompanyForm({
  id,
  name,
  cnpj,
  responsible,
  slug,
  description,
  logoUrl,
  publicImageId,
  phone,
  whatsapp,
  email,
  instagram,
  address,
  neighborhood,
  zipCode,
  discount,
  benefits,
  contractStart,
  contractEnd,
  featured,
  cityId,
  categoryId,
}: UpdateCompanyFormType) {
  return useForm<UpdateCompanyFormType>({
    resolver: zodResolver(updateCompanyFormSchema),
    values: {
      id: id || '',
      name: name || '',
      cnpj: cnpj || '',
      responsible: responsible || '',
      slug: slug || '',
      description: description || '',
      logoUrl: logoUrl || '',
      publicImageId: publicImageId || '',
      phone: phone || '',
      whatsapp: whatsapp || '',
      email: email || '',
      instagram: instagram || '',
      address: address || '',
      neighborhood: neighborhood || '',
      zipCode: zipCode || '',
      discount: discount || '',
      benefits: benefits || '',
      contractStart: contractStart || undefined,
      contractEnd: contractEnd || undefined,
      featured: featured || false,
      cityId: cityId || '',
      categoryId: categoryId || '',
    },
  })
}
