'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../ui'
import { useToast } from '../../providers/toast-provider'
import { NOMBRE_FASE_SECUENCIA, type FaseSecuencia } from '../secuencia-rft'
import { guardarGrupoGenerado, proponerGrupo, type Destino } from './actions'
import type { ClaseGenerada } from './plantillas'

const nuevaSemilla = () => Math.random().toString(36).slice(2, 10)

// «Generar grupo nuevo»: propone un grupo (3 clases, 4 en las redes de oposición) con todas sus claves, se
// revisa en la vista previa y se guarda como un grupo más del programa. Las
// frases generadas no tienen voz grabada: las lee el alumno o el terapeuta
export default function GenerarGrupo({ destino, programaId }: { destino: Destino; programaId: string }) {
  const [propuesta, setPropuesta] = useState<{ semilla: string; grupo: string; clases: ClaseGenerada[] } | null>(null)
  // Edición a mano de las frases: número de clase → clave → texto
  const [editando, setEditando] = useState(false)
  const [cambios, setCambios] = useState<Record<number, Record<string, string>>>({})
  const [pendiente, iniciar] = useTransition()
  const toast = useToast()
  const router = useRouter()

  const proponer = () =>
    iniciar(async () => {
      const semilla = nuevaSemilla()
      const r = await proponerGrupo(destino, programaId, semilla)
      if ('error' in r) toast(r.error, 'error')
      else {
        setPropuesta({ semilla, ...r })
        setCambios({})
        setEditando(false)
      }
    })

  const guardar = () =>
    iniciar(async () => {
      if (!propuesta) return
      const r = await guardarGrupoGenerado(destino, programaId, propuesta.semilla, cambios)
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
        <button type="button" onClick={() => setEditando((v) => !v)} className="mt-1 text-sm font-medium text-indigo-700 hover:text-indigo-900">
          {editando ? 'Terminar de editar' : '✏️ Editar frases'}
        </button>
        {editando && (
          <p className="mt-1 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Puede cambiar cómo está dicha cada frase (nombres, palabras, situación), pero la respuesta correcta y las opciones no cambian:
            compruebe que la frase sigue llevando a la misma respuesta.
          </p>
        )}
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
                  {editando ? (
                    <textarea
                      value={cambios[c.numero]?.[clave] ?? frase}
                      onChange={(e) => setCambios((prev) => ({ ...prev, [c.numero]: { ...prev[c.numero], [clave]: e.target.value } }))}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm"
                    />
                  ) : (
                    <>«{cambios[c.numero]?.[clave] ?? frase}»</>
                  )}
                  {c.respuestas_esperadas?.[clave] && <span className="text-xs text-slate-400"> → {c.respuestas_esperadas[clave]}</span>}
                  {c.opciones_por_fase?.[clave] && <span className="text-xs text-slate-400"> (opciones: {c.opciones_por_fase[clave].join(' · ')})</span>}
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
