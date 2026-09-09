'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  crearEstimuloRftBase,
  eliminarEstimuloRftBase,
  eliminarClaseRftBase,
} from '../actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'

type Estimulo = { id: string; etiqueta: string; nombre: string; posicion: string | null }
type Clase = { id: string; nombre: string; grupo: string; estimulos_rft_base: Estimulo[] }

export default function ClaseRftBaseCard({
  clase,
  programaBaseId,
}: {
  clase: Clase
  programaBaseId: string
}) {
  const [nombreEstimulo, setNombreEstimulo] = useState('')
  const [posicion, setPosicion] = useState('A')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">
            {clase.nombre}{' '}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {clase.grupo}
            </span>
          </h3>
        </div>
        <button
          onClick={async () => {
            const ok = await confirmar({
              titulo: 'Eliminar clase',
              mensaje: `¿Eliminar "${clase.nombre}" y todos sus estímulos de plantilla? No se puede deshacer.`,
              textoConfirmar: 'Eliminar',
              peligroso: true,
            })
            if (!ok) return
            startTransition(async () => {
              const res = await eliminarClaseRftBase(clase.id, programaBaseId)
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

      <ul className="space-y-1">
        {clase.estimulos_rft_base.map((e) => (
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
                  await eliminarEstimuloRftBase(e.id, programaBaseId)
                  router.refresh()
                })
              }}
              className="text-xs text-rose-500 hover:text-rose-700"
            >
              Quitar
            </button>
          </li>
        ))}
        {clase.estimulos_rft_base.length === 0 && (
          <li className="text-xs text-slate-400 italic">Sin estímulos todavía.</li>
        )}
      </ul>

            <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!nombreEstimulo.trim()) return
          startTransition(async () => {
            await crearEstimuloRftBase(clase.id, programaBaseId, nombreEstimulo, '', posicion)
            setNombreEstimulo('')
            router.refresh()
          })
        }}
        className="flex gap-2"
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
  )
}