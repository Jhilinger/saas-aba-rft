'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../../providers/toast-provider'
import { AVATARES } from '../avatares'
import { crearNino } from './actions'

export default function NinoForm() {
  const [avatar, setAvatar] = useState('')
  const [isPending, startTransition] = useTransition()
  const toast = useToast()
  const router = useRouter()

  return (
    <form
      action={(fd) => {
        fd.set('avatar', avatar)
        startTransition(async () => {
          const res = await crearNino(fd)
          if (res.error) {
            toast(res.error, 'error')
            return
          }
          setAvatar('')
          router.refresh()
          toast('Añadido.', 'exito')
        })
      }}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <h2 className="font-semibold">Añadir un niño o una niña</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-slate-600">Nombre (o cómo le llamáis)</span>
          <input name="nombre" maxLength={30} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base" />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-600">Fecha de nacimiento</span>
          <input name="fecha_nacimiento" type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base" />
        </label>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-slate-600">Su animal (lo tocará para empezar)</p>
        <div className="grid grid-cols-6 gap-2">
          {Object.entries(AVATARES).map(([clave, a]) => (
            <button
              key={clave}
              type="button"
              onClick={() => setAvatar(clave)}
              title={a.nombre}
              className={`rounded-xl p-2 text-3xl ${avatar === clave ? 'ring-4 ring-[#0F4C5C]' : ''}`}
              style={{ background: a.color }}
            >
              {a.emoji}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" disabled={isPending} className="w-full rounded-lg bg-[#0F4C5C] py-3 font-semibold text-white disabled:opacity-50">
        Añadir
      </button>
    </form>
  )
}
