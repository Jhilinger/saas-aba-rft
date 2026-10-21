'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { importarPrograma } from './actions'
import { Button, Panel } from '../../../ui'

type ProgramaBase = {
  id: string
  nombre: string
  tipo: string
  area: string
  codigo: string | null
  clinica_id: string | null
  visibilidad: string
  creado_por: string
  // Motivo si la secuencia del currículo bloquea su dominio para este alumno
  bloqueo: string | null
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
  puedeForzar,
}: {
  alumnoId: string
  programasBase: ProgramaBase[]
  miPerfilId: string
  // clinica_admin/superadmin: puede asignar bloqueados con justificación
  puedeForzar: boolean
}) {
  const [fuente, setFuente] = useState<Fuente>('base')
  const [programaId, setProgramaId] = useState('')
  const [justificacion, setJustificacion] = useState('')
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
      if (
        filtroTexto &&
        !p.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) &&
        !(p.codigo ?? '').startsWith(filtroTexto.trim())
      )
        return false
      if (filtroArea && p.area !== filtroArea) return false
      if (filtroTipo && p.tipo !== filtroTipo) return false
      return true
    })
  }, [listaDeFuente, filtroTexto, filtroArea, filtroTipo])

  const seleccionado = programasBase.find((p) => p.id === programaId)
  const numBloqueados = programasFiltrados.filter((p) => p.bloqueo).length

  const cambiarFuente = (f: Fuente) => {
    setFuente(f)
    setProgramaId('')
    setJustificacion('')
    setFiltroTexto('')
    setFiltroArea('')
    setFiltroTipo('')
    setError(null)
  }

  return (
    <Panel className="p-4 sm:p-6 space-y-4">
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
            placeholder="Buscar por nombre o código..."
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <select
            value={filtroArea}
            onChange={(e) => setFiltroArea(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          >
            <option value="">Todos los dominios</option>
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

        <p className="text-xs text-slate-500">
          {programasFiltrados.length} de {listaDeFuente.length} programas
          {numBloqueados > 0 && ` · 🔒 ${numBloqueados} bloqueados por la secuencia del currículo`}
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={programaId}
            onChange={(e) => {
              setProgramaId(e.target.value)
              setJustificacion('')
              setError(null)
            }}
            className="flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            size={1}
          >
            <option value="">Selecciona un programa...</option>
            {programasFiltrados.map((p) => (
              <option key={p.id} value={p.id} disabled={!!p.bloqueo && !puedeForzar}>
                {p.bloqueo ? '🔒 ' : ''}
                {p.codigo ? `${p.codigo} — ` : ''}
                {p.nombre} ({p.tipo === 'rft' ? 'Relacional' : 'Directo'})
              </option>
            ))}
          </select>
          <Button
            disabled={!programaId || isPending || (!!seleccionado?.bloqueo && !justificacion.trim())}
            onClick={() => {
              setError(null)
              startTransition(async () => {
                const res = await importarPrograma(
                  alumnoId,
                  programaId,
                  seleccionado?.bloqueo ? justificacion : undefined
                )
                if (res.error) {
                  setError(res.error)
                  return
                }
                setProgramaId('')
                setJustificacion('')
                router.refresh()
              })
            }}
            className="py-3 sm:py-2 text-base sm:text-sm"
          >
            {seleccionado?.bloqueo ? 'Importar con excepción' : 'Importar'}
          </Button>
        </div>

        {seleccionado?.bloqueo && (
          <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
            <p className="text-amber-800">
              <span className="font-semibold">Fuera de secuencia:</span> {seleccionado.bloqueo}.
            </p>
            <label className="block space-y-1">
              <span className="font-semibold text-slate-700">Justificación clínica (obligatoria)</span>
              <textarea
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                rows={2}
                placeholder="ej. Lo domina en contexto natural; se trabaja para generalizar"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base sm:text-sm"
              />
            </label>
          </div>
        )}

        {numBloqueados > 0 && !puedeForzar && (
          <p className="text-xs text-slate-500">
            Los programas con 🔒 se desbloquean cuando el alumno consigue el nivel o dominio anterior. Si hay un
            motivo clínico para adelantarlos, el administrador de la clínica puede asignarlos con una justificación.
          </p>
        )}

        {error && <p className="text-sm text-rose-600">{error}</p>}

        {listaDeFuente.length === 0 && (
          <p className="text-sm text-slate-500">
            {fuente === 'base' && 'No hay programas en el currículo global todavía.'}
            {fuente === 'clinica' && 'Tu clínica todavía no tiene programas compartidos. Créalos desde "Currículo clínica".'}
            {fuente === 'mios' && 'Todavía no has creado ningún programa propio. Créalos desde "Mis programas".'}
          </p>
        )}
      </div>
    </Panel>
  )
}