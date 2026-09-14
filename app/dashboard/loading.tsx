import { Panel, Skeleton } from '../ui'

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8" aria-label="Cargando contenido">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <Panel className="space-y-3 p-4 sm:p-5"><Skeleton className="h-9 w-16" /><Skeleton className="h-4 w-28" /></Panel>
        <Panel className="space-y-3 p-4 sm:p-5"><Skeleton className="h-9 w-16" /><Skeleton className="h-4 w-28" /></Panel>
        <Panel className="hidden space-y-3 p-4 sm:block sm:p-5"><Skeleton className="h-9 w-16" /><Skeleton className="h-4 w-28" /></Panel>
      </div>
      <Panel className="space-y-4 p-4 sm:p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Panel>
    </div>
  )
}