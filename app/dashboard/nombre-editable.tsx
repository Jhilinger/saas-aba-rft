'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { editarNombrePerfil } from './equipo/actions'
import { useToast } from '../providers/toast-provider'

// Nombre de un terapeuta o familiar con corrección en línea (clinica_admin)
export default function NombreEditable({ id, nombre }: { id: string; nombre: string }) {
  const [editando, setEditando] = useState(false)
  const [valor, setValor] = useState(nombre)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  if (!editando) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        <span>{nombre}</span>
        <button
          onClick={() => {
            setValor(nombre)
            setEditando(true)
          }}
          className="text-xs font-normal text-indigo-600 hover:text-indigo-800"
        >
          Corregir
        </button>
      </span>
    )
  }

  const guardar = () =>
    startTransition(async () => {
      const res = await editarNombrePerfil(id, valor)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Nombre actualizado', 'exito')
      setEditando(false)
      router.refresh()
    })

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') guardar()
          if (e.key === 'Escape') setEditando(false)
        }}
        autoFocus
        className="rounded-lg border border-slate-300 px-2 py-1 text-base font-normal sm:text-sm"
      />
      <button onClick={guardar} disabled={isPending || !valor.trim()} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50">
        Guardar
      </button>
      <button onClick={() => setEditando(false)} className="text-xs font-normal text-slate-500 hover:text-slate-700">
        Cancelar
      </button>
    </span>
  )
}
