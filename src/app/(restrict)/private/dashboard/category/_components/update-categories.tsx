'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Edit2, Save } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { updateCategory } from '../_actions/update-category'
import { type UpdateCategoryFormType, useUpdateCategoryForm } from './update-category-form'

type UpdateCategoryProps = {
  categories: {
    id: string
    name: string
    slug: string
    icon: string | null
  }
}

export function UpdateCategories({ categories }: UpdateCategoryProps) {
  const queryClient = useQueryClient()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useUpdateCategoryForm({
    id: categories.id,
    name: categories.name,
    slug: categories.slug,
    icon: categories.icon,
  })

  async function handleUpdateCategory({ id, name, slug, icon }: UpdateCategoryFormType) {
    const response = await updateCategory({ id, name, slug, icon })

    if (response.error) {
      toast.error(response.error)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['categories'] })

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
          <DialogTitle>Editar Informações da Categoria</DialogTitle>
          <DialogDescription>Altere os dados da categoria conforme necessário.</DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateCategory)}>
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
                        Por favor, insira o nome completo da categoria
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
                    <FormLabel>Slug da Categoria:</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: sao-luis" {...field} className="rounded-sm placeholder:text-xs" />
                    </FormControl>

                    {errors.slug ? (
                      <FormMessage className="text-destructive text-xs">{errors.slug.message}</FormMessage>
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
                name="icon"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormLabel>Ícone (Opcional):</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-sm" />
                    </FormControl>

                    <FormMessage className="text-destructive text-xs">{errors.icon?.message}</FormMessage>
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

              <Button type="submit" size="sm" disabled={form.formState.isSubmitting} className="rounded-sm md:w-[50%]">
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
