'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearPasoBase } from '../actions'
import { useToast } from '../../../providers/toast-provider'
import { Button } from '../../../ui'

export default function NuevoPasoBaseForm({ programaBaseId }: { programaBaseId: string }) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!nombre.trim()) return
        startTransition(async () => {
          const res = await crearPasoBase(programaBaseId, nombre, descripcion)
          if (res?.error) {
            toast(res.error, 'error')
            return
          }
          setNombre('')
          setDescripcion('')
          router.refresh()
        })
      }}
      className="flex flex-col sm:flex-row gap-2"
    >
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del paso (ej. 1. Coger el jabón)"
        className="w-full flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
      <input
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción (opcional)"
        className="w-full flex-1 min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
      <Button type="submit" disabled={isPending} className="py-3 sm:py-2 text-base sm:text-sm">
        Añadir paso
      </Button>
    </form>
  )
}
