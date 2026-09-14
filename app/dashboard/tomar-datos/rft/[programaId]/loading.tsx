import { Panel, Skeleton } from '../../../../ui'

export default function TomarDatosRftLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8" aria-label="Cargando toma de datos RFT">
      <div className="space-y-2"><Skeleton className="h-4 w-36" /><Skeleton className="h-8 w-72" /></div>
      <Panel className="space-y-5 p-4 sm:p-8">
        <Skeleton className="h-5 w-48" />
        <div className="flex flex-wrap gap-2"><Skeleton className="h-11 w-28" /><Skeleton className="h-11 w-28" /><Skeleton className="h-11 w-28" /></div>
        <Skeleton className="h-12 w-full" />
      </Panel>
    </div>
  )
}