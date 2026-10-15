import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function CategoriesListSkeleton() {
  return (
    <div className="flex gap-2 overflow-hidden pb-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3.5">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-42" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function CategoriesTableSkeleton() {
  return Array.from({ length: 5 }, (_, index) => (
    <TableRow key={index} className="hover:bg-transparent">
      <TableCell className="py-3">
        <div className="inline-flex items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full bg-muted-foreground/20" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32 bg-muted-foreground/20" />
            <Skeleton className="h-2.5 w-20 bg-muted-foreground/15" />
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="inline-flex h-5 items-center">
          <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        </div>
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <div className="inline-flex h-5 items-center">
          <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
        </div>
      </TableCell>

      <TableCell>
        <div className="flex justify-center">
          <Skeleton className="h-3 w-14 bg-muted-foreground/20" />
        </div>
      </TableCell>
    </TableRow>
  ))
}
