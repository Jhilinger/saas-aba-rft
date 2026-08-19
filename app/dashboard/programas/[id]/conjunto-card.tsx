'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  crearEstimuloAlumno,
  eliminarEstimuloAlumno,
  eliminarEstimuloAlumnoForzado,
  eliminarConjuntoAlumno,
  iniciarIntervencion,
} from './actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'

type Estimulo = { id: string; nombre: string; descripcion: string | null }
type Conjunto = { id: string; nombre: string; estado: string; estimulos_alumno: Estimulo[] }

const ETIQUETA_ESTADO: Record<string, { label: string; color: string }> = {
  linea_base: { label: 'Línea base', color: 'bg-sky-50 text-sky-700' },
  adquisicion: { label: 'En adquisición', color: 'bg-amber-50 text-amber-700' },
  mantenimiento: { label: 'Mantenimiento', color: 'bg-blue-50 text-blue-700' },
  dominado: { label: 'Dominado', color: 'bg-emerald-50 text-emerald-700' },
  pausado: { label: 'Pausado', color: 'bg-slate-100 text-slate-500' },
}

export default function ConjuntoCard({
  conjunto,
  programaAlumnoId,
}: {
  conjunto: Conjunto
  programaAlumnoId: string
}) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  const infoEstado = ETIQUETA_ESTADO[conjunto.estado] ?? { label: conjunto.estado, color: 'bg-slate-100 text-slate-500' }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-800">{conjunto.nombre}</h3>
          <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${infoEstado.color}`}>
            {infoEstado.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {conjunto.estado === 'linea_base' && (
            <button
              onClick={async () => {
                const ok = await confirmar({
                  titulo: 'Iniciar intervención',
                  mensaje: `¿Dar por finalizada la línea base de "${conjunto.nombre}" y empezar la intervención? A partir de ahora se evaluará el criterio de dominio y se podrán registrar ayudas.`,
                  textoConfirmar: 'Iniciar intervención',
                })
                if (!ok) return
                startTransition(async () => {
                  const res = await iniciarIntervencion(conjunto.id, programaAlumnoId)
                  if (res?.error) {
                    toast(res.error, 'error')
                    return
                  }
                  toast('Intervención iniciada', 'exito')
                  router.refresh()
                })
              }}
              className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500"
            >
              Iniciar intervención
            </button>
          )}
          
            <a href={`/dashboard/tomar-datos/aba/${conjunto.id}`}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Tomar datos
          </a>
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
                const res = await eliminarConjuntoAlumno(conjunto.id, programaAlumnoId)
                if (res?.error) {
                  toast(res.error, 'error')
                  return
                }
                toast('Conjunto eliminado', 'exito')
                router.refresh()
              })
            }}
            className="text-xs font-medium text-rose-500 hover:text-rose-700"
          >
            Eliminar conjunto
          </button>
        </div>
      </div>

      <ul className="space-y-1">
        {conjunto.estimulos_alumno.map((e) => (
          <li
            key={e.id}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm gap-2"
          >
            <span>
              <strong>{e.nombre}</strong>
              {e.descripcion ? ` — ${e.descripcion}` : ''}
            </span>
            <button
              onClick={async () => {
                const res = await eliminarEstimuloAlumno(e.id, programaAlumnoId)

                if (res?.error === 'tiene_datos') {
                  const confirmado = await confirmar({
                    titulo: 'Estímulo con datos registrados',
                    mensaje: `"${e.nombre}" ya tiene ensayos registrados. Si lo eliminas, se perderán esos datos permanentemente. ¿Eliminar de todas formas?`,
                    textoConfirmar: 'Eliminar de todas formas',
                    peligroso: true,
                  })
                  if (confirmado) {
                    startTransition(async () => {
                      const res2 = await eliminarEstimuloAlumnoForzado(e.id, programaAlumnoId)
                      if (res2?.error) {
                        toast(res2.error, 'error')
                        return
                      }
                      toast('Estímulo eliminado', 'exito')
                      router.refresh()
                    })
                  }
                  return
                }

                if (res?.error) {
                  toast('Error: ' + res.error, 'error')
                  return
                }

                toast('Estímulo eliminado', 'exito')
                router.refresh()
              }}
              className="text-xs text-rose-500 hover:text-rose-700 shrink-0"
            >
              Quitar
            </button>
          </li>
        ))}
        {conjunto.estimulos_alumno.length === 0 && (
          <li className="text-xs text-slate-400 italic">Sin estímulos todavía.</li>
        )}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!nombre.trim()) return
          startTransition(async () => {
            await crearEstimuloAlumno(conjunto.id, programaAlumnoId, nombre, descripcion)
            setNombre('')
            setDescripcion('')
            router.refresh()
          })
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del estímulo"
          className="flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-1.5 text-base sm:text-sm"
        />
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción (opcional)"
          className="flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-1.5 text-base sm:text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-base sm:text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
        >
          Añadir
        </button>
      </form>
    </div>
  )
}
