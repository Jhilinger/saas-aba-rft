'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cambiarDisenoPei, cambiarSupervisor } from './actions'
import { useToast } from '../../providers/toast-provider'
import { Panel } from '../../ui'

type Modo = 'supervisores' | 'terapeutas'

const OPCIONES: { valor: Modo; titulo: string; texto: string }[] = [
  {
    valor: 'supervisores',
    titulo: 'Los supervisores',
    texto:
      'Tú y los terapeutas que marques como supervisores diseñáis los PEI, configuráis los programas, cambiáis estados, valoráis y generáis informes. El resto toma datos y consulta.',
  },
  {
    valor: 'terapeutas',
    titulo: 'Cada terapeuta',
    texto: 'Cada terapeuta diseña y gestiona el PEI de los alumnos que tiene asignados.',
  },
]

export function AjusteDiseno({ modo }: { modo: Modo }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  return (
    <Panel className="space-y-3 p-4 sm:p-5">
      <div>
        <p className="font-medium text-slate-800">¿Quién diseña los PEI?</p>
        <p className="text-sm text-slate-500">La toma de datos y la evaluación estandarizada están siempre abiertas a todo el equipo.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {OPCIONES.map((o) => (
          <button
            key={o.valor}
            onClick={() =>
              o.valor !== modo &&
              startTransition(async () => {
                const res = await cambiarDisenoPei(o.valor)
                if (res.error) {
                  toast(res.error, 'error')
                  return
                }
                router.refresh()
              })
            }
            disabled={isPending}
            className={`rounded-xl border p-3 text-left text-sm transition-colors ${
              o.valor === modo ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            <span className="block font-semibold text-slate-800">{o.titulo}</span>
            <span className="text-slate-600">{o.texto}</span>
          </button>
        ))}
      </div>
    </Panel>
  )
}

export function InterruptorSupervisor({ id, nombre, activo }: { id: string; nombre: string; activo: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const res = await cambiarSupervisor(id, !activo)
          if (res.error) {
            toast(res.error, 'error')
            return
          }
          router.refresh()
        })
      }
      disabled={isPending}
      role="switch"
      aria-checked={activo}
      aria-label={`${nombre} es supervisor`}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors disabled:opacity-50 ${activo ? 'bg-indigo-600' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${activo ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  )
}
