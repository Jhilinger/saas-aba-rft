'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import BotonLargo from '../../../boton-largo'
import { PAUSA_ENTRE_ENSAYOS } from '../../../etapas-ensayo'
import { decirElogio, decirFraseRft, guardarElogios, leerElogios, precargarElogios } from '../../../voz'
import AjustesVoz from '../../../ajustes-voz'
import { NOMBRE_FASE_SECUENCIA, type FaseSecuencia } from '../../../secuencia-rft'
import ContenidoEstimulo from '../../../contenido-estimulo'
import { parsearEstimuloPantalla } from '../../../estimulo-pantalla'
import { presentacionNivel, siguienteNivel } from '../../../sin-error'

// Pantalla del alumno para un bloque RFT en la tableta: la muestra arriba y
// las comparaciones en tarjetas. El toque del alumno registra el ensayo. Las
// ayudas automáticas (de mayor a menor o de menor a mayor) las aplica la
// pantalla según la configuración del programa; el terapeuta da el refuerzo y
// las demás ayudas y las anota con controles que hay que mantener pulsados. Si
// las comparaciones son palabras que el alumno dice (ej. test B→A), la
// pantalla solo muestra la muestra y el terapeuta puntúa.

// pantalla: columna jsonb (texto, figura SVG, n imágenes…); se valida al pintar
export type EstimuloTablet = { id: string; nombre: string; concepto_imagen: string | null; pantalla: unknown }
export type ComparativoTablet = { claseId: string; estimulo: EstimuloTablet; esCorrecto: boolean }
// concepto → ejemplar → URL pública
export type ImagenesBanco = Record<string, Record<string, string>>
// Aprendizaje sin error: opacidad (y tamaño) de los distractores y segundos
// hasta que se resalta la correcta (null = sin ayuda en pantalla)
export type ApoyoTablet = { nombre: string; opacidad: number; tamano: boolean; demora: number | null }

const AYUDAS = [
  { value: 'verbal', label: 'Verbal' },
  { value: 'verbal_parcial', label: 'Verbal parcial' },
  { value: 'gestual', label: 'Gestual' },
  { value: 'visual', label: 'Visual' },
  { value: 'modelado', label: 'Modelado' },
  { value: 'fisica_parcial', label: 'Física parcial' },
  { value: 'fisica_total', label: 'Física total' },
  { value: 'textual', label: 'Textual' },
]

// Nombre entre comillas («"Agua"»): palabra que se dice, no se ve
export function esOido(e: { nombre: string; concepto_imagen: string | null; pantalla: unknown }) {
  return !esVisible(e) && /^["“«].*["”»]$/.test(e.nombre.trim())
}

// Se ve en la pantalla: foto del banco o presentación propia (texto, figura…)
export function esVisible(e: { concepto_imagen: string | null; pantalla: unknown }) {
  return !!e.concepto_imagen || parsearEstimuloPantalla(e.pantalla) !== null
}

export function textoOido(nombre: string) {
  return nombre.trim().replace(/^["“«]|["”»]$/g, '')
}

// Ejemplar de la imagen: en las sondas de generalización, el reservado (3);
// en el resto, alterna los de entrenamiento (1 y 2)
// Foto del banco para un estímulo: siempre la 1 (la que se ve en la ficha de
// la clase), para que el grupo se trabaje solo con sus estímulos; en las sondas
// de generalización, la 3. La variación de ejemplares se diseña con los grupos.
// Excepción por programa (alternar): la 1 y la 2 se alternan por ensayo, como
// múltiples ejemplares del mismo nombre («Vincular Mutuamente … con sus Nombres»)
export function urlImagen(imagenes: ImagenesBanco, concepto: string | null, fase: string, ensayo = 0, alternar = false) {
  if (!concepto) return null
  const ejemplares = imagenes[concepto]
  if (!ejemplares) return null
  if (fase === 'generalizacion') return ejemplares['3'] ?? ejemplares['1'] ?? null
  if (alternar && ensayo % 2 === 1) return ejemplares['2'] ?? ejemplares['1'] ?? null
  return ejemplares['1'] ?? null
}

// Si el programa alterna las fotos 1 y 2 de cada concepto
const AlternarEjemplares = createContext(false)


function lado(n: number, maxVh: number, margenRem = 4) {
  return `min(calc((100vw - ${margenRem}rem) / ${n} - 2.5vmin), ${maxVh}vh)`
}

// Apoyo visual de los programas verbales: todas las fichas iguales (ninguna
// propiedad física da la respuesta) con el nombre debajo, como las monedas
// idénticas de Barnes-Holmes et al. (2004)
function Ficha({ nombre, lado: l }: { nombre: string; lado: string }) {
  return (
    <span className="flex flex-col items-center gap-[1.2vmin]">
      <svg viewBox="0 0 100 100" style={{ width: `calc(${l} * 0.55)`, height: `calc(${l} * 0.55)` }} aria-hidden>
        <circle cx="50" cy="50" r="46" fill="#e0e7ff" stroke="#6366f1" strokeWidth="4" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#a5b4fc" strokeWidth="4" />
      </svg>
      <span className="px-[1vmin] text-center font-semibold leading-tight text-slate-800" style={{ fontSize: `calc(${l} * 0.12)` }}>
        {nombre}
      </span>
    </span>
  )
}

function Tarjeta({
  estimulo,
  url,
  lado: l,
  urlConcepto,
}: {
  estimulo: EstimuloTablet
  url: string | null
  lado: string
  urlConcepto: (concepto: string) => string | null
}) {
  const pantalla = parsearEstimuloPantalla(estimulo.pantalla)
  if (pantalla) return <ContenidoEstimulo estimulo={pantalla} lado={l} urlImagen={urlConcepto} />
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" draggable={false} className="h-[88%] w-[88%] object-contain" />
  }
  return (
    <span className="px-3 text-center font-serif font-bold leading-tight text-slate-800" style={{ fontSize: `calc(${l} * 0.16)` }}>
      {textoOido(estimulo.nombre)}
    </span>
  )
}

