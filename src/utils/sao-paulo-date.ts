// A Vercel roda em UTC: sem fixar o fuso, um cadastro às 22h de 31/12 cairia no ano seguinte
export const SAO_PAULO_TIME_ZONE = 'America/Sao_Paulo'

const partsFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SAO_PAULO_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

// Ano, mês (1..12) e dia da data civil em São Paulo
export function getSaoPauloDateParts(date: Date | string) {
  const parts = partsFormatter.formatToParts(new Date(date))
  const read = (type: 'year' | 'month' | 'day') => Number(parts.find(part => part.type === type)?.value)

  return { year: read('year'), month: read('month'), day: read('day') }
}

// Dia civil em São Paulo como meia-noite UTC, o formato que o Prisma grava em colunas @db.Date
export function getSaoPauloDay(date: Date = new Date()) {
  const { year, month, day } = getSaoPauloDateParts(date)

  return new Date(Date.UTC(year, month - 1, day))
}
