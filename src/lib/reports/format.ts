import type { ReportCell, ReportColumn } from './types'

export const EMPTY_CELL = '–'

const numberFormatter = new Intl.NumberFormat('pt-BR')
const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
// Datas do relatório já são o dia civil em meia-noite UTC: formatar em UTC mantém o dia
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' })
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatCount(value: number) {
  return numberFormatter.format(value)
}

export function formatPercentValue(fraction: number) {
  return percentFormatter.format(fraction)
}

export function formatDateValue(date: Date) {
  return dateFormatter.format(date)
}

export function formatGeneratedAt(date: Date) {
  return dateTimeFormatter.format(date)
}

// Texto da célula na prévia e no PDF (o Excel grava o valor tipado)
export function formatCell(column: ReportColumn, value: ReportCell) {
  if (value === null || value === '') return EMPTY_CELL
  if (value instanceof Date) return formatDateValue(value)
  if (typeof value === 'number') return column.type === 'percent' ? formatPercentValue(value) : formatCount(value)

  return value
}
