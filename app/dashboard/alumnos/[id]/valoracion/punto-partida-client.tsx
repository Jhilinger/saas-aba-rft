'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { borrarValoracion, guardarValoracion, marcarDominadosEnBloque } from './actions'
import { useToast } from '../../../../providers/toast-provider'
import { Button, Panel } from '../../../../ui'

type Valoracion = 'dominado' | 'parcial' | 'no'
// Origen de la valoración: evaluación estandarizada, manual, marcado en
// bloque o dominado en el PEI (manda sobre la valoración inicial)
export type Origen = 'evaluacion' | 'manual' | 'bloque' | 'pei' | null

export type ProgramaPartida = {
  id: string
  nombre: string
  codigo: string | null
  dominioId: string
  valoracion: Valoracion | null
  origen: Origen
  notas: string | null
  enPei: boolean
}

export type NivelPartida = {
  numero: number
  nombre: string
  dominios: { id: string; codigo: string; nombre: string }[]
}

type Filtro = 'todos' | 'sin_valorar' | 'por_trabajar'

const ETIQUETA: Record<Valoracion, { label: string; corta: string; color: string }> = {
  dominado: { label: 'Dominado', corta: 'D', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  parcial: { label: 'Parcial', corta: 'P', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  no: { label: 'No', corta: 'N', color: 'bg-rose-50 text-rose-700 border-rose-200' },
}

const ORIGEN: Record<NonNullable<Origen>, string> = {
  evaluacion: 'Evaluación',
  manual: 'Manual',
  bloque: 'En bloque',
  pei: 'Dominado en el PEI',
}

const MOTIVOS = ['Por debajo del nivel de inicio de la evaluación', 'Informe previo de otro centro', 'Juicio clínico del supervisor']

function Recuento({ programas }: { programas: ProgramaPartida[] }) {
  const sinValorar = programas.filter((p) => !p.valoracion).length
  return (
    <span className="flex flex-wrap gap-1 text-xs">
      {(['dominado', 'parcial', 'no'] as const).map((v) => {
        const n = programas.filter((p) => p.valoracion === v).length
        return n > 0 ? (
          <span key={v} className={`rounded-full border px-1.5 ${ETIQUETA[v].color}`}>
            {ETIQUETA[v].corta} {n}
          </span>
        ) : null
      })}
      {sinValorar > 0 && <span className="rounded-full border border-slate-200 px-1.5 text-slate-500">— {sinValorar}</span>}
    </span>
  )
}

function MarcarEnBloque({ alumnoId, ids, etiqueta }: { alumnoId: string; ids: string[]; etiqueta: string }) {
  const [abierto, setAbierto] = useState(false)
  const [motivo, setMotivo] = useState(MOTIVOS[0])
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  if (ids.length === 0) return null
  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)} className="text-xs font-medium text-indigo-600 hover:underline">
        {etiqueta} ({ids.length})
      </button>
    )
  }
  return (
    <span className="flex flex-wrap items-center gap-2 text-xs">
      <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className="rounded border border-slate-300 px-2 py-1">
        {MOTIVOS.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>
      <Button
        onClick={() =>
          startTransition(async () => {
            const res = await marcarDominadosEnBloque(alumnoId, ids, motivo)
            if ('error' in res && res.error) {
              toast(res.error, 'error')
              return
            }
            toast(`${res.marcados ?? 0} programas marcados como dominados`, 'exito')
            setAbierto(false)
            router.refresh()
          })
        }
        disabled={isPending}
        className="px-2 py-1 text-xs"
      >
        Marcar como dominados
      </Button>
      <button onClick={() => setAbierto(false)} className="text-slate-500">
        Cancelar
      </button>
    </span>
  )
}

