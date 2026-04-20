'use client'

import { Save } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import type { User } from '@/@types/next-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { updateProfile } from '../_actions/update-profile'
import { type ProfileFormType, useProfileForm } from './profile-form'

interface ProfileContentProps {
  user: User
}

const roleLabels = {
  ADMIN: 'Administrador',
  MEMBER: 'Membro',
} as const

export function ProfileContent({ user }: ProfileContentProps) {
  const { update } = useSession()

  const form = useProfileForm({
    name: user.name,
    email: user.email,
    role: user.role,
  })

  async function handleUpdateProfile({ name }: ProfileFormType) {
    const response = await updateProfile({ name })

    if (response.error) {
      toast.error(response.message)
      return
    }

    await update({ name }) // Atualiza o nome do usuário na sessão

    toast.success(response.message)
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateProfile)}>
          <Card className="mx-auto mt-8 lg:max-w-7xl">
            <CardHeader>
              <CardTitle className="font-bold text-lg md:text-2xl">Meu Perfil</CardTitle>
              <CardDescription className="text-sm md:text-base">Atualize suas informações de perfil.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="relative mx-auto flex h-25 w-25 overflow-hidden rounded-full md:h-42 md:w-42">
                <Image
                  src={user.image || ''}
                  alt={user.name || ''}
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo:</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" className="text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu-email:</FormLabel>
                      <FormControl>
                        <Input className="text-sm" disabled {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={() => (
                    <FormItem>
                      <FormLabel>Sua função:</FormLabel>
                      <FormControl>
                        <Badge
                          className={cn('bg-primary/10 px-3 py-1 text-primary hover:bg-primary/20', {
                            'bg-destructive/10 text-destructive hover:bg-destructive/20': user.role === 'ADMIN',
                          })}
                        >
                          {roleLabels[user.role]}
                        </Badge>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="mt-2 w-full bg-[#22254D] text-white">
                {form.formState.isSubmitting ? (
                  <>
                    <ImSpinner2 className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Salvar alterações
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
