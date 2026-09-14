'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  crearEstimuloBase,
  eliminarEstimuloBase,
  eliminarConjuntoBase,
} from '../actions'
import { useToast } from '../../../providers/toast-provider'
import { useConfirm } from '../../../providers/confirm-provider'
import { Button, Panel } from '../../../ui'

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
  const toast = useToast()
  const confirmar = useConfirm()

  return (
    <Panel className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{conjunto.nombre}</h3>
        <button
          onClick={async () => {
            const ok = await confirmar({
              titulo: 'Eliminar conjunto',
              mensaje: `¿Eliminar "${conjunto.nombre}" y todos sus estímulos? No se puede deshacer.`,
              textoConfirmar: 'Eliminar',
              peligroso: true,
            })
            if (!ok) return
            startTransition(async () => {
              const res = await eliminarConjuntoBase(conjunto.id, programaBaseId)
              if (res?.error) {
                toast(res.error, 'error')
                return
              }
              router.refresh()
            })
          }}
          className="text-xs font-medium text-rose-700 hover:text-rose-800"
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
                  const res = await eliminarEstimuloBase(e.id, programaBaseId)
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
        {conjunto.estimulos_base.length === 0 && (
          <li className="text-xs text-slate-500 italic">Sin estímulos todavía.</li>
        )}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!nombre.trim()) return
          startTransition(async () => {
            const res = await crearEstimuloBase(conjunto.id, programaBaseId, nombre, descripcion)
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
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
        <Button
          type="submit"
          variant="secondary"
          disabled={isPending}
          className="px-3 py-1.5 font-medium"
        >
          Añadir
        </Button>
      </form>
    </Panel>
  )
}