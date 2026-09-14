import { Panel, Skeleton } from '../../ui'

export default function AgendaLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8" aria-label="Cargando agenda">
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Panel className="space-y-4 p-4 sm:p-6">
        <div className="flex gap-2"><Skeleton className="h-9 w-40" /><Skeleton className="h-9 w-28" /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-11 w-full" /><Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" /><Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
      </Panel>
      <div className="grid gap-2 sm:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => <Panel key={index} className="h-44 p-3"><Skeleton className="mx-auto h-4 w-20" /></Panel>)}
      </div>
    </div>
  )
}