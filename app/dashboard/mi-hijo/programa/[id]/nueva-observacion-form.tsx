'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearObservacion } from './observaciones-actions'
import { useToast } from '../../../../providers/toast-provider'
import { Button, Panel } from '../../../../ui'

export default function NuevaObservacionForm({ programaAlumnoId }: { programaAlumnoId: string }) {
  const [abierto, setAbierto] = useState(false)
  const [texto, setTexto] = useState('')
  const [consiguio, setConsiguio] = useState<boolean | null>(null)
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0])
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  if (!abierto) {
    return (
      <Button variant="secondary" onClick={() => setAbierto(true)} className="text-sm">
        Contar algo que pasó
      </Button>
    )
  }

  return (
    <Panel className="p-4 space-y-3">
      <p className="text-sm font-semibold text-slate-700">Contar algo que pasó</p>
      <p className="text-xs text-slate-600">
        ¿Ha hecho esto fuera de sesión — contigo, en casa, con otra persona? Cuéntaselo al equipo, ellos lo
        revisan antes de que cuente como dato.
      </p>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        aria-label="Cuenta qué pasó"
        placeholder="Por ejemplo: pidió agua solo, en casa, mientras cocinaba"
        rows={3}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-slate-600">¿Lo consiguió?</label>
        <div className="flex gap-2">
          <button
            onClick={() => setConsiguio(true)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              consiguio === true ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Sí
          </button>
          <button
            onClick={() => setConsiguio(false)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              consiguio === false ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            No
          </button>
          <button
            onClick={() => setConsiguio(null)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              consiguio === null ? 'bg-slate-300 text-slate-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            No estoy segura/o
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="fecha-observacion" className="text-sm text-slate-600">Fecha</label>
        <input
          id="fecha-observacion"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            startTransition(async () => {
              const res = await crearObservacion(programaAlumnoId, texto, consiguio, fecha)
              if (res?.error) {
                toast(res.error, 'error')
                return
              }
              toast('Gracias, el equipo lo revisará', 'exito')
              setTexto('')
              setConsiguio(null)
              setAbierto(false)
              router.refresh()
            })
          }}
          disabled={isPending || !texto.trim()}
          className="py-2 text-sm"
        >
          {isPending ? 'Enviando...' : 'Enviar'}
        </Button>
        <Button variant="secondary" onClick={() => setAbierto(false)} disabled={isPending} className="py-2 text-sm">
          Cancelar
        </Button>
      </div>
    </Panel>
  )
}
