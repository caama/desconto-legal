export type ColumnType = 'text' | 'number' | 'date' | 'percent'

export type ReportColumn = {
  key: string
  header: string
  type: ColumnType
  // Peso da coluna na largura da tabela do PDF
  pdfWidth: number
  // Largura em caracteres no Excel
  xlsxWidth: number
  // false: a coluna só cabe na planilha
  pdf?: boolean
}

// Datas chegam normalizadas para o dia civil de São Paulo (meia-noite UTC); percentuais como fração (0,148)
export type ReportCell = string | number | Date | null

export type ReportRow = Record<string, ReportCell>

export type Report = {
  id: string
  title: string
  description: string
  filterLines: string[]
  summary: { label: string; value: string }[]
  columns: ReportColumn[]
  rows: ReportRow[]
  totals?: ReportRow
  notes?: string[]
  emptyMessage: string
}

export type ReportMeta = {
  generatedAt: Date
  generatedBy: string
}
