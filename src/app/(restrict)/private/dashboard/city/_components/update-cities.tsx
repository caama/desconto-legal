'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Save, SquarePen } from 'lucide-react'
import { useState } from 'react'
import { useWatch } from 'react-hook-form'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { slugify } from '@/utils/slugify'
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

  // O slug acompanha o nome enquanto ainda for o gerado automaticamente; um slug personalizado é preservado
  const isSlugCustom = (slug: string, name: string) => slug !== slugify(name)
  const [isSlugEditedManually, setIsSlugEditedManually] = useState(() => isSlugCustom(cities.slug, cities.name))

  // Assinatura explícita: o React Compiler memoriza o componente e uma leitura via watch não re-renderizaria
  const slug = useWatch({ control: form.control, name: 'slug' })
  const isSlugChanged = slug.trim() !== '' && slug !== cities.slug

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
      setIsSlugEditedManually(isSlugCustom(cities.slug, cities.name))
    }

    setIsDialogOpen(open)
  }

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
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon-sm" className="text-muted-foreground hover:text-foreground">
              <SquarePen className="size-4" />
              <span className="sr-only">Editar cidade</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Editar cidade</TooltipContent>
      </Tooltip>
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
                        placeholder="Ex: sao-luis"
                        {...field}
                        onChange={event => handleSlugChange(event.target.value)}
                        className="rounded-sm placeholder:text-xs"
                      />
                    </FormControl>

                    {errors.slug ? (
                      <FormMessage className="text-destructive text-xs">{errors.slug.message}</FormMessage>
                    ) : isSlugChanged ? (
                      <FormDescription className="text-amber-700 text-xs">
                        O endereço público da cidade muda e links antigos para ela deixam de funcionar.
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
