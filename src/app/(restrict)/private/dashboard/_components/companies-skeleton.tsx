import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function CompaniesTableSkeleton() {
  return Array.from({ length: 8 }, (_, index) => (
    <TableRow key={index} className="hover:bg-transparent">
      {/* Company Info */}
      <TableCell className="px-4 py-3">
        <div className="flex min-w-56 items-center gap-3">
          <Skeleton className="size-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </TableCell>

      {/* City */}
      <TableCell className="hidden px-4 py-3 xl:table-cell">
        <Skeleton className="h-4 w-20" />
      </TableCell>

      {/* Category */}
      <TableCell className="hidden px-4 py-3 xl:table-cell">
        <Skeleton className="h-6 w-32 rounded-full" />
      </TableCell>

      {/* WhatsApp */}
      <TableCell className="hidden px-4 py-3 2xl:table-cell">
        <Skeleton className="h-4 w-28" />
      </TableCell>

      {/* Contract */}
      <TableCell className="px-4 py-3">
        <Skeleton className="h-6 w-24 rounded-full" />
      </TableCell>

      {/* Status */}
      <TableCell className="px-4 py-3">
        <Skeleton className="h-4 w-12" />
      </TableCell>

      {/* Actions */}
      <TableCell className="px-4 py-3">
        <div className="flex justify-end">
          <Skeleton className="h-8 w-[66px] rounded-lg" />
        </div>
      </TableCell>
    </TableRow>
  ))
}