export default function PuntoPartidaClient({
  alumnoId,
  programas,
  niveles,
  soloLectura,
}: {
  alumnoId: string
  programas: ProgramaPartida[]
  niveles: NivelPartida[]
  soloLectura: boolean
}) {
  const [valores, setValores] = useState<Map<string, Valoracion | null>>(new Map())
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  // Lo cambiado aquí se ve al momento, sin esperar a recargar
  const actuales = useMemo(
    () =>
      programas.map((p) =>
        valores.has(p.id) ? { ...p, valoracion: valores.get(p.id) ?? null, origen: valores.get(p.id) ? ('manual' as const) : null } : p
      ),
    [programas, valores]
  )
  const visible = (p: ProgramaPartida) =>
    filtro === 'todos' || (filtro === 'sin_valorar' ? !p.valoracion : p.valoracion === 'parcial' || p.valoracion === 'no')

  const cambiar = (p: ProgramaPartida, valoracion: Valoracion | null) => {
    const anterior = valores.has(p.id) ? valores.get(p.id)! : p.valoracion
    setValores((m) => new Map(m).set(p.id, valoracion))
    startTransition(async () => {
      const res = valoracion ? await guardarValoracion(alumnoId, p.id, valoracion) : await borrarValoracion(alumnoId, p.id)
      if (res?.error) {
        toast(res.error, 'error')
        setValores((m) => new Map(m).set(p.id, anterior))
      }
    })
  }

  const filtros: { valor: Filtro; label: string }[] = [
    { valor: 'todos', label: 'Todos' },
    { valor: 'sin_valorar', label: `Sin valorar (${actuales.filter((p) => !p.valoracion).length})` },
    { valor: 'por_trabajar', label: 'Parcial o no' },
  ]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {filtros.map((f) => (
            <button
              key={f.valor}
              onClick={() => setFiltro(f.valor)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                filtro === f.valor ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Recuento programas={actuales} />
      </div>
      {soloLectura && (
        <p className="text-sm text-slate-500">El punto de partida lo revisa el supervisor del alumno. Aquí puedes consultarlo.</p>
      )}

      {niveles.map((nivel) => {
        const delNivel = actuales.filter((p) => nivel.dominios.some((d) => d.id === p.dominioId))
        if (delNivel.length === 0 || !delNivel.some(visible)) return null
        return (
          <Panel key={nivel.numero} className="space-y-2 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-slate-800">
                Nivel {nivel.numero} · {nivel.nombre}
              </p>
              <span className="flex flex-wrap items-center gap-3">
                <Recuento programas={delNivel} />
                {!soloLectura && (
                  <MarcarEnBloque
                    alumnoId={alumnoId}
                    ids={delNivel.filter((p) => !p.valoracion).map((p) => p.id)}
                    etiqueta="Marcar sin valorar como dominados"
                  />
                )}
              </span>
            </div>

            {nivel.dominios.map((d) => {
              const delDominio = delNivel.filter((p) => p.dominioId === d.id)
              const filas = delDominio.filter(visible)
              if (filas.length === 0) return null
              return (
                <details key={d.id} open={filtro !== 'todos'} className="rounded-lg border border-slate-200">
                  <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                    <span className="font-medium text-slate-700">
                      {d.codigo} {d.nombre}
                    </span>
                    <Recuento programas={delDominio} />
                  </summary>
                  <ul className="divide-y divide-slate-100 border-t border-slate-100">
                    {filas.map((p) => (
                      <li key={p.id} className="flex flex-wrap items-center gap-2 px-3 py-1.5 text-sm">
                        <span className="min-w-0 flex-1 text-slate-700" title={p.notas ?? undefined}>
                          {p.codigo && <span className="mr-1 font-mono text-xs text-indigo-600">{p.codigo}</span>}
                          {p.nombre}
                          {p.origen && <span className="ml-2 text-xs text-slate-400">{ORIGEN[p.origen]}</span>}
                          {p.enPei && p.origen !== 'pei' && <span className="ml-2 text-xs text-indigo-500">en el PEI</span>}
                        </span>
                        {soloLectura || p.origen === 'pei' ? (
                          p.valoracion ? (
                            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${ETIQUETA[p.valoracion].color}`}>
                              {ETIQUETA[p.valoracion].label}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Sin valorar</span>
                          )
                        ) : (
                          <span className="flex gap-1">
                            {(['dominado', 'parcial', 'no'] as const).map((v) => (
                              <button
                                key={v}
                                onClick={() => cambiar(p, p.valoracion === v ? null : v)}
                                disabled={isPending}
                                title={p.valoracion === v ? 'Quitar la valoración' : ETIQUETA[v].label}
                                className={`rounded-md border px-2 py-0.5 text-xs font-medium ${
                                  p.valoracion === v ? ETIQUETA[v].color : 'border-slate-200 text-slate-400 hover:border-slate-300'
                                }`}
                              >
                                {ETIQUETA[v].label}
                              </button>
                            ))}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {!soloLectura && (
                    <div className="border-t border-slate-100 px-3 py-2">
                      <MarcarEnBloque
                        alumnoId={alumnoId}
                        ids={delDominio.filter((p) => !p.valoracion).map((p) => p.id)}
                        etiqueta="Marcar sin valorar del dominio como dominados"
                      />
                    </div>
                  )}
                </details>
              )
            })}
          </Panel>
        )
      })}
    </div>
  )
}
