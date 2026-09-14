import { Panel, Skeleton } from '../../../ui'

export default function ProgramaRftLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8" aria-label="Cargando programa RFT" role="status">
      <div className="space-y-2">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-40" />
      </div>
      <Panel className="space-y-3 p-4 text-sm sm:p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </Panel>
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <Panel className="p-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Panel>
      </div>
    </div>
  )
}
