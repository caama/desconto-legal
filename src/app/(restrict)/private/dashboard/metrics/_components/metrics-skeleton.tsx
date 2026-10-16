import { Skeleton } from '@/components/ui/skeleton'

// Mesma grade da tela pronta, para a troca de filtro não fazer a página pular
export function MetricsSkeleton() {
  return (
    <div className="flex flex-col gap-5" role="status" aria-busy="true" aria-label="Carregando métricas">
      <div className="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
        <Skeleton className="h-15 rounded-lg bg-muted-foreground/15" />
        <Skeleton className="h-15 rounded-lg bg-muted-foreground/15" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl bg-muted-foreground/15" />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl bg-muted-foreground/15" />
        <Skeleton className="h-80 rounded-xl bg-muted-foreground/15" />
      </div>

      <Skeleton className="h-96 rounded-xl bg-muted-foreground/15" />
    </div>
  )
}
