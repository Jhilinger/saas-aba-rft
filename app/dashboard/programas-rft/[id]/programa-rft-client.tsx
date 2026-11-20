'use client'

import ClavesTemporales, { type FilaClave } from '../../claves-temporales'
import GenerarGrupo from '../../generador-rft/generar-grupo'
import { useState } from 'react'
import Link from 'next/link'
import NuevaClaseForm from './nueva-clase-form'
import ClaseCard from './clase-card'
import type { ImagenesBanco } from '../../tomar-datos/rft/[programaId]/pantalla-tablet'
import EvolucionRftChart from './evolucion-rft-chart'
import DistribucionAyudasChart from '../../distribucion-ayudas-chart'
import type { DistribucionAyuda } from '../../ayuda-tipos'
import { Panel } from '../../../ui'
import AyudaTermino from '../../ayuda-termino'
import TablaGruposClases from '../../tabla-grupos-clases'
import EvolucionNiveles, { type BloqueNivel, type FilaClaveNivel } from '../../evolucion-niveles'

type Estimulo = { id: string; etiqueta: string; nombre: string; posicion: string | null; concepto_imagen: string | null; pantalla?: unknown }
type Relacion = { id: string; estimulo_origen_id: string; estimulo_destino_id: string }
type Clase = {
  id: string
  nombre: string
  grupo: string
  tipo_relacion: string
  estado: string
  respuestas_esperadas: import('@/database.types').Json
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
  via_entrenamiento: boolean
  updated_at: string
}

const NOMBRES_FASE: Record<string, string> = {
  entrenamiento: 'Entrenamiento',
  test_mutuo: 'Test de vínculo mutuo',
  test_combinatorio: 'Test de vínculo combinatorio',
  transformacion_funciones: 'Transformación de funciones',
  generalizacion: 'Sonda de generalización',
  mantenimiento: 'Sonda de mantenimiento',
}

export default function ProgramaRftClient({
  programaAlumnoId,
  grupos,
  clases,
  testsPorClase,
  porFase,
  distribucionPorGrupo,
  dominioFases,
  porcentajeDominio,
  nivelRft,
  conRespuestasEsperadas,
  soloLectura = false,
  imagenes,
  conImagenes,
  alternarEjemplares = false,
  conGenerador = false,
  clavesTemporales = [],
  evolucionNiveles = null,
}: {
  programaAlumnoId: string
  grupos: string[]
  clases: Clase[]
  testsPorClase: Record<string, any[]>
  porFase: PorFase
  distribucionPorGrupo: Record<string, DistribucionAyuda[]>
  dominioFases: DominioFase[]
  porcentajeDominio: number
  nivelRft: string | null
  conRespuestasEsperadas: boolean
  soloLectura?: boolean
  imagenes: ImagenesBanco
  conImagenes: boolean
  alternarEjemplares?: boolean
  // El programa tiene generador de grupos (nivel 3 verbal)
  conGenerador?: boolean
  // Programas temporales: aciertos con «antes» y con «después»
  clavesTemporales?: FilaClave[]
  // Abstracción de claves con ensayos generados: los niveles hacen de grupos
  evolucionNiveles?: { niveles: string[]; bloques: BloqueNivel[]; claves: FilaClaveNivel[] } | null
}) {
  const [tab, setTab] = useState<'evolucion' | 'revision' | 'gestion'>('evolucion')
  const [extraGrupos, setExtraGrupos] = useState<string[]>([])
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string>(grupos[0] ?? '')
  const [creandoGrupo, setCreandoGrupo] = useState(false)
  const [nombreNuevoGrupo, setNombreNuevoGrupo] = useState('')

  const gruposVisibles = [...grupos, ...extraGrupos.filter((g) => !grupos.includes(g))]

  const clasesDelGrupo = clases
    .filter((c) => c.grupo === grupoSeleccionado)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { numeric: true }))

  const porFaseFiltrado: PorFase = {}
  for (const fase of Object.keys(porFase)) {
    const seriesDelGrupo = porFase[fase].filter((s) => s.grupo === grupoSeleccionado)
    if (seriesDelGrupo.length > 0) {
      porFaseFiltrado[fase] = seriesDelGrupo
    }
  }

  const dominioDelGrupo = dominioFases.filter((d) => d.grupo === grupoSeleccionado)

  // Ensayos generados en la tableta: sin grupos ni clases de material; cada
  // nivel hace de grupo
  if (evolucionNiveles) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">Ensayos generados en la tableta: cada nivel se registra como un grupo.</p>
          <Link
            href={`/dashboard/tomar-datos/rft/${programaAlumnoId}`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Tomar datos
          </Link>
        </div>
        <EvolucionNiveles
          {...evolucionNiveles}
          dominados={dominioFases
            .filter((d) => d.dominado && d.fase === 'entrenamiento' && d.posicion_origen === 'A' && d.posicion_destino === 'A')
            .map((d) => d.grupo)}
          porcentajeDominio={porcentajeDominio}
          distribucionPorNivel={distribucionPorGrupo}
        />
      </div>
    )
  }

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
          <span className="text-xs font-medium text-slate-500">
            Grupos
            <AyudaTermino clave="grupo" />
            <AyudaTermino clave="clase" />
          </span>
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

          {soloLectura ? null : !creandoGrupo ? (
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
                className="rounded-lg px-2 py-1.5 text-sm text-slate-500 hover:text-slate-600"
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
          onClick={() => setTab('revision')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'revision'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Revisión de grupos
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

      {tab === 'revision' ? (
        <TablaGruposClases
          clases={clases.map((c) => ({ id: c.id, nombre: c.nombre, grupo: c.grupo, estimulos: c.estimulos_rft }))}
          imagenes={imagenes}
        />
      ) : tab === 'evolucion' ? (
        gruposVisibles.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Todavía no hay clases creadas.</p>
        ) : (
          <div className="space-y-4">
            <ClavesTemporales filas={clavesTemporales} grupo={grupoSeleccionado} />
            {dominioDelGrupo.length > 0 && (
              <Panel className="p-4 space-y-2">
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
                      {d.dominado && d.fase !== 'entrenamiento' && !d.via_entrenamiento ? (
                        <span
                          className="self-start sm:self-auto rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 whitespace-nowrap"
                          title="Superó el test en un solo bloque, sin ayudas: relación emergente sin enseñanza directa"
                        >
                          ✓ Derivado
                        </span>
                      ) : d.dominado ? (
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
              </Panel>
            )}

            <EvolucionRftChart porFase={porFaseFiltrado} porcentajeDominio={porcentajeDominio} />

            <Panel className="p-4 sm:p-5">
              <DistribucionAyudasChart
                distribucion={distribucionPorGrupo[grupoSeleccionado] ?? []}
                titulo={`Distribución de ayudas en Entrenamiento — ${grupoSeleccionado}`}
              />
            </Panel>
          </div>
        )
      ) : (
        <section className="space-y-4">
          {!soloLectura && conGenerador && <GenerarGrupo destino="pei" programaId={programaAlumnoId} />}
          {soloLectura ? null : grupoSeleccionado ? (
            <NuevaClaseForm programaAlumnoId={programaAlumnoId} grupoActual={grupoSeleccionado} />
          ) : (
            <p className="text-sm text-slate-500">Crea un grupo primero (botón "+ Grupo" arriba).</p>
          )}

          <div className="space-y-4">
            {clasesDelGrupo.map((c) => (
              <ClaseCard
                key={c.id}
                clase={c}
                programaAlumnoId={programaAlumnoId}
                testsRealizados={testsPorClase[c.id] ?? []}
                nivelRft={nivelRft}
                conRespuestasEsperadas={conRespuestasEsperadas}
                soloLectura={soloLectura}
                imagenes={imagenes}
                conImagenes={conImagenes}
                alternarEjemplares={alternarEjemplares}
              />
            ))}
          </div>

          {clasesDelGrupo.length === 0 && grupoSeleccionado && (
            <p className="text-center text-slate-500">Sin clases en este grupo todavía.</p>
          )}
        </section>
      )}
    </div>
  )
}