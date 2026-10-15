import { Skeleton } from '@/components/ui/skeleton'

export function CompanyCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <div className="flex h-32 items-center justify-center border-border border-b bg-white px-8">
        <Skeleton className="h-14 w-32 rounded-md" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Skeleton className="h-5 w-3/4" />

        <div className="mt-3 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        <Skeleton className="mt-6 h-11 w-full rounded-lg" />
      </div>
    </div>
  )
}
