'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { agregarRequisito, quitarRequisito } from '../requisitos-actions'
import { useToast } from '../../../providers/toast-provider'
import { Button, Panel } from '../../../ui'

type ProgramaRef = { id: string; nombre: string; codigo: string | null }

export default function RequisitosPrograma({
  programaBaseId,
  requisitos,
  candidatos,
  soloLectura,
}: {
  programaBaseId: string
  requisitos: ProgramaRef[]
  // Programas que se pueden añadir como requisito (vacío en solo lectura)
  candidatos: ProgramaRef[]
  soloLectura: boolean
}) {
  const [seleccion, setSeleccion] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const yaAnadidos = new Set(requisitos.map((r) => r.id))
  const opciones = candidatos.filter((c) => !yaAnadidos.has(c.id))

  const ejecutar = (accion: () => Promise<{ error?: string }>) =>
    startTransition(async () => {
      const res = await accion()
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      setSeleccion('')
      router.refresh()
    })

  if (soloLectura && requisitos.length === 0) return null

  return (
    <Panel className="space-y-3 p-4 text-sm sm:p-5">
      <div>
        <h2 className="font-semibold text-slate-700">Requisitos previos</h2>
        <p className="text-xs text-slate-500">
          Al importar este programa en un PEI se avisa si el alumno todavía no los ha dominado.
        </p>
      </div>

      {requisitos.length > 0 ? (
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {requisitos.map((r) => (
            <li key={r.id} className="flex items-center gap-3 px-3 py-2">
              {r.codigo && <span className="w-14 shrink-0 font-mono text-xs text-slate-500">{r.codigo}</span>}
              <Link href={`/dashboard/curriculo/${r.id}`} className="min-w-0 flex-1 text-slate-800 hover:text-indigo-600">
                {r.nombre}
              </Link>
              {!soloLectura && (
                <button
                  onClick={() => ejecutar(() => quitarRequisito(programaBaseId, r.id))}
                  disabled={isPending}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
                >
                  Quitar
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500">Sin requisitos previos.</p>
      )}

      {!soloLectura && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={seleccion}
            onChange={(e) => setSeleccion(e.target.value)}
            disabled={isPending}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          >
            <option value="">Añadir un requisito…</option>
            {opciones.map((c) => (
              <option key={c.id} value={c.id}>
                {c.codigo ? `${c.codigo} · ` : ''}
                {c.nombre}
              </option>
            ))}
          </select>
          <Button
            onClick={() => ejecutar(() => agregarRequisito(programaBaseId, seleccion))}
            disabled={!seleccion || isPending}
            className="shrink-0"
          >
            Añadir
          </Button>
        </div>
      )}
    </Panel>
  )
}
