'use client'

import { useState, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { crearRegistroAbc, eliminarRegistroAbc } from './actions'
import { useConfirm } from '../../../../../providers/confirm-provider'
import { useToast } from '../../../../../providers/toast-provider'

type Registro = {
  id: string
  fecha_hora: string
  antecedente: string
  conducta: string
  consecuencia: string
  notas: string | null
}

export default function AbcClient({
  programaAlumnoId,
  registrosIniciales,
}: {
  programaAlumnoId: string
  registrosIniciales: Registro[]
}) {
  const params = useParams()
  const alumnoId = params.id as string
  const [antecedente, setAntecedente] = useState('')
  const [conducta, setConducta] = useState('')
  const [consecuencia, setConsecuencia] = useState('')
  const [notas, setNotas] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  const guardar = () => {
    startTransition(async () => {
      const res = await crearRegistroAbc(programaAlumnoId, alumnoId, {
        antecedente,
        conducta,
        consecuencia,
        notas,
      })
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      setAntecedente('')
      setConducta('')
      setConsecuencia('')
      setNotas('')
      toast('Registro guardado', 'exito')
      router.refresh()
    })
  }

  const borrar = async (id: string) => {
    const ok = await confirmar({
      titulo: 'Eliminar registro',
      mensaje: '¿Eliminar este episodio ABC? No se puede deshacer.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarRegistroAbc(id, alumnoId, programaAlumnoId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Registro eliminado', 'exito')
      router.refresh()
    })
  }
    return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-3">
        <h2 className="font-semibold text-slate-700">Nuevo episodio</h2>
        <div>
          <label className="text-sm text-slate-600">Antecedente — ¿qué pasó justo antes?</label>
          <textarea
            value={antecedente}
            onChange={(e) => setAntecedente(e.target.value)}
            rows={2}
            className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Conducta — ¿qué hizo exactamente?</label>
          <textarea
            value={conducta}
            onChange={(e) => setConducta(e.target.value)}
            rows={2}
            className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Consecuencia — ¿qué pasó justo después?</label>
          <textarea
            value={consecuencia}
            onChange={(e) => setConsecuencia(e.target.value)}
            rows={2}
            className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Notas adicionales (opcional)"
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <button
          onClick={guardar}
          disabled={isPending || !antecedente.trim() || !conducta.trim() || !consecuencia.trim()}
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Guardar episodio
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Historial</h2>
        {registrosIniciales.map((r) => (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                {new Date(r.fecha_hora).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <button onClick={() => borrar(r.id)} className="text-xs font-medium text-rose-500 hover:text-rose-700">
                Eliminar
              </button>
            </div>
            <p><strong className="text-slate-500">Antecedente:</strong> {r.antecedente}</p>
            <p><strong className="text-slate-500">Conducta:</strong> {r.conducta}</p>
            <p><strong className="text-slate-500">Consecuencia:</strong> {r.consecuencia}</p>
            {r.notas && <p className="text-slate-500 italic">{r.notas}</p>}
          </div>
        ))}
        {registrosIniciales.length === 0 && (
          <p className="text-center text-slate-400 py-6">Sin episodios registrados todavía.</p>
        )}
      </div>
    </div>
  )
}