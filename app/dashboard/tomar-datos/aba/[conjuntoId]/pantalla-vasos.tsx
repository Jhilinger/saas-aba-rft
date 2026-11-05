'use client'

import { useEffect, useRef, useState } from 'react'
import BotonLargo from '../../../boton-largo'
import AjustesVoz from '../../../ajustes-voz'
import { decirFraseRft } from '../../../voz'
import { DURACION_INTERCAMBIO, generarIntercambios, type ActividadVasos } from '../../../vasos'

// Pantalla del alumno del juego de los vasos (se monta de nuevo en cada
// ensayo): se ve el objeto, los vasos bajan y lo tapan, se intercambian y la
// voz pregunta «¿Dónde está?». El alumno toca un vaso, que se levanta; si no
// era, se levanta después el correcto para que vea dónde estaba. Se registra
// la primera elección y la latencia desde que acaban los intercambios.

const PREGUNTA = '¿Dónde está?'
const T_PAUSA = 900
const T_MOSTRAR = 1500
const T_BAJAR = 700
const T_REVELAR = 1700

type Fase = 'pausa' | 'mostrar' | 'bajar' | 'mezclar' | 'responder' | 'revelar'

function Vaso() {
  return (
    <svg viewBox="0 0 100 110" className="h-full w-full drop-shadow-md" aria-hidden>
      <path d="M18 8 H82 L94 100 H6 Z" fill="#E07A5F" />
      <path d="M18 8 H82 L84 24 H16 Z" fill="#C8644D" />
      <rect x="2" y="96" width="96" height="12" rx="5" fill="#B5533E" />
      <path d="M30 34 L26 86" stroke="#F2A58F" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

function Ensayo({
  actividad,
  imagen,
  nombre,
  onResponder,
}: {
  actividad: ActividadVasos
  imagen: string | null
  nombre: string
  onResponder: (correcto: boolean, latenciaMs: number) => void
}) {
  const n = actividad.vasos
  const duracion = DURACION_INTERCAMBIO[actividad.velocidad]
  // Vaso que tapa el objeto y hueco inicial de cada vaso (vaso i en hueco i)
  const [inicio] = useState(() => {
    const objetivo = Math.floor(Math.random() * n)
    return { objetivo, intercambios: generarIntercambios(n, actividad.intercambios, objetivo) }
  })
  const [huecos, setHuecos] = useState(() => Array.from({ length: n }, (_, i) => i))
  const [fase, setFase] = useState<Fase>('pausa')
  const [elevado, setElevado] = useState<number | null>(null)
  const [levantados, setLevantados] = useState<number[]>([])
  const inicioRespuesta = useRef(0)
  const elegido = useRef(false)

  // Secuencia de la presentación con temporizadores
  useEffect(() => {
    const tiempos: ReturnType<typeof setTimeout>[] = []
    let t = T_PAUSA
    tiempos.push(setTimeout(() => setFase('mostrar'), t))
    t += T_MOSTRAR
    tiempos.push(setTimeout(() => setFase('bajar'), t))
    t += T_BAJAR
    tiempos.push(setTimeout(() => setFase('mezclar'), t))
    const orden = Array.from({ length: n }, (_, i) => i)
    for (const [a, b] of inicio.intercambios) {
      const vasoA = orden.indexOf(a)
      const vasoB = orden.indexOf(b)
      orden[vasoA] = b
      orden[vasoB] = a
      const foto = [...orden]
      tiempos.push(
        setTimeout(() => {
          setHuecos(foto)
          setElevado(vasoA)
        }, t)
      )
      tiempos.push(setTimeout(() => setElevado(null), t + duracion / 2))
      t += duracion + 120
    }
    tiempos.push(
      setTimeout(() => {
        setFase('responder')
        inicioRespuesta.current = performance.now()
        void decirFraseRft(PREGUNTA)
      }, t)
    )
    return () => tiempos.forEach(clearTimeout)
  }, [inicio, n, duracion])

  // instante: marca de tiempo del toque (misma base que performance.now())
  const tocar = (vaso: number, instante: number) => {
    if (fase !== 'responder' || elegido.current) return
    elegido.current = true
    const latencia = Math.max(0, Math.round(instante - inicioRespuesta.current))
    const correcto = vaso === inicio.objetivo
    setFase('revelar')
    setLevantados([vaso])
    const extra = correcto ? 0 : 900
    if (!correcto) setTimeout(() => setLevantados([vaso, inicio.objetivo]), 900)
    setTimeout(() => onResponder(correcto, latencia), T_REVELAR + extra)
  }

  const lado = `min(${n === 2 ? 30 : 24}vmin, ${n === 2 ? 34 : 26}vw)`
  const visible = fase !== 'pausa'
  // Al principio los vasos están levantados y el objeto se ve; luego bajan y lo tapan
  const arriba = (vaso: number) => fase === 'pausa' || fase === 'mostrar' || levantados.includes(vaso)

  return (
    <div className={`relative mx-auto ${visible ? '' : 'invisible'}`} style={{ width: `min(92vw, calc(${lado} * ${n} * 1.6))`, height: `calc(${lado} * 1.9)` }}>
      {Array.from({ length: n }, (_, vaso) => (
        <button
          key={vaso}
          type="button"
          onClick={(e) => tocar(vaso, e.timeStamp)}
          aria-label={`Vaso ${vaso + 1}`}
          className="absolute bottom-0"
          style={{
            left: `${((huecos[vaso] + 0.5) / n) * 100}%`,
            width: lado,
            height: `calc(${lado} * 1.1)`,
            transform: `translateX(-50%) translateY(${elevado === vaso ? `calc(${lado} * -0.45)` : '0'})`,
            transition: `left ${duracion}ms ease-in-out, transform ${duracion / 2}ms ease-out`,
            zIndex: elevado === vaso ? 2 : 1,
          }}
        >
          {vaso === inicio.objetivo && (
            <span className="absolute inset-x-[12%] bottom-[4%] flex aspect-square items-end justify-center">
              {imagen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagen} alt="" draggable={false} className="h-full w-full object-contain" />
              ) : (
                <span className="text-center font-bold text-slate-700" style={{ fontSize: `calc(${lado} * 0.14)` }}>
                  {nombre}
                </span>
              )}
            </span>
          )}
          <span
            className="absolute inset-0"
            style={{
              transform: `translateY(${arriba(vaso) ? `calc(${lado} * -0.95)` : '0'})`,
              transition: `transform ${fase === 'mostrar' || fase === 'bajar' ? T_BAJAR : 450}ms ease-in-out`,
            }}
          >
            <Vaso />
          </span>
        </button>
      ))}
    </div>
  )
}

