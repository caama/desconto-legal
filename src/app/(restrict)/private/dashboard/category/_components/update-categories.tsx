'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Save, SquarePen } from 'lucide-react'
import { useState } from 'react'
import { useWatch } from 'react-hook-form'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { slugify } from '@/utils/slugify'
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

  // O slug acompanha o nome enquanto ainda for o gerado automaticamente; um slug personalizado é preservado
  const isSlugCustom = (slug: string, name: string) => slug !== slugify(name)
  const [isSlugEditedManually, setIsSlugEditedManually] = useState(() => isSlugCustom(categories.slug, categories.name))

  // Assinatura explícita: o React Compiler memoriza o componente e uma leitura via watch não re-renderizaria
  const slug = useWatch({ control: form.control, name: 'slug' })
  const isSlugChanged = slug.trim() !== '' && slug !== categories.slug

  function handleNameChange(value: string) {
    form.setValue('name', value, { shouldDirty: true, shouldValidate: form.formState.isSubmitted })

    if (!isSlugEditedManually) {
      form.setValue('slug', slugify(value), { shouldDirty: true, shouldValidate: form.formState.isSubmitted })
    }
  }

  function handleSlugChange(value: string) {
    form.setValue('slug', value, { shouldDirty: true, shouldValidate: form.formState.isSubmitted })
    setIsSlugEditedManually(value.trim() !== '')
  }

  // Cada abertura parte dos dados salvos, inclusive o vínculo entre nome e slug
  function handleOpenChange(open: boolean) {
    if (open) {
      form.reset()
      setIsSlugEditedManually(isSlugCustom(categories.slug, categories.name))
    }

    setIsDialogOpen(open)
  }

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
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon-sm" className="text-muted-foreground hover:text-foreground">
              <SquarePen className="size-4" />
              <span className="sr-only">Editar categoria</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Editar categoria</TooltipContent>
      </Tooltip>
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
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} onChange={event => handleNameChange(event.target.value)} className="rounded-sm" />
                    </FormControl>

                    {errors.name ? (
                      <FormMessage className="text-destructive text-xs">{errors.name.message}</FormMessage>
                    ) : (
                      <FormDescription className="text-muted-foreground text-xs">Nome como aparece no site</FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: alimentacao"
                        {...field}
                        onChange={event => handleSlugChange(event.target.value)}
                        className="rounded-sm placeholder:text-xs"
                      />
                    </FormControl>

                    {errors.slug ? (
                      <FormMessage className="text-destructive text-xs">{errors.slug.message}</FormMessage>
                    ) : isSlugChanged ? (
                      <FormDescription className="text-amber-700 text-xs">
                        O endereço da categoria muda e links antigos para ela deixam de funcionar.
                      </FormDescription>
                    ) : (
                      <FormDescription className="text-muted-foreground text-xs">
                        Gerado a partir do nome. Use apenas letras minúsculas e hífens.
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
                    <FormLabel>Ícone (opcional)</FormLabel>
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
