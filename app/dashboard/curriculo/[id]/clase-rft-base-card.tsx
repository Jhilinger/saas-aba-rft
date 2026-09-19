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
import { Button, Panel } from '../../../ui'
import { coerceNivelRft, POSICIONES_POR_NIVEL, MAX_MIEMBROS_POR_NIVEL, NOMBRE_NIVEL_RFT } from '../../niveles-rft'
import { calcularPatron, formatearPatron } from '../../patron-rft'

type Estimulo = { id: string; etiqueta: string; nombre: string; posicion: string | null; elemento: string | null }
type Clase = { id: string; nombre: string; grupo: string; estimulos_rft_base: Estimulo[] }

export default function ClaseRftBaseCard({
  clase,
  programaBaseId,
  nivelRft,
}: {
  clase: Clase
  programaBaseId: string
  nivelRft: string | null
}) {
  const nivel = coerceNivelRft(nivelRft)
  const posicionesPermitidas = POSICIONES_POR_NIVEL[nivel]
  const maxMiembros = MAX_MIEMBROS_POR_NIVEL[nivel]
  const enElLimite = clase.estimulos_rft_base.length >= maxMiembros
  const esPatron = nivel === 'relacion_relaciones'
  const patron = esPatron ? calcularPatron(clase.estimulos_rft_base) : null

  const [nombreEstimulo, setNombreEstimulo] = useState('')
  const [elemento, setElemento] = useState('')
  const [posicion, setPosicion] = useState(posicionesPermitidas[0])
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  return (
    <Panel className="p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">
            {clase.nombre}{' '}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {clase.grupo}
            </span>
          </h3>
          {esPatron && patron && patron.length > 0 && (
            <span className="inline-block mt-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
              Patrón: {formatearPatron(patron)}
            </span>
          )}
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
              {esPatron && (
                e.elemento ? (
                  <span className="ml-1 rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-700">
                    elemento {e.elemento}
                  </span>
                ) : (
                  <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                    sin elemento
                  </span>
                )
              )}
            </span>
            <button
              onClick={() => {
                startTransition(async () => {
                  const res = await eliminarEstimuloRftBase(e.id, programaBaseId)
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
        {clase.estimulos_rft_base.length === 0 && (
          <li className="text-xs text-slate-500 italic">Sin estímulos todavía.</li>
        )}
      </ul>

            {enElLimite ? (
        <p className="text-xs text-slate-500 italic">
          {NOMBRE_NIVEL_RFT[nivel]} admite como máximo {maxMiembros} miembro(s) por clase.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!nombreEstimulo.trim()) return
            startTransition(async () => {
              const res = await crearEstimuloRftBase(clase.id, programaBaseId, nombreEstimulo, posicion, elemento || undefined)
              if (res?.error) {
                toast(res.error, 'error')
                return
              }
              setNombreEstimulo('')
              setElemento('')
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
          {esPatron && (
            <input
              value={elemento}
              onChange={(e) => setElemento(e.target.value)}
              placeholder="Elemento (ej. X)"
              className="w-28 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            />
          )}
          <Button
            type="submit"
            variant="secondary"
            disabled={isPending}
            className="px-3 py-1.5 font-medium"
          >
            Añadir
          </Button>
        </form>
      )}
    </Panel>
  )
}