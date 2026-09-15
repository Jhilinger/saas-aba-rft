'use client'

import { Button } from '../../ui'

export function BannerSinConexion() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-xs text-slate-600">
      <span className="h-2 w-2 shrink-0 rounded-full bg-slate-400" />
      Sin conexión — tus respuestas se están guardando en este dispositivo.
    </div>
  )
}

export function PantallaGuardadoPendiente({
  tipo,
  onReintentar,
  onVolver,
  reintentando,
}: {
  tipo: 'pendiente' | 'error'
  onReintentar: () => void
  onVolver: () => void
  reintentando: boolean
}) {
  const pendiente = tipo === 'pendiente'
  return (
    <div
      className={`space-y-3 rounded-2xl border p-4 text-center sm:p-6 ${
        pendiente ? 'border-amber-300 bg-amber-50' : 'border-rose-300 bg-rose-50'
      }`}
    >
      <p className={`text-base font-semibold sm:text-lg ${pendiente ? 'text-amber-800' : 'text-rose-800'}`}>
        {pendiente ? 'Sin conexión — tus datos están a salvo' : 'No se pudo guardar el bloque'}
      </p>
      <p className={`text-sm ${pendiente ? 'text-amber-700' : 'text-rose-700'}`}>
        {pendiente
          ? 'Este bloque ya está guardado en tu dispositivo. En cuanto vuelva la conexión se sincronizará solo — también puedes reintentarlo ahora.'
          : 'Tus datos siguen a salvo en este dispositivo. Puedes reintentar cuando quieras.'}
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={onReintentar} disabled={reintentando} className="py-3 text-base sm:py-2 sm:text-sm">
          {reintentando ? 'Reintentando...' : 'Reintentar ahora'}
        </Button>
        <Button variant="secondary" onClick={onVolver} className="py-3 text-base sm:py-2 sm:text-sm">
          Volver al programa
        </Button>
      </div>
    </div>
  )
}
