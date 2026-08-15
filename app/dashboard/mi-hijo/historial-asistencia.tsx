type Sesion = {
  id: string
  fecha_hora: string
  estado: 'programada' | 'asistio' | 'cancelada' | 'no_asistio'
  cancelado_por: string | null
  confirmada_familia: boolean
  alumno_nombre: string
}

const ETIQUETA_ESTADO: Record<string, { label: string; color: string }> = {
  programada: { label: 'Programada', color: 'bg-slate-100 text-slate-500' },
  asistio: { label: 'Asistió', color: 'bg-emerald-50 text-emerald-700' },
  cancelada: { label: 'Cancelada', color: 'bg-amber-50 text-amber-700' },
  no_asistio: { label: 'No asistió', color: 'bg-rose-50 text-rose-700' },
}

export default function HistorialAsistencia({ sesiones }: { sesiones: Sesion[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
      <table className="w-full text-sm min-w-[450px]">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="p-3">Alumno</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Confirmada</th>
          </tr>
        </thead>
        <tbody>
          {sesiones.map((s) => (
            <tr key={s.id} className="border-b border-slate-100 last:border-0">
              <td className="p-3 font-medium text-slate-800">{s.alumno_nombre}</td>
              <td className="p-3 text-slate-600 whitespace-nowrap">
                {new Date(s.fecha_hora).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </td>
              <td className="p-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${ETIQUETA_ESTADO[s.estado].color}`}>
                  {ETIQUETA_ESTADO[s.estado].label}
                  {s.cancelado_por && ` (${s.cancelado_por})`}
                </span>
              </td>
              <td className="p-3 text-slate-600">
                {s.estado === 'programada' ? '—' : s.confirmada_familia ? '✓ Sí' : 'Pendiente'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sesiones.length === 0 && (
        <p className="p-6 text-center text-slate-400">Todavía no hay sesiones registradas.</p>
      )}
    </div>
  )
}