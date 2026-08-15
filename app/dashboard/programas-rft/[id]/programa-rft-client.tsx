'use client'

import { useState } from 'react'
import Link from 'next/link'
import NuevaClaseForm from './nueva-clase-form'
import ClaseCard from './clase-card'
import EvolucionRftChart from './evolucion-rft-chart'

type Estimulo = { id: string; etiqueta: string; nombre: string; posicion: string | null }
type Relacion = { id: string; estimulo_origen_id: string; estimulo_destino_id: string }
type Clase = {
  id: string
  nombre: string
  grupo: string
  tipo_relacion: string
  estado: string
  estimulos_rft: Estimulo[]
  relaciones_entrenadas_rft: Relacion[]
}
type Punto = { fecha: string; porcentaje: number }
type Serie = { id: string; label: string; grupo: string; bloques: Punto[] }
type PorFase = Record<string, Serie[]>
type DominioFase = {
  grupo: string
  fase: string
  posicion_origen: string
  posicion_destino: string
  dominado: boolean
  updated_at: string
}

const NOMBRES_FASE: Record<string, string> = {
  entrenamiento: 'Entrenamiento',
  test_mutuo: 'Test de vínculo mutuo',
  test_combinatorio: 'Test de vínculo combinatorio',
  transformacion_funciones: 'Transformación de funciones',
}

export default function ProgramaRftClient({
  programaAlumnoId,
  grupos,
  clases,
  testsPorClase,
  porFase,
  dominioFases,
  porcentajeDominio,
}: {
  programaAlumnoId: string
  grupos: string[]
  clases: Clase[]
  testsPorClase: Record<string, any[]>
  porFase: PorFase
  dominioFases: DominioFase[]
  porcentajeDominio: number
}) {
  const [tab, setTab] = useState<'evolucion' | 'gestion'>('evolucion')
  const [extraGrupos, setExtraGrupos] = useState<string[]>([])
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string>(grupos[0] ?? '')
  const [creandoGrupo, setCreandoGrupo] = useState(false)
  const [nombreNuevoGrupo, setNombreNuevoGrupo] = useState('')

  const gruposVisibles = [...grupos, ...extraGrupos.filter((g) => !grupos.includes(g))]

  const clasesDelGrupo = clases.filter((c) => c.grupo === grupoSeleccionado)

  const porFaseFiltrado: PorFase = {}
  for (const fase of Object.keys(porFase)) {
    const seriesDelGrupo = porFase[fase].filter((s) => s.grupo === grupoSeleccionado)
    if (seriesDelGrupo.length > 0) {
      porFaseFiltrado[fase] = seriesDelGrupo
    }
  }

  const dominioDelGrupo = dominioFases.filter((d) => d.grupo === grupoSeleccionado)

  const confirmarNuevoGrupo = () => {
    const nombre = nombreNuevoGrupo.trim()
    if (!nombre) return
    if (!extraGrupos.includes(nombre) && !grupos.includes(nombre)) {
      setExtraGrupos((prev) => [...prev, nombre])
    }
    setGrupoSeleccionado(nombre)
    setTab('gestion')
    setNombreNuevoGrupo('')
    setCreandoGrupo(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {gruposVisibles.map((g) => (
            <button
              key={g}
              onClick={() => setGrupoSeleccionado(g)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                grupoSeleccionado === g
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g}
            </button>
          ))}

          {!creandoGrupo ? (
            <button
              onClick={() => setCreandoGrupo(true)}
              className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
              title="Crear grupo nuevo"
            >
              + Grupo
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                confirmarNuevoGrupo()
              }}
              className="flex items-center gap-1"
            >
              <input
                autoFocus
                value={nombreNuevoGrupo}
                onChange={(e) => setNombreNuevoGrupo(e.target.value)}
                placeholder="Nombre del grupo"
                className="w-32 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-2 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
              >
                ✓
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreandoGrupo(false)
                  setNombreNuevoGrupo('')
                }}
                className="rounded-lg px-2 py-1.5 text-sm text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </form>
          )}
        </div>

        {grupoSeleccionado && (
          <Link
            href={`/dashboard/tomar-datos/rft/${programaAlumnoId}?grupo=${encodeURIComponent(grupoSeleccionado)}`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Tomar datos ({grupoSeleccionado})
          </Link>
        )}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab('evolucion')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'evolucion'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Evolución
        </button>
        <button
          onClick={() => setTab('gestion')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'gestion'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Gestión de clases
        </button>
      </div>

      {tab === 'evolucion' ? (
        gruposVisibles.length === 0 ? (
          <p className="text-center text-slate-400 py-8">Todavía no hay clases creadas.</p>
        ) : (
          <div className="space-y-4">
            {dominioDelGrupo.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  Dominio por fase — {grupoSeleccionado}
                </p>
                <ul className="space-y-1">
                  {dominioDelGrupo.map((d, i) => (
                    <li
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg bg-slate-50 px-3 py-2 text-sm"
                    >
                      <span className="text-slate-600">
                        {NOMBRES_FASE[d.fase] ?? d.fase}: {d.posicion_origen}→{d.posicion_destino}
                      </span>
                      {d.dominado ? (
                        <span className="self-start sm:self-auto rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                          ✓ Dominado
                        </span>
                      ) : (
                        <span className="self-start sm:self-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                          En progreso
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <EvolucionRftChart porFase={porFaseFiltrado} porcentajeDominio={porcentajeDominio} />
          </div>
        )
      ) : (
        <section className="space-y-4">
          {grupoSeleccionado ? (
            <NuevaClaseForm programaAlumnoId={programaAlumnoId} grupoActual={grupoSeleccionado} />
          ) : (
            <p className="text-sm text-slate-400">Crea un grupo primero (botón "+ Grupo" arriba).</p>
          )}

          <div className="space-y-4">
            {clasesDelGrupo.map((c) => (
              <ClaseCard
                key={c.id}
                clase={c}
                programaAlumnoId={programaAlumnoId}
                testsRealizados={testsPorClase[c.id] ?? []}
              />
            ))}
          </div>

          {clasesDelGrupo.length === 0 && grupoSeleccionado && (
            <p className="text-center text-slate-400">Sin clases en este grupo todavía.</p>
          )}
        </section>
      )}
    </div>
  )
}