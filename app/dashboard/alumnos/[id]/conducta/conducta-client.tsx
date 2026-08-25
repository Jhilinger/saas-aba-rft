'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { crearProgramaConducta, toggleVisibleFamilia } from './actions'
import { useToast } from '../../../../providers/toast-provider'

type Programa = {
  id: string
  nombre: string
  formato_recogida: 'intervalo' | 'duracion' | 'tasa' | 'abc'
  direccion_objetivo: 'aumentar' | 'reducir' | null
  estado: string
  visible_familia: boolean
  created_at: string
}

const ETIQUETA_FORMATO: Record<string, string> = {
  intervalo: 'Intervalo',
  duracion: 'Duración',
  tasa: 'Tasa',
  abc: 'ABC (registro narrativo)',
}

export default function ConductaClient({
  alumnoId,
  programasIniciales,
}: {
  alumnoId: string
  programasIniciales: Programa[]
}) {
    const [programas, setProgramas] = useState(programasIniciales)

  useEffect(() => {
    setProgramas(programasIniciales)
  }, [programasIniciales])
  const [mostrandoForm, setMostrandoForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [formato, setFormato] = useState<'intervalo' | 'duracion' | 'tasa' | 'abc'>('intervalo')
  const [direccion, setDireccion] = useState<'aumentar' | 'reducir'>('reducir')
  const [objetivo, setObjetivo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const crear = () => {
    setError(null)
    startTransition(async () => {
      const res = await crearProgramaConducta(alumnoId, {
        nombre,
        formatoRecogida: formato,
        direccionObjetivo: formato === 'abc' ? undefined : direccion,
        objetivo,
      })
      if (res.error) {
        setError(res.error)
        return
      }
      toast('Registro de conducta creado', 'exito')
      setNombre('')
      setObjetivo('')
      setMostrandoForm(false)
      router.refresh()
    })
  }

  const toggleFamilia = (programaId: string, valorActual: boolean) => {
    setProgramas((prev) => prev.map((p) => (p.id === programaId ? { ...p, visible_familia: !valorActual } : p)))
    startTransition(async () => {
      const res = await toggleVisibleFamilia(programaId, alumnoId, !valorActual)
      if (res?.error) {
        toast(res.error, 'error')
        setProgramas((prev) => prev.map((p) => (p.id === programaId ? { ...p, visible_familia: valorActual } : p)))
        return
      }
      toast(!valorActual ? 'Compartido con la familia' : 'Ya no se comparte con la familia', 'exito')
    })
  }
    return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Registros de conducta</h2>
        <p className="text-sm text-slate-500">
          Mide conductas concretas (rabietas, tiempo en tarea...) con intervalo, duración, tasa o un
          registro narrativo ABC — distinto del PEI, que es para habilidades.
        </p>
      </div>

      {!mostrandoForm ? (
        <button
          onClick={() => setMostrandoForm(true)}
          className="rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500"
        >
          + Nuevo registro de conducta
        </button>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-3">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre (ej. Rabietas en transiciones)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />

          <div>
            <label className="text-sm text-slate-600">Formato de recogida</label>
            <select
              value={formato}
              onChange={(e) => setFormato(e.target.value as any)}
              className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            >
              <option value="intervalo">Intervalo (% de intervalos con conducta)</option>
              <option value="duracion">Duración (cronómetro, % del tiempo de sesión)</option>
              <option value="tasa">Tasa (nº de veces por minuto)</option>
              <option value="abc">ABC (registro narrativo, sin %)</option>
            </select>
          </div>

          {formato !== 'abc' && (
            <div>
              <label className="text-sm text-slate-600">¿El objetivo es que la conducta...?</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setDireccion('reducir')}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium ${direccion === 'reducir' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Disminuya
                </button>
                <button
                  onClick={() => setDireccion('aumentar')}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium ${direccion === 'aumentar' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Aumente
                </button>
              </div>
            </div>
          )}

          <textarea
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            placeholder="Objetivo / contexto (opcional)"
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={crear}
              disabled={isPending || !nombre.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              Crear
            </button>
            <button onClick={() => setMostrandoForm(false)} className="text-sm text-slate-500 hover:text-slate-700">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {programas.map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link href={`/dashboard/alumnos/${alumnoId}/conducta/${p.id}`} className="font-semibold text-slate-800 hover:underline">
                {p.nombre}
              </Link>
              <p className="text-xs text-slate-500">
                {ETIQUETA_FORMATO[p.formato_recogida]}
                {p.direccion_objetivo && ` · Objetivo: ${p.direccion_objetivo === 'reducir' ? 'disminuir' : 'aumentar'}`}
                {' · '}
                {p.estado}
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" checked={p.visible_familia} onChange={() => toggleFamilia(p.id, p.visible_familia)} />
              Compartir con familia
            </label>
          </div>
        ))}
        {programas.length === 0 && (
          <p className="text-center text-slate-400 py-6">Sin registros de conducta todavía.</p>
        )}
      </div>
    </div>
  )
}