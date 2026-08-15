'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearFamiliar, desvincularFamiliar } from './actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'

type Familiar = { perfil_id: string; nombre: string; email: string }

export default function FamiliaresSection({
  alumnoId,
  familiares,
}: {
  alumnoId: string
  familiares: Familiar[]
}) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  return (
    <section className="space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-slate-700">Familia</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!nombre.trim() || !email.trim()) return
          startTransition(async () => {
            const res = await crearFamiliar(alumnoId, nombre, email)
            if (res.error) {
              setError(res.error)
              return
            }
            setError(null)
            setNombre('')
            setEmail('')
            toast('Invitación enviada', 'exito')
            router.refresh()
          })
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
      >
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre (ej. Familia de M.S.)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="sm:col-span-2 rounded-lg bg-indigo-600 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Invitar familiar
        </button>
        {error && <p className="sm:col-span-2 text-sm text-rose-600">{error}</p>}
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {familiares.map((f) => (
              <tr key={f.perfil_id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-medium text-slate-800">{f.nombre}</td>
                <td className="p-3 text-slate-600">{f.email}</td>
                <td className="p-3">
                  <button
                    onClick={async () => {
                      const ok = await confirmar({
                        titulo: 'Desvincular familiar',
                        mensaje: `¿Desvincular a ${f.nombre} de este alumno?`,
                        textoConfirmar: 'Desvincular',
                        peligroso: true,
                      })
                      if (!ok) return
                      startTransition(async () => {
                        const res = await desvincularFamiliar(f.perfil_id, alumnoId)
                        if (res?.error) {
                          toast(res.error, 'error')
                          return
                        }
                        toast('Familiar desvinculado', 'exito')
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
        {familiares.length === 0 && (
          <p className="p-6 text-center text-slate-400">Sin familiares vinculados todavía.</p>
        )}
      </div>
    </section>
  )
}