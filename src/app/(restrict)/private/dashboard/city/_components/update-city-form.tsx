'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const updateCityFormSchema = z.object({
  id: z.cuid(),
  name: z.string().trim().nonempty({ message: 'O nome é obrigatório' }),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z]+(?:-[a-z]+)*$/, { message: 'Use apenas letras minúsculas e hífens' })
    .nonempty(),
  isThirst: z.boolean(),
})

export type UpdateCityFormType = z.infer<typeof updateCityFormSchema>

export type UseUpdateCityFormType = {
  id: string
  name: string
  slug: string
  isThirst: boolean
}

export function useUpdateCityForm({ id, name, slug, isThirst }: UseUpdateCityFormType) {
  return useForm<UpdateCityFormType>({
    resolver: zodResolver(updateCityFormSchema),
    values: {
      id: id,
      name: name || '',
      slug: slug || '',
      isThirst: isThirst,
    },
  })
}
