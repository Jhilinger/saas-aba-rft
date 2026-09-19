'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearAnalogiaAlumno, eliminarAnalogiaAlumno } from './analogias-actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'
import { Button, Panel } from '../../../ui'

const RELACIONES = [
  { value: 'coordinacion', label: 'Coordinación' },
  { value: 'distincion', label: 'Distinción' },
  { value: 'oposicion', label: 'Oposición' },
  { value: 'comparacion', label: 'Comparación' },
  { value: 'jerarquia', label: 'Jerarquía' },
  { value: 'temporal', label: 'Temporal' },
  { value: 'causal', label: 'Causal' },
  { value: 'deictica', label: 'Deíctico' },
]

const ETIQUETA_RELACION: Record<string, string> = Object.fromEntries(RELACIONES.map((r) => [r.value, r.label]))

type Analogia = {
  id: string
  par1_termino_a: string
  par1_termino_b: string
  par1_relacion: string
  par2_termino_a: string
  par2_termino_b: string
  par2_relacion: string
}

export default function AnalogiasPanel({
  analogias,
  programaAlumnoId,
}: {
  analogias: Analogia[]
  programaAlumnoId: string
}) {
  const [par1TerminoA, setPar1TerminoA] = useState('')
  const [par1TerminoB, setPar1TerminoB] = useState('')
  const [par1Relacion, setPar1Relacion] = useState('coordinacion')
  const [par2TerminoA, setPar2TerminoA] = useState('')
  const [par2TerminoB, setPar2TerminoB] = useState('')
  const [par2Relacion, setPar2Relacion] = useState('coordinacion')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  return (
    <Panel className="p-4 sm:p-5 space-y-4">
      <h2 className="text-sm font-semibold text-slate-700">Analogías</h2>

      <div className="space-y-2">
        {analogias.map((a) => {
          const misma = a.par1_relacion === a.par2_relacion
          return (
            <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <div>
                <p className="text-slate-800">
                  <strong>{a.par1_termino_a}</strong> — <strong>{a.par1_termino_b}</strong>{' '}
                  <span className="text-xs text-slate-500">({ETIQUETA_RELACION[a.par1_relacion] ?? a.par1_relacion})</span>
                  {'  vs.  '}
                  <strong>{a.par2_termino_a}</strong> — <strong>{a.par2_termino_b}</strong>{' '}
                  <span className="text-xs text-slate-500">({ETIQUETA_RELACION[a.par2_relacion] ?? a.par2_relacion})</span>
                </p>
                <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-semibold ${misma ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {misma ? 'Igual relación' : 'Relación distinta'}
                </span>
              </div>
              <button
                onClick={async () => {
                  const ok = await confirmar({
                    titulo: 'Eliminar analogía',
                    mensaje: '¿Eliminar esta analogía? No se puede deshacer.',
                    textoConfirmar: 'Eliminar',
                    peligroso: true,
                  })
                  if (!ok) return
                  startTransition(async () => {
                    const res = await eliminarAnalogiaAlumno(a.id, programaAlumnoId)
                    if (res?.error) {
                      toast(res.error, 'error')
                      return
                    }
                    router.refresh()
                  })
                }}
                disabled={isPending}
                className="text-xs font-medium text-rose-700 hover:text-rose-800 shrink-0"
              >
                Eliminar
              </button>
            </div>
          )
        })}
        {analogias.length === 0 && <p className="text-sm text-slate-500 text-center py-2">Sin analogías todavía.</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          startTransition(async () => {
            const res = await crearAnalogiaAlumno(programaAlumnoId, {
              par1TerminoA, par1TerminoB, par1Relacion, par2TerminoA, par2TerminoB, par2Relacion,
            })
            if (res?.error) {
              toast(res.error, 'error')
              return
            }
            setPar1TerminoA('')
            setPar1TerminoB('')
            setPar2TerminoA('')
            setPar2TerminoB('')
            router.refresh()
          })
        }}
        className="space-y-2 rounded-lg bg-slate-50 p-3"
      >
        <p className="text-xs font-semibold text-slate-600">Nueva analogía</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input value={par1TerminoA} onChange={(e) => setPar1TerminoA(e.target.value)} placeholder="Término A (par 1)" className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
          <input value={par1TerminoB} onChange={(e) => setPar1TerminoB(e.target.value)} placeholder="Término B (par 1)" className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
          <select value={par1Relacion} onChange={(e) => setPar1Relacion(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
            {RELACIONES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input value={par2TerminoA} onChange={(e) => setPar2TerminoA(e.target.value)} placeholder="Término A (par 2)" className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
          <input value={par2TerminoB} onChange={(e) => setPar2TerminoB(e.target.value)} placeholder="Término B (par 2)" className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
          <select value={par2Relacion} onChange={(e) => setPar2Relacion(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
            {RELACIONES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <Button type="submit" disabled={isPending} className="px-4 py-2 text-sm">
          Añadir analogía
        </Button>
      </form>
    </Panel>
  )
}
