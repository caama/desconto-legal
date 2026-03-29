import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns'
import { toLocalDate } from './to-local-date'

export function getContractDuration(contractStart: Date | string, contractEnd: Date | string) {
  const startDate = toLocalDate(contractStart)
  const endDate = toLocalDate(contractEnd)
  const days = differenceInDays(endDate, startDate)

  if (days < 0) {
    return 'Período inválido'
  }

  if (days <= 30) {
    return `${days} ${days === 1 ? 'dia' : 'dias'}`
  }

  const months = differenceInMonths(endDate, startDate)

  // Regra visual/comercial: contratos com praticamente um ano contam como 1 ano.
  if (days >= 364 && months < 12) {
    return '1 ano'
  }

  if (months < 12) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`
  }

  const years = differenceInYears(endDate, startDate)

  return `${years} ${years === 1 ? 'ano' : 'anos'}`
}

export function getRemainingTime(contractEnd: Date | string) {
  const endDate = toLocalDate(contractEnd)
  const today = toLocalDate(new Date())

  const days = differenceInDays(endDate, today)

  if (days < 0) {
    return 'Contrato vencido'
  }

  // até 30 dias → dias
  if (days <= 30) {
    return `${days} ${days === 1 ? 'dia' : 'dias'} restantes`
  }

  const months = differenceInMonths(endDate, today)

  // até 12 meses → meses
  if (months < 12) {
    return `${months} ${months === 1 ? 'mês' : 'meses'} restantes`
  }

  const years = differenceInYears(endDate, today)

  return `${years} ${years === 1 ? 'ano' : 'anos'} restantes`
}

export function getContractStatus(contractEnd: Date | string) {
  const today = toLocalDate(new Date())
  const endDate = toLocalDate(contractEnd)

  const daysLeft = differenceInDays(endDate, today)

  if (daysLeft < 0) {
    return { status: 'expired' as const, daysLeft }
  }

  if (daysLeft <= 30) {
    return { status: 'warning' as const, daysLeft }
  }

  return { status: 'active' as const, daysLeft }
}
