import { formatCityName } from '@/utils/format-city-name'
import { getSaoPauloDateParts, getSaoPauloDay } from '@/utils/sao-paulo-date'

export const MONTH_SHORT_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// O que aparece no lugar do número quando o mês ainda não chegou
export const NO_DATA_MARK = '–'

// Janela de contratos acompanhados na tabela e nos indicadores
export const CONTRACT_WINDOW_DAYS = 90

// Empresa recém-cadastrada ainda não teve tempo de ser procurada
const WITHOUT_DEMAND_MIN_AGE_DAYS = 30

const DAY_IN_MS = 24 * 60 * 60 * 1000

const numberFormatter = new Intl.NumberFormat('pt-BR')
const percentFormatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export function formatCount(value: number) {
  return numberFormatter.format(value)
}

export function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`
}

const saoPauloDateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' })
const utcDateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' })

// Instantes (cadastro, fim de contrato) são lidos no fuso de São Paulo
export function formatDate(iso: string) {
  return saoPauloDateFormatter.format(new Date(iso))
}

// Colunas @db.Date chegam como meia-noite UTC: formatar em São Paulo voltaria um dia
export function formatDay(iso: string) {
  return utcDateFormatter.format(new Date(iso))
}

export type MetricDelta = {
  // Sempre positivo: o sinal vira o rótulo e a cor, não o número
  percent: number
  direction: 'up' | 'down' | 'flat'
}

// Sem base de comparação não há variação: dividir por zero viraria "+∞%"
export function buildDelta(current: number, previous: number): MetricDelta | null {
  if (previous <= 0) return null

  const variation = ((current - previous) / previous) * 100

  if (Math.abs(variation) < 0.05) return { percent: 0, direction: 'flat' }

  return { percent: Math.abs(variation), direction: variation > 0 ? 'up' : 'down' }
}

// O menos é o sinal matemático (U+2212), que alinha com os dígitos tabulares
export function formatDelta({ percent, direction }: MetricDelta) {
  const sign = direction === 'up' ? '+' : direction === 'down' ? '−' : ''

  return `${sign}${percentFormatter.format(percent)}%`
}

export type MetricsCompanyRow = {
  id: string
  name: string
  slug: string
  active: boolean
  createdAt: Date
  contractEnd: Date | null
  visitors: number
  cityId: string
  categoryId: string
  createdById: string | null
}

export type MetricsCityRow = { id: string; name: string; slug: string; active: boolean }
export type MetricsCategoryRow = { id: string; name: string; active: boolean }
export type MetricsUserRow = { id: string; name: string | null; image: string | null }
export type MetricsDailyStatRow = { companyId: string; date: Date; views: number; whatsappClicks: number }

export type MetricsInput = {
  now: Date
  year: number
  selectedCityId: string | null
  companies: MetricsCompanyRow[]
  cities: MetricsCityRow[]
  categories: MetricsCategoryRow[]
  users: MetricsUserRow[]
  // Registros diários do ano selecionado, de todas as subseções
  dailyStats: MetricsDailyStatRow[]
  firstStatDate: Date | null
}

export type MonthPoint = {
  month: number
  label: string
  total: number | null
  // Recharts precisa de número para desenhar: o mês futuro vira barra de altura zero
  value: number
}

export type RankedItem = {
  id: string
  name: string
  total: number
  // Fatia do total, que aparece ao lado da contagem
  share: number
  // Largura da barra, relativa ao primeiro colocado
  width: number
  highlighted?: boolean
}

export type CompanyLink = {
  id: string
  name: string
  cityName: string
  publicUrl: string
  editUrl: string
}

export type ContractRow = CompanyLink & {
  contractEnd: string
  daysLeft: number
  visitors: number
}

export type TopCompany = CompanyLink & {
  contacts: number
  views: number | null
}

export type WithoutDemandRow = CompanyLink & { createdAt: string }

export type CreatorRow = RankedItem & { image: string | null }

export type CoverageMatrix = {
  categories: { id: string; name: string }[]
  rows: { id: string; name: string; total: number; cells: number[]; highlighted: boolean }[]
}

export type MetricsData = ReturnType<typeof buildMetrics>

// A barra mede contra o líder (compara itens entre si); o percentual mede contra o total (quanto passa por ali)
function rank(items: { id: string; name: string; total: number; highlighted?: boolean }[]): RankedItem[] {
  const sum = items.reduce((accumulator, item) => accumulator + item.total, 0)
  const max = items.reduce((accumulator, item) => Math.max(accumulator, item.total), 0)

  return items.map(item => ({
    ...item,
    share: sum > 0 ? (item.total / sum) * 100 : 0,
    width: max > 0 ? (item.total / max) * 100 : 0,
  }))
}

function byTotalThenName<T extends { total: number; name: string }>(a: T, b: T) {
  return b.total - a.total || a.name.localeCompare(b.name, 'pt-BR')
}

// Meses do ano: os que ainda não chegaram ficam nulos para o gráfico mostrar o traço, e não zero
function buildMonthSeries(counts: number[], year: number, today: { year: number; month: number }): MonthPoint[] {
  return MONTH_SHORT_LABELS.map((label, index) => {
    const month = index + 1
    const isFuture = year > today.year || (year === today.year && month > today.month)
    const total = isFuture ? null : (counts[index] ?? 0)

    return { month, label, total, value: total ?? 0 }
  })
}

export function buildMetrics(input: MetricsInput) {
  const { now, year, selectedCityId, companies, cities, categories, users, dailyStats, firstStatDate } = input

  const today = getSaoPauloDateParts(now)
  const todayDay = getSaoPauloDay(now)
  const cityById = new Map(cities.map(city => [city.id, city]))

  const scoped = selectedCityId ? companies.filter(company => company.cityId === selectedCityId) : companies
  const scopedActive = scoped.filter(company => company.active)
  const scopedById = new Map(scoped.map(company => [company.id, company]))

  function toLink(company: MetricsCompanyRow): CompanyLink {
    const city = cityById.get(company.cityId)

    return {
      id: company.id,
      name: company.name,
      cityName: city ? formatCityName(city.name) : '',
      publicUrl: city ? `/city/${city.slug}/companies/${company.slug}/details` : '',
      editUrl: `/private/dashboard/company/${company.id}/update-company`,
    }
  }

  const createdYear = (company: MetricsCompanyRow) => getSaoPauloDateParts(company.createdAt).year

  // Indicadores
  const newInYear = scoped.filter(company => createdYear(company) === year).length
  const newInPreviousYear = scoped.filter(company => createdYear(company) === year - 1).length

  const contractRows: ContractRow[] = []
  let withoutContractEnd = 0

  for (const company of scopedActive) {
    if (!company.contractEnd) {
      withoutContractEnd++
      continue
    }

    // Datas de contrato são gravadas como meia-noite de São Paulo: compara-se o dia civil
    const daysLeft = Math.round((getSaoPauloDay(company.contractEnd).getTime() - todayDay.getTime()) / DAY_IN_MS)

    if (daysLeft <= CONTRACT_WINDOW_DAYS) {
      contractRows.push({
        ...toLink(company),
        contractEnd: company.contractEnd.toISOString(),
        daysLeft,
        visitors: company.visitors,
      })
    }
  }

  contractRows.sort((a, b) => a.daysLeft - b.daysLeft || a.name.localeCompare(b.name, 'pt-BR'))

  const expiringWithin = (days: number) => contractRows.filter(row => row.daysLeft >= 0 && row.daysLeft <= days).length

  const kpis = {
    active: scopedActive.length,
    inactive: scoped.length - scopedActive.length,
    newInYear,
    newDelta: buildDelta(newInYear, newInPreviousYear),
    expiring30: expiringWithin(30),
    expiring60: expiringWithin(60),
    expiring90: expiringWithin(90),
    expiredActive: contractRows.filter(row => row.daysLeft < 0).length,
    withoutContractEnd,
  }

  // Cadastros ao longo do tempo
  const firstYear = companies.reduce((accumulator, company) => Math.min(accumulator, createdYear(company)), today.year)

  const byYear = Array.from({ length: today.year - firstYear + 1 }, (_, index) => {
    const value = firstYear + index
    return { year: value, total: scoped.filter(company => createdYear(company) === value).length }
  })

  const createdByMonth = Array.from({ length: 12 }, () => 0)

  for (const company of scoped) {
    const { year: companyYear, month } = getSaoPauloDateParts(company.createdAt)
    if (companyYear === year) createdByMonth[month - 1]++
  }

  // Distribuição e cobertura (empresas ativas)
  const activeCities = cities.filter(city => city.active)
  const activeCategories = categories.filter(category => category.active)
  const allActive = companies.filter(company => company.active)

  const activeByCity = new Map<string, number>()
  for (const company of allActive) activeByCity.set(company.cityId, (activeByCity.get(company.cityId) ?? 0) + 1)

  // Comparação entre subseções: sempre todas, com a filtrada destacada
  const byCity = rank(
    activeCities
      .map(city => ({
        id: city.id,
        name: formatCityName(city.name),
        total: activeByCity.get(city.id) ?? 0,
        highlighted: city.id === selectedCityId,
      }))
      .sort(byTotalThenName)
  )

  const byCategory = rank(
    activeCategories
      .map(category => ({
        id: category.id,
        name: category.name,
        total: scopedActive.filter(company => company.categoryId === category.id).length,
      }))
      .filter(category => category.total > 0)
      .sort(byTotalThenName)
  )

  const coverage: CoverageMatrix = {
    categories: activeCategories
      .map(category => ({ id: category.id, name: category.name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
    rows: [],
  }

  coverage.rows = activeCities
    .map(city => {
      const cityCompanies = allActive.filter(company => company.cityId === city.id)

      return {
        id: city.id,
        name: formatCityName(city.name),
        total: cityCompanies.length,
        cells: coverage.categories.map(category => cityCompanies.filter(company => company.categoryId === category.id).length),
        highlighted: city.id === selectedCityId,
      }
    })
    .sort(byTotalThenName)

  const citiesWithoutCompanies = coverage.rows.filter(row => row.total === 0).map(row => row.name)

  // Procura no ano (agregado diário)
  const viewsByMonth = Array.from({ length: 12 }, () => 0)
  const clicksByMonth = Array.from({ length: 12 }, () => 0)
  const yearDemand = new Map<string, { views: number; contacts: number }>()

  for (const stat of dailyStats) {
    if (!scopedById.has(stat.companyId)) continue

    // `date` é @db.Date (meia-noite UTC): o mês sai do próprio UTC, sem conversão de fuso
    const month = stat.date.getUTCMonth()
    viewsByMonth[month] += stat.views
    clicksByMonth[month] += stat.whatsappClicks

    const current = yearDemand.get(stat.companyId) ?? { views: 0, contacts: 0 }
    current.views += stat.views
    current.contacts += stat.whatsappClicks
    yearDemand.set(stat.companyId, current)
  }

  const yearViews = viewsByMonth.reduce((accumulator, value) => accumulator + value, 0)
  const yearContacts = clicksByMonth.reduce((accumulator, value) => accumulator + value, 0)

  const topInYear: TopCompany[] = [...yearDemand.entries()]
    .map(([companyId, demand]) => ({ company: scopedById.get(companyId), ...demand }))
    .filter(
      (item): item is { company: MetricsCompanyRow; views: number; contacts: number } =>
        !!item.company?.active && item.contacts > 0
    )
    .sort((a, b) => b.contacts - a.contacts || b.views - a.views || a.company.name.localeCompare(b.company.name, 'pt-BR'))
    .slice(0, 5)
    .map(item => ({ ...toLink(item.company), contacts: item.contacts, views: item.views }))

  const topAllTime: TopCompany[] = scopedActive
    .filter(company => company.visitors > 0)
    .sort((a, b) => b.visitors - a.visitors || a.name.localeCompare(b.name, 'pt-BR'))
    .slice(0, 5)
    .map(company => ({ ...toLink(company), contacts: company.visitors, views: null }))

  const withoutDemand: WithoutDemandRow[] = scopedActive
    .filter(
      company =>
        company.visitors === 0 &&
        !yearDemand.get(company.id)?.contacts &&
        now.getTime() - company.createdAt.getTime() > WITHOUT_DEMAND_MIN_AGE_DAYS * DAY_IN_MS
    )
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map(company => ({ ...toLink(company), createdAt: company.createdAt.toISOString() }))

  // Equipe: quem cadastrou no ano
  const userById = new Map(users.map(user => [user.id, user]))
  const creatorCounts = new Map<string | null, number>()

  for (const company of scoped) {
    if (createdYear(company) !== year) continue
    creatorCounts.set(company.createdById, (creatorCounts.get(company.createdById) ?? 0) + 1)
  }

  const rankedCreators = rank(
    [...creatorCounts.entries()]
      .map(([userId, total]) => ({
        id: userId ?? 'sem-registro',
        name: userId ? (userById.get(userId)?.name ?? 'Usuário removido') : 'Sem registro',
        total,
      }))
      // "Sem registro" vai para o fim: não é uma pessoa disputando posição
      .sort((a, b) => Number(a.id === 'sem-registro') - Number(b.id === 'sem-registro') || byTotalThenName(a, b))
  )

  const creators: CreatorRow[] = rankedCreators.map(creator => ({
    ...creator,
    image: userById.get(creator.id)?.image ?? null,
  }))

  return {
    kpis,
    byYear,
    byMonth: buildMonthSeries(createdByMonth, year, today),
    byCity,
    byCategory,
    coverage,
    citiesWithoutCompanies,
    contracts: contractRows,
    demand: {
      views: buildMonthSeries(viewsByMonth, year, today),
      contacts: buildMonthSeries(clicksByMonth, year, today),
      totalViews: yearViews,
      totalContacts: yearContacts,
      conversion: yearViews > 0 ? (yearContacts / yearViews) * 100 : null,
      firstStatDate: firstStatDate?.toISOString() ?? null,
    },
    topInYear,
    topAllTime,
    withoutDemand,
    creators,
  }
}

// Anos do seletor: do primeiro cadastro até o ano corrente
export function buildYearOptions(firstCompanyAt: Date | null, now: Date) {
  const currentYear = getSaoPauloDateParts(now).year
  const firstYear = firstCompanyAt ? Math.min(getSaoPauloDateParts(firstCompanyAt).year, currentYear) : currentYear

  return Array.from({ length: currentYear - firstYear + 1 }, (_, index) => currentYear - index)
}
