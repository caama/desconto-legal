import type { ReportFilters as ReportFiltersValue } from '@/lib/reports/filters'
import { getReportPreview } from '../_dal/get-report-preview'
import { ReportFilters } from './report-filters'
import { ReportPreview } from './report-preview'

export async function ReportBoard({ filters }: { filters: ReportFiltersValue }) {
  const { report, options } = await getReportPreview(filters)

  return (
    <div className="flex flex-col gap-5">
      <ReportFilters filters={filters} options={options} />
      <ReportPreview report={report} filters={filters} />
    </div>
  )
}
