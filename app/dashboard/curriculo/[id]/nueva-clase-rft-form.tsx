'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearClaseRftBase } from '../actions'
import { useToast } from '../../../providers/toast-provider'
import { Button } from '../../../ui'

export default function NuevaClaseRftForm({ programaBaseId }: { programaBaseId: string }) {
  const [nombre, setNombre] = useState('')
  const [grupo, setGrupo] = useState('Grupo 1')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!nombre.trim()) return
        startTransition(async () => {
          const res = await crearClaseRftBase(programaBaseId, nombre, grupo)
          if (res?.error) {
            toast(res.error, 'error')
            return
          }
          setNombre('')
          router.refresh()
        })
      }}
      className="flex flex-col sm:flex-row gap-2 p-4"
    >
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la clase"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
      <input
        value={grupo}
        onChange={(e) => setGrupo(e.target.value)}
        placeholder="Grupo (ej. Grupo 1)"
        className="w-full sm:w-40 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
      <Button type="submit" disabled={isPending} className="px-4 py-2 text-base sm:text-sm">
        Añadir clase
      </Button>
    </form>
  )
}