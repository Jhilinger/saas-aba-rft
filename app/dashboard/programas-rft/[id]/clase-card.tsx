'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  crearEstimuloRft,
  eliminarEstimuloRft,
  eliminarEstimuloRftForzado,
  eliminarClase,
  eliminarClaseForzado,
  eliminarRelacionEntrenada,
} from './actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'
import { Button, Panel } from '../../../ui'
import { coerceNivelRft, POSICIONES_POR_NIVEL, MAX_MIEMBROS_POR_NIVEL, NOMBRE_NIVEL_RFT } from '../../niveles-rft'

type Estimulo = { id: string; etiqueta: string; nombre: string; posicion: string | null }
type Relacion = {
  id: string
  estimulo_origen_id: string
  estimulo_destino_id: string
}
type Clase = {
  id: string
  nombre: string
  grupo: string
  tipo_relacion: string
  estado: string
  estimulos_rft: Estimulo[]
  relaciones_entrenadas_rft: Relacion[]
}
type TestRealizado = {
  fase: string
  posicionOrigen: string
  posicionDestino: string
  fecha: string
  porcentaje: number
}

const NOMBRES_FASE: Record<string, string> = {
  test_mutuo: 'Test mutuo',
  test_combinatorio: 'Test combinatorio',
  directo: 'Directo',
  transformacion_funciones: 'Transformación de funciones',
  generalizacion: 'Sonda de generalización',
  mantenimiento: 'Sonda de mantenimiento',
}

