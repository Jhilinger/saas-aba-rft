'use client'

import { useState, useTransition } from 'react'
import { Button, Panel } from '../../../ui'
import { useToast } from '../../../providers/toast-provider'
import { guardarConsignas } from './actions'
import { claveConsigna, type ConsignasPrograma } from '../../consignas-rft'
import { NOMBRE_FASE_SECUENCIA, type PasoSecuencia } from '../../secuencia-rft'

// Claves relacionales (consignas) del programa del alumno: la de cada paso y, si la
// pregunta depende de la clase (transformación de funciones, categorías), la de
// cada clase. La tableta las dice en voz alta y con material las lee el terapeuta.

type ClaseConsignas = { id: string; nombre: string; grupo: string; consignas: Record<string, string> }

export default function ConsignasPanel({
  programaAlumnoId,
  pasos,
  consignas: guardadas,
  clases: clasesGuardadas,
  soloLectura,
}: {
  programaAlumnoId: string
  pasos: PasoSecuencia[]
  consignas: ConsignasPrograma
  clases: ClaseConsignas[]
  soloLectura: boolean
}) {
  const [programa, setPrograma] = useState(guardadas)
  const [clases, setClases] = useState(clasesGuardadas)
  const [abierto, setAbierto] = useState(false)
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  // Pasos con pregunta por clase: los de transformación y los que ya tengan alguna
  const clavesPorClase = [
    ...new Set([
      ...pasos.filter((p) => p.fase === 'transformacion_funciones').map((p) => claveConsigna(p.fase, p.origen, p.destino)),
      ...clasesGuardadas.flatMap((c) => Object.keys(c.consignas)),
    ]),
  ]
  const relaciones = [...new Set(pasos.map((p) => `${p.origen}→${p.destino}`))]
  const nombreClave = (clave: string) => {
    const [fase, relacion] = clave.split(':')
    return `${NOMBRE_FASE_SECUENCIA[fase as PasoSecuencia['fase']] ?? fase} ${relacion}`
  }
  const definidas = Object.keys(guardadas.pasos).length + clasesGuardadas.filter((c) => Object.keys(c.consignas).length).length

  const guardar = () =>
    startTransition(async () => {
      const res = await guardarConsignas(
        programaAlumnoId,
        programa,
        clases.map((c) => ({ id: c.id, consignas: c.consignas }))
      )
      if (res.error) toast(res.error, 'error')
      else toast('Claves relacionales guardadas.', 'exito')
    })

  const campo = (valor: string, cambiar: (v: string) => void, placeholder = '') =>
    soloLectura ? (
      <span className="text-slate-700">{valor || '—'}</span>
    ) : (
      <input
        value={valor}
        onChange={(e) => cambiar(e.target.value)}
        placeholder={placeholder}
        maxLength={200}
        className="w-full rounded border border-slate-300 px-2 py-1"
      />
    )

  return (
    <Panel className="space-y-3 p-4 text-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-700">Clave relacional (Crel)</h2>
          <p className="text-xs text-slate-500">
            {definidas
              ? 'La clave que se da al alumno en cada paso: la tableta la dice en voz alta y con material se muestra al terapeuta.'
              : 'Sin claves relacionales: la tableta solo dice la muestra cuando es una palabra oída.'}
          </p>
        </div>
        <button onClick={() => setAbierto((a) => !a)} className="text-sm font-medium text-indigo-600 hover:underline">
          {abierto ? 'Cerrar' : soloLectura ? 'Ver' : 'Editar'}
        </button>
      </div>

      {abierto && (
        <div className="space-y-4 text-xs">
          <p className="text-slate-500">
            Escribe <code>{'{muestra}'}</code> donde vaya la palabra oída de la muestra (ej. «Toca {'{muestra}'}»). Mantén la
            misma clave relacional que en los programas de abstracción.
          </p>
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100">
              {pasos.map((p) => {
                const clave = claveConsigna(p.fase, p.origen, p.destino)
                return (
                  <tr key={clave}>
                    <td className="w-44 py-1.5 pr-2 text-slate-600">{nombreClave(clave)}</td>
                    <td className="py-1.5">
                      {campo(programa.pasos[clave] ?? '', (v) => setPrograma((c) => ({ ...c, pasos: { ...c.pasos, [clave]: v } })))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="space-y-1">
            <p className="font-medium text-slate-600">Frase alternativa en las sondas de generalización (opcional)</p>
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100">
                {relaciones.map((r) => (
                  <tr key={r}>
                    <td className="w-44 py-1.5 pr-2 text-slate-600">{r}</td>
                    <td className="py-1.5">
                      {campo(programa.alternativas[r] ?? '', (v) =>
                        setPrograma((c) => ({ ...c, alternativas: { ...c.alternativas, [r]: v } }))
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {clavesPorClase.map((clave) => (
            <div key={clave} className="space-y-1">
              <p className="font-medium text-slate-600">{nombreClave(clave)}: pregunta de cada clase</p>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {clases.map((c) => (
                    <tr key={c.id}>
                      <td className="w-44 py-1.5 pr-2 text-slate-600">
                        {c.grupo} · {c.nombre}
                      </td>
                      <td className="py-1.5">
                        {campo(c.consignas[clave] ?? '', (v) =>
                          setClases((lista) => lista.map((x) => (x.id === c.id ? { ...x, consignas: { ...x.consignas, [clave]: v } } : x)))
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {!soloLectura && (
            <div className="flex justify-end">
              <Button disabled={isPending} onClick={guardar}>
                Guardar claves relacionales
              </Button>
            </div>
          )}
        </div>
      )}
    </Panel>
  )
}
