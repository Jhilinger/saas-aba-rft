export type Sonda = {
  id: string
  fecha: string
  tipo: 'generalizacion' | 'mantenimiento'
  contexto: string | null
  porcentaje: number
  conjuntoNombre: string
}

const ETIQUETA_TIPO: Record<Sonda['tipo'], { label: string; color: string }> = {
  generalizacion: { label: 'Generalización', color: 'bg-indigo-50 text-indigo-700' },
  mantenimiento: { label: 'Mantenimiento', color: 'bg-emerald-50 text-emerald-700' },
}

export default function SondasLista({ sondas }: { sondas: Sonda[] }) {
  if (sondas.length === 0) {
    return (
      <p className="text-center text-sm text-slate-600 py-4">
        Todavía no hay sondas de generalización ni de mantenimiento registradas.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {sondas.map((s) => {
        const info = ETIQUETA_TIPO[s.tipo]
        return (
          <li key={s.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${info.color}`}>
                  {info.label}
                </span>
                <span className="text-slate-600">{s.conjuntoNombre}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className={s.porcentaje >= 80 ? 'font-semibold text-emerald-700' : 'font-semibold text-slate-600'}>
                  {s.porcentaje}%
                </span>
                <span>{s.fecha}</span>
              </div>
            </div>
            {s.contexto && <p className="mt-1 text-xs text-slate-600">{s.contexto}</p>}
          </li>
        )
      })}
    </ul>
  )
}
