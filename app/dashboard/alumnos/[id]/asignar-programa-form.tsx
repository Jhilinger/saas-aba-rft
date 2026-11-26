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
  // Aviso si el nivel o dominio anterior no está consolidado (no bloquea)
  avisoSecuencia: string | null
  // Requisitos previos que el alumno todavía no domina (solo avisan)
  requisitosPendientes: string[]
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
// pueden añadir (fuera del PEI y no dominados), agrupados como el resto de la
// app. La secuencia del currículo y los requisitos previos solo avisan
export default function AsignarProgramaForm({
  alumnoId,
  programasBase,
  niveles,
  miPerfilId,
  abiertoInicial,
}: {
  alumnoId: string
  programasBase: ProgramaBase[]
  niveles: Nivel[]
  miPerfilId: string
  abiertoInicial: boolean
}) {
  const [abierto, setAbierto] = useState(abiertoInicial)
  const [fuente, setFuente] = useState<Fuente>('base')
  const [importandoId, setImportandoId] = useState<string | null>(null)
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
  const visibles = candidatos

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

  const importar = (p: ProgramaBase) => {
    setImportandoId(p.id)
    startTransition(async () => {
      const res = await importarPrograma(alumnoId, p.id)
      setImportandoId(null)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast(`"${p.nombre}" añadido al PEI`, 'exito')
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
            onClick={() => setFuente(f.key)}
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
          <strong className="text-slate-800">
            {visibles.length} {visibles.length === 1 ? 'disponible' : 'disponibles'}
          </strong>
          {numEnPei > 0 && ` · ${numEnPei} ya en el PEI`}
          {numDominados > 0 && ` · ${numDominados} ${numDominados === 1 ? 'dominado' : 'dominados'}`}
        </p>
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
                  <span className="min-w-0 flex-1 text-slate-800">
                    {p.nombre}
                    <span className="ml-2 text-xs text-slate-400">{p.tipo === 'rft' ? 'Relacional' : 'Directo'}</span>
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => importar(p)}
                    disabled={importandoId !== null}
                    className="px-3 py-1.5 text-xs font-medium"
                  >
                    {importandoId === p.id ? 'Añadiendo...' : 'Añadir'}
                  </Button>
                </div>
                {p.avisoSecuencia && <p className="text-xs text-amber-700">⚠ {p.avisoSecuencia}.</p>}
                {p.requisitosPendientes.length > 0 && (
                  <p className="text-xs text-amber-700">
                    ⚠ Requisitos previos sin dominar: {p.requisitosPendientes.join(' · ')}
                  </p>
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
            : 'No quedan programas por añadir: todos están ya en el PEI o dominados.'}
        </p>
      )}

      <p className="text-xs text-slate-500">
        Los avisos ⚠ son recomendaciones: el nivel o dominio anterior, o los requisitos previos, aún no están consolidados. Puede
        añadir el programa igualmente si el alumno está preparado (por ejemplo, un niño con desarrollo típico que empieza en el nivel 3).
      </p>
    </div>
  )
}
