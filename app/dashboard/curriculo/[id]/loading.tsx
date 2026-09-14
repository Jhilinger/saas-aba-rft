import { Panel, Skeleton } from '../../../ui'

export default function ProgramaBaseLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8 sm:space-y-8" aria-label="Cargando programa" role="status">
      <div className="space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Panel className="p-4 text-sm shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-10 w-full sm:col-span-3" />
          <Skeleton className="h-10 w-full sm:col-span-3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Panel>
      <div className="space-y-4">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-11 w-full" />
        <Panel className="p-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Panel>
      </div>
    </div>
  )
}
