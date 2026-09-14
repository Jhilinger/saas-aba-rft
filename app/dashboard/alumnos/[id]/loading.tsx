import { Panel, Skeleton } from '../../../ui'

export default function AlumnoDetalleLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8" aria-label="Cargando alumno" role="status">
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0" />
        ))}
      </div>
      <Panel className="space-y-4 p-4 sm:p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </Panel>
    </div>
  )
}
