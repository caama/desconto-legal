'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Plus, Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { slugify } from '@/utils/slugify'
import { createCategory } from '../_actions/create-category'
import { type NewCategoryFormType, useNewCategoryForm } from './category-form'

export function NewCategory() {
  const params = useParams<{ slug: string }>()
  const citySlug = params.slug

  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const queryClient = useQueryClient()

  const form = useNewCategoryForm({
    name: '',
    slug: '',
    icon: '',
  })

  // O slug acompanha o nome até ser editado manualmente (apagar o slug reativa o automático)
  const [isSlugEditedManually, setIsSlugEditedManually] = useState(false)

  function handleNameChange(value: string) {
    form.setValue('name', value, { shouldDirty: true, shouldValidate: form.formState.isSubmitted })

    if (!isSlugEditedManually) {
      form.setValue('slug', slugify(value), { shouldValidate: form.formState.isSubmitted })
    }
  }

  function handleSlugChange(value: string) {
    form.setValue('slug', value, { shouldDirty: true, shouldValidate: form.formState.isSubmitted })
    setIsSlugEditedManually(value.trim() !== '')
  }

  // Cada abertura começa do zero, inclusive o vínculo entre nome e slug
  function handleOpenChange(open: boolean) {
    if (open) {
      form.reset()
      setIsSlugEditedManually(false)
    }

    setIsSheetOpen(open)
  }

  async function handleNewCategory({ name, slug, icon }: NewCategoryFormType) {
    const response = await createCategory({
      name,
      slug,
      icon,
    })

    if (response.error) {
      return toast.error(response.error)
    }

    await queryClient.invalidateQueries({
      queryKey: ['categories'],
    })
    await queryClient.invalidateQueries({
      queryKey: ['categories', citySlug],
    })

    setIsSheetOpen(false)

    toast.success(response.message)
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="mt-2 w-full sm:mt-0 sm:w-fit">
          <Plus className="size-4" />
          Nova Categoria
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader className="px-4 pb-0">
          <SheetTitle className="text-lg">Nova Categoria</SheetTitle>
          <SheetDescription>Adicione uma nova categoria ao sistema</SheetDescription>
        </SheetHeader>
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNewCategory)}>
            <div className="mx-4 space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Alimentação"
                        {...field}
                        onChange={event => handleNameChange(event.target.value)}
                        className="rounded-sm placeholder:text-xs"
                      />
                    </FormControl>

                    <FormMessage className="text-destructive text-xs" />
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 📚" {...field} className="rounded-sm placeholder:text-xs" />
                    </FormControl>

                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <ImSpinner2 className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Salvar
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
