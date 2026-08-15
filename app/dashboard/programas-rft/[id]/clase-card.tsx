'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  crearEstimuloRft,
  eliminarEstimuloRft,
  eliminarClase,
  eliminarRelacionEntrenada,
} from './actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'

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
}

export default function ClaseCard({
  clase,
  programaAlumnoId,
  testsRealizados = [],
}: {
  clase: Clase
  programaAlumnoId: string
  testsRealizados?: TestRealizado[]
}) {
  const [nombreEstimulo, setNombreEstimulo] = useState('')
  const [posicion, setPosicion] = useState('A')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  const nombreEstimuloPorId = (id: string) =>
    clase.estimulos_rft.find((e) => e.id === id)?.etiqueta ?? '?'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">
            {clase.nombre}{' '}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {clase.grupo}
            </span>
          </h3>
          <span className="text-xs text-slate-400">
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
              if (res?.error) {
                toast(res.error, 'error')
                return
              }
              toast('Clase eliminada', 'exito')
              router.refresh()
            })
          }}
          className="text-xs font-medium text-rose-500 hover:text-rose-700"
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
              <span>
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
                    await eliminarEstimuloRft(e.id, programaAlumnoId)
                    router.refresh()
                  })
                }}
                className="text-xs text-rose-500 hover:text-rose-700"
              >
                Quitar
              </button>
            </li>
          ))}
          {clase.estimulos_rft.length === 0 && (
            <li className="text-xs text-slate-400 italic">Sin estímulos todavía.</li>
          )}
        </ul>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!nombreEstimulo.trim()) return
            startTransition(async () => {
              await crearEstimuloRft(clase.id, programaAlumnoId, nombreEstimulo, '', posicion)
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
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          <input
            value={nombreEstimulo}
            onChange={(e) => setNombreEstimulo(e.target.value)}
            placeholder="Nombre del estímulo"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            Añadir
          </button>
        </form>
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
                <span>
                  {nombreEstimuloPorId(r.estimulo_origen_id)} → {nombreEstimuloPorId(r.estimulo_destino_id)}
                </span>
                <button
                  onClick={() => {
                    startTransition(async () => {
                      await eliminarRelacionEntrenada(r.id, programaAlumnoId)
                      router.refresh()
                    })
                  }}
                  className="text-xs text-rose-500 hover:text-rose-700"
                >
                  Quitar
                </button>
              </li>
            ))}
            {clase.relaciones_entrenadas_rft.length === 0 && (
              <li className="text-xs text-slate-400 italic">Sin relaciones entrenadas todavía.</li>
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
                <span>
                  {NOMBRES_FASE[t.fase] ?? t.fase}: {t.posicionOrigen}→{t.posicionDestino}
                </span>
                <span
                  className={t.porcentaje >= 90 ? 'text-emerald-600 font-medium' : 'text-slate-500'}
                >
                  {t.porcentaje}%
                </span>
              </li>
            ))}
            {testsRealizados.length === 0 && (
              <li className="text-xs text-slate-400 italic">Sin tests realizados todavía.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}