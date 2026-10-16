import type { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { formatCityName } from '@/utils/format-city-name'
import { formatCNPJ } from '@/utils/format-cnpj'
import { formatWhatsapp } from '@/utils/format-whatsapp'
import { getSaoPauloDateParts, getSaoPauloDay } from '@/utils/sao-paulo-date'
import { CONTRACT_WINDOWS, REPORTS, type ReportFilters, type ReportId, resolveYear, STATUS_OPTIONS } from './filters'
import { formatCount, formatDateValue, formatPercentValue } from './format'
import type { Report, ReportColumn, ReportRow } from './types'

const DAY_IN_MS = 24 * 60 * 60 * 1000

const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

type ReportContext = {
  now: Date
  today: Date
  city: { id: string; name: string } | null
  category: { id: string; name: string } | null
}

// O Brasil não tem horário de verão desde 2019: o ano civil de São Paulo começa às 03:00 UTC
function saoPauloYearRange(year: number) {
  return { gte: new Date(Date.UTC(year, 0, 1, 3)), lt: new Date(Date.UTC(year + 1, 0, 1, 3)) }
}

// Intervalo em colunas @db.Date (meia-noite UTC)
function dayRange(year: number, month?: number) {
  return month
    ? { gte: new Date(Date.UTC(year, month - 1, 1)), lt: new Date(Date.UTC(year, month, 1)) }
    : { gte: new Date(Date.UTC(year, 0, 1)), lt: new Date(Date.UTC(year + 1, 0, 1)) }
}

const toDay = (date: Date | null) => (date ? getSaoPauloDay(date) : null)

function daysUntil(contractEnd: Date, today: Date) {
  return Math.round((getSaoPauloDay(contractEnd).getTime() - today.getTime()) / DAY_IN_MS)
}

function contractSituation(contractEnd: Date | null, today: Date) {
  if (!contractEnd) return 'Sem data de fim'

  const days = daysUntil(contractEnd, today)

  if (days < 0) return `Vencido há ${Math.abs(days)} ${Math.abs(days) === 1 ? 'dia' : 'dias'}`
  if (days === 0) return 'Vence hoje'
  if (days <= 90) return `Faltam ${days} ${days === 1 ? 'dia' : 'dias'}`

  return 'Vigente'
}

function cityLine(context: ReportContext) {
  return `Subseção: ${context.city ? formatCityName(context.city.name) : 'Todas'}`
}

function categoryLine(context: ReportContext) {
  return `Categoria: ${context.category?.name ?? 'Todas'}`
}

function scopeWhere(context: ReportContext): Prisma.CompanyWhereInput {
  return {
    ...(context.city && { cityId: context.city.id }),
    ...(context.category && { categoryId: context.category.id }),
  }
}

const companyInclude = {
  city: { select: { name: true } },
  category: { select: { name: true } },
  createdBy: { select: { name: true } },
} satisfies Prisma.CompanyInclude

const reportInfo = (id: ReportId) => REPORTS.find(report => report.id === id) as (typeof REPORTS)[number]

async function buildCompaniesReport(filters: ReportFilters, context: ReportContext): Promise<Report> {
  const companies = await prisma.company.findMany({
    where: {
      ...scopeWhere(context),
      ...(filters.situacao !== 'todas' && { active: filters.situacao === 'ativas' }),
      ...(filters.ano && { createdAt: saoPauloYearRange(filters.ano) }),
    },
    include: companyInclude,
    orderBy: [{ city: { name: 'asc' } }, { name: 'asc' }],
  })

  const columns: ReportColumn[] = [
    { key: 'name', header: 'Empresa', type: 'text', pdfWidth: 2.6, xlsxWidth: 34 },
    { key: 'cnpj', header: 'CNPJ', type: 'text', pdfWidth: 1.7, xlsxWidth: 20 },
    { key: 'city', header: 'Subseção', type: 'text', pdfWidth: 1.4, xlsxWidth: 18 },
    { key: 'category', header: 'Categoria', type: 'text', pdfWidth: 1.5, xlsxWidth: 22 },
    { key: 'discount', header: 'Desconto', type: 'text', pdfWidth: 1.6, xlsxWidth: 26 },
    { key: 'responsible', header: 'Responsável', type: 'text', pdfWidth: 1.4, xlsxWidth: 24, pdf: false },
    { key: 'whatsapp', header: 'WhatsApp', type: 'text', pdfWidth: 1.3, xlsxWidth: 17 },
    { key: 'email', header: 'E-mail', type: 'text', pdfWidth: 2, xlsxWidth: 30, pdf: false },
    { key: 'contractStart', header: 'Início do contrato', type: 'date', pdfWidth: 1, xlsxWidth: 14, pdf: false },
    { key: 'contractEnd', header: 'Fim do contrato', type: 'date', pdfWidth: 1, xlsxWidth: 14 },
    { key: 'contractStatus', header: 'Situação do contrato', type: 'text', pdfWidth: 1.4, xlsxWidth: 20 },
    { key: 'status', header: 'Status', type: 'text', pdfWidth: 0.8, xlsxWidth: 10, pdf: filters.situacao === 'todas' },
    { key: 'visitors', header: 'Contatos', type: 'number', pdfWidth: 0.8, xlsxWidth: 10 },
    { key: 'createdAt', header: 'Cadastrada em', type: 'date', pdfWidth: 1, xlsxWidth: 14, pdf: false },
    { key: 'createdBy', header: 'Cadastrada por', type: 'text', pdfWidth: 1.4, xlsxWidth: 24, pdf: false },
  ]

  const rows: ReportRow[] = companies.map(company => ({
    name: company.name,
    cnpj: formatCNPJ(company.cnpj),
    city: formatCityName(company.city.name),
    category: company.category.name,
    discount: company.discount,
    responsible: company.responsible,
    whatsapp: formatWhatsapp(company.whatsapp),
    email: company.email,
    contractStart: toDay(company.contractStart),
    contractEnd: toDay(company.contractEnd),
    contractStatus: contractSituation(company.contractEnd, context.today),
    status: company.active ? 'Ativa' : 'Inativa',
    visitors: company.visitors,
    createdAt: toDay(company.createdAt),
    createdBy: company.createdBy?.name ?? 'Sem registro',
  }))

  const active = companies.filter(company => company.active)
  const expired = active.filter(company => company.contractEnd && daysUntil(company.contractEnd, context.today) < 0)
  const statusLabel = STATUS_OPTIONS.find(option => option.value === filters.situacao)?.label ?? 'Ativas'

  return {
    id: 'empresas',
    title: reportInfo('empresas').label,
    description: 'Convênios cadastrados no Desconto Legal, com contato, desconto, vigência do contrato e contatos recebidos.',
    filterLines: [
      cityLine(context),
      categoryLine(context),
      `Situação: ${statusLabel}`,
      `Cadastro: ${filters.ano ? `em ${filters.ano}` : 'todos os anos'}`,
    ],
    summary: [
      { label: 'Empresas', value: formatCount(companies.length) },
      ...(filters.situacao === 'todas'
        ? [
            { label: 'Ativas', value: formatCount(active.length) },
            { label: 'Inativas', value: formatCount(companies.length - active.length) },
          ]
        : []),
      { label: 'Ativas com contrato vencido', value: formatCount(expired.length) },
      { label: 'Ativas sem data de fim', value: formatCount(active.filter(company => !company.contractEnd).length) },
    ],
    columns,
    rows,
    notes: ['"Contatos" é o total de cliques no WhatsApp da empresa desde o cadastro.'],
    emptyMessage: 'Nenhuma empresa encontrada para os filtros escolhidos.',
  }
}

async function buildContractsReport(filters: ReportFilters, context: ReportContext): Promise<Report> {
  const companies = await prisma.company.findMany({
    where: { ...scopeWhere(context), active: true },
    include: companyInclude,
    orderBy: [{ contractEnd: 'asc' }, { name: 'asc' }],
  })

  const window = filters.janela
  const selected = companies.filter(company => {
    if (window === 'sem-fim') return !company.contractEnd
    if (!company.contractEnd) return false

    const days = daysUntil(company.contractEnd, context.today)
    return window === 'vencidos' ? days < 0 : days <= Number(window)
  })

  if (window === 'sem-fim') selected.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

  const columns: ReportColumn[] = [
    { key: 'name', header: 'Empresa', type: 'text', pdfWidth: 2.6, xlsxWidth: 34 },
    { key: 'cnpj', header: 'CNPJ', type: 'text', pdfWidth: 1.7, xlsxWidth: 20 },
    { key: 'city', header: 'Subseção', type: 'text', pdfWidth: 1.4, xlsxWidth: 18 },
    { key: 'category', header: 'Categoria', type: 'text', pdfWidth: 1.5, xlsxWidth: 22 },
    { key: 'responsible', header: 'Responsável', type: 'text', pdfWidth: 1.5, xlsxWidth: 24 },
    { key: 'whatsapp', header: 'WhatsApp', type: 'text', pdfWidth: 1.3, xlsxWidth: 17 },
    { key: 'contractStart', header: 'Início', type: 'date', pdfWidth: 0.9, xlsxWidth: 13 },
    { key: 'contractEnd', header: 'Fim', type: 'date', pdfWidth: 0.9, xlsxWidth: 13 },
    { key: 'situation', header: 'Situação', type: 'text', pdfWidth: 1.4, xlsxWidth: 20 },
    { key: 'visitors', header: 'Contatos', type: 'number', pdfWidth: 0.8, xlsxWidth: 10 },
  ]

  const rows: ReportRow[] = selected.map(company => ({
    name: company.name,
    cnpj: formatCNPJ(company.cnpj),
    city: formatCityName(company.city.name),
    category: company.category.name,
    responsible: company.responsible,
    whatsapp: formatWhatsapp(company.whatsapp),
    contractStart: toDay(company.contractStart),
    contractEnd: toDay(company.contractEnd),
    situation: contractSituation(company.contractEnd, context.today),
    visitors: company.visitors,
  }))

  const expiredCount = selected.filter(company => company.contractEnd && daysUntil(company.contractEnd, context.today) < 0).length
  const windowLabel = CONTRACT_WINDOWS.find(option => option.value === window)?.label ?? ''

  return {
    id: 'contratos',
    title: reportInfo('contratos').label,
    description:
      window === 'sem-fim'
        ? 'Empresas ativas sem data de fim de contrato cadastrada.'
        : 'Contratos de empresas ativas para renovação, do mais urgente ao mais distante. Os contatos ajudam a priorizar.',
    filterLines: [cityLine(context), `Janela: ${windowLabel}`, `Referência: ${formatDateValue(context.today)}`],
    summary:
      window === 'sem-fim'
        ? [{ label: 'Sem data de fim', value: formatCount(selected.length) }]
        : [
            { label: 'Contratos', value: formatCount(selected.length) },
            { label: 'Vencidos', value: formatCount(expiredCount) },
            ...(window !== 'vencidos' ? [{ label: 'A vencer', value: formatCount(selected.length - expiredCount) }] : []),
          ],
    columns,
    rows,
    emptyMessage:
      window === 'sem-fim'
        ? 'Todas as empresas ativas têm data de fim de contrato.'
        : 'Nenhum contrato nesta janela para os filtros escolhidos.',
  }
}

async function buildDemandReport(filters: ReportFilters, context: ReportContext): Promise<Report> {
  const year = resolveYear(filters, context.now)
  const period = dayRange(year, filters.mes)

  const [stats, firstStat] = await Promise.all([
    prisma.companyDailyStat.groupBy({
      by: ['companyId'],
      where: { date: period, company: scopeWhere(context) },
      _sum: { views: true, whatsappClicks: true },
    }),
    prisma.companyDailyStat.findFirst({ select: { date: true }, orderBy: { date: 'asc' } }),
  ])

  const demandById = new Map(
    stats.map(stat => [stat.companyId, { views: stat._sum.views ?? 0, contacts: stat._sum.whatsappClicks ?? 0 }])
  )

  // Ativas entram mesmo sem procura; inativas só se tiveram procura no período
  const companies = await prisma.company.findMany({
    where: { ...scopeWhere(context), OR: [{ active: true }, { id: { in: [...demandById.keys()] } }] },
    include: companyInclude,
  })

  const rows = companies
    .map(company => {
      const demand = demandById.get(company.id) ?? { views: 0, contacts: 0 }

      return {
        name: company.active ? company.name : `${company.name} (inativa)`,
        city: formatCityName(company.city.name),
        category: company.category.name,
        views: demand.views,
        contacts: demand.contacts,
        conversion: demand.views > 0 ? demand.contacts / demand.views : null,
        visitors: company.visitors,
      }
    })
    .sort((a, b) => b.contacts - a.contacts || b.views - a.views || a.name.localeCompare(b.name, 'pt-BR'))

  const totalViews = rows.reduce((sum, row) => sum + row.views, 0)
  const totalContacts = rows.reduce((sum, row) => sum + row.contacts, 0)
  const periodLabel = filters.mes ? `${MONTH_NAMES[filters.mes - 1]} de ${year}` : String(year)

  const columns: ReportColumn[] = [
    { key: 'name', header: 'Empresa', type: 'text', pdfWidth: 3, xlsxWidth: 36 },
    { key: 'city', header: 'Subseção', type: 'text', pdfWidth: 1.5, xlsxWidth: 18 },
    { key: 'category', header: 'Categoria', type: 'text', pdfWidth: 1.6, xlsxWidth: 22 },
    { key: 'views', header: 'Visitas', type: 'number', pdfWidth: 0.9, xlsxWidth: 11 },
    { key: 'contacts', header: 'Contatos', type: 'number', pdfWidth: 0.9, xlsxWidth: 11 },
    { key: 'conversion', header: 'Conversão', type: 'percent', pdfWidth: 0.9, xlsxWidth: 12 },
    { key: 'visitors', header: 'Contatos desde o cadastro', type: 'number', pdfWidth: 1.3, xlsxWidth: 16 },
  ]

  const notes = ['Visitas: aberturas da página da empresa (uma por visitante a cada sessão). Contatos: cliques no WhatsApp.']

  if (!firstStat) {
    notes.unshift('A coleta de visitas e contatos ainda não registrou nenhuma procura.')
  } else if (firstStat.date >= period.lt) {
    notes.unshift(`A coleta de procura começou em ${formatDateValue(firstStat.date)}, depois deste período.`)
  } else if (firstStat.date > period.gte) {
    notes.unshift(`A coleta de procura começou em ${formatDateValue(firstStat.date)}: o período está parcialmente coberto.`)
  }

  return {
    id: 'procura',
    title: reportInfo('procura').label,
    description: `Visitas à página e contatos pelo WhatsApp de cada empresa em ${periodLabel}, da mais procurada para a menos.`,
    filterLines: [cityLine(context), categoryLine(context), `Período: ${periodLabel}`],
    summary: [
      { label: 'Visitas', value: formatCount(totalViews) },
      { label: 'Contatos', value: formatCount(totalContacts) },
      { label: 'Conversão', value: totalViews > 0 ? formatPercentValue(totalContacts / totalViews) : '–' },
      { label: 'Empresas com contato', value: formatCount(rows.filter(row => row.contacts > 0).length) },
    ],
    columns,
    rows,
    totals: {
      name: 'Total',
      city: null,
      category: null,
      views: totalViews,
      contacts: totalContacts,
      conversion: totalViews > 0 ? totalContacts / totalViews : null,
      visitors: rows.reduce((sum, row) => sum + row.visitors, 0),
    },
    notes,
    emptyMessage: 'Nenhuma empresa encontrada para os filtros escolhidos.',
  }
}

async function buildCitiesReport(filters: ReportFilters, context: ReportContext): Promise<Report> {
  const year = resolveYear(filters, context.now)

  const [cities, categories, companies, stats] = await Promise.all([
    prisma.city.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.category.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.company.findMany({
      select: { id: true, cityId: true, categoryId: true, active: true, createdAt: true, contractEnd: true },
    }),
    prisma.companyDailyStat.groupBy({
      by: ['companyId'],
      where: { date: dayRange(year) },
      _sum: { views: true, whatsappClicks: true },
    }),
  ])

  const demandById = new Map(stats.map(stat => [stat.companyId, stat._sum]))

  const rows: ReportRow[] = cities.map(city => {
    const cityCompanies = companies.filter(company => company.cityId === city.id)
    const active = cityCompanies.filter(company => company.active)
    const days = active.flatMap(company => (company.contractEnd ? [daysUntil(company.contractEnd, context.today)] : []))

    const row: ReportRow = {
      city: formatCityName(city.name),
      active: active.length,
      inactive: cityCompanies.length - active.length,
      newInYear: cityCompanies.filter(company => getSaoPauloDateParts(company.createdAt).year === year).length,
      expired: days.filter(value => value < 0).length,
      expiring: days.filter(value => value >= 0 && value <= 90).length,
      withoutEnd: active.filter(company => !company.contractEnd).length,
      views: cityCompanies.reduce((sum, company) => sum + (demandById.get(company.id)?.views ?? 0), 0),
      contacts: cityCompanies.reduce((sum, company) => sum + (demandById.get(company.id)?.whatsappClicks ?? 0), 0),
    }

    for (const category of categories) {
      row[`category:${category.id}`] = active.filter(company => company.categoryId === category.id).length
    }

    return row
  })

  const columns: ReportColumn[] = [
    { key: 'city', header: 'Subseção', type: 'text', pdfWidth: 2, xlsxWidth: 22 },
    { key: 'active', header: 'Ativas', type: 'number', pdfWidth: 0.9, xlsxWidth: 10 },
    { key: 'inactive', header: 'Inativas', type: 'number', pdfWidth: 0.9, xlsxWidth: 10 },
    { key: 'newInYear', header: `Cadastradas em ${year}`, type: 'number', pdfWidth: 1.2, xlsxWidth: 15 },
    { key: 'expired', header: 'Contratos vencidos', type: 'number', pdfWidth: 1.1, xlsxWidth: 14 },
    { key: 'expiring', header: 'Vencem em 90 dias', type: 'number', pdfWidth: 1.1, xlsxWidth: 14 },
    { key: 'withoutEnd', header: 'Sem data de fim', type: 'number', pdfWidth: 1.1, xlsxWidth: 14 },
    { key: 'views', header: `Visitas em ${year}`, type: 'number', pdfWidth: 1.1, xlsxWidth: 14 },
    { key: 'contacts', header: `Contatos em ${year}`, type: 'number', pdfWidth: 1.1, xlsxWidth: 14 },
    ...categories.map(category => ({
      key: `category:${category.id}`,
      header: category.name,
      type: 'number' as const,
      pdfWidth: 1,
      xlsxWidth: Math.max(12, Math.min(28, category.name.length + 2)),
      pdf: false,
    })),
  ]

  const totals: ReportRow = { city: 'Total' }
  for (const column of columns.slice(1)) {
    totals[column.key] = rows.reduce((sum, row) => sum + (Number(row[column.key]) || 0), 0)
  }

  return {
    id: 'subsecoes',
    title: reportInfo('subsecoes').label,
    description:
      'Situação dos convênios em cada subseção ativa: empresas, contratos e procura. Contratos e situação refletem a data de geração.',
    filterLines: [`Ano de referência: ${year}`, `Contratos em: ${formatDateValue(context.today)}`],
    summary: [
      { label: 'Subseções', value: formatCount(rows.length) },
      { label: 'Empresas ativas', value: formatCount(Number(totals.active)) },
      { label: 'Subseções sem empresa ativa', value: formatCount(rows.filter(row => row.active === 0).length) },
      { label: 'Contratos vencidos', value: formatCount(Number(totals.expired)) },
    ],
    columns,
    rows,
    totals,
    notes: categories.length > 0 ? ['A planilha traz também as empresas ativas por categoria em cada subseção.'] : [],
    emptyMessage: 'Nenhuma subseção ativa cadastrada.',
  }
}

const BUILDERS: Record<ReportId, (filters: ReportFilters, context: ReportContext) => Promise<Report>> = {
  empresas: buildCompaniesReport,
  contratos: buildContractsReport,
  procura: buildDemandReport,
  subsecoes: buildCitiesReport,
}

// Chamado só depois da checagem de ADMIN (página ou rota de download)
export async function buildReport(filters: ReportFilters, now = new Date()) {
  const [city, category] = await Promise.all([
    filters.subsecao ? prisma.city.findUnique({ where: { slug: filters.subsecao }, select: { id: true, name: true } }) : null,
    filters.categoria
      ? prisma.category.findUnique({ where: { slug: filters.categoria }, select: { id: true, name: true } })
      : null,
  ])

  return BUILDERS[filters.relatorio](filters, { now, today: getSaoPauloDay(now), city, category })
}

// Nome do arquivo: relatório, recorte e data (sem acentos, para não quebrar em nenhum sistema)
export function reportFileName(filters: ReportFilters, extension: 'pdf' | 'xlsx', now = new Date()) {
  const { year, month, day } = getSaoPauloDateParts(now)
  const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const scope = filters.subsecao ? `-${filters.subsecao}` : ''

  return `desconto-legal-${filters.relatorio}${scope}-${date}.${extension}`
}
