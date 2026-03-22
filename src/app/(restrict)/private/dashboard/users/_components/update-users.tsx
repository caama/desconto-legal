'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Edit2, Save } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { updateProfile } from '../_actions/update-user'
import { type UpdateUserFormType, useUpdateUserForm } from './users-form'

type UpdateUsersProps = {
  user: {
    id: string
    name: string | null
    role: 'ADMIN' | 'MEMBER'
  }
}

export function UpdateUsers({ user }: UpdateUsersProps) {
  const queryClient = useQueryClient()
  const { update } = useSession()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useUpdateUserForm({
    id: user.id,
    name: user.name,
    role: user.role,
  })

  async function handleUpdateUser({ id, name, role }: UpdateUserFormType) {
    const response = await updateProfile({
      id,
      name,
      role,
    })

    if (response.error) {
      toast.error(response.error)
      return
    }

    await queryClient.invalidateQueries({
      queryKey: ['users'],
    })

    await update({ name, role })

    setIsDialogOpen(false)

    toast.success(response.message)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="hover:bg-muted">
          <Edit2 className="size-4" />
          <span className="sr-only">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Informações do Funcionário</DialogTitle>
          <DialogDescription>Altere os dados do funcionário conforme necessário.</DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateUser)}>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormLabel>Nome completo:</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-sm" />
                    </FormControl>

                    {errors.name ? (
                      <FormMessage className="text-destructive text-xs">{errors.name.message}</FormMessage>
                    ) : (
                      <FormDescription className="text-muted-foreground text-xs">
                        Por favor, insira o nome completo do funcionário
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo Atual:</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-sm">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="rounded-sm" defaultValue={field.value}>
                        <SelectItem value="MEMBER">Membro</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" size="sm" type="button" className="rounded-sm md:w-[50%]">
                  Cancelar
                </Button>
              </DialogClose>

              <Button type="submit" size="sm" className="rounded-sm md:w-[50%]">
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
