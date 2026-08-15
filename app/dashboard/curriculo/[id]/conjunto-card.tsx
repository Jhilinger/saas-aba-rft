'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  crearEstimuloBase,
  eliminarEstimuloBase,
  eliminarConjuntoBase,
} from '../actions'

type Estimulo = { id: string; nombre: string; descripcion: string | null }
type Conjunto = { id: string; nombre: string; estimulos_base: Estimulo[] }

export default function ConjuntoCard({
  conjunto,
  programaBaseId,
}: {
  conjunto: Conjunto
  programaBaseId: string
}) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{conjunto.nombre}</h3>
        <button
          onClick={() => {
            if (!confirm(`¿Eliminar "${conjunto.nombre}" y todos sus estímulos?`)) return
            startTransition(async () => {
              await eliminarConjuntoBase(conjunto.id, programaBaseId)
              router.refresh()
            })
          }}
          className="text-xs font-medium text-rose-500 hover:text-rose-700"
        >
          Eliminar conjunto
        </button>
      </div>

      <ul className="space-y-1">
        {conjunto.estimulos_base.map((e) => (
          <li
            key={e.id}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
          >
            <span>
              <strong>{e.nombre}</strong>
              {e.descripcion ? ` — ${e.descripcion}` : ''}
            </span>
            <button
              onClick={() => {
                startTransition(async () => {
                  await eliminarEstimuloBase(e.id, programaBaseId)
                  router.refresh()
                })
              }}
              className="text-xs text-rose-500 hover:text-rose-700"
            >
              Quitar
            </button>
          </li>
        ))}
        {conjunto.estimulos_base.length === 0 && (
          <li className="text-xs text-slate-400 italic">Sin estímulos todavía.</li>
        )}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!nombre.trim()) return
          startTransition(async () => {
            await crearEstimuloBase(conjunto.id, programaBaseId, nombre, descripcion)
            setNombre('')
            setDescripcion('')
            router.refresh()
          })
        }}
        className="flex gap-2"
      >
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del estímulo (ej. Rojo)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
        />
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción (opcional)"
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