'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { email, z } from 'zod'

const profileFormSchema = z.object({
  name: z.string().trim().nonempty({
    message: 'O nome é obrigatório',
  }),
  email: email(),
  role: z.enum(['ADMIN', 'MEMBER']),
})

export type ProfileFormType = z.infer<typeof profileFormSchema>

type useProfileFormProps = {
  name: string | null
  email: string
  role: 'ADMIN' | 'MEMBER'
}

export function useProfileForm({ name, email, role }: useProfileFormProps) {
  return useForm<ProfileFormType>({
    // email e role não são editáveis nem renderizados como campo; mantê-los registrados preserva a validação
    shouldUnregister: false,
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: name || '',
      email: email || '',
      role: role || 'MEMBER',
    },
  })
}
