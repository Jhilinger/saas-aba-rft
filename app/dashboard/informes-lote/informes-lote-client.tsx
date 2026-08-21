'use client'

import { useState } from 'react'
import { generarInforme } from '../alumnos/[id]/informes/actions'

type Alumno = { id: string; nombre_anonimizado: string }
type EstadoAlumno = 'pendiente' | 'generando' | 'exito' | 'error'

function hace30Dias(): string {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().split('T')[0]
}

function hoy(): string {
  return new Date().toISOString().split('T')[0]
}

export default function InformesLoteClient({ alumnos }: { alumnos: Alumno[] }) {
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [destinatario, setDestinatario] = useState<'familia' | 'formal'>('familia')
  const [periodoDesde, setPeriodoDesde] = useState(hace30Dias())
  const [periodoHasta, setPeriodoHasta] = useState(hoy())
  const [generando, setGenerando] = useState(false)
  const [resultados, setResultados] = useState<Record<string, { estado: EstadoAlumno; mensaje?: string }>>({})

  const todosSeleccionados = alumnos.length > 0 && seleccionados.length === alumnos.length

  const toggleTodos = () => {
    setSeleccionados(todosSeleccionados ? [] : alumnos.map((a) => a.id))
  }

  const toggleUno = (id: string) => {
    setSeleccionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const generarTodos = async () => {
    if (seleccionados.length === 0) return
    setGenerando(true)

    const inicial: Record<string, { estado: EstadoAlumno }> = {}
    for (const id of seleccionados) inicial[id] = { estado: 'pendiente' }
    setResultados(inicial)

    for (const alumnoId of seleccionados) {
      setResultados((prev) => ({ ...prev, [alumnoId]: { estado: 'generando' } }))

      const res = await generarInforme(alumnoId, destinatario, periodoDesde, periodoHasta)

      setResultados((prev) => ({
        ...prev,
        [alumnoId]: res.error
          ? { estado: 'error', mensaje: res.error }
          : { estado: 'exito' },
      }))
    }

    setGenerando(false)
  }

  const nombreDe = (id: string) => alumnos.find((a) => a.id === id)?.nombre_anonimizado ?? '—'

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value as 'familia' | 'formal')}
            disabled={generando}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          >
            <option value="familia">Para la familia</option>
            <option value="formal">Informe formal</option>
          </select>
          <input
            type="date"
            value={periodoDesde}
            onChange={(e) => setPeriodoDesde(e.target.value)}
            disabled={generando}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <input
            type="date"
            value={periodoHasta}
            onChange={(e) => setPeriodoHasta(e.target.value)}
            disabled={generando}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
            <input type="checkbox" checked={todosSeleccionados} onChange={toggleTodos} disabled={generando} />
            Seleccionar todos ({alumnos.length})
          </label>
          <div className="max-h-64 overflow-y-auto space-y-1 rounded-lg border border-slate-200 p-2">
            {alumnos.map((a) => (
              <label
                key={a.id}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(a.id)}
                    onChange={() => toggleUno(a.id)}
                    disabled={generando}
                  />
                  {a.nombre_anonimizado}
                </span>
                {resultados[a.id] && (
                  <span
                    className={
                      resultados[a.id].estado === 'exito'
                        ? 'text-xs text-emerald-600'
                        : resultados[a.id].estado === 'error'
                          ? 'text-xs text-rose-600'
                          : resultados[a.id].estado === 'generando'
                            ? 'text-xs text-indigo-600'
                            : 'text-xs text-slate-400'
                    }
                  >
                    {resultados[a.id].estado === 'pendiente' && 'En cola...'}
                    {resultados[a.id].estado === 'generando' && 'Generando...'}
                    {resultados[a.id].estado === 'exito' && '✓ Listo'}
                    {resultados[a.id].estado === 'error' && `✗ ${resultados[a.id].mensaje}`}
                  </span>
                )}
              </label>
            ))}
            {alumnos.length === 0 && <p className="p-2 text-sm text-slate-400">Sin alumnos activos.</p>}
          </div>
        </div>

        <button
          onClick={generarTodos}
          disabled={generando || seleccionados.length === 0}
          className="w-full rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {generando
            ? `Generando... (${Object.values(resultados).filter((r) => r.estado === 'exito' || r.estado === 'error').length}/${seleccionados.length})`
            : `Generar todos (${seleccionados.length} seleccionados)`}
        </button>
      </div>
    </div>
  )
}