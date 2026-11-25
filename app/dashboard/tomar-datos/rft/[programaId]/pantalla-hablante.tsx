'use client'

import { useEffect, useState } from 'react'
import BotonLargo from '../../../boton-largo'
import ContenidoEstimulo from '../../../contenido-estimulo'
import type { EnsayoHablante } from '../../../conceptos'
import { urlImagen, type ImagenesBanco } from './pantalla-tablet'

// Modo hablante de los conceptos generados: el alumno ve los estímulos (con el
// que señala el terapeuta marcado) y DICE la relación; el terapeuta hace la
// pregunta y marca si la respuesta es correcta. Los botones del terapeuta hay
// que mantenerlos pulsados, para que un toque del alumno no los dispare.

const VISIBLE = 1500
const ENTRE = 1000
const PAUSA = 600

const lado = (n: number) => `min(calc((100vw - 4rem) / ${n} - 2.5vmin), 40vh)`

export default function PantallaHablante({
  ensayo,
  numero,
  total,
  fase,
  imagenes,
  onResponder,
  onSalir,
}: {
  ensayo: EnsayoHablante
  numero: number
  total: number
  fase: string
  imagenes: ImagenesBanco
  onResponder: (correcto: boolean) => void
  onSalir: () => void
}) {
  // Presentación secuencial (orden en que aparecen): -1 = en blanco; null = terminada
  const [paso, setPaso] = useState<number | null>(ensayo.secuencia ? -1 : null)
  const [vuelta, setVuelta] = useState(0)
  // La respuesta esperada solo se ve mientras se mantiene pulsado (el alumno
  // lector no debe poder leerla)
  const [verRespuesta, setVerRespuesta] = useState(false)
  // Puntuado y a la espera de «Siguiente ensayo» (tiempo para reforzar)
  const [puntuado, setPuntuado] = useState<boolean | null>(null)
  const siguiente = () => {
    const correcto = puntuado
    setPuntuado(null)
    if (correcto !== null) onResponder(correcto)
  }

  useEffect(() => {
    if (!ensayo.secuencia) return
    const tiempos: number[] = []
    let t = PAUSA
    ensayo.secuencia.forEach((_, i) => {
      tiempos.push(window.setTimeout(() => setPaso(i), t))
      t += VISIBLE
      tiempos.push(window.setTimeout(() => setPaso(-1), t))
      t += ENTRE
    })
    tiempos.push(window.setTimeout(() => setPaso(null), t))
    return () => tiempos.forEach((x) => clearTimeout(x))
  }, [ensayo, vuelta])

  const url = (concepto: string) => urlImagen(imagenes, concepto, fase, numero, true)
  const enSecuencia = paso !== null && ensayo.secuencia
  const visibles = enSecuencia ? (paso >= 0 ? [ensayo.secuencia![paso]] : []) : ensayo.estimulos
  const l = lado(Math.max(visibles.length, 2))

  return (
    <div className="fixed inset-0 z-50 flex select-none flex-col bg-white">
      <div className="flex items-start justify-between gap-2 px-3 pt-2">
        <p className="text-[11px] text-slate-300">
          {fase === 'generalizacion' ? 'Sonda de generalización' : 'Entrenamiento'} · hablante · {numero + 1}/{total}
        </p>
        <BotonLargo onActivar={onSalir} className="border border-slate-200 !bg-transparent">
          Salir
        </BotonLargo>
      </div>

      <div className="flex flex-1 items-center justify-center gap-[4vmin] px-4">
        {visibles.map((e, i) => {
          const marcada = !enSecuencia && ensayo.marcada === i
          return (
            <div key={`${paso}-${i}`} className="flex flex-col items-center gap-[1.5vmin]">
              <div
                style={{ width: l, height: l }}
                className={`flex items-center justify-center rounded-[2.5vmin] border-2 bg-white shadow-sm ${
                  marcada ? 'border-amber-400 ring-[1.2vmin] ring-amber-200' : 'border-slate-200'
                }`}
              >
                <ContenidoEstimulo estimulo={e} lado={l} urlImagen={url} />
              </div>
              {!enSecuencia && ensayo.marcada !== null && (
                <span className={`text-[5vmin] leading-none ${marcada ? 'text-amber-500' : 'invisible'}`}>▲</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Banda del terapeuta */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-slate-800">{ensayo.pregunta}</p>
          <button
            type="button"
            onPointerDown={() => setVerRespuesta(true)}
            onPointerUp={() => setVerRespuesta(false)}
            onPointerLeave={() => setVerRespuesta(false)}
            onPointerCancel={() => setVerRespuesta(false)}
            onContextMenu={(e) => e.preventDefault()}
            className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm text-slate-500 [touch-action:none]"
          >
            {verRespuesta ? <span className="font-semibold text-slate-800">{ensayo.esperada}</span> : '👁 Respuesta (mantener pulsado)'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {ensayo.secuencia && (
            <BotonLargo
              onActivar={() => {
                setPaso(-1)
                setVuelta((v) => v + 1)
              }}
              className="border border-slate-200 !bg-white"
            >
              ↺ Secuencia
            </BotonLargo>
          )}
          {puntuado !== null ? (
            <>
              <span className={`self-center text-sm font-semibold ${puntuado ? 'text-emerald-700' : 'text-rose-700'}`}>
                {puntuado ? '✓ Correcta' : '✗ Incorrecta'}
              </span>
              <BotonLargo onActivar={() => setPuntuado(null)} className="border border-slate-200 !bg-white">
                Cambiar
              </BotonLargo>
              <BotonLargo onActivar={siguiente} className="!bg-indigo-600 text-white">
                Siguiente ensayo →
              </BotonLargo>
            </>
          ) : (
            <>
              <BotonLargo onActivar={() => setPuntuado(false)} className="!bg-rose-100 text-rose-800">
                ✗ Incorrecta
              </BotonLargo>
              <BotonLargo onActivar={() => setPuntuado(true)} className="!bg-emerald-100 text-emerald-800">
                ✓ Correcta
              </BotonLargo>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
