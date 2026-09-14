import { Panel, Skeleton } from '../../ui'

export default function CurriculoLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8" aria-label="Cargando currículo" role="status">
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Panel className="p-4 sm:p-6 space-y-3">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Panel>
    </div>
  )
}
