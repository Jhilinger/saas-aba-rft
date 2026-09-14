import { Panel, Skeleton } from '../../../../ui'

export default function TomarDatosLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8" aria-label="Cargando toma de datos">
      <div className="space-y-2"><Skeleton className="h-4 w-36" /><Skeleton className="h-8 w-72" /></div>
      <Panel className="space-y-5 p-4 sm:p-8">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-2 gap-3"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
        <Skeleton className="h-14 w-full" />
      </Panel>
    </div>
  )
}