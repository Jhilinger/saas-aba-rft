'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearTerapeuta } from './actions'
import { Button, Panel } from '../../ui'
import { useToast } from '../../providers/toast-provider'

export default function InvitarTerapeutaForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  return (
    <Panel
      as="form"
      action={(formData) => {
        startTransition(async () => {
          const res = await crearTerapeuta(formData)
          if (res?.error) {
            toast(res.error, 'error')
            return
          }
          toast('Terapeuta invitado', 'exito')
          router.refresh()
        })
      }}
      className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6"
    >
      <input
        name="nombre"
        placeholder="Nombre"
        required
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-base sm:text-sm"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="rounded-lg border border-slate-300 px-3 py-2.5 text-base sm:text-sm"
      />
      <Button
        type="submit"
        disabled={isPending}
        className="sm:col-span-2 py-3 text-base sm:py-2 sm:text-sm"
      >
        {isPending ? 'Invitando...' : 'Invitar terapeuta'}
      </Button>
    </Panel>
  )
}