export default function PantallaVasos({
  actividad,
  imagen,
  nombre,
  ensayo,
  total,
  onResponder,
  onSalir,
}: {
  actividad: ActividadVasos
  imagen: string | null
  nombre: string
  ensayo: number
  total: number
  onResponder: (correcto: boolean, latenciaMs: number) => void
  onSalir: () => void
}) {
  const [menuVoz, setMenuVoz] = useState(false)
  return (
    <div className="fixed inset-0 z-50 flex select-none flex-col bg-white">
      <div className="flex items-start justify-between gap-2 px-3 pt-2">
        <p className="text-[11px] text-slate-300">
          {ensayo + 1}/{total}
        </p>
        <span className="flex gap-2">
          <BotonLargo onActivar={() => setMenuVoz(true)} className="border border-slate-200 !bg-transparent">
            Voz
          </BotonLargo>
          <BotonLargo onActivar={onSalir} className="border border-slate-200 !bg-transparent">
            Salir
          </BotonLargo>
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-6">
        <Ensayo key={ensayo} actividad={actividad} imagen={imagen} nombre={nombre} onResponder={onResponder} />
      </div>
      {menuVoz && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm space-y-2 rounded-2xl bg-white p-4 text-sm">
            <AjustesVoz />
            <button onClick={() => setMenuVoz(false)} className="w-full rounded-lg px-3 py-2 text-slate-500">
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