export default function ClaseCard({
  clase,
  programaAlumnoId,
  testsRealizados = [],
  nivelRft,
}: {
  clase: Clase
  programaAlumnoId: string
  testsRealizados?: TestRealizado[]
  nivelRft: string | null
}) {
  const nivel = coerceNivelRft(nivelRft)
  const posicionesPermitidas = POSICIONES_POR_NIVEL[nivel]
  const maxMiembros = MAX_MIEMBROS_POR_NIVEL[nivel]
  const enElLimite = clase.estimulos_rft.length >= maxMiembros

  const [nombreEstimulo, setNombreEstimulo] = useState('')
  const [posicion, setPosicion] = useState(posicionesPermitidas[0])
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  const nombreEstimuloPorId = (id: string) =>
    clase.estimulos_rft.find((e) => e.id === id)?.etiqueta ?? '?'

  return (
    <Panel className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">
            {clase.nombre}{' '}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {clase.grupo}
            </span>
          </h3>
          <span className="text-xs text-slate-500">
            {clase.tipo_relacion}
          </span>
        </div>
        <button
          onClick={async () => {
            const ok = await confirmar({
              titulo: 'Eliminar clase',
              mensaje: `¿Eliminar "${clase.nombre}" entera? No se puede deshacer.`,
              textoConfirmar: 'Eliminar',
              peligroso: true,
            })
            if (!ok) return
            startTransition(async () => {
              const res = await eliminarClase(clase.id, programaAlumnoId)

              if (res?.error === 'tiene_datos') {
                const confirmado = await confirmar({
                  titulo: 'Clase con datos registrados',
                  mensaje: `"${clase.nombre}" ya tiene ensayos o relaciones entrenadas registradas. Si la eliminas, se perderán esos datos permanentemente. ¿Eliminar de todas formas?`,
                  textoConfirmar: 'Eliminar de todas formas',
                  peligroso: true,
                })
                if (confirmado) {
                  const res2 = await eliminarClaseForzado(clase.id, programaAlumnoId)
                  if (res2?.error) {
                    toast(res2.error, 'error')
                    return
                  }
                  toast('Clase eliminada', 'exito')
                  router.refresh()
                }
                return
              }

              if (res?.error) {
                toast(res.error, 'error')
                return
              }
              toast('Clase eliminada', 'exito')
              router.refresh()
            })
          }}
                    className="inline-flex items-center justify-center rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
        >
          Eliminar clase
        </button>
      </div>
      {/* Estímulos */}
      <div>
        <p className="mb-1 text-xs font-medium text-slate-500">Estímulos</p>
        <ul className="space-y-1">
          {clase.estimulos_rft.map((e) => (
              <li
              key={e.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="text-slate-800">
                <strong>{e.etiqueta}</strong>
                {e.posicion ? (
                  <span className="ml-1 rounded bg-indigo-100 px-1.5 py-0.5 text-xs text-indigo-700">
                    posición {e.posicion}
                  </span>
                ) : (
                  <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                    sin posición
                  </span>
                )}
                {' '}— {e.nombre}
              </span>
              <button
                onClick={() => {
                  startTransition(async () => {
                    const res = await eliminarEstimuloRft(e.id, programaAlumnoId)

                    if (res?.error === 'tiene_datos') {
                      const confirmado = await confirmar({
                        titulo: 'Estímulo con datos registrados',
                        mensaje: `"${e.nombre}" ya se usó en ensayos o relaciones entrenadas. Si lo eliminas, se perderán esos datos permanentemente. ¿Eliminar de todas formas?`,
                        textoConfirmar: 'Eliminar de todas formas',
                        peligroso: true,
                      })
                      if (confirmado) {
                        const res2 = await eliminarEstimuloRftForzado(e.id, programaAlumnoId)
                        if (res2?.error) {
                          toast(res2.error, 'error')
                          return
                        }
                        toast('Estímulo eliminado', 'exito')
                        router.refresh()
                      }
                      return
                    }

                    if (res?.error) {
                      toast(res.error, 'error')
                      return
                    }
                    toast('Estímulo eliminado', 'exito')
                    router.refresh()
                  })
                }}
                className="text-xs text-rose-700 hover:text-rose-800"
              >
                Quitar
              </button>
            </li>
          ))}
          {clase.estimulos_rft.length === 0 && (
            <li className="text-xs text-slate-500 italic">Sin estímulos todavía.</li>
          )}
        </ul>

        {enElLimite ? (
          <p className="mt-2 text-xs text-slate-500 italic">
            {NOMBRE_NIVEL_RFT[nivel]} admite como máximo {maxMiembros} miembro(s) por clase.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!nombreEstimulo.trim()) return
              startTransition(async () => {
                const res = await crearEstimuloRft(clase.id, programaAlumnoId, nombreEstimulo, '', posicion)
                if (res?.error) {
                  toast(res.error, 'error')
                  return
                }
                setNombreEstimulo('')
                router.refresh()
              })
            }}
            className="mt-2 flex gap-2"
          >
            <select
              value={posicion}
              onChange={(e) => setPosicion(e.target.value)}
              className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            >
              {posicionesPermitidas.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              value={nombreEstimulo}
              onChange={(e) => setNombreEstimulo(e.target.value)}
              placeholder="Nombre del estímulo"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            />
            <Button type="submit" disabled={isPending} className="py-1.5">
              Añadir
            </Button>
          </form>
        )}
      </div>

      {/* Relaciones entrenadas y testeadas: informativo, se rellena solo al tomar datos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">Relaciones entrenadas</p>
          <ul className="space-y-1">
            {clase.relaciones_entrenadas_rft.map((r) => (
                <li
                key={r.id}
                className="flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-2 text-sm"
              >
                <span className="text-indigo-800">
                  {nombreEstimuloPorId(r.estimulo_origen_id)} → {nombreEstimuloPorId(r.estimulo_destino_id)}
                </span>
                <button
                  onClick={() => {
                    startTransition(async () => {
                      const res = await eliminarRelacionEntrenada(r.id, programaAlumnoId)
                      if (res?.error) {
                        toast(res.error, 'error')
                        return
                      }
                      router.refresh()
                    })
                  }}
                  className="text-xs text-rose-700 hover:text-rose-800"
                >
                  Quitar
                </button>
              </li>
            ))}
            {clase.relaciones_entrenadas_rft.length === 0 && (
              <li className="text-xs text-slate-500 italic">Sin relaciones entrenadas todavía.</li>
            )}
          </ul>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">Tests realizados (último resultado)</p>
          <ul className="space-y-1">
            {testsRealizados.map((t, i) => (
                <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2 text-sm"
              >
                <span className="text-purple-800">
                  {NOMBRES_FASE[t.fase] ?? t.fase}: {t.posicionOrigen}→{t.posicionDestino}
                </span>
                <span
                  className={t.porcentaje >= 90 ? 'text-emerald-700 font-medium' : 'text-slate-500'}
                >
                  {t.porcentaje}%
                </span>
              </li>
            ))}
            {testsRealizados.length === 0 && (
              <li className="text-xs text-slate-500 italic">Sin tests realizados todavía.</li>
            )}
          </ul>
        </div>
      </div>
    </Panel>
  )
}