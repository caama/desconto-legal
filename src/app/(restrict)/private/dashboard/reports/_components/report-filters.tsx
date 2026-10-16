'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  CONTRACT_WINDOWS,
  REPORT_FILTER_KEYS,
  type ReportFilters as ReportFiltersValue,
  STATUS_OPTIONS,
  toReportQuery,
} from '@/lib/reports/filters'
import { formatCityName } from '@/utils/format-city-name'
import type { ReportPreviewOptions } from '../_dal/get-report-preview'

const ALL = 'all'

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

type ReportFiltersProps = {
  filters: ReportFiltersValue
  options: ReportPreviewOptions
}

type FilterFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  items: { value: string; label: string }[]
}

function FilterField({ id, label, value, onChange, items }: FilterFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-muted-foreground text-xs uppercase tracking-wider">
        {label}
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full bg-card shadow-xs">
          <SelectValue className="flex-1 text-left" />
        </SelectTrigger>

        <SelectContent>
          {items.map(item => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function ReportFilters({ filters, options }: ReportFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const keys: readonly string[] = REPORT_FILTER_KEYS[filters.relatorio]

  function update(patch: Partial<ReportFiltersValue>) {
    const query = toReportQuery({ ...filters, ...patch })
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  // Relatórios de período sempre têm um ano; o de empresas pode abranger todos
  const yearIsOptional = filters.relatorio === 'empresas'
  const yearValue = filters.ano ? String(filters.ano) : yearIsOptional ? ALL : String(options.currentYear)

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {keys.includes('subsecao') && (
        <FilterField
          id="report-city"
          label="Subseção"
          value={filters.subsecao ?? ALL}
          onChange={value => update({ subsecao: value === ALL ? undefined : value })}
          items={[
            { value: ALL, label: 'Todas as subseções' },
            ...options.cities.map(city => ({
              value: city.slug,
              label: `${formatCityName(city.name)}${city.active ? '' : ' (inativa)'}`,
            })),
          ]}
        />
      )}

      {keys.includes('categoria') && (
        <FilterField
          id="report-category"
          label="Categoria"
          value={filters.categoria ?? ALL}
          onChange={value => update({ categoria: value === ALL ? undefined : value })}
          items={[
            { value: ALL, label: 'Todas as categorias' },
            ...options.categories.map(category => ({
              value: category.slug,
              label: `${category.name}${category.active ? '' : ' (inativa)'}`,
            })),
          ]}
        />
      )}

      {keys.includes('situacao') && (
        <FilterField
          id="report-status"
          label="Situação"
          value={filters.situacao}
          onChange={value => update({ situacao: value as ReportFiltersValue['situacao'] })}
          items={STATUS_OPTIONS.map(option => ({ value: option.value, label: option.label }))}
        />
      )}

      {keys.includes('janela') && (
        <FilterField
          id="report-window"
          label="Contratos"
          value={filters.janela}
          onChange={value => update({ janela: value as ReportFiltersValue['janela'] })}
          items={CONTRACT_WINDOWS.map(option => ({ value: option.value, label: option.label }))}
        />
      )}

      {keys.includes('ano') && (
        <FilterField
          id="report-year"
          label={yearIsOptional ? 'Ano de cadastro' : 'Ano'}
          value={yearValue}
          onChange={value => update({ ano: value === ALL ? undefined : Number(value) })}
          items={[
            ...(yearIsOptional ? [{ value: ALL, label: 'Todos os anos' }] : []),
            ...options.years.map(year => ({ value: String(year), label: String(year) })),
          ]}
        />
      )}

      {keys.includes('mes') && (
        <FilterField
          id="report-month"
          label="Mês"
          value={filters.mes ? String(filters.mes) : ALL}
          onChange={value => update({ mes: value === ALL ? undefined : Number(value) })}
          items={[
            { value: ALL, label: 'Ano inteiro' },
            ...MONTHS.map((month, index) => ({ value: String(index + 1), label: month })),
          ]}
        />
      )}
    </div>
  )
}
