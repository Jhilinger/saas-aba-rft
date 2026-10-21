'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { importarPrograma } from './actions'
import { useToast } from '../../../providers/toast-provider'
import { Button } from '../../../ui'

type ProgramaBase = {
  id: string
  nombre: string
  tipo: string
  area: string
  codigo: string | null
  dominio_id: string | null
  clinica_id: string | null
  visibilidad: string
  creado_por: string
  // Motivo si la secuencia del currículo bloquea su dominio para este alumno
  bloqueo: string | null
  // Ya en el PEI o dominado (PEI o valoración): no tiene sentido importarlo
  situacion: 'disponible' | 'en_pei' | 'dominado'
}

type Nivel = {
  numero: number
  nombre: string
  dominios: { id: string; codigo: string; nombre: string }[]
}

type Fuente = 'base' | 'clinica' | 'mios'

const FUENTES: { key: Fuente; label: string }[] = [
  { key: 'base', label: 'Currículo' },
  { key: 'clinica', label: 'Programas de la clínica' },
  { key: 'mios', label: 'Mis programas' },
]

type Grupo = { clave: string; titulo: string; subtitulo?: string; programas: ProgramaBase[] }

// Importador del PEI: panel desplegable con la lista de programas que se
// pueden añadir (fuera del PEI, no dominados y, salvo que se pidan, no
// bloqueados por la secuencia), agrupados como el resto de la app
export default function AsignarProgramaForm({
  alumnoId,
  programasBase,
  niveles,
  miPerfilId,
  puedeForzar,
  abiertoInicial,
}: {
  alumnoId: string
  programasBase: ProgramaBase[]
  niveles: Nivel[]
  miPerfilId: string
  // clinica_admin/superadmin: puede asignar bloqueados con justificación
  puedeForzar: boolean
  abiertoInicial: boolean
}) {
  const [abierto, setAbierto] = useState(abiertoInicial)
  const [fuente, setFuente] = useState<Fuente>('base')
  const [mostrarBloqueados, setMostrarBloqueados] = useState(false)
  const [importandoId, setImportandoId] = useState<string | null>(null)
  const [excepcionId, setExcepcionId] = useState<string | null>(null)
  const [justificacion, setJustificacion] = useState('')
  const [, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const listaDeFuente = useMemo(() => {
    if (fuente === 'base') return programasBase.filter((p) => p.clinica_id === null)
    if (fuente === 'clinica') return programasBase.filter((p) => p.clinica_id !== null && p.visibilidad === 'clinica')
    return programasBase.filter((p) => p.creado_por === miPerfilId && p.visibilidad === 'privado')
  }, [programasBase, fuente, miPerfilId])

  const candidatos = listaDeFuente.filter((p) => p.situacion === 'disponible')
  const numEnPei = listaDeFuente.filter((p) => p.situacion === 'en_pei').length
  const numDominados = listaDeFuente.filter((p) => p.situacion === 'dominado').length
  const numBloqueados = candidatos.filter((p) => p.bloqueo).length
  const visibles = candidatos.filter((p) => mostrarBloqueados || !p.bloqueo)

  // Currículo: por nivel y dominio. Complementarios: por área.
  const grupos: Grupo[] = useMemo(() => {
    if (fuente === 'base') {
      return niveles.flatMap((n) =>
        n.dominios
          .map((d) => ({
            clave: d.id,
            titulo: `${d.codigo} · ${d.nombre}`,
            subtitulo: `Nivel ${n.numero}`,
            programas: visibles.filter((p) => p.dominio_id === d.id),
          }))
          .filter((g) => g.programas.length > 0)
      )
    }
    const porArea = new Map<string, ProgramaBase[]>()
    for (const p of visibles) {
      const area = p.area.trim() || 'Sin área'
      porArea.set(area, [...(porArea.get(area) ?? []), p])
    }
    return [...porArea.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([area, programas]) => ({
        clave: area,
        titulo: area,
        programas: programas.sort((a, b) => a.nombre.localeCompare(b.nombre)),
      }))
  }, [fuente, niveles, visibles])

  const importar = (p: ProgramaBase, conJustificacion?: string) => {
    setImportandoId(p.id)
    startTransition(async () => {
      const res = await importarPrograma(alumnoId, p.id, conJustificacion)
      setImportandoId(null)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast(`"${p.nombre}" añadido al PEI`, 'exito')
      setExcepcionId(null)
      setJustificacion('')
      router.refresh()
    })
  }

  if (!abierto) {
    return (
      <Button onClick={() => setAbierto(true)} className="w-full py-3 text-base sm:w-auto sm:py-2 sm:text-sm">
        ＋ Añadir programas al PEI
      </Button>
    )
  }

  return (
    <div className="space-y-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-indigo-900">Añadir programas al PEI</h3>
        <button onClick={() => setAbierto(false)} className="text-sm font-medium text-indigo-700 hover:text-indigo-900">
          Cerrar
        </button>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {FUENTES.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFuente(f.key)
              setExcepcionId(null)
            }}
            className={`rounded-lg px-3 py-1.5 font-medium ${
              fuente === f.key ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <p>
          <strong className="text-slate-800">{visibles.length} disponibles</strong>
          {numEnPei > 0 && ` · ${numEnPei} ya en el PEI`}
          {numDominados > 0 && ` · ${numDominados} dominados`}
          {numBloqueados > 0 && !mostrarBloqueados && ` · 🔒 ${numBloqueados} bloqueados`}
        </p>
        {numBloqueados > 0 && (
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={mostrarBloqueados}
              onChange={(e) => {
                setMostrarBloqueados(e.target.checked)
                setExcepcionId(null)
              }}
            />
            Mostrar bloqueados ({numBloqueados})
          </label>
        )}
      </div>

      {grupos.map((g) => (
        <div key={g.clave} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-2">
            {g.subtitulo && <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{g.subtitulo}</p>}
            <p className="text-sm font-medium text-slate-700">{g.titulo}</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {g.programas.map((p) => (
              <li key={p.id} className="space-y-2 px-4 py-2.5 text-sm">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {p.codigo && <span className="w-14 shrink-0 font-mono text-xs text-slate-500">{p.codigo}</span>}
                  <span className="min-w-0 flex-1 basis-40 text-slate-800">
                    {p.bloqueo && '🔒 '}
                    {p.nombre}
                    <span className="ml-2 text-xs text-slate-400">{p.tipo === 'rft' ? 'Relacional' : 'Directo'}</span>
                  </span>
                  {!p.bloqueo ? (
                    <Button
                      variant="secondary"
                      onClick={() => importar(p)}
                      disabled={importandoId !== null}
                      className="px-3 py-1.5 text-xs font-medium"
                    >
                      {importandoId === p.id ? 'Añadiendo...' : 'Añadir'}
                    </Button>
                  ) : puedeForzar && excepcionId !== p.id ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setExcepcionId(p.id)
                        setJustificacion('')
                      }}
                      className="px-3 py-1.5 text-xs font-medium"
                    >
                      Añadir con excepción
                    </Button>
                  ) : null}
                </div>
                {p.bloqueo && <p className="text-xs text-amber-700">{p.bloqueo}.</p>}
                {excepcionId === p.id && (
                  <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-700">Justificación clínica (obligatoria)</span>
                      <textarea
                        value={justificacion}
                        onChange={(e) => setJustificacion(e.target.value)}
                        rows={2}
                        autoFocus
                        placeholder="ej. Lo domina en contexto natural; se trabaja para generalizar"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base sm:text-sm"
                      />
                    </label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => importar(p, justificacion)}
                        disabled={!justificacion.trim() || importandoId !== null}
                        className="px-3 py-1.5 text-xs"
                      >
                        {importandoId === p.id ? 'Añadiendo...' : 'Añadir con excepción'}
                      </Button>
                      <Button variant="secondary" onClick={() => setExcepcionId(null)} className="px-3 py-1.5 text-xs">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {visibles.length === 0 && (
        <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-500">
          {listaDeFuente.length === 0
            ? fuente === 'base'
              ? 'No hay programas en el currículo todavía.'
              : fuente === 'clinica'
                ? 'Tu clínica todavía no tiene programas propios. Créalos desde "Programas de la clínica".'
                : 'Todavía no has creado programas propios. Créalos desde "Mis programas".'
            : numBloqueados > 0
              ? 'No hay programas disponibles ahora mismo: los que quedan están bloqueados hasta que el alumno consiga el nivel o dominio anterior.'
              : 'No quedan programas por añadir: todos están ya en el PEI o dominados.'}
        </p>
      )}

      {numBloqueados > 0 && !puedeForzar && mostrarBloqueados && (
        <p className="text-xs text-slate-500">
          Los programas con 🔒 se desbloquean cuando el alumno consigue el nivel o dominio anterior. Si hay un motivo
          clínico para adelantarlos, el administrador de la clínica puede añadirlos con una justificación.
        </p>
      )}
    </div>
  )
}
