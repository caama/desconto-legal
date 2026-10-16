import ExcelJS from 'exceljs'
import { formatGeneratedAt } from './format'
import { getReportLogo, LOGO_RATIO } from './logo'
import type { Report, ReportCell, ReportColumn, ReportMeta } from './types'

const NAVY = 'FF22254D'
const MUTED = 'FF5F5F69'
const LINE = 'FFE4E4E7'
const ZEBRA = 'FFF6F6F8'

const LOGO_WIDTH = 300

const NUMBER_FORMATS: Record<ReportColumn['type'], string | undefined> = {
  text: undefined,
  number: '#,##0',
  date: 'dd/mm/yyyy',
  percent: '0.0%',
}

// Nome de aba: até 31 caracteres e sem os caracteres proibidos pelo Excel
function sheetName(title: string) {
  return title.replace(/[\\/?*[\]:]/g, ' ').slice(0, 31)
}

const cellValue = (value: ReportCell | undefined) => (value === undefined ? null : value)

export async function renderReportXlsx(report: Report, meta: ReportMeta) {
  const logo = await getReportLogo()
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'CAAMA · Desconto Legal'
  workbook.created = meta.generatedAt

  const columns = report.columns
  const lastColumn = Math.max(columns.length, 6)

  // Bloco de identidade acima da tabela: logo, título, descrição, filtros, autoria e resumo
  const HEADER_ROW = 10

  const sheet = workbook.addWorksheet(sheetName(report.title), {
    views: [{ state: 'frozen', ySplit: HEADER_ROW, showGridLines: false }],
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      printTitlesRow: `${HEADER_ROW}:${HEADER_ROW}`,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    },
    headerFooter: { oddFooter: '&LCAAMA · Desconto Legal&RPágina &P de &N' },
  })

  sheet.columns = columns.map(column => ({ key: column.key, width: column.xlsxWidth }))

  for (const rowNumber of [1, 2, 3]) sheet.getRow(rowNumber).height = 20

  const imageId = workbook.addImage({ buffer: logo as unknown as ExcelJS.Buffer, extension: 'png' })
  sheet.addImage(imageId, { tl: { col: 0, row: 0.2 }, ext: { width: LOGO_WIDTH, height: LOGO_WIDTH / LOGO_RATIO } })

  function textLine(rowNumber: number, text: string, font: Partial<ExcelJS.Font>) {
    sheet.mergeCells(rowNumber, 1, rowNumber, lastColumn)
    const cell = sheet.getCell(rowNumber, 1)
    cell.value = text
    cell.font = font
    cell.alignment = { vertical: 'middle', wrapText: false }
  }

  textLine(4, report.title, { bold: true, size: 15, color: { argb: NAVY } })
  textLine(5, report.description, { size: 10, color: { argb: MUTED } })
  textLine(6, report.filterLines.join('   ·   '), { size: 10 })
  textLine(7, `Gerado em ${formatGeneratedAt(meta.generatedAt)} por ${meta.generatedBy}`, {
    size: 9,
    italic: true,
    color: { argb: MUTED },
  })
  textLine(8, report.summary.map(item => `${item.label}: ${item.value}`).join('   ·   '), {
    bold: true,
    size: 10,
    color: { argb: NAVY },
  })
  sheet.getRow(4).height = 22

  const header = sheet.getRow(HEADER_ROW)
  header.values = columns.map(column => column.header)
  header.height = 22
  header.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
    cell.alignment = { vertical: 'middle', wrapText: true }
  })

  report.rows.forEach((row, index) => {
    const excelRow = sheet.addRow(columns.map(column => cellValue(row[column.key])))

    excelRow.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
      const column = columns[columnNumber - 1]
      const format = column ? NUMBER_FORMATS[column.type] : undefined

      if (format) cell.numFmt = format
      cell.border = { bottom: { style: 'thin', color: { argb: LINE } } }
      if (index % 2 === 1) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ZEBRA } }
    })
  })

  if (report.totals && report.rows.length > 0) {
    const totals = report.totals
    const totalRow = sheet.addRow(columns.map(column => cellValue(totals[column.key])))

    totalRow.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
      const column = columns[columnNumber - 1]
      const format = column ? NUMBER_FORMATS[column.type] : undefined

      if (format) cell.numFmt = format
      cell.font = { bold: true }
      cell.border = { top: { style: 'medium', color: { argb: NAVY } } }
    })
  }

  if (report.rows.length === 0) {
    const emptyRow = sheet.addRow([report.emptyMessage])
    emptyRow.getCell(1).font = { italic: true, color: { argb: MUTED } }
  } else {
    sheet.autoFilter = {
      from: { row: HEADER_ROW, column: 1 },
      to: { row: HEADER_ROW + report.rows.length, column: columns.length },
    }
  }

  for (const note of report.notes ?? []) {
    const noteRow = sheet.addRow([note])
    noteRow.getCell(1).font = { size: 9, italic: true, color: { argb: MUTED } }
  }

  return Buffer.from(await workbook.xlsx.writeBuffer())
}
