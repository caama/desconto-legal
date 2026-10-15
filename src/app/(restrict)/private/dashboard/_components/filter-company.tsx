'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { API } from '@/lib/axios'

const filterCompanySchema = z.object({
  name: z.string().trim().optional(),
  city: z.string().trim().optional(),
})

type FilterCompaniesType = z.infer<typeof filterCompanySchema>

interface CityProps {
  cities: {
    id: string
    name: string
  }[]
}

export function FilterCompanies() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const name = searchParams.get('name') || ''
  const city = searchParams.get('city') || ''

  const form = useForm<FilterCompaniesType>({
    shouldUnregister: true,
    resolver: zodResolver(filterCompanySchema),
    defaultValues: {
      name: name || '',
      city: city || '',
    },
  })

  function handleFilterCompanies({ name, city }: FilterCompaniesType) {
    const url = new URLSearchParams(searchParams.toString())

    if (name) url.set('name', name.toString())
    else url.delete('name')

    if (city) url.set('city', city.toString())
    else url.delete('city')

    url.set('page', '1')

    router.push(`?${url.toString()}`)
  }

  function handleClearFilter() {
    const url = new URLSearchParams()
    url.set('page', '1')
    router.push(`?${url.toString()}`)
    form.reset()
  }

  const { data } = useQuery({
    queryKey: ['cities', name],
    queryFn: async () => {
      const response = await API.get<CityProps>('/api/cities/fetch-all-cities', {
        params: {
          name,
        },
      })

      return response.data
    },
    staleTime: Number.POSITIVE_INFINITY, // Significa que o cache nunca vai expirar
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFilterCompanies)}
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

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full sm:w-60">
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma cidade" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {data?.cities.map(city => (
                      <SelectItem key={city.id} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
