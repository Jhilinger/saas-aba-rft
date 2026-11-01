'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useCronometroEnsayo } from '../../../../../tomar-datos/cronometro'
import Figura from '../figuras'
import BotonLargo from '../../../../../boton-largo'
import { useEtapasEnsayo } from '../../../../../etapas-ensayo'
import { decirConsigna, desbloquearAudio, precargarConsigna } from '../../../../../voz'
import AjustesVoz from '../../../../../ajustes-voz'
import { esCorrecta, ordenesDeOpciones, type Estimulo, type Paso } from '../guion'
import { CRITERIO_BLOQUE, MAX_BLOQUES, type Ensayo } from '../logica'

// Pantalla del alumno: muestra los ensayos del guion sin texto de ayuda ni
// reacción al tocar, y registra respuesta y latencia. El evaluador la maneja
// con botones discretos que hay que mantener pulsados.

export type ResultadoPantalla = { ensayos: Ensayo[]; noProcede: boolean }

type Elemento = { paso: Paso; indice: number }


// Contenido de un estímulo dentro de una tarjeta de lado `lado` (expresión
// CSS): emoji, figuras y textos se dimensionan como fracción de ese lado
function Contenido({ estimulo, lado, imagenes }: { estimulo: Estimulo; lado: string; imagenes: Record<string, string> }) {
  const f = (k: number) => `calc(${lado} * ${k})`
  if ('par' in estimulo) {
    return (
      <span className="flex items-center justify-center" style={{ gap: f(0.05) }}>
        {estimulo.par.map((e, i) => (
          <span key={i} className="flex items-center justify-center rounded-xl bg-slate-50" style={{ width: f(0.46), height: f(0.46) }}>
            <Contenido estimulo={e} lado={f(0.46)} imagenes={imagenes} />
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
  if ('img' in estimulo) {
    const url = imagenes[estimulo.img]
    return (
      <span className="flex flex-col items-center justify-center" style={{ gap: f(0.03) }}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" draggable={false} className="object-contain" style={{ width: f(estimulo.etiqueta ? 0.68 : 0.88), height: f(estimulo.etiqueta ? 0.68 : 0.88) }} />
        ) : (
          <span className="text-slate-400" style={{ fontSize: f(0.08) }}>
            {estimulo.img}
          </span>
        )}
        {estimulo.etiqueta && (
          <span className="font-bold text-slate-700" style={{ fontSize: f(0.13) }}>
            {estimulo.etiqueta}
          </span>
        )}
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


// Un ensayo en pantalla: pausa, opciones y después la muestra (o la voz). Se
// monta de nuevo en cada ensayo; los toques antes de la muestra no cuentan.
function Escenario({
  paso: p,
  orden,
  seleccion,
  imagenes,
  voz,
  onTocar,
  onRegistrar,
  onSeguir,
  onMuestra,
}: {
  paso: Paso
  orden: number[]
  seleccion: number[]
  imagenes: Record<string, string>
  voz: boolean
  onTocar: (indice: number) => void
  onRegistrar: (correcto: boolean, respuesta?: number | number[]) => void
  onSeguir: () => void
  onMuestra: () => void
}) {
  const modelos = p.modelo === undefined ? [] : Array.isArray(p.modelo) ? p.modelo : [p.modelo]
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
  // La grabación se descarga durante la pausa para que suene con la muestra
  useEffect(() => {
    if (voz || muestraAuditiva) void precargarConsigna(p.consigna)
  }, [voz, muestraAuditiva, p.consigna])
  const etapa = useEtapasEnsayo(nOpciones > 0 && p.fase !== 'enunciado', () => {
    onMuestra()
    if (voz) void decirConsigna(p.consigna)
  })
  const activo = etapa === 'muestra'
  // Un solo registro por ensayo aunque lleguen dos toques seguidos
  const respondido = useRef(false)
  const registrarUnaVez = (correcto: boolean, respuesta?: number | number[]) => {
    if (!activo || respondido.current) return
    respondido.current = true
    onRegistrar(correcto, respuesta)
  }
  const tocar = (i: number) => {
    if (!activo || respondido.current) return
    // Respuesta única: el primer toque cierra el ensayo; ordenar, el último
    if (p.respuesta !== 'multiple' && p.respuesta !== 'ordenar') respondido.current = true
    if (p.respuesta === 'ordenar' && seleccion.length + 1 === nOpciones && !seleccion.includes(i)) respondido.current = true
    onTocar(i)
  }

  return (
    <>
      <div className={`flex flex-1 flex-col items-center justify-center gap-[2.5vmin] overflow-hidden px-4 pb-2 ${etapa === 'pausa' ? 'invisible' : ''}`}>
        {(modelos.length > 0 || muestraAuditiva) && (
          <div className="flex flex-wrap items-center justify-center gap-[2.5vmin] rounded-[3vmin] border-2 border-indigo-200 bg-indigo-50/70 px-[3vmin] py-[2.5vmin]">
            {modelos.length > 0 ? (
              modelos.map((m, i) => (
                <span
                  key={i}
                  style={{ width: ladoModelo, height: ladoModelo }}
                  className={`flex items-center justify-center rounded-[2.5vmin] border-2 border-indigo-300 bg-white ${activo ? '' : 'invisible'}`}
                >
                  <Contenido estimulo={m} lado={ladoModelo} imagenes={imagenes} />
                </span>
              ))
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!activo) return
                  desbloquearAudio()
                  void decirConsigna(p.consigna)
                }}
                style={{ width: ladoAudio, height: ladoAudio }}
                className={`flex flex-col items-center justify-center gap-2 rounded-[2.5vmin] border-2 border-indigo-300 bg-white ${activo ? '' : 'invisible'}`}
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
                  key={i}
                  type="button"
                  onClick={() => tocar(i)}
                  style={{ width: ladoOpcion, height: ladoOpcion }}
                  className={`relative flex items-center justify-center rounded-[2.5vmin] border-2 bg-white shadow-sm transition-transform active:scale-[0.98] ${
                    marcada >= 0 ? 'border-indigo-500 ring-4 ring-indigo-200' : 'border-slate-200'
                  }`}
                >
                  <Contenido estimulo={p.opciones![i]} lado={ladoOpcion} imagenes={imagenes} />
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
            onClick={() => registrarUnaVez(esCorrecta(p, seleccion), seleccion)}
            className={`rounded-2xl bg-slate-700 px-10 py-3 text-xl font-bold text-white ${activo ? '' : 'invisible'}`}
          >
            Listo
          </button>
        )}
      </div>

      <div className="flex min-h-12 justify-end gap-2 px-3 pb-2">
        {activo && p.fase === 'enunciado' && <BotonLargo onActivar={onSeguir}>Seguir</BotonLargo>}
        {activo && puntuaEvaluador && (
          <>
            <BotonLargo onActivar={() => registrarUnaVez(true)}>✓ Correcto</BotonLargo>
            <BotonLargo onActivar={() => registrarUnaVez(false)}>✗ Incorrecto</BotonLargo>
          </>
        )}
      </div>
    </>
  )
}

export default function PantallaAlumno({
  codigo,
  pasos,
  alTerminar,
  alCancelar,
  imagenes,
}: {
  codigo: string
  pasos: Paso[]
  alTerminar: (resultado: ResultadoPantalla) => void
  alCancelar: () => void
  // concepto del banco → URL del ejemplar de evaluación
  imagenes: Record<string, string>
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
  const [seleccion, setSeleccion] = useState<number[]>([])
  const [menu, setMenu] = useState(false)
  const [voz, setVoz] = useState(false)
  const [paso, setPaso] = useState(0)
  const cronometro = useCronometroEnsayo(paso)

  const actual = cola[posicion]

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
    if (!actual) return
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
    // El siguiente ensayo empieza con la pausa (Escenario se monta de nuevo)
    avanzar(registrados, fallos)
  }

  const tocar = (indiceOpcion: number) => {
    if (!actual) return
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
  const orden = ordenes[actual.indice] ?? []

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

      <Escenario
        key={paso}
        paso={p}
        orden={orden}
        seleccion={seleccion}
        imagenes={imagenes}
        voz={voz}
        onTocar={tocar}
        onRegistrar={registrar}
        onSeguir={() => avanzar(ensayos, fallosComprobacion)}
        onMuestra={() => cronometro.reiniciar()}
      />

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
            <button
              onClick={() => {
                desbloquearAudio()
                setVoz((v) => !v)
              }}
              className="w-full rounded-lg bg-slate-100 px-3 py-2 text-left"
            >
              Decir la consigna en voz alta: {voz ? 'sí' : 'no'}
            </button>
            <p className="px-1 text-[11px] text-slate-500">
              Suena la grabación de la consigna, igual para todos los alumnos. La voz del dispositivo solo se usa si una consigna no
              está grabada.
            </p>
            <AjustesVoz />
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
