type Observacion = {
  id: string
  texto: string
  consiguio: boolean | null
  fechaEvento: string
  estado: 'pendiente' | 'confirmada' | 'descartada'
  respuestaTerapeuta: string | null
}

const ETIQUETA_ESTADO: Record<Observacion['estado'], { label: string; color: string }> = {
  pendiente: { label: 'Pendiente de revisar', color: 'bg-amber-50 text-amber-700' },
  confirmada: { label: 'Confirmada por el equipo', color: 'bg-emerald-50 text-emerald-700' },
  descartada: { label: 'No se ha contado como dato', color: 'bg-slate-100 text-slate-600' },
}

export default function HistorialObservaciones({ observaciones }: { observaciones: Observacion[] }) {
  if (observaciones.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-700">Lo que has contado</p>
      <ul className="space-y-2">
        {observaciones.map((o) => {
          const info = ETIQUETA_ESTADO[o.estado]
          return (
            <li key={o.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${info.color}`}>
                  {info.label}
                </span>
                <span className="text-xs text-slate-600">{new Date(o.fechaEvento).toLocaleDateString('es-ES')}</span>
              </div>
              <p className="mt-1 text-slate-700">{o.texto}</p>
              {o.respuestaTerapeuta && (
                <p className="mt-1 text-xs text-slate-600">
                  <strong>Respuesta del equipo:</strong> {o.respuestaTerapeuta}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
