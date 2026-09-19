'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { crearAnalogiaBase } from '../actions'
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

export default function NuevaAnalogiaBaseForm({ programaBaseId }: { programaBaseId: string }) {
  const [par1TerminoA, setPar1TerminoA] = useState('')
  const [par1TerminoB, setPar1TerminoB] = useState('')
  const [par1Relacion, setPar1Relacion] = useState('coordinacion')
  const [par2TerminoA, setPar2TerminoA] = useState('')
  const [par2TerminoB, setPar2TerminoB] = useState('')
  const [par2Relacion, setPar2Relacion] = useState('coordinacion')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const limpiar = () => {
    setPar1TerminoA('')
    setPar1TerminoB('')
    setPar2TerminoA('')
    setPar2TerminoB('')
  }

  return (
    <Panel
      as="form"
      onSubmit={(e: FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
          const res = await crearAnalogiaBase(programaBaseId, {
            par1TerminoA,
            par1TerminoB,
            par1Relacion,
            par2TerminoA,
            par2TerminoB,
            par2Relacion,
          })
          if (res?.error) {
            toast(res.error, 'error')
            return
          }
          limpiar()
          router.refresh()
        })
      }}
      className="p-4 space-y-3"
    >
      <p className="text-sm font-semibold text-slate-700">Nueva analogía</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Término A (par 1)</label>
          <input value={par1TerminoA} onChange={(e) => setPar1TerminoA(e.target.value)} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Término B (par 1)</label>
          <input value={par1TerminoB} onChange={(e) => setPar1TerminoB(e.target.value)} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Relación del par 1</label>
          <select value={par1Relacion} onChange={(e) => setPar1Relacion(e.target.value)} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
            {RELACIONES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Término A (par 2)</label>
          <input value={par2TerminoA} onChange={(e) => setPar2TerminoA(e.target.value)} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Término B (par 2)</label>
          <input value={par2TerminoB} onChange={(e) => setPar2TerminoB(e.target.value)} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Relación del par 2</label>
          <select value={par2Relacion} onChange={(e) => setPar2Relacion(e.target.value)} className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
            {RELACIONES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        {par1Relacion === par2Relacion
          ? '✓ Misma relación en ambos pares — la respuesta correcta será "Igual relación".'
          : '✗ Relación distinta en cada par — la respuesta correcta será "Relación distinta".'}
      </p>
      <Button type="submit" disabled={isPending} className="px-4 py-2 text-sm">
        Añadir analogía
      </Button>
    </Panel>
  )
}
