import { Document, Font, Image, Page, renderToBuffer, StyleSheet, Text, View } from '@react-pdf/renderer'
import { formatCell, formatGeneratedAt } from './format'
import { getReportLogo, LOGO_RATIO } from './logo'
import type { Report, ReportColumn, ReportMeta, ReportRow } from './types'

// Cores da identidade: azul-marinho do painel (--primary) e o vermelho da logo
const NAVY = '#22254d'
const RED = '#a01c24'
const INK = '#18181b'
const MUTED = '#5f5f69'
const LINE = '#e4e4e7'
const ZEBRA = '#f6f6f8'

const LOGO_HEIGHT = 26

// Sem hifenização: o react-pdf quebraria "contrato" em "contra-to" nas colunas estreitas
Font.registerHyphenationCallback(word => [word])

const styles = StyleSheet.create({
  page: {
    paddingTop: 26,
    paddingBottom: 40,
    paddingHorizontal: 28,
    fontFamily: 'Helvetica',
    fontSize: 7.5,
    color: INK,
  },
  header: { marginBottom: 8 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  generated: { fontSize: 7, color: MUTED, textAlign: 'right' },
  title: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: NAVY, marginTop: 10 },
  description: { fontSize: 8, color: MUTED, marginTop: 2 },
  filters: { fontSize: 7.5, color: INK, marginTop: 4 },
  band: { flexDirection: 'row', height: 2.5, marginTop: 8 },
  summary: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  summaryItem: {
    flexGrow: 1,
    borderWidth: 0.75,
    borderColor: LINE,
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  summaryLabel: { fontSize: 6.5, color: MUTED, textTransform: 'uppercase' },
  summaryValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY, marginTop: 2 },
  headRow: { flexDirection: 'row', backgroundColor: NAVY, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  headCell: { color: '#ffffff', fontFamily: 'Helvetica-Bold', fontSize: 7, paddingVertical: 4, paddingHorizontal: 4 },
  row: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: LINE },
  cell: { paddingVertical: 3.5, paddingHorizontal: 4 },
  totalRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: NAVY },
  totalCell: { paddingVertical: 4, paddingHorizontal: 4, fontFamily: 'Helvetica-Bold' },
  notes: { marginTop: 8, gap: 2 },
  note: { fontSize: 6.5, color: MUTED },
  empty: { marginTop: 24, textAlign: 'center', color: MUTED, fontSize: 9 },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.75,
    borderTopColor: RED,
    paddingTop: 4,
    fontSize: 6.5,
    color: MUTED,
  },
})

const isNumeric = (column: ReportColumn) => column.type !== 'text'

function cellStyle(column: ReportColumn) {
  return { flexGrow: column.pdfWidth, flexBasis: 0, textAlign: isNumeric(column) ? ('right' as const) : ('left' as const) }
}

function TableRow({ columns, row, index }: { columns: ReportColumn[]; row: ReportRow; index: number }) {
  return (
    <View style={[styles.row, index % 2 === 1 ? { backgroundColor: ZEBRA } : {}]} wrap={false}>
      {columns.map(column => (
        <Text key={column.key} style={[styles.cell, cellStyle(column)]}>
          {formatCell(column, row[column.key] ?? null)}
        </Text>
      ))}
    </View>
  )
}

function ReportDocument({ report, meta, logo }: { report: Report; meta: ReportMeta; logo: Buffer }) {
  const columns = report.columns.filter(column => column.pdf !== false)

  return (
    <Document title={report.title} author="CAAMA · Desconto Legal" creator="Desconto Legal" language="pt-BR">
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Cabeçalho, resumo e cabeçalho da tabela fixos: repetem em todas as páginas */}
        <View style={styles.header} fixed>
          <View style={styles.top}>
            <Image src={{ data: logo, format: 'png' }} style={{ height: LOGO_HEIGHT, width: LOGO_HEIGHT * LOGO_RATIO }} />
            <View>
              <Text style={styles.generated}>Desconto Legal · Relatório gerencial</Text>
              <Text style={styles.generated}>
                Gerado em {formatGeneratedAt(meta.generatedAt)} por {meta.generatedBy}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{report.title}</Text>
          <Text style={styles.description}>{report.description}</Text>
          <Text style={styles.filters}>{report.filterLines.join('   ·   ')}</Text>

          <View style={styles.band}>
            <View style={{ flexGrow: 3, backgroundColor: NAVY }} />
            <View style={{ flexGrow: 1, backgroundColor: RED }} />
          </View>
        </View>

        {report.summary.length > 0 && (
          <View style={styles.summary} fixed>
            {report.summary.map(item => (
              <View key={item.label} style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>{item.label}</Text>
                <Text style={styles.summaryValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}

        {report.rows.length === 0 ? (
          <Text style={styles.empty}>{report.emptyMessage}</Text>
        ) : (
          <>
            <View style={styles.headRow} fixed>
              {columns.map(column => (
                <Text key={column.key} style={[styles.headCell, cellStyle(column)]}>
                  {column.header}
                </Text>
              ))}
            </View>

            {report.rows.map((row, index) => (
              <TableRow key={index} columns={columns} row={row} index={index} />
            ))}

            {report.totals && (
              <View style={styles.totalRow} wrap={false}>
                {columns.map(column => (
                  <Text key={column.key} style={[styles.totalCell, cellStyle(column)]}>
                    {report.totals?.[column.key] === null || report.totals?.[column.key] === undefined
                      ? ''
                      : formatCell(column, report.totals[column.key] ?? null)}
                  </Text>
                ))}
              </View>
            )}
          </>
        )}

        {!!report.notes?.length && (
          <View style={styles.notes} wrap={false}>
            {report.notes.map(note => (
              <Text key={note} style={styles.note}>
                {note}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>CAAMA · Caixa de Assistência dos Advogados do Maranhão · Desconto Legal</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

export async function renderReportPdf(report: Report, meta: ReportMeta) {
  const logo = await getReportLogo()

  return renderToBuffer(<ReportDocument report={report} meta={meta} logo={logo} />)
}
