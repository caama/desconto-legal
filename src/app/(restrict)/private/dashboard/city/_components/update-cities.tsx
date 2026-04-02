'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Edit2, Save } from 'lucide-react'
import { useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Separator } from '@/components/ui/separator'
import { updateProfile } from '../_actions/update-city'
import { type UpdateCityFormType, useUpdateCityForm } from './update-city-form'

type UpdateCityProps = {
  cities: {
    id: string
    name: string
    slug: string
    isThirst: boolean
  }
}

export function UpdateCities({ cities }: UpdateCityProps) {
  const queryClient = useQueryClient()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useUpdateCityForm({
    id: cities.id,
    name: cities.name,
    slug: cities.slug,
    isThirst: cities.isThirst,
  })

  async function handleUpdateCity({ id, name, slug, isThirst }: UpdateCityFormType) {
    const response = await updateProfile({ id, name, slug, isThirst })

    if (response.error) {
      toast.error(response.error)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['cities'] })

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
          <DialogTitle>Editar Informações da Cidade</DialogTitle>
          <DialogDescription>Altere os dados da cidade conforme necessário.</DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateCity)}>
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
                name="slug"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormLabel>Slug da Cidade:</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: sao-luis" {...field} className="rounded-sm placeholder:text-xs" />
                    </FormControl>

                    {errors.name ? (
                      <FormMessage className="text-destructive text-xs">{errors.name.message}</FormMessage>
                    ) : (
                      <FormDescription className="text-muted-foreground text-xs">
                        Use apenas letras minúsculas e hífens.
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isThirst"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>

                    <FormLabel className="text-sm">Sede</FormLabel>
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

              <Button type="submit" disabled={form.formState.isSubmitting} size="sm" className="rounded-sm md:w-[50%]">
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
