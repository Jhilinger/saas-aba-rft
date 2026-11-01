'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCronometroEnsayo } from '../../../../../tomar-datos/cronometro'
import Figura from '../figuras'
import BotonLargo from '../../../../../boton-largo'
import { esCorrecta, ordenesDeOpciones, type Estimulo, type Paso } from '../guion'
import { CRITERIO_BLOQUE, MAX_BLOQUES, type Ensayo } from '../logica'

// Pantalla del alumno: muestra los ensayos del guion sin texto de ayuda ni
// reacción al tocar, y registra respuesta y latencia. El evaluador la maneja
// con botones discretos que hay que mantener pulsados.

export type ResultadoPantalla = { ensayos: Ensayo[]; noProcede: boolean }

type Elemento = { paso: Paso; indice: number }

const PAUSA_ENTRE_ENSAYOS = 700

// Contenido de un estímulo dentro de una tarjeta de lado `lado` (expresión
// CSS): emoji, figuras y textos se dimensionan como fracción de ese lado
function Contenido({ estimulo, lado }: { estimulo: Estimulo; lado: string }) {
  const f = (k: number) => `calc(${lado} * ${k})`
  if ('par' in estimulo) {
    return (
      <span className="flex items-center justify-center" style={{ gap: f(0.05) }}>
        {estimulo.par.map((e, i) => (
          <span key={i} className="flex items-center justify-center rounded-xl bg-slate-50" style={{ width: f(0.46), height: f(0.46) }}>
            <Contenido estimulo={e} lado={f(0.46)} />
          </span>
        ))}
      </span>
    )
  }
  if ('externo' in estimulo) {
    return (
      <span className="px-2 text-center text-slate-400" style={{ fontSize: f(0.08) }}>
        {estimulo.externo}
      </span>
    )
  }
  if ('color' in estimulo) {
    return <span className="block rounded-2xl" style={{ width: f(0.8), height: f(0.8), backgroundColor: estimulo.color }} />
  }
  if ('t' in estimulo) {
    return (
      <span
        className="text-center font-serif font-bold leading-tight text-slate-800"
        style={{ fontSize: f(estimulo.t.length > 12 ? 0.11 : estimulo.t.length > 7 ? 0.15 : 0.2), padding: `0 ${f(0.06)}` }}
      >
        {estimulo.t}
      </span>
    )
  }
  const etiqueta = 'etiqueta' in estimulo ? estimulo.etiqueta : undefined
  return (
    <span className="flex flex-col items-center justify-center" style={{ gap: f(0.03) }}>
      {'e' in estimulo ? (
        <span className="whitespace-nowrap leading-none" style={{ fontSize: f((etiqueta ? 0.46 : 0.6) / Math.max(1, numGrafemas(estimulo.e) * 0.85)) }}>
          {estimulo.e}
        </span>
      ) : (
        <span style={{ width: f(etiqueta ? 0.66 : 0.82), height: f(etiqueta ? 0.66 : 0.82) }}>
          <Figura tipo={estimulo.fig} semilla={estimulo.s} variante={estimulo.v} className="h-full w-full" />
        </span>
      )}
      {etiqueta && (
        <span className="font-bold text-slate-700" style={{ fontSize: f(0.13) }}>
          {etiqueta}
        </span>
      )}
    </span>
  )
}

// Emoji que forman el texto (🐕🍖 son 2): se reparten el ancho de la tarjeta
function numGrafemas(texto: string) {
  return [...new Intl.Segmenter('es', { granularity: 'grapheme' }).segment(texto)].length
}

