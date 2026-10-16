import { z } from 'zod'
import { getSaoPauloDateParts } from '@/utils/sao-paulo-date'

export const REPORTS = [
  {
    id: 'empresas',
    label: 'Empresas conveniadas',
    description: 'Lista de convênios com contato, desconto, vigência e procura',
  },
  {
    id: 'contratos',
    label: 'Contratos',
    description: 'Contratos vencidos, a vencer ou sem data de fim, para renovação',
  },
  {
    id: 'procura',
    label: 'Procura por empresa',
    description: 'Visitas, contatos e conversão de cada empresa no período',
  },
  {
    id: 'subsecoes',
    label: 'Resumo por subseção',
    description: 'Totais de convênios, contratos e procura em cada subseção',
  },
] as const

export type ReportId = (typeof REPORTS)[number]['id']

export const REPORT_IDS = REPORTS.map(report => report.id) as [ReportId, ...ReportId[]]

export function isReportId(value: string): value is ReportId {
  return (REPORT_IDS as string[]).includes(value)
}

export const STATUS_OPTIONS = [
  { value: 'ativas', label: 'Ativas' },
  { value: 'inativas', label: 'Inativas' },
  { value: 'todas', label: 'Todas' },
] as const

export const CONTRACT_WINDOWS = [
  { value: 'vencidos', label: 'Só vencidos' },
  { value: '30', label: 'Vencidos e até 30 dias' },
  { value: '60', label: 'Vencidos e até 60 dias' },
  { value: '90', label: 'Vencidos e até 90 dias' },
  { value: '180', label: 'Vencidos e até 180 dias' },
  { value: 'sem-fim', label: 'Sem data de fim' },
] as const

export type ContractWindow = (typeof CONTRACT_WINDOWS)[number]['value']

// Filtros que cada relatório lê; os demais são descartados ao trocar de relatório
export const REPORT_FILTER_KEYS = {
  empresas: ['subsecao', 'categoria', 'situacao', 'ano'],
  contratos: ['subsecao', 'janela'],
  procura: ['subsecao', 'categoria', 'ano', 'mes'],
  subsecoes: ['ano'],
} as const satisfies Record<ReportId, readonly string[]>

const optionalSlug = z
  .string()
  .regex(/^[a-z0-9-]{1,80}$/)
  .optional()
  .catch(undefined)

const reportFiltersSchema = z.object({
  relatorio: z.enum(REPORT_IDS).catch('empresas'),
  subsecao: optionalSlug,
  categoria: optionalSlug,
  situacao: z.enum(['ativas', 'inativas', 'todas']).catch('ativas'),
  ano: z.coerce.number().int().min(2000).max(2100).optional().catch(undefined),
  mes: z.coerce.number().int().min(1).max(12).optional().catch(undefined),
  janela: z.enum(['vencidos', '30', '60', '90', '180', 'sem-fim']).catch('90'),
})

export type ReportFilters = z.infer<typeof reportFiltersSchema>

type ParamsSource = URLSearchParams | Record<string, string | string[] | undefined>

function readParam(source: ParamsSource, key: string) {
  const value = source instanceof URLSearchParams ? source.get(key) : source[key]
  const first = Array.isArray(value) ? value[0] : value

  return first === null || first === '' ? undefined : first
}

// Mesmo parser na página e na rota de download: a prévia e o arquivo nunca divergem
export function parseReportFilters(source: ParamsSource): ReportFilters {
  const keys = ['relatorio', 'subsecao', 'categoria', 'situacao', 'ano', 'mes', 'janela'] as const

  return reportFiltersSchema.parse(Object.fromEntries(keys.map(key => [key, readParam(source, key)])))
}

// Ano usado por relatórios de período: o informado ou o corrente
export function resolveYear(filters: ReportFilters, now: Date) {
  return filters.ano ?? getSaoPauloDateParts(now).year
}

// Query string só com os filtros do relatório e sem os valores padrão
export function toReportQuery(filters: ReportFilters) {
  const params = new URLSearchParams()
  const keys: readonly string[] = REPORT_FILTER_KEYS[filters.relatorio]

  if (filters.relatorio !== 'empresas') params.set('relatorio', filters.relatorio)
  if (keys.includes('subsecao') && filters.subsecao) params.set('subsecao', filters.subsecao)
  if (keys.includes('categoria') && filters.categoria) params.set('categoria', filters.categoria)
  if (keys.includes('situacao') && filters.situacao !== 'ativas') params.set('situacao', filters.situacao)
  if (keys.includes('ano') && filters.ano) params.set('ano', String(filters.ano))
  if (keys.includes('mes') && filters.mes) params.set('mes', String(filters.mes))
  if (keys.includes('janela') && filters.janela !== '90') params.set('janela', filters.janela)

  return params.toString()
}
