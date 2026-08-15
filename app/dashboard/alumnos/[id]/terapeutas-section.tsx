'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { vincularTerapeuta, desvincularTerapeuta, marcarTerapeutaPrincipal } from './actions'

type Terapeuta = { id: string; nombre: string; email: string }
type Vinculo = { terapeuta_id: string; es_principal: boolean }

export default function TerapeutasSection({
  alumnoId,
  terapeutasClinica,
  vinculados,
}: {
  alumnoId: string
  terapeutasClinica: Terapeuta[]
  vinculados: Vinculo[]
}) {
  const [terapeutaId, setTerapeutaId] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const idsVinculados = new Set(vinculados.map((v) => v.terapeuta_id))
  const disponibles = terapeutasClinica.filter((t) => !idsVinculados.has(t.id))

  const nombreDe = (id: string) => terapeutasClinica.find((t) => t.id === id)?.nombre ?? '—'
  const emailDe = (id: string) => terapeutasClinica.find((t) => t.id === id)?.email ?? '—'

  return (
    <section className="space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-slate-700">Terapeutas</h2>

      <div className="flex flex-col sm:flex-row gap-2 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <select
          value={terapeutaId}
          onChange={(e) => setTerapeutaId(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        >
          <option value="">Selecciona un terapeuta...</option>
          {disponibles.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
        <button
          disabled={!terapeutaId || isPending}
          onClick={() => {
            startTransition(async () => {
              const esPrincipal = vinculados.length === 0
              await vincularTerapeuta(alumnoId, terapeutaId, esPrincipal)
              setTerapeutaId('')
              router.refresh()
            })
          }}
          className="rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Vincular
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {vinculados.map((v) => (
              <tr key={v.terapeuta_id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-medium text-slate-800">{nombreDe(v.terapeuta_id)}</td>
                <td className="p-3 text-slate-600">{emailDe(v.terapeuta_id)}</td>
                <td className="p-3">
                  {v.es_principal ? (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 whitespace-nowrap">
                      Principal
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        startTransition(async () => {
                          await marcarTerapeutaPrincipal(alumnoId, v.terapeuta_id)
                          router.refresh()
                        })
                      }}
                      className="text-xs text-slate-500 hover:text-slate-700 hover:underline whitespace-nowrap"
                    >
                      Hacer principal
                    </button>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      startTransition(async () => {
                        await desvincularTerapeuta(alumnoId, v.terapeuta_id)
                        router.refresh()
                      })
                    }}
                    className="text-xs font-medium text-rose-500 hover:text-rose-700 whitespace-nowrap"
                  >
                    Desvincular
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vinculados.length === 0 && (
          <p className="p-6 text-center text-slate-400">Sin terapeutas vinculados todavía.</p>
        )}
      </div>
    </section>
  )
}