'use client'

import { Lock, Save, ShieldCheck, UserRound } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import type { User } from '@/@types/next-auth'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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

function getInitials(name: string | null) {
  return (name ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')
}

export function ProfileContent({ user }: ProfileContentProps) {
  const { update } = useSession()

  const form = useProfileForm({
    name: user.name,
    email: user.email,
    role: user.role,
  })

  const { isDirty, isSubmitting } = form.formState
  const isAdmin = user.role === 'ADMIN'

  async function handleUpdateProfile({ name }: ProfileFormType) {
    const response = await updateProfile({ name })

    if (response.status !== 200) {
      toast.error('error' in response ? response.error : response.message)
      return
    }

    await update({ name }) // Atualiza o nome do usuário na sessão

    // Marca o novo nome como valor salvo (desativa o botão até a próxima alteração)
    form.reset({ ...form.getValues(), name })

    toast.success(response.message)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateProfile)}>
        <Card className="mt-2 max-w-3xl gap-0 overflow-hidden py-0">
          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="font-bold text-lg md:text-xl">Meu Perfil</CardTitle>
            <CardDescription className="text-sm">Atualize suas informações de perfil.</CardDescription>
          </CardHeader>

          {/* Identidade */}
          <div className="flex flex-wrap items-center gap-4 border-b px-6 py-5">
            {user.image ? (
              <Image
                src={user.image}
                referrerPolicy="no-referrer"
                alt=""
                width={56}
                height={56}
                priority
                className="size-14 shrink-0 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <span
                className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-lg text-primary"
                aria-hidden="true"
              >
                {getInitials(user.name)}
              </span>
            )}

            <div className="min-w-0 flex-1 basis-[calc(100%-4.5rem)] sm:basis-auto">
              <p className="truncate font-semibold text-base text-foreground">{user.name}</p>
              <p className="truncate text-muted-foreground text-sm">{user.email}</p>
            </div>

            <span
              className={cn(
                'ml-18 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs sm:ml-0',
                isAdmin ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground ring-1 ring-border'
              )}
            >
              {isAdmin ? (
                <ShieldCheck className="size-3.5" aria-hidden="true" />
              ) : (
                <UserRound className="size-3.5" aria-hidden="true" />
              )}
              {roleLabels[user.role]}
            </span>
          </div>

          {/* Dados editáveis */}
          <div className="grid items-start gap-5 px-6 py-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
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
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input className="pr-9 text-sm" disabled {...field} />
                      <Lock
                        className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">Vinculado à sua conta Google e não pode ser alterado.</FormDescription>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t bg-muted/30 px-6 py-4">
            {isDirty && !isSubmitting && <span className="text-muted-foreground text-xs">Alterações não salvas</span>}

            <Button type="submit" disabled={!isDirty || isSubmitting}>
              {isSubmitting ? (
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
          </div>
        </Card>
      </form>
    </Form>
  )
}
