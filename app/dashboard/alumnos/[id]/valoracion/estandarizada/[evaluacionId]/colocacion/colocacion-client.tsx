'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { anadirPropuestaAlPei, aplicarColocacion } from '../../actions'
import type { Evidencia, Valoracion } from '../../colocacion'
import { useToast } from '../../../../../../../providers/toast-provider'
import { Button, Panel } from '../../../../../../../ui'

export type FilaColocacion = {
  programaBaseId: string
  nombre: string
  dominio: string
  ordenGlobal: number
  propuesta: Valoracion
  evidencias: Evidencia[]
  actual: Valoracion | null
  // La valoración actual la puso el terapeuta (no una evaluación estandarizada)
  actualManual: boolean
  dominadoPei: boolean
}

export type ProgramaPropuesto = { programaBaseId: string; nombre: string; valoracion: Valoracion }

const ETIQUETA: Record<Valoracion, { label: string; color: string }> = {
  dominado: { label: 'Dominado', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  parcial: { label: 'Parcial', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  no: { label: 'No', color: 'bg-rose-50 text-rose-700 border-rose-200' },
}

function Chip({ valoracion }: { valoracion: Valoracion }) {
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${ETIQUETA[valoracion].color}`}>{ETIQUETA[valoracion].label}</span>
}

function textoEvidencias(evidencias: Evidencia[]) {
  return evidencias
    .map((e) => `${e.codigo.replace('EV-', '')}: ${e.puntuacion ?? (e.motivo === 'techo' ? '0 por techo' : '0 sin requisito')}`)
    .join(' · ')
}

export default function ColocacionClient({
  alumnoId,
  evaluacionId,
  aplicadaAt,
  nivelInicio,
  filas,
  propuestos,
  bloqueados,
  soloLectura = false,
}: {
  alumnoId: string
  evaluacionId: string
  aplicadaAt: string | null
  nivelInicio: number | null
  filas: FilaColocacion[]
  propuestos: ProgramaPropuesto[]
  bloqueados: number
  // Aplica la evaluación cualquier terapeuta; la colocación la decide quien diseña
  soloLectura?: boolean
}) {
  const conflictos = filas.filter((f) => !f.dominadoPei && f.actualManual && f.actual !== f.propuesta)
  const [mantener, setMantener] = useState<Set<string>>(new Set())
  const [descartados, setDescartados] = useState<Set<string>>(new Set())
  const elegidos = propuestos.filter((p) => !descartados.has(p.programaBaseId)).map((p) => p.programaBaseId)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const cuenta = (v: Valoracion) => filas.filter((f) => !f.dominadoPei && f.propuesta === v).length
  const alternar = (set: Set<string>, id: string) => {
    const siguiente = new Set(set)
    if (siguiente.has(id)) siguiente.delete(id)
    else siguiente.add(id)
    return siguiente
  }

  const aplicar = () =>
    startTransition(async () => {
      const res = await aplicarColocacion(evaluacionId, [...mantener])
      if ('error' in res && res.error) {
        toast(res.error, 'error')
        return
      }
      toast('Colocación aplicada al punto de partida', 'exito')
      router.refresh()
    })

  const anadir = () =>
    startTransition(async () => {
      const res = await anadirPropuestaAlPei(alumnoId, elegidos)
      if (res.errores.length) toast(res.errores.join(' '), 'error')
      if (res.importados) toast(`${res.importados} programas añadidos al PEI`, 'exito')
      router.refresh()
    })

  return (
    <div className="space-y-4">
      <Panel className="space-y-3 p-4">
        <div>
          <p className="font-semibold text-slate-800">1. Traslado al punto de partida</p>
          <p className="text-sm text-slate-500">
            Cada programa toma la puntuación más baja de los ítems que lo evalúan: 2 → dominado, 1 → parcial, 0 → no. Los
            ítems no aplicados por techo o requisito cuentan como 0; los indicadores no marcan programas. Lo ya dominado
            en el PEI no se toca.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {(['dominado', 'parcial', 'no'] as const).map((v) => (
            <span key={v} className="flex items-center gap-1">
              <Chip valoracion={v} /> {cuenta(v)}
            </span>
          ))}
        </div>

        {conflictos.length > 0 && (
          <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-medium text-amber-800">
              {conflictos.length} programas tienen una valoración manual distinta. Por defecto se aplica la de la
              evaluación; marca los que quieras mantener.
            </p>
            <ul className="space-y-1">
              {conflictos.map((f) => (
                <li key={f.programaBaseId}>
                  <label className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={mantener.has(f.programaBaseId)}
                      onChange={() => setMantener((m) => alternar(m, f.programaBaseId))}
                    />
                    <span className="flex-1">{f.nombre}</span>
                    <span className="text-xs text-slate-500">manual</span> <Chip valoracion={f.actual!} />
                    <span className="text-xs text-slate-500">evaluación</span> <Chip valoracion={f.propuesta} />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-indigo-600">Ver los {filas.length} programas evaluados</summary>
          <ul className="mt-2 divide-y divide-slate-100">
            {filas.map((f) => (
              <li key={f.programaBaseId} className="flex flex-wrap items-center gap-2 py-1.5">
                <span className="min-w-0 flex-1">
                  <span className="block text-slate-700">{f.nombre}</span>
                  <span className="block text-xs text-slate-500">{textoEvidencias(f.evidencias)}</span>
                </span>
                {f.dominadoPei ? <span className="text-xs text-slate-500">Dominado en el PEI</span> : <Chip valoracion={f.propuesta} />}
              </li>
            ))}
          </ul>
        </details>

        {soloLectura && (
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
            La colocación en el currículo la decide el supervisor del alumno.
          </p>
        )}
        <div className={`flex flex-wrap items-center gap-3 ${soloLectura ? 'hidden' : ''}`}>
          <Button onClick={aplicar} disabled={isPending || filas.length === 0}>
            {aplicadaAt ? 'Volver a aplicar' : 'Aplicar a la valoración'}
          </Button>
          {aplicadaAt && (
            <span className="text-xs text-slate-500">Aplicada el {new Date(aplicadaAt).toLocaleString('es-ES')}</span>
          )}
        </div>
      </Panel>

      {aplicadaAt && (
        <Panel className="space-y-3 p-4">
          <div>
            <p className="font-semibold text-slate-800">2. Programas para empezar</p>
            <p className="text-sm text-slate-500">
              Primero los emergentes (parcial) y después los no adquiridos, en el orden del currículo; solo de dominios
              desbloqueados y con los requisitos dominados.
            </p>
          </div>

          {bloqueados > 0 && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {bloqueados} programas evaluados como no o parcial están en dominios bloqueados por la secuencia del
              currículo.
              {nivelInicio !== null && nivelInicio > 1 &&
                ` Los niveles por debajo del ${nivelInicio} no se evaluaron: márcalos en Punto de partida o usa la excepción de secuencia.`}
            </p>
          )}

          {propuestos.length === 0 ? (
            <p className="text-sm text-slate-500">No hay programas disponibles para proponer.</p>
          ) : (
            <ul className="space-y-1">
              {propuestos.map((p) => (
                <li key={p.programaBaseId}>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={!descartados.has(p.programaBaseId)}
                      onChange={() => setDescartados((s) => alternar(s, p.programaBaseId))}
                    />
                    <span className="flex-1">{p.nombre}</span>
                    <Chip valoracion={p.valoracion} />
                  </label>
                </li>
              ))}
            </ul>
          )}

          <div className={`flex flex-wrap items-center gap-3 ${soloLectura ? 'hidden' : ''}`}>
            <Button onClick={anadir} disabled={isPending || elegidos.length === 0}>
              Añadir al PEI ({elegidos.length})
            </Button>
            <Link href={`/dashboard/alumnos/${alumnoId}/pei`} className="text-sm font-medium text-indigo-600 hover:underline">
              Ir al PEI →
            </Link>
          </div>
        </Panel>
      )}
    </div>
  )
}
