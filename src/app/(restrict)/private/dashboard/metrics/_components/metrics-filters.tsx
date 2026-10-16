'use client'

import { CalendarRange, MapPinHouse } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCityName } from '@/utils/format-city-name'

const ALL_CITIES = 'all'

type MetricsFiltersProps = {
  year: number
  currentYear: number
  yearOptions: number[]
  citySlug: string | null
  cityOptions: { slug: string; name: string; active: boolean }[]
}

// Ano e subseção moram na URL: a tela recarrega e se compartilha no mesmo recorte. O padrão não é escrito nela.
export function MetricsFilters({ year, currentYear, yearOptions, citySlug, cityOptions }: MetricsFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function pushParam(name: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())

    if (value === null) params.delete(name)
    else params.set(name, value)

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function handleYearChange(value: string) {
    pushParam('ano', Number(value) === currentYear ? null : value)
  }

  function handleCityChange(value: string) {
    pushParam('subsecao', value === ALL_CITIES ? null : value)
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
      <div className="flex flex-col gap-2">
        <Label htmlFor="metrics-year" className="text-muted-foreground text-xs uppercase tracking-wider">
          Ano
        </Label>

        <Select value={String(year)} onValueChange={handleYearChange}>
          <SelectTrigger id="metrics-year" className="w-full bg-card shadow-xs">
            <CalendarRange className="text-muted-foreground" />
            <SelectValue className="flex-1 text-left" />
          </SelectTrigger>

          <SelectContent>
            {yearOptions.map(option => (
              <SelectItem key={option} value={String(option)} className="tabular-nums">
                {option === currentYear ? `${option} (em curso)` : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="metrics-city" className="text-muted-foreground text-xs uppercase tracking-wider">
          Subseção
        </Label>

        <Select value={citySlug ?? ALL_CITIES} onValueChange={handleCityChange}>
          <SelectTrigger id="metrics-city" className="w-full bg-card shadow-xs">
            <MapPinHouse className="text-muted-foreground" />
            <SelectValue placeholder="Todas as subseções" className="flex-1 text-left" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_CITIES}>Todas as subseções</SelectItem>
            {cityOptions.map(option => (
              <SelectItem key={option.slug} value={option.slug}>
                {formatCityName(option.name)}
                {!option.active && ' (inativa)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
