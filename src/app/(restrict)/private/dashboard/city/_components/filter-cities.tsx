'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const filterCitiesSchema = z.object({
  name: z.string().trim().optional(),
})

type FilterCitiesType = z.infer<typeof filterCitiesSchema>

export function FilterCities() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const name = searchParams.get('name') || ''

  const form = useForm<FilterCitiesType>({
    shouldUnregister: true,
    resolver: zodResolver(filterCitiesSchema),
    defaultValues: {
      name: name || '',
    },
  })

  function handleFilterCities({ name }: FilterCitiesType) {
    const url = new URLSearchParams(searchParams.toString())

    if (name) url.set('name', name.toString())
    else url.delete('name')

    url.set('page', '1')

    router.push(`?${url.toString()}`)
  }

  function handleClearFilter() {
    const url = new URLSearchParams()
    url.set('page', '1')
    router.push(`?${url.toString()}`)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFilterCities)}
        className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="font-semibold text-sm">Filtros:</span>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full sm:w-60">
                <FormControl>
                  <Input {...field} placeholder="Busque pelo nome" className="h-8 rounded-sm text-sm" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Button type="submit" size="sm" className="h-8 w-full rounded-sm text-sm sm:w-auto">
            <Search className="size-4" />
            Filtrar resultados
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 w-full rounded-sm text-sm sm:w-auto"
            onClick={handleClearFilter}
          >
            <X className="size-4" />
            Remover filtros
          </Button>
        </div>
      </form>
    </Form>
  )
}
