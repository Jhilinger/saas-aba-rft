import { Panel, Skeleton } from '../../ui'

export default function AlumnosLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-8" aria-label="Cargando alumnos">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Panel className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
      </Panel>
      <Panel className="p-4 sm:p-6 space-y-3">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Panel>
    </div>
  )
}
