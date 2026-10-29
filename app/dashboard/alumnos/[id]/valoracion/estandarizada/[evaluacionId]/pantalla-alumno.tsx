'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useCronometroEnsayo } from '../../../../../tomar-datos/cronometro'
import Figura from '../figuras'
import { esCorrecta, ordenesDeOpciones, type Estimulo, type Paso } from '../guion'
import { CRITERIO_BLOQUE, MAX_BLOQUES, type Ensayo } from '../logica'

// Pantalla del alumno: muestra los ensayos del guion sin texto de ayuda ni
// reacción al tocar, y registra respuesta y latencia. El evaluador la maneja
// con botones discretos que hay que mantener pulsados.

export type ResultadoPantalla = { ensayos: Ensayo[]; noProcede: boolean }

type Elemento = { paso: Paso; indice: number }

const PAUSA_ENTRE_ENSAYOS = 700
const PULSACION_LARGA = 600

function EstimuloVista({ estimulo, grande = false }: { estimulo: Estimulo; grande?: boolean }) {
  const tam = grande ? 'h-36 w-36 sm:h-44 sm:w-44' : 'h-24 w-24 sm:h-32 sm:w-32'
  if ('par' in estimulo) {
    return (
      <span className="flex gap-2">
        <EstimuloVista estimulo={estimulo.par[0]} />
        <EstimuloVista estimulo={estimulo.par[1]} />
      </span>
    )
  }
  if ('externo' in estimulo) return <span className="text-xs text-slate-300">{estimulo.externo}</span>
  if ('color' in estimulo) return <span className={`block rounded-2xl ${tam}`} style={{ backgroundColor: estimulo.color }} />
  if ('t' in estimulo) {
    return (
      <span className="flex min-h-20 min-w-32 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white px-5 py-3 text-center text-2xl font-bold tracking-wide text-slate-800 sm:text-3xl">
        {estimulo.t}
      </span>
    )
  }
  const etiqueta = 'etiqueta' in estimulo ? estimulo.etiqueta : undefined
  return (
    <span className="flex flex-col items-center gap-1">
      {'e' in estimulo ? (
        <span className={`flex items-center justify-center leading-none ${grande ? 'text-8xl sm:text-9xl' : 'text-6xl sm:text-7xl'}`}>{estimulo.e}</span>
      ) : (
        <Figura tipo={estimulo.fig} semilla={estimulo.s} variante={estimulo.v} className={tam} />
      )}
      {etiqueta && <span className="text-xl font-bold text-slate-700">{etiqueta}</span>}
    </span>
  )
}

function BotonLargo({ children, onActivar, className = '' }: { children: React.ReactNode; onActivar: () => void; className?: string }) {
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pulsando, setPulsando] = useState(false)
  const soltar = () => {
    if (temporizador.current) clearTimeout(temporizador.current)
    temporizador.current = null
    setPulsando(false)
  }
  return (
    <button
      type="button"
      onPointerDown={() => {
        setPulsando(true)
        temporizador.current = setTimeout(() => {
          soltar()
          onActivar()
        }, PULSACION_LARGA)
      }}
      onPointerUp={soltar}
      onPointerLeave={soltar}
      onContextMenu={(e) => e.preventDefault()}
      className={`select-none rounded-lg px-3 py-2 text-xs font-medium transition-colors ${pulsando ? 'bg-slate-300 text-slate-700' : 'bg-slate-100 text-slate-400'} ${className}`}
    >
      {children}
    </button>
  )
}

export default function PantallaAlumno({
  codigo,
  pasos,
  alTerminar,
  alCancelar,
}: {
  codigo: string
  pasos: Paso[]
  alTerminar: (resultado: ResultadoPantalla) => void
  alCancelar: () => void
}) {
  const ordenes = useMemo(() => ordenesDeOpciones(codigo, pasos), [codigo, pasos])
  const elementos = useMemo(() => pasos.map((paso, indice) => ({ paso, indice })), [pasos])
  const comprobacion = elementos.filter((e) => e.paso.fase === 'comprobacion')
  const entrenamiento = elementos.filter((e) => e.paso.fase === 'entrenamiento')
  const resto = elementos.filter((e) => e.paso.fase === 'enunciado' || e.paso.fase === 'test')

  const [cola, setCola] = useState<Elemento[]>(() =>
    comprobacion.length ? comprobacion : entrenamiento.length ? entrenamiento : resto
  )
  const [posicion, setPosicion] = useState(0)
  const [ensayos, setEnsayos] = useState<Ensayo[]>([])
  const [fallosComprobacion, setFallosComprobacion] = useState(0)
  const [bloques, setBloques] = useState(0)
  const [enPausa, setEnPausa] = useState(false)
  const [seleccion, setSeleccion] = useState<number[]>([])
  const [menu, setMenu] = useState(false)
  const [voz, setVoz] = useState(false)
  const [paso, setPaso] = useState(0)
  const cronometro = useCronometroEnsayo(enPausa ? null : paso)

  const actual = cola[posicion]

  useEffect(() => {
    if (!voz || enPausa || !actual || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const frase = new SpeechSynthesisUtterance(actual.paso.consigna)
    frase.lang = 'es-ES'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(frase)
  }, [voz, enPausa, actual, paso])

  // Pasa al siguiente elemento de la cola; al acabar un tramo decide el
  // siguiente (comprobación → entrenamiento por bloques → enunciados y test)
  const avanzar = (registrados: Ensayo[], fallos: number) => {
    setSeleccion([])
    if (posicion + 1 < cola.length) {
      setPosicion(posicion + 1)
      setPaso((p) => p + 1)
      return
    }
    const tramo = cola[0]?.paso.fase
    let siguiente: Elemento[] | null = null
    if (tramo === 'comprobacion') {
      if (fallos > 0) {
        alTerminar({ ensayos: registrados, noProcede: true })
        return
      }
      siguiente = entrenamiento.length ? entrenamiento : resto
    } else if (tramo === 'entrenamiento') {
      const delBloque = registrados.filter((e) => e.fase === 'entrenamiento').slice(-entrenamiento.length)
      const hechos = bloques + 1
      setBloques(hechos)
      if (delBloque.filter((e) => e.correcto).length >= CRITERIO_BLOQUE) siguiente = resto
      else if (hechos < MAX_BLOQUES) siguiente = entrenamiento
    }
    if (!siguiente || siguiente.length === 0) {
      alTerminar({ ensayos: registrados, noProcede: false })
      return
    }
    setCola(siguiente)
    setPosicion(0)
    setPaso((p) => p + 1)
  }

  const registrar = (correcto: boolean, respuesta?: number | number[]) => {
    if (!actual || enPausa) return
    const latenciaMs = cronometro.leer() ?? undefined
    const { fase, control } = actual.paso
    let registrados = ensayos
    let fallos = fallosComprobacion
    if (fase === 'comprobacion') {
      if (!correcto) fallos++
      setFallosComprobacion(fallos)
    } else if (fase === 'entrenamiento' || fase === 'test') {
      const ensayo: Ensayo = { fase, correcto, latenciaMs }
      if (control) ensayo.control = true
      if (respuesta !== undefined) ensayo.respuesta = respuesta
      registrados = [...ensayos, ensayo]
      setEnsayos(registrados)
    }
    setEnPausa(true)
    setTimeout(() => {
      setEnPausa(false)
      avanzar(registrados, fallos)
    }, PAUSA_ENTRE_ENSAYOS)
  }

  const tocar = (indiceOpcion: number) => {
    if (!actual || enPausa) return
    const p = actual.paso
    if (p.respuesta === 'multiple') {
      setSeleccion((s) => (s.includes(indiceOpcion) ? s.filter((i) => i !== indiceOpcion) : [...s, indiceOpcion]))
      return
    }
    if (p.respuesta === 'ordenar') {
      if (seleccion.includes(indiceOpcion)) return
      const orden = [...seleccion, indiceOpcion]
      setSeleccion(orden)
      if (orden.length === (p.opciones?.length ?? 0)) registrar(esCorrecta(p, orden), orden)
      return
    }
    registrar(esCorrecta(p, indiceOpcion), indiceOpcion)
  }

  const repetir = () => {
    setMenu(false)
    setSeleccion([])
    setPaso((p) => p + 1)
  }

  if (!actual) return null
  const p = actual.paso
  const modelos = p.modelo === undefined ? [] : Array.isArray(p.modelo) ? p.modelo : [p.modelo]
  const orden = ordenes[actual.indice] ?? []
  const puntuaEvaluador = (p.fase === 'test' || p.fase === 'entrenamiento' || p.fase === 'comprobacion') && !p.opciones
  const grid = p.respuesta === 'multiple' ? 'grid-cols-3 sm:grid-cols-4' : (p.opciones?.length ?? 0) > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-start justify-between gap-2 p-2">
        <p className="max-w-[75%] text-xs text-slate-300">
          {p.fase === 'enunciado' ? 'Enunciado' : p.fase === 'entrenamiento' ? `Entrenamiento · bloque ${bloques + 1}` : p.fase === 'comprobacion' ? 'Comprobación' : 'Test'}
          {p.control && ' · control'} · {p.consigna}
        </p>
        <BotonLargo onActivar={() => setMenu(true)}>Evaluador</BotonLargo>
      </div>

      <div className={`flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto p-4 transition-opacity ${enPausa ? 'opacity-0' : 'opacity-100'}`}>
        {modelos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {modelos.map((m, i) => (
              <EstimuloVista key={i} estimulo={m} grande={modelos.length === 1 && !p.opciones?.length} />
            ))}
          </div>
        )}
        {p.opciones && (
          <div className={`grid w-full max-w-4xl gap-4 ${grid}`}>
            {orden.map((i) => {
              const marcada = seleccion.indexOf(i)
              return (
                <button
                  key={`${paso}-${i}`}
                  type="button"
                  onClick={() => tocar(i)}
                  className={`relative flex min-h-32 items-center justify-center rounded-2xl border-2 p-3 ${
                    marcada >= 0 ? 'border-slate-400 bg-slate-50' : 'border-transparent'
                  }`}
                >
                  <EstimuloVista estimulo={p.opciones![i]} />
                  {p.respuesta === 'ordenar' && marcada >= 0 && (
                    <span className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-500 text-sm font-bold text-white">
                      {marcada + 1}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
        {p.respuesta === 'multiple' && (
          <button
            type="button"
            onClick={() => registrar(esCorrecta(p, seleccion), seleccion)}
            className="rounded-2xl bg-slate-700 px-10 py-4 text-xl font-bold text-white"
          >
            Listo
          </button>
        )}
      </div>

      <div className="flex justify-end gap-2 p-2">
        {p.fase === 'enunciado' && <BotonLargo onActivar={() => avanzar(ensayos, fallosComprobacion)}>Seguir</BotonLargo>}
        {puntuaEvaluador && (
          <>
            <BotonLargo onActivar={() => registrar(true)}>✓ Correcto</BotonLargo>
            <BotonLargo onActivar={() => registrar(false)}>✗ Incorrecto</BotonLargo>
          </>
        )}
      </div>

      {menu && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm space-y-2 rounded-2xl bg-white p-4 text-sm">
            <p className="font-semibold text-slate-800">Evaluador</p>
            <p className="text-xs text-slate-500">
              {ensayos.filter((e) => e.fase === 'test').length} de test y {ensayos.filter((e) => e.fase === 'entrenamiento').length} de
              entrenamiento registrados.
            </p>
            <button onClick={repetir} className="w-full rounded-lg bg-slate-100 px-3 py-2 text-left">
              Repetir este ensayo (no se registra)
            </button>
            <button onClick={() => setVoz((v) => !v)} className="w-full rounded-lg bg-slate-100 px-3 py-2 text-left">
              Voz sintética: {voz ? 'activada' : 'desactivada'}
            </button>
            <button onClick={() => alTerminar({ ensayos, noProcede: false })} className="w-full rounded-lg bg-slate-100 px-3 py-2 text-left">
              Terminar y conservar lo registrado
            </button>
            <button onClick={alCancelar} className="w-full rounded-lg bg-rose-50 px-3 py-2 text-left text-rose-700">
              Salir sin guardar
            </button>
            <button onClick={() => setMenu(false)} className="w-full rounded-lg px-3 py-2 text-slate-500">
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
