'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Plus, Save } from 'lucide-react'
import { useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { createCategory } from '../_actions/create-category'
import { type NewCategoryFormType, useNewCategoryForm } from './category-form'

export function NewCategory() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const queryClient = useQueryClient()

  const form = useNewCategoryForm({
    name: '',
    slug: '',
    icon: '',
  })

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

    setIsSheetOpen(false)

    toast.success(response.message)
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                    <FormLabel>Nome da Categoria:</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Alimentação" {...field} className="rounded-sm placeholder:text-xs" />
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
                    <FormLabel>Slug da Categoria:</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: alimentacao" {...field} className="rounded-sm placeholder:text-xs" />
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone (Opcional):</FormLabel>
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
