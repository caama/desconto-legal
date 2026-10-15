import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

// Traços finos de propósito: o placeholder marca onde o dado vai cair, sem imitar o peso dele
export function CitiesSkeleton() {
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

      <TableCell className="hidden sm:table-cell">
        <div className="inline-flex h-5 items-center">
          <Skeleton className="h-3 w-16 rounded-full bg-muted-foreground/20" />
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
