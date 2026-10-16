import { auth } from '@/lib/auth'
import { buildReport, reportFileName } from '@/lib/reports/builders'
import { isReportId, parseReportFilters } from '@/lib/reports/filters'
import { renderReportPdf } from '@/lib/reports/pdf'
import { renderReportXlsx } from '@/lib/reports/xlsx'

const CONTENT_TYPES = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as const

type RouteProps = {
  params: Promise<{ report: string; format: string }>
}

export async function GET(request: Request, { params }: RouteProps) {
  const session = await auth()

  if (!session?.user) {
    return Response.json({ error: 'Usuário não autenticado' }, { status: 401 })
  }

  if (session.user.role !== 'ADMIN' || session.user.inactive) {
    return Response.json({ error: 'Acesso restrito a administradores' }, { status: 403 })
  }

  const { report: reportId, format } = await params

  if (!isReportId(reportId) || (format !== 'pdf' && format !== 'xlsx')) {
    return Response.json({ error: 'Relatório não encontrado' }, { status: 404 })
  }

  const searchParams = new URL(request.url).searchParams
  // O relatório vem do caminho; a query só carrega os filtros
  const filters = { ...parseReportFilters(searchParams), relatorio: reportId }

  const now = new Date()
  const report = await buildReport(filters, now)
  const meta = { generatedAt: now, generatedBy: session.user.name ?? session.user.email }

  const file = format === 'pdf' ? await renderReportPdf(report, meta) : await renderReportXlsx(report, meta)

  return new Response(new Uint8Array(file), {
    headers: {
      'Content-Type': CONTENT_TYPES[format],
      'Content-Disposition': `attachment; filename="${reportFileName(filters, format, now)}"`,
      'Cache-Control': 'no-store',
    },
  })
}
