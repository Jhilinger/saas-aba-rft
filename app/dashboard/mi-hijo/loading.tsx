import { Panel, Skeleton } from '../../ui'

export default function MiHijoLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8" aria-label="Cargando progreso">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-56" />
      </div>
      <Panel className="p-4 sm:p-6 space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Panel>
    </div>
  )
}
