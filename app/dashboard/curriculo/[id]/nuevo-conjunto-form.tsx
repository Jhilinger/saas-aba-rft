'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearConjuntoBase } from '../actions'
import { useToast } from '../../../providers/toast-provider'
import { Button } from '../../../ui'

export default function NuevoConjuntoForm({ programaBaseId }: { programaBaseId: string }) {
  const [nombre, setNombre] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!nombre.trim()) return
        startTransition(async () => {
          const res = await crearConjuntoBase(programaBaseId, nombre)
          if (res?.error) {
            toast(res.error, 'error')
            return
          }
          setNombre('')
          router.refresh()
        })
      }}
      className="flex gap-2"
    >
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del conjunto (ej. Conjunto 1: colores primarios)"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <Button type="submit" disabled={isPending} className="px-4 py-2">
        Añadir conjunto
      </Button>
    </form>
  )
}