// Lado de una tarjeta para que quepan `n` por fila sin desbordar la pantalla
function lado(n: number, maxVh: number, margenRem = 4) {
  return `min(calc((100vw - ${margenRem}rem) / ${n} - 2.5vmin), ${maxVh}vh)`
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
  const nOpciones = p.opciones?.length ?? 0
  // Cuadrícula de respuesta múltiple: hasta 6 por fila; el resto, todas en una fila
  const porFila = p.respuesta === 'multiple' ? Math.min(6, Math.ceil(nOpciones / 2)) : nOpciones
  const ladoOpcion = lado(Math.max(porFila, 2), p.respuesta === 'multiple' ? 22 : 34)
  // Sin opciones (respuesta oral u otra que puntúa el evaluador) el modelo se ve más grande
  const ladoModelo = lado(Math.max(modelos.length, 1), modelos.length > 2 ? 20 : nOpciones === 0 ? 44 : 26, 7)
  const ladoAudio = lado(1, 16, 7)
  // Sin modelo visible, la muestra es la consigna oída: se puede volver a escuchar
  const muestraAuditiva = modelos.length === 0 && nOpciones > 0
  const escuchar = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const frase = new SpeechSynthesisUtterance(p.consigna)
    frase.lang = 'es-ES'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(frase)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F5F2EC] select-none">
      <div className="flex items-start justify-between gap-2 px-3 pt-2">
        <p className="max-w-[75%] text-[11px] text-slate-300">
          {p.fase === 'enunciado' ? 'Enunciado' : p.fase === 'entrenamiento' ? `Entrenamiento · bloque ${bloques + 1}` : p.fase === 'comprobacion' ? 'Comprobación' : 'Test'}
          {p.control && ' · control'} · {posicion + 1}/{cola.length} · {p.consigna}
        </p>
        <BotonLargo onActivar={() => setMenu(true)} className="!bg-transparent border border-slate-200">
          Evaluador
        </BotonLargo>
      </div>

      <div
        className={`flex flex-1 flex-col items-center justify-center gap-[2.5vmin] overflow-hidden px-4 pb-2 transition-opacity duration-200 ${
          enPausa ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {(modelos.length > 0 || muestraAuditiva) && (
          <div className="flex flex-wrap items-center justify-center gap-[2.5vmin] rounded-[3vmin] border-2 border-indigo-200 bg-indigo-50/70 px-[3vmin] py-[2.5vmin]">
            {modelos.length > 0 ? (
              modelos.map((m, i) => (
                <span
                  key={i}
                  style={{ width: ladoModelo, height: ladoModelo }}
                  className="flex items-center justify-center rounded-[2.5vmin] border-2 border-indigo-300 bg-white"
                >
                  <Contenido estimulo={m} lado={ladoModelo} />
                </span>
              ))
            ) : (
              <button
                type="button"
                onClick={escuchar}
                style={{ width: ladoAudio, height: ladoAudio }}
                className="flex flex-col items-center justify-center gap-2 rounded-[2.5vmin] border-2 border-indigo-300 bg-white"
                aria-label="Escuchar de nuevo"
              >
                <span className="leading-none" style={{ fontSize: `calc(${ladoAudio} * 0.38)` }}>
                  🔊
                </span>
                <span className="text-slate-500" style={{ fontSize: `calc(${ladoAudio} * 0.1)` }}>
                  Escuchar
                </span>
              </button>
            )}
          </div>
        )}

        {p.opciones && (modelos.length > 0 || muestraAuditiva) && <span className="text-[3vmin] font-semibold leading-none text-slate-400">=</span>}

        {p.opciones && (
          <div className="flex flex-wrap justify-center gap-[2.5vmin]" style={{ maxWidth: `calc(${porFila} * (${ladoOpcion} + 2.5vmin))` }}>
            {orden.map((i) => {
              const marcada = seleccion.indexOf(i)
              return (
                <button
                  key={`${paso}-${i}`}
                  type="button"
                  onClick={() => tocar(i)}
                  style={{ width: ladoOpcion, height: ladoOpcion }}
                  className={`relative flex items-center justify-center rounded-[2.5vmin] border-2 bg-white shadow-sm transition-transform active:scale-[0.98] ${
                    marcada >= 0 ? 'border-indigo-500 ring-4 ring-indigo-200' : 'border-slate-200'
                  }`}
                >
                  <Contenido estimulo={p.opciones![i]} lado={ladoOpcion} />
                  {p.respuesta === 'ordenar' && marcada >= 0 && (
                    <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-base font-bold text-white">
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
            className="rounded-2xl bg-slate-700 px-10 py-3 text-xl font-bold text-white"
          >
            Listo
          </button>
        )}
      </div>

      <div className="flex min-h-12 justify-end gap-2 px-3 pb-2">
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
