'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Plus, Save } from 'lucide-react'
import { useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { createCity } from '../_actions/create-city'
import { type NewCityFormType, useNewCityForm } from './city-form'

export function NewCity() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const queryClient = useQueryClient()

  const form = useNewCityForm({
    name: '',
    slug: '',
    isThirst: false,
  })

  async function handleNewCity({ name, slug, isThirst }: NewCityFormType) {
    const response = await createCity({
      name,
      slug,
      isThirst,
    })

    if (response.error) {
      return toast.error(response.error)
    }

    await queryClient.invalidateQueries({
      queryKey: ['cities'],
    })

    setIsSheetOpen(false)

    toast.success(response.message)
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button className="mt-2 w-full sm:mt-0 sm:w-fit">
          <Plus className="size-4" />
          Nova Cidade
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader className="px-4 pb-0">
          <SheetTitle className="text-lg">Nova Cidade</SheetTitle>
          <SheetDescription>Adicione uma nova cidade ao sistema</SheetDescription>
        </SheetHeader>
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNewCity)}>
            <div className="mx-4 space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Cidade:</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: São Luís" {...field} className="rounded-sm placeholder:text-xs" />
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
