'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { importarPrograma } from './actions'

type ProgramaBase = {
  id: string
  nombre: string
  tipo: string
  area: string
  orden: number | null
  clinica_id: string | null
  visibilidad: string
  creado_por: string
}

type Fuente = 'base' | 'clinica' | 'mios'

const FUENTES: { key: Fuente; label: string }[] = [
  { key: 'base', label: 'Currículo base' },
  { key: 'clinica', label: 'Currículo clínica' },
  { key: 'mios', label: 'Mis programas' },
]

export default function AsignarProgramaForm({
  alumnoId,
  programasBase,
  miPerfilId,
}: {
  alumnoId: string
  programasBase: ProgramaBase[]
  miPerfilId: string
}) {
  const [fuente, setFuente] = useState<Fuente>('base')
  const [programaId, setProgramaId] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroArea, setFiltroArea] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  const listaDeFuente = useMemo(() => {
    if (fuente === 'base') return programasBase.filter((p) => p.clinica_id === null)
    if (fuente === 'clinica') return programasBase.filter((p) => p.clinica_id !== null && p.visibilidad === 'clinica')
    return programasBase.filter((p) => p.creado_por === miPerfilId)
  }, [programasBase, fuente, miPerfilId])

  const areas = useMemo(
    () => [...new Set(listaDeFuente.map((p) => p.area))].sort(),
    [listaDeFuente]
  )

  const programasFiltrados = useMemo(() => {
    return listaDeFuente.filter((p) => {
      if (filtroTexto && !p.nombre.toLowerCase().includes(filtroTexto.toLowerCase())) return false
      if (filtroArea && p.area !== filtroArea) return false
      if (filtroTipo && p.tipo !== filtroTipo) return false
      return true
    })
  }, [listaDeFuente, filtroTexto, filtroArea, filtroTipo])

  const cambiarFuente = (f: Fuente) => {
    setFuente(f)
    setProgramaId('')
    setFiltroTexto('')
    setFiltroArea('')
    setFiltroTipo('')
    setError(null)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap gap-2 text-sm">
        {FUENTES.map((f) => (
          <button
            key={f.key}
            onClick={() => cambiarFuente(f.key)}
            className={`rounded-lg px-3 py-1.5 font-medium ${fuente === f.key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            placeholder="Buscar por nombre..."
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <select
            value={filtroArea}
            onChange={(e) => setFiltroArea(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          >
            <option value="">Todas las áreas</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          >
            <option value="">Todos los tipos</option>
            <option value="aba_clasico">Aprendizaje Directo</option>
            <option value="rft">Aprendizaje Relacional</option>
          </select>
        </div>

        <p className="text-xs text-slate-400">
          {programasFiltrados.length} de {listaDeFuente.length} programas
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={programaId}
            onChange={(e) => {
              setProgramaId(e.target.value)
              setError(null)
            }}
            className="flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            size={1}
          >
            <option value="">Selecciona un programa...</option>
            {programasFiltrados.map((p) => (
              <option key={p.id} value={p.id}>
                {p.orden !== null ? `#${p.orden} — ` : ''}
                {p.nombre} ({p.tipo === 'rft' ? 'Relacional' : 'Directo'} · {p.area})
              </option>
            ))}
          </select>
          <button
            disabled={!programaId || isPending}
            onClick={() => {
              setError(null)
              startTransition(async () => {
                const res = await importarPrograma(alumnoId, programaId)
                if (res.error) {
                  setError(res.error)
                  return
                }
                setProgramaId('')
                router.refresh()
              })
            }}
            className="rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            Importar
          </button>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        {listaDeFuente.length === 0 && (
          <p className="text-sm text-slate-400">
            {fuente === 'base' && 'No hay programas en el currículo global todavía.'}
            {fuente === 'clinica' && 'Tu clínica todavía no tiene programas compartidos. Créalos desde "Currículo clínica".'}
            {fuente === 'mios' && 'Todavía no has creado ningún programa propio. Créalos desde "Mis programas".'}
          </p>
        )}
      </div>
    </div>
  )
}