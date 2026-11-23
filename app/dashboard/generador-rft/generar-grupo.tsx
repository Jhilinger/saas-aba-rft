'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../ui'
import { useToast } from '../../providers/toast-provider'
import { NOMBRE_FASE_SECUENCIA, type FaseSecuencia } from '../secuencia-rft'
import { guardarGrupoGenerado, proponerGrupo, type Destino } from './actions'
import type { ClaseGenerada } from './plantillas'

const nuevaSemilla = () => Math.random().toString(36).slice(2, 10)

// «Generar grupo nuevo»: propone un grupo de 3 clases con todas sus claves, se
// revisa en la vista previa y se guarda como un grupo más del programa. Las
// frases generadas no tienen voz grabada: las lee el alumno o el terapeuta
export default function GenerarGrupo({ destino, programaId }: { destino: Destino; programaId: string }) {
  const [propuesta, setPropuesta] = useState<{ semilla: string; grupo: string; clases: ClaseGenerada[] } | null>(null)
  const [pendiente, iniciar] = useTransition()
  const toast = useToast()
  const router = useRouter()

  const proponer = () =>
    iniciar(async () => {
      const semilla = nuevaSemilla()
      const r = await proponerGrupo(destino, programaId, semilla)
      if ('error' in r) toast(r.error, 'error')
      else setPropuesta({ semilla, ...r })
    })

  const guardar = () =>
    iniciar(async () => {
      if (!propuesta) return
      const r = await guardarGrupoGenerado(destino, programaId, propuesta.semilla)
      if ('error' in r && r.error) {
        toast(r.error, 'error')
        return
      }
      toast(`${propuesta.grupo} creado`, 'exito')
      setPropuesta(null)
      router.refresh()
    })

  if (!propuesta) {
    return (
      <Button variant="secondary" onClick={proponer} disabled={pendiente}>
        {pendiente ? 'Generando…' : '✨ Generar grupo nuevo'}
      </Button>
    )
  }

  return (
    <div className="space-y-3 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4">
      <div>
        <p className="font-semibold text-slate-800">Propuesta: {propuesta.grupo}</p>
        <p className="text-xs text-slate-500">
          Revisa las frases. Al guardar se crea como un grupo más del programa. No tiene voz grabada: lo lee el alumno o el terapeuta.
        </p>
      </div>
      {propuesta.clases.map((c) => (
        <div key={c.numero} className="space-y-1 rounded-xl bg-white p-3 text-sm">
          <p className="font-medium text-slate-800">
            Clase {c.numero}:{' '}
            {c.estimulos.map((e) => (
              <span key={e.posicion} className="mr-2 text-slate-600">
                <span className="font-semibold text-slate-400">{e.posicion}</span> {e.nombre}
              </span>
            ))}
          </p>
          <ul className="space-y-0.5 text-slate-600">
            {Object.entries(c.consignas).map(([clave, frase]) => {
              const [fase, relacion] = clave.split(':')
              return (
                <li key={clave}>
                  <span className="text-xs font-medium text-slate-400">
                    {NOMBRE_FASE_SECUENCIA[fase as FaseSecuencia] ?? fase} {relacion}
                  </span>{' '}
                  «{frase}»
                  {c.respuestas_esperadas?.[clave] && <span className="text-xs text-slate-400"> → {c.respuestas_esperadas[clave]}</span>}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button onClick={guardar} disabled={pendiente}>
          {pendiente ? 'Guardando…' : `Guardar como ${propuesta.grupo}`}
        </Button>
        <Button variant="secondary" onClick={proponer} disabled={pendiente}>
          Otra propuesta
        </Button>
        <Button variant="secondary" onClick={() => setPropuesta(null)} disabled={pendiente}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