type Eleccion = { correcto: boolean; respuesta: string | null; conAyudaPantalla: boolean }

// Respuesta de un ensayo completo. Con ayudas de menor a mayor, un acierto con
// ayuda se registra como error con el nivel alcanzado, junto al resultado del
// ensayo de transferencia
export type RespuestaTablet = Eleccion & {
  nivelAyuda?: number
  transferencia?: { correcto: boolean; respuesta: string | null; latenciaMs: number }
}

// Orden pseudoaleatorio reproducible (qué distractor se quita en cada ensayo)
function hash(valor: string) {
  let h = 2166136261
  for (const caracter of valor) h = Math.imul(h ^ caracter.charCodeAt(0), 16777619)
  return h >>> 0
}

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))
// Pantalla en blanco antes de la muestra tras un acierto con elogio en entrenamiento
const PAUSA_TRAS_ELOGIO = 600
// Presentación secuencial (orden en que aparecen): cada imagen a la vista y la
// pantalla en blanco entre una y otra
const SECUENCIA_VISIBLE = 1500
const SECUENCIA_ENTRE = 1000
// En la corrección del error, con el rótulo debajo, cada imagen se ve más tiempo
const SECUENCIA_VISIBLE_ROTULADA = 2500

// Una presentación del ensayo (se monta de nuevo en cada una): pausa, la
// muestra y en seguida las comparaciones, o al tocar la muestra si hay
// respuesta de observación. Los toques antes de que salgan las opciones no
// cuentan. nivel: ayuda de menor a mayor que se está aplicando (0 = ninguna).
function Presentacion({
  origen,
  comparativos,
  fase,
  ensayo,
  imagenes,
  apoyo,
  observacion,
  nivel,
  consigna,
  sinMuestra: sinMuestraForzada = false,
  seleccionOida = false,
  conTexto = false,
  pausa = PAUSA_ENTRE_ENSAYOS,
  sinVozAutomatica = false,
  sinAudio = false,
  secuencia,
  etiquetasSecuencia,
  hablante = false,
  apoyoVisual = false,
  ordenEsperado,
  onElegir,
  onOpciones,
}: {
  origen: EstimuloTablet
  comparativos: ComparativoTablet[]
  fase: string
  ensayo: number
  imagenes: ImagenesBanco
  apoyo: ApoyoTablet | null
  observacion: boolean
  nivel: number
  // Clave relacional que se dice al aparecer la muestra (si no hay, se dice la muestra oída)
  consigna: string | null
  // Ensayo sin muestra (ej. «¿Cuál es más grande?» en los conceptos generados)
  sinMuestra?: boolean
  // Opciones que son palabras oídas: en vez de puntuar el terapeuta, la
  // tableta las dice una a una y el alumno toca la suya
  seleccionOida?: boolean
  // Clave y opciones oídas también en texto (alumno lector)
  conTexto?: boolean
  // Pausa en blanco antes de la muestra (más corta tras un acierto con elogio)
  pausa?: number
  // Sin voz grabada: la clave no se lee sola al aparecer
  sinVozAutomatica?: boolean
  // Sin audio: nada se lee, ni a petición
  sinAudio?: boolean
  // Imágenes que se presentan de una en una en el centro antes de las opciones
  secuencia?: EstimuloTablet[]
  // Corrección del error: cada imagen de la secuencia con su rótulo («antes», «después»)
  etiquetasSecuencia?: string[]
  // Respuesta de hablante: sin opciones; el alumno responde y el terapeuta puntúa
  hablante?: boolean
  // Fichas iguales con el nombre debajo en vez de botones de texto (programas verbales)
  apoyoVisual?: boolean
  // Respuesta de ordenar: tocar las opciones en este orden (nombres)
  ordenEsperado?: string[]
  onElegir: (e: Eleccion) => void
  // Salen las opciones: desde aquí se mide la latencia
  onOpciones: () => void
}) {
  const muestraOida = esOido(origen)
  const oidasComoOpciones = !hablante && seleccionOida && !muestraOida && comparativos.length > 1 && comparativos.every((c) => esOido(c.estimulo))
  const respuestaOral = hablante || (!oidasComoOpciones && comparativos.some((c) => esOido(c.estimulo)))
  // Respuesta esperada (hablante): oculta, se ve manteniendo pulsado
  const [verEsperada, setVerEsperada] = useState(false)
  const esperada = ordenEsperado ? ordenEsperado.join(' → ') : comparativos.find((c) => c.esCorrecto)?.estimulo.nombre
  // Ordenar: lo que el alumno ha tocado, en orden; al tocar el último se registra
  const [tocadas, setTocadas] = useState<string[]>([])
  const tocarEnOrden = (nombre: string) => {
    if (!ordenEsperado || tocadas.includes(nombre)) return
    const lista = [...tocadas, nombre]
    setTocadas(lista)
    if (lista.length === ordenEsperado.length) {
      const bien = lista.every((n, i) => n.trim().toLowerCase() === ordenEsperado[i].trim().toLowerCase())
      onElegir({ correcto: bien, respuesta: lista.join(' → '), conAyudaPantalla: false })
    }
  }
  // Test de transformación de funciones: sin muestra (se retiran los A); solo
  // las opciones y la pregunta
  const sinMuestra = sinMuestraForzada || (fase === 'transformacion_funciones' && !respuestaOral)
  const [conMuestra, setConMuestra] = useState(false)
  const [observada, setObservada] = useState(false)
  const conOpciones = conMuestra && (respuestaOral || sinMuestra || !observacion || observada)
  // Palabras oídas como opciones: se dicen una a una (iluminando su tarjeta)
  // tras la clave; se puede responder cuando han sonado todas
  const [sonando, setSonando] = useState<number | null>(null)
  const [oidasListas, setOidasListas] = useState(false)
  // Cada lectura de las opciones invalida la anterior (ensayo nuevo o «repetir»)
  const lecturaOidas = useRef(0)
  // Fin de la clave en curso: las opciones esperan a que termine
  const finClave = useRef<Promise<void>>(Promise.resolve())
  const decirOpciones = async () => {
    if (sinAudio) return
    const lectura = ++lecturaOidas.current
    const sigue = () => lectura === lecturaOidas.current
    await finClave.current
    await esperar(400)
    for (let i = 0; i < comparativos.length && sigue(); i++) {
      setSonando(i)
      await decirFraseRft(textoOido(comparativos[i].estimulo.nombre).toLowerCase())
      await esperar(500)
    }
    if (!sigue()) return
    setSonando(null)
    setOidasListas(true)
  }
  // Presentación en texto (programas verbales con el texto activado): la frase
  // grande y las opciones como botones de texto, que se pueden tocar en cuanto
  // aparecen. No suena nada solo: lo lee el alumno o el terapeuta; «🔊 Escuchar»
  // lee la frase y las opciones a petición
  const modoTexto = oidasComoOpciones && conTexto
  const listo = conOpciones && (!oidasComoOpciones || modoTexto || sinVozAutomatica || sinAudio || oidasListas)
  // La tarjeta de la clave se ilumina mientras suena, como las opciones
  const [claveSonando, setClaveSonando] = useState(false)
  const lecturaClave = useRef(0)
  const textoClave = consigna ?? (muestraOida ? textoOido(origen.nombre) : null)
  const hablar = () => {
    const texto = textoClave
    if (!texto || sinAudio) return
    const lectura = ++lecturaClave.current
    // Fuera del render del efecto que la llama
    void Promise.resolve().then(() => lectura === lecturaClave.current && setClaveSonando(true))
    finClave.current = decirFraseRft(texto).then(() => {
      if (lectura === lecturaClave.current) setClaveSonando(false)
    })
  }

  // Repetir: toda la secuencia, la clave y después las opciones oídas
  const repetirSecuencia = () => {
    if (!conOpciones) return
    hablar()
    void decirOpciones()
  }

  // Presentación secuencial: null = no hay o ya terminó; -1 = pantalla en blanco
  const [paso, setPaso] = useState<number | null>(secuencia?.length ? -1 : null)
  useEffect(() => {
    if (secuencia?.length) {
      const tiempos: number[] = []
      let t = pausa
      secuencia.forEach((_, i) => {
        tiempos.push(window.setTimeout(() => setPaso(i), t))
        t += etiquetasSecuencia ? SECUENCIA_VISIBLE_ROTULADA : SECUENCIA_VISIBLE
        tiempos.push(window.setTimeout(() => setPaso(-1), t))
        t += SECUENCIA_ENTRE
      })
      tiempos.push(
        window.setTimeout(() => {
          setPaso(null)
          setConMuestra(true)
        }, t)
      )
      return () => tiempos.forEach((x) => clearTimeout(x))
    }
    const t = setTimeout(() => setConMuestra(true), pausa)
    return () => clearTimeout(t)
    // Solo al montarse el ensayo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (conMuestra && !sinVozAutomatica && !modoTexto) hablar()
    // Solo al aparecer la muestra
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conMuestra])
  // Después del efecto anterior (mismo orden en el código), para que la
  // clave ya haya empezado y las palabras esperen a que termine
  useEffect(() => {
    if (conOpciones && oidasComoOpciones && !modoTexto && !sinVozAutomatica) void decirOpciones()
    return () => {
      lecturaOidas.current++
    }
    // Solo al salir las opciones
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conOpciones])
  useEffect(() => {
    if (listo) onOpciones()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo])
  // Ayuda de menor a mayor: en cada nivel se repite la muestra
  useEffect(() => {
    if (nivel > 0) hablar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nivel])

  // Ayuda con demora (mayor a menor): la correcta se resalta pasada la demora
  const demora = apoyo?.demora ?? null
  const [resaltadaPorDemora, setResaltadaPorDemora] = useState(false)
  useEffect(() => {
    if (!listo || demora === null) return
    const t = setTimeout(() => setResaltadaPorDemora(true), demora * 1000)
    return () => clearTimeout(t)
  }, [listo, demora])

  const distractores = comparativos
    .filter((c) => !c.esCorrecto)
    .sort((a, b) => hash(`${ensayo}-${a.claseId}`) - hash(`${ensayo}-${b.claseId}`))
  const presentacion = presentacionNivel(nivel, distractores.length)
  const visibles = new Set(distractores.slice(0, presentacion.distractoresVisibles).map((c) => c.claseId))
  const resaltada = resaltadaPorDemora || presentacion.resaltar
  const estiloDistractor = (c: ComparativoTablet) => {
    if (c.esCorrecto) return undefined
    const opacidad = Math.min(apoyo?.opacidad ?? 1, presentacion.opacidad)
    if (opacidad >= 1) return undefined
    return { opacity: opacidad, transform: apoyo?.tamano ? `scale(${0.4 + 0.6 * opacidad})` : undefined }
  }

  // La muestra se presenta exactamente igual que las comparaciones: mismo
  // tamaño y misma tarjeta (solo cambia el sitio, arriba)
  const ladoOpcion = lado(Math.max(comparativos.length, 2), 34)
  const ladoMuestra = ladoOpcion
  const ladoAudio = ladoOpcion
  const alternar = useContext(AlternarEjemplares)
  const urlMuestra = urlImagen(imagenes, origen.concepto_imagen, fase, ensayo, alternar)
  const urlConcepto = (concepto: string) => urlImagen(imagenes, concepto, fase, ensayo, alternar)
  const tocarMuestra = () => {
    if (!conMuestra) return
    hablar()
    setObservada(true)
  }
  // Ámbar y latiendo cuando se repite la muestra como ayuda
  const marcoMuestra = nivel > 0 ? 'animate-pulse border-amber-400' : 'border-slate-200'

  if (paso !== null && secuencia) {
    const ladoSecuencia = lado(2, 40)
    const actual = paso >= 0 ? secuencia[paso] : null
    const etiqueta = paso !== null && paso >= 0 ? etiquetasSecuencia?.[paso] : undefined
    return (
      <>
        <div className="flex flex-1 flex-col items-center justify-center gap-[2vmin] px-4 pb-2">
          {actual && (
            <div style={{ width: ladoSecuencia, height: ladoSecuencia }} className="flex items-center justify-center rounded-[2.5vmin] border-2 border-slate-200 bg-white shadow-sm">
              <Tarjeta estimulo={actual} url={urlImagen(imagenes, actual.concepto_imagen, fase, ensayo, alternar)} lado={ladoSecuencia} urlConcepto={urlConcepto} />
            </div>
          )}
          {actual && etiqueta && (
            <p className="rounded-full bg-amber-100 px-[3vmin] py-[1vmin] font-bold text-amber-800" style={{ fontSize: '5vmin' }}>
              {etiqueta}
            </p>
          )}
        </div>
        <div className="min-h-12 px-3 pb-2" />
      </>
    )
  }

  if (modoTexto) {
    return (
      <>
        <div className={`flex flex-1 flex-col items-center justify-center gap-[4vmin] overflow-y-auto px-4 pb-2 ${conMuestra ? '' : 'invisible'}`}>
          <div
            className={`w-full max-w-[92vw] rounded-[2.5vmin] border-2 bg-white px-[4vmin] py-[3vmin] shadow-sm ${
              nivel > 0 ? 'animate-pulse border-amber-400' : claveSonando ? 'border-indigo-400 ring-[1vmin] ring-indigo-200' : 'border-slate-200'
            }`}
          >
            <p className="text-center font-medium leading-snug text-slate-800" style={{ fontSize: '5vmin' }}>
              {textoClave ?? textoOido(origen.nombre)}
            </p>
          </div>
          <div className={`flex w-full max-w-[92vw] flex-wrap justify-center gap-[2.5vmin] ${conOpciones ? '' : 'invisible'}`}>
            {comparativos.map((c, i) => {
              const oculta = !c.esCorrecto && !visibles.has(c.claseId)
              return (
                <button
                  key={c.claseId}
                  type="button"
                  disabled={oculta}
                  onClick={() =>
                    listo &&
                    (ordenEsperado
                      ? tocarEnOrden(textoOido(c.estimulo.nombre))
                      : onElegir({ correcto: c.esCorrecto, respuesta: textoOido(c.estimulo.nombre), conAyudaPantalla: resaltadaPorDemora }))
                  }
                  style={apoyoVisual ? { width: ladoOpcion, height: ladoOpcion, ...estiloDistractor(c) } : { fontSize: '5vmin', ...estiloDistractor(c) }}
                  className={`${apoyoVisual ? 'flex items-center justify-center' : 'min-w-[26vw] px-[4vmin] py-[3vmin]'} rounded-[2.5vmin] border-2 bg-white font-semibold leading-tight text-slate-800 shadow-sm transition-transform active:scale-[0.98] ${
                    oculta ? 'invisible' : ''
                  } ${
                    resaltada && c.esCorrecto
                      ? 'animate-pulse border-amber-400 ring-[1vmin] ring-amber-300'
                      : sonando === i
                        ? 'border-indigo-400 ring-[1vmin] ring-indigo-200'
                        : 'border-slate-200'
                  }`}
                >
                  {ordenEsperado && tocadas.includes(textoOido(c.estimulo.nombre)) && (
                    <span className="mr-[1.5vmin] inline-flex h-[6vmin] w-[6vmin] items-center justify-center rounded-full bg-indigo-600 align-middle text-[3.5vmin] font-bold text-white">
                      {tocadas.indexOf(textoOido(c.estimulo.nombre)) + 1}
                    </span>
                  )}
                  {apoyoVisual ? <Ficha nombre={textoOido(c.estimulo.nombre)} lado={ladoOpcion} /> : textoOido(c.estimulo.nombre)}
                </button>
              )
            })}
          </div>
          {!sinAudio && (
            <button
              type="button"
              onClick={repetirSecuencia}
              className={`rounded-full border border-slate-200 px-[3vmin] py-[1vmin] text-[2.6vmin] text-slate-500 ${conOpciones ? '' : 'invisible'}`}
            >
              🔊 Escuchar
            </button>
          )}
        </div>
        <div className="flex min-h-12 justify-end gap-2 px-3 pb-2" />
      </>
    )
  }

  return (
    <>
      <div className={`flex flex-1 flex-col items-center justify-center gap-[5vmin] overflow-hidden px-4 pb-2 ${conMuestra ? '' : 'invisible'}`}>
        <div className="flex flex-col items-center justify-center gap-[2vmin]">
          {(sinMuestra || muestraOida) && sinAudio ? null : sinMuestra || muestraOida ? (
            // Clave (o muestra oída): la misma tarjeta 🔊 que las opciones oídas
            <button
              type="button"
              onClick={oidasComoOpciones ? repetirSecuencia : sinMuestra ? hablar : tocarMuestra}
              style={{ width: ladoAudio, height: ladoAudio }}
              className={`flex items-center justify-center rounded-[2.5vmin] border-2 bg-white shadow-sm transition-transform active:scale-[0.98] ${
                nivel > 0 ? 'animate-pulse border-amber-400' : claveSonando ? 'border-indigo-400 ring-[1vmin] ring-indigo-200' : 'border-slate-200'
              }`}
              aria-label="Escuchar de nuevo"
            >
              <span className="leading-none" style={{ fontSize: `calc(${ladoAudio} * 0.38)` }}>
                🔊
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={tocarMuestra}
              style={{ width: ladoMuestra, height: ladoMuestra }}
              className={`flex items-center justify-center rounded-[2.5vmin] border-2 bg-white shadow-sm ${marcoMuestra}`}
            >
              <Tarjeta estimulo={origen} url={urlMuestra} lado={ladoMuestra} urlConcepto={urlConcepto} />
            </button>
          )}
          {/* Alumno lector: la clave también escrita, a la vista todo el ensayo */}
          {conTexto && textoClave && (
            <p className="max-w-[80vw] text-center font-medium leading-snug text-slate-800" style={{ fontSize: hablante ? '5vmin' : '3.6vmin' }}>
              {textoClave}
            </p>
          )}
          {/* Hablante con apoyo visual: las fichas a la vista para señalarlas y nombrarlas */}
          {hablante && apoyoVisual && (
            <div className="flex flex-wrap justify-center gap-[2.5vmin] pt-[2vmin]">
              {comparativos.map((c) => (
                <span key={c.claseId} style={{ width: ladoOpcion, height: ladoOpcion }} className="flex items-center justify-center rounded-[2.5vmin] border-2 border-slate-200 bg-white">
                  <Ficha nombre={textoOido(c.estimulo.nombre)} lado={ladoOpcion} />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Las opciones ocupan su sitio desde el principio para que nada se mueva */}
        {!respuestaOral && (
          <div className={`flex flex-col items-center gap-[2.5vmin] ${conOpciones ? '' : 'invisible'}`}>
            <div className="flex flex-wrap justify-center gap-[2.5vmin]">
              {comparativos.map((c, i) => {
                const oculta = !c.esCorrecto && !visibles.has(c.claseId)
                return (
                  <button
                    key={c.claseId}
                    type="button"
                    disabled={oculta}
                    onClick={() =>
                      listo &&
                      (ordenEsperado
                        ? tocarEnOrden(textoOido(c.estimulo.nombre))
                        : onElegir({ correcto: c.esCorrecto, respuesta: textoOido(c.estimulo.nombre), conAyudaPantalla: resaltadaPorDemora }))
                    }
                    style={{ width: ladoOpcion, height: ladoOpcion, ...estiloDistractor(c) }}
                    className={`relative flex items-center justify-center rounded-[2.5vmin] border-2 bg-white shadow-sm transition-transform active:scale-[0.98] ${
                      oculta ? 'invisible' : ''
                    } ${
                      resaltada && c.esCorrecto
                        ? 'animate-pulse border-amber-400 ring-[1vmin] ring-amber-300'
                        : sonando === i
                          ? 'border-indigo-400 ring-[1vmin] ring-indigo-200'
                          : 'border-slate-200'
                    }`}
                  >
                    {ordenEsperado && tocadas.includes(textoOido(c.estimulo.nombre)) && (
                      <span className="absolute left-[1vmin] top-[1vmin] inline-flex h-[6vmin] w-[6vmin] items-center justify-center rounded-full bg-indigo-600 text-[3.5vmin] font-bold text-white">
                        {tocadas.indexOf(textoOido(c.estimulo.nombre)) + 1}
                      </span>
                    )}
                    {oidasComoOpciones ? (
                      <span className="flex flex-col items-center gap-[1vmin]">
                        <span className="leading-none" style={{ fontSize: `calc(${ladoOpcion} * ${conTexto ? 0.28 : 0.38})` }}>
                          🔊
                        </span>
                        {conTexto && (
                          <span className="px-[1vmin] text-center font-medium leading-tight text-slate-800" style={{ fontSize: `calc(${ladoOpcion} * 0.11)` }}>
                            {textoOido(c.estimulo.nombre)}
                          </span>
                        )}
                      </span>
                    ) : (
                      <Tarjeta
                        estimulo={c.estimulo}
                        url={urlImagen(imagenes, c.estimulo.concepto_imagen, fase, ensayo, alternar)}
                        lado={ladoOpcion}
                        urlConcepto={urlConcepto}
                      />
                    )}
                  </button>
                )
              })}
            </div>
            {oidasComoOpciones && (
              <button
                type="button"
                onClick={repetirSecuencia}
                className={`rounded-full border border-slate-200 px-[3vmin] py-[1vmin] text-[2.2vmin] text-slate-500 ${listo ? '' : 'invisible'}`}
              >
                🔁 Repetir
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex min-h-12 justify-end gap-2 px-3 pb-2">
        {respuestaOral && conMuestra && (
          <>
            {hablante && esperada && (
              <button
                type="button"
                onPointerDown={() => setVerEsperada(true)}
                onPointerUp={() => setVerEsperada(false)}
                onPointerLeave={() => setVerEsperada(false)}
                onPointerCancel={() => setVerEsperada(false)}
                onContextMenu={(e) => e.preventDefault()}
                className="mr-auto rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm text-slate-500 [touch-action:none]"
              >
                {verEsperada ? <span className="font-semibold text-slate-800">{textoOido(esperada)}</span> : '👁 Respuesta (mantener pulsado)'}
              </button>
            )}
            <BotonLargo onActivar={() => onElegir({ correcto: true, respuesta: null, conAyudaPantalla: false })}>✓ Correcto</BotonLargo>
            <BotonLargo onActivar={() => onElegir({ correcto: false, respuesta: null, conAyudaPantalla: false })}>✗ Incorrecto</BotonLargo>
          </>
        )}
      </div>
    </>
  )
}

// Tras un acierto en entrenamiento, la muestra y la opción elegida siguen a la
// vista (resaltada en verde) mientras suena el elogio, para que el refuerzo
// llegue contiguo a la relación; las demás opciones desaparecen sin mover nada
function Retroalimentacion({
  origen,
  comparativos,
  fase,
  ensayo,
  imagenes,
  consigna,
  sinMuestra: sinMuestraForzada,
  conTexto,
}: {
  origen: EstimuloTablet
  comparativos: ComparativoTablet[]
  fase: string
  ensayo: number
  imagenes: ImagenesBanco
  consigna: string | null
  sinMuestra: boolean
  conTexto: boolean
}) {
  const muestraOida = esOido(origen)
  const oidas = comparativos.length > 1 && comparativos.every((c) => esOido(c.estimulo))
  const respuestaOral = !oidas && comparativos.some((c) => esOido(c.estimulo))
  const sinMuestra = sinMuestraForzada || (fase === 'transformacion_funciones' && !respuestaOral)
  const ladoOpcion = lado(Math.max(comparativos.length, 2), 34)
  const alternar = useContext(AlternarEjemplares)
  const urlConcepto = (concepto: string) => urlImagen(imagenes, concepto, fase, ensayo, alternar)
  const textoClave = consigna ?? (muestraOida ? textoOido(origen.nombre) : null)
  if (oidas && conTexto) {
    return (
      <>
        <div className="flex flex-1 flex-col items-center justify-center gap-[4vmin] overflow-y-auto px-4 pb-2">
          <div className="w-full max-w-[92vw] rounded-[2.5vmin] border-2 border-slate-200 bg-white px-[4vmin] py-[3vmin] shadow-sm">
            <p className="text-center font-medium leading-snug text-slate-800" style={{ fontSize: '5vmin' }}>
              {textoClave ?? textoOido(origen.nombre)}
            </p>
          </div>
          <div className="flex w-full max-w-[92vw] flex-wrap justify-center gap-[2.5vmin]">
            {comparativos.map((c) => (
              <div
                key={c.claseId}
                style={{ fontSize: '5vmin' }}
                className={`min-w-[26vw] rounded-[2.5vmin] border-2 bg-white px-[4vmin] py-[3vmin] text-center font-semibold leading-tight text-slate-800 shadow-sm ${
                  c.esCorrecto ? 'border-emerald-500 ring-[1vmin] ring-emerald-300' : 'invisible'
                }`}
              >
                {textoOido(c.estimulo.nombre)}
              </div>
            ))}
          </div>
          <span className="rounded-full px-[3vmin] py-[1vmin] text-[2.6vmin] invisible">🔊 Escuchar</span>
        </div>
        <div className="min-h-12 px-3 pb-2" />
      </>
    )
  }
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-[5vmin] overflow-hidden px-4 pb-2">
        <div className="flex flex-col items-center justify-center gap-[2vmin]">
          <div
            style={{ width: ladoOpcion, height: ladoOpcion }}
            className="flex items-center justify-center rounded-[2.5vmin] border-2 border-slate-200 bg-white shadow-sm"
          >
            {sinMuestra || muestraOida ? (
              <span className="leading-none" style={{ fontSize: `calc(${ladoOpcion} * 0.38)` }}>
                🔊
              </span>
            ) : (
              <Tarjeta estimulo={origen} url={urlImagen(imagenes, origen.concepto_imagen, fase, ensayo, alternar)} lado={ladoOpcion} urlConcepto={urlConcepto} />
            )}
          </div>
          {conTexto && textoClave && (
            <p className="max-w-[80vw] text-center font-medium leading-snug text-slate-800" style={{ fontSize: '3.6vmin' }}>
              {textoClave}
            </p>
          )}
        </div>
        {!respuestaOral && (
          <div className="flex flex-wrap justify-center gap-[2.5vmin]">
            {comparativos.map((c) => (
              <div
                key={c.claseId}
                style={{ width: ladoOpcion, height: ladoOpcion }}
                className={`flex items-center justify-center rounded-[2.5vmin] border-2 bg-white shadow-sm ${
                  c.esCorrecto ? 'border-emerald-500 ring-[1vmin] ring-emerald-300' : 'invisible'
                }`}
              >
                {oidas ? (
                  <span className="flex flex-col items-center gap-[1vmin]">
                    <span className="leading-none" style={{ fontSize: `calc(${ladoOpcion} * ${conTexto ? 0.28 : 0.38})` }}>
                      🔊
                    </span>
                    {conTexto && (
                      <span className="px-[1vmin] text-center font-medium leading-tight text-slate-800" style={{ fontSize: `calc(${ladoOpcion} * 0.11)` }}>
                        {textoOido(c.estimulo.nombre)}
                      </span>
                    )}
                  </span>
                ) : (
                  <Tarjeta
                    estimulo={c.estimulo}
                    url={urlImagen(imagenes, c.estimulo.concepto_imagen, fase, ensayo, alternar)}
                    lado={ladoOpcion}
                    urlConcepto={urlConcepto}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="min-h-12 px-3 pb-2" />
    </>
  )
}

// Un ensayo (se monta de nuevo en cada uno). Con ayudas de menor a mayor,
// cada error sube un nivel de ayuda sobre la misma presentación; un acierto con
// ayuda da paso al ensayo de transferencia (el mismo, sin ayuda), que no escala.
// Con corrección del error (entrenamiento sin ayudas de menor a mayor): tras un
// error se modela la respuesta (la secuencia otra vez con sus rótulos y solo la
// correcta, resaltada) y se repite el ensayo sin ayuda. El ensayo cuenta como
// error; la repetición se guarda como ensayo de transferencia (Barry, Neufeld y
// Stewart, 2024; Rodgers e Iwata, 1991).
function EnsayoTablet({
  origen,
  comparativos,
  fase,
  ensayo,
  imagenes,
  apoyo,
  observacion,
  menorAMayor,
  consigna,
  sinMuestra,
  seleccionOida,
  conTexto,
  pausa,
  sinVozAutomatica,
  sinAudio,
  secuencia,
  correccion,
  etiquetasSecuencia,
  hablante,
  apoyoVisual,
  ordenEsperado,
  onResponder,
  onMuestra,
  onPrimeraRespuesta,
}: {
  origen: EstimuloTablet
  comparativos: ComparativoTablet[]
  fase: string
  ensayo: number
  imagenes: ImagenesBanco
  apoyo: ApoyoTablet | null
  observacion: boolean
  menorAMayor: boolean
  consigna: string | null
  sinMuestra: boolean
  seleccionOida: boolean
  conTexto: boolean
  pausa: number
  sinVozAutomatica: boolean
  sinAudio: boolean
  secuencia?: EstimuloTablet[]
  correccion: boolean
  etiquetasSecuencia?: string[]
  hablante: boolean
  apoyoVisual: boolean
  ordenEsperado?: string[]
  onResponder: (r: RespuestaTablet) => void
  onMuestra: () => void
  onPrimeraRespuesta: () => void
}) {
  const [nivel, setNivel] = useState(0)
  const [transferencia, setTransferencia] = useState(false)
  const [modelo, setModelo] = useState(false)
  const primera = useRef<string | null>(null)
  const inicioTransferencia = useRef(0)
  const nDistractores = comparativos.filter((c) => !c.esCorrecto).length

  const elegir = (e: Eleccion) => {
    if (transferencia) {
      onResponder({
        correcto: false,
        respuesta: primera.current,
        conAyudaPantalla: false,
        nivelAyuda: menorAMayor ? nivel : undefined,
        transferencia: { correcto: e.correcto, respuesta: e.respuesta, latenciaMs: Date.now() - inicioTransferencia.current },
      })
      return
    }
    // Modelo de la corrección: solo está la correcta; al tocarla, se repite el ensayo
    if (modelo) {
      if (!e.correcto) return
      setModelo(false)
      setTransferencia(true)
      return
    }
    if (nivel === 0) onPrimeraRespuesta()
    if (!menorAMayor && !e.correcto && correccion) {
      primera.current = e.respuesta
      setModelo(true)
      return
    }
    if (!menorAMayor || (e.correcto && nivel === 0)) {
      onResponder(e)
      return
    }
    if (e.correcto) {
      setTransferencia(true)
      return
    }
    if (nivel === 0) primera.current = e.respuesta
    setNivel(siguienteNivel(nivel, nDistractores))
  }

  return (
    <Presentacion
      key={transferencia ? 'transferencia' : modelo ? 'modelo' : 'ensayo'}
      origen={origen}
      comparativos={comparativos}
      fase={fase}
      ensayo={ensayo}
      imagenes={imagenes}
      apoyo={transferencia ? null : apoyo}
      observacion={observacion}
      nivel={transferencia ? 0 : modelo ? 5 : nivel}
      consigna={consigna}
      sinMuestra={sinMuestra}
      seleccionOida={seleccionOida}
      conTexto={conTexto}
      pausa={transferencia ? PAUSA_ENTRE_ENSAYOS : pausa}
      sinVozAutomatica={sinVozAutomatica}
      sinAudio={sinAudio}
      secuencia={modelo || (correccion && transferencia) ? secuencia : transferencia || nivel > 0 ? undefined : secuencia}
      etiquetasSecuencia={modelo ? etiquetasSecuencia : undefined}
      hablante={hablante}
      apoyoVisual={apoyoVisual}
      ordenEsperado={ordenEsperado}
      onElegir={elegir}
      onOpciones={
        modelo
          ? () => {}
          : transferencia
          ? () => {
              inicioTransferencia.current = Date.now()
            }
          : onMuestra
      }
    />
  )
}

export default function PantallaTablet({
  origen,
  comparativos,
  fase,
  ensayo,
  total,
  imagenes,
  apoyo = null,
  observacion = false,
  menorAMayor = false,
  consigna = null,
  sinMuestra = false,
  seleccionOida = false,
  conTexto = false,
  infantil = false,
  alternarEjemplares = false,
  sinVozAutomatica = false,
  sinAudio = false,
  secuencia,
  correccion = false,
  etiquetasSecuencia,
  hablante = false,
  apoyoVisual = false,
  ordenEsperado,
  onResponder,
  onMuestra,
  onPrimeraRespuesta,
  onSalir,
}: {
  origen: EstimuloTablet
  comparativos: ComparativoTablet[]
  fase: string
  ensayo: number
  total: number
  imagenes: ImagenesBanco
  apoyo?: ApoyoTablet | null
  // Respuesta de observación y ayudas de menor a mayor dentro del ensayo
  observacion?: boolean
  menorAMayor?: boolean
  consigna?: string | null
  sinMuestra?: boolean
  // Tests con respuesta oral por selección entre palabras oídas
  seleccionOida?: boolean
  // Clave y opciones oídas también en texto (alumno lector)
  conTexto?: boolean
  // App infantil (familias y escuelas): sin los controles del terapeuta; solo
  // una salida que hay que mantener pulsada
  infantil?: boolean
  // Alternar las fotos 1 y 2 de cada concepto entre ensayos (opción del programa)
  alternarEjemplares?: boolean
  // Clase sin voz grabada (generada): no se lee sola; «🔊 Escuchar» la lee con la voz del dispositivo
  sinVozAutomatica?: boolean
  // Programa sin audio: nada se lee (ni a petición); solo suena el elogio
  sinAudio?: boolean
  // Imágenes que se presentan de una en una antes de las opciones (orden en que aparecen)
  secuencia?: EstimuloTablet[]
  // Corrección del error en entrenamiento (modelo y repetición sin ayuda)
  correccion?: boolean
  // Rótulos de la secuencia al corregir («antes», «después»)
  etiquetasSecuencia?: string[]
  // Respuesta de hablante: sin opciones; el terapeuta puntúa (respuesta esperada oculta)
  hablante?: boolean
  // Fichas iguales con el nombre debajo (apoyo visual de los programas verbales)
  apoyoVisual?: boolean
  // Respuesta de ordenar: tocar las opciones en este orden
  ordenEsperado?: string[]
  onResponder: (correcto: boolean, ayuda: string, respuesta: string | null, extra: Pick<RespuestaTablet, 'nivelAyuda' | 'transferencia'>) => void
  // Salen las opciones: desde aquí se mide la latencia
  onMuestra: () => void
  // Primera respuesta del alumno (fija la latencia aunque luego haya ayudas)
  onPrimeraRespuesta: () => void
  onSalir: () => void
}) {
  const [ayuda, setAyuda] = useState<string | null>(null)
  const [menuAyuda, setMenuAyuda] = useState(false)
  const [menuVoz, setMenuVoz] = useState(false)
  // Elogio hablado («¡Muy bien!») al acertar en entrenamiento; en la app
  // infantil lo dice la propia sesión
  const [elogios, setElogios] = useState(leerElogios)
  useEffect(() => {
    precargarElogios()
  }, [])

  // Acierto en entrenamiento: se congela el ensayo (muestra y opción correcta)
  // mientras suena el elogio; el ensayo siguiente empieza al terminar. La
  // respuesta se registra en el momento del toque (la latencia no cambia)
  const [retro, setRetro] = useState<{ origen: EstimuloTablet; comparativos: ComparativoTablet[]; consigna: string | null; ensayo: number } | null>(null)

  // Pausa antes de la muestra siguiente: más corta tras un acierto en
  // entrenamiento, porque el elogio ya separa los ensayos (intervalos cortos
  // tras el reforzador aceleran la adquisición; Koegel, Dunlap y Dyer, 1980).
  // Tras un error y en los tests, la de siempre (igual aciertes o falles)
  const [pausaSiguiente, setPausaSiguiente] = useState(PAUSA_ENTRE_ENSAYOS)

  const responder = ({ correcto, respuesta, conAyudaPantalla, nivelAyuda, transferencia }: RespuestaTablet) => {
    setPausaSiguiente(!infantil && correcto && fase === 'entrenamiento' ? PAUSA_TRAS_ELOGIO : PAUSA_ENTRE_ENSAYOS)
    // La ayuda anotada solo cuenta en un acierto (un error se registra sin ayuda);
    // un acierto después de resaltarse la correcta es un acierto con ayuda visual
    const registrar = () =>
      onResponder(correcto, !correcto ? 'independiente' : (ayuda ?? (conAyudaPantalla ? 'visual' : 'independiente')), respuesta, {
        nivelAyuda,
        transferencia,
      })
    setAyuda(null)
    if (!infantil && correcto && fase === 'entrenamiento') {
      setRetro({ origen, comparativos, consigna, ensayo })
      const fin = elogios ? Promise.all([decirElogio(), esperar(900)]) : esperar(900)
      // En el último ensayo del bloque, el registro (que cierra la tableta y
      // pasa a los resultados) espera a que termine el elogio. La latencia ya
      // quedó fijada en el primer toque
      const ultimo = ensayo >= total - 1
      void fin.then(() => {
        if (ultimo) registrar()
        else setRetro(null)
      })
      if (ultimo) return
    }
    registrar()
  }

  return (
    <AlternarEjemplares.Provider value={alternarEjemplares}>
    <div className="fixed inset-0 z-50 flex select-none flex-col bg-white">
      {infantil ? (
        <div className="flex justify-end px-3 pt-2">
          <BotonLargo onActivar={onSalir} className="border border-slate-200 !bg-transparent text-slate-300">
            ✕
          </BotonLargo>
        </div>
      ) : (
      <div className="flex items-start justify-between gap-2 px-3 pt-2">
        <p className="text-[11px] text-slate-300">
          {NOMBRE_FASE_SECUENCIA[fase as FaseSecuencia] ?? (fase === 'generalizacion' ? 'Sonda de generalización' : fase === 'mantenimiento' ? 'Sonda de mantenimiento' : fase)} ·{' '}
          {ensayo + 1}/{total}
          {apoyo && <span className="ml-2">· {apoyo.nombre}</span>}
          {ayuda && <span className="ml-2 font-semibold text-amber-500">ayuda: {AYUDAS.find((a) => a.value === ayuda)?.label}</span>}
        </p>
        <span className="flex gap-2">
          <BotonLargo onActivar={() => setMenuAyuda(true)} className="border border-slate-200 !bg-transparent">
            Ayuda
          </BotonLargo>
          <BotonLargo onActivar={() => setMenuVoz(true)} className="border border-slate-200 !bg-transparent">
            Voz
          </BotonLargo>
          <BotonLargo onActivar={onSalir} className="border border-slate-200 !bg-transparent">
            Salir
          </BotonLargo>
        </span>
      </div>
      )}

      {retro ? (
        <Retroalimentacion
          origen={retro.origen}
          comparativos={retro.comparativos}
          fase={fase}
          ensayo={retro.ensayo}
          imagenes={imagenes}
          consigna={retro.consigna}
          sinMuestra={sinMuestra}
          conTexto={conTexto}
        />
      ) : (
      <EnsayoTablet
        key={ensayo}
        origen={origen}
        comparativos={comparativos}
        fase={fase}
        ensayo={ensayo}
        imagenes={imagenes}
        apoyo={apoyo}
        observacion={observacion}
        menorAMayor={menorAMayor && !hablante && !ordenEsperado}
        consigna={consigna}
        sinMuestra={sinMuestra}
        seleccionOida={seleccionOida}
        conTexto={conTexto}
        pausa={pausaSiguiente}
        sinVozAutomatica={sinVozAutomatica}
        sinAudio={sinAudio}
        secuencia={secuencia}
        correccion={correccion && fase === 'entrenamiento' && !menorAMayor && !hablante}
        etiquetasSecuencia={etiquetasSecuencia}
        hablante={hablante}
        apoyoVisual={apoyoVisual}
        ordenEsperado={ordenEsperado}
        onResponder={responder}
        onMuestra={onMuestra}
        onPrimeraRespuesta={onPrimeraRespuesta}
      />
      )}

      {menuVoz && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm space-y-2 rounded-2xl bg-white p-4 text-sm">
            <AjustesVoz />
            {!infantil && (
              <label className="flex items-center gap-2 text-slate-700">
                <input
                  type="checkbox"
                  checked={elogios}
                  onChange={(e) => {
                    setElogios(e.target.checked)
                    guardarElogios(e.target.checked)
                  }}
                  className="h-4 w-4"
                />
                Elogio hablado al acertar en entrenamiento («¡Muy bien!»)
              </label>
            )}
            <button onClick={() => setMenuVoz(false)} className="w-full rounded-lg px-3 py-2 text-slate-500">
              Volver
            </button>
          </div>
        </div>
      )}

      {menuAyuda && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm space-y-2 rounded-2xl bg-white p-4 text-sm">
            <p className="font-semibold text-slate-800">Ayuda en este ensayo</p>
            <p className="text-xs text-slate-500">Se anota en la siguiente respuesta correcta.</p>
            <div className="grid grid-cols-2 gap-2">
              {AYUDAS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => {
                    setAyuda(a.value)
                    setMenuAyuda(false)
                  }}
                  className={`rounded-lg px-3 py-2 text-left ${ayuda === a.value ? 'bg-amber-100 text-amber-800' : 'bg-slate-100'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setAyuda(null)
                setMenuAyuda(false)
              }}
              className="w-full rounded-lg px-3 py-2 text-slate-500"
            >
              Sin ayuda
            </button>
          </div>
        </div>
      )}
    </div>
    </AlternarEjemplares.Provider>
  )
}
