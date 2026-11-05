'use client'

import { useEffect, useRef, useState } from 'react'
import BotonLargo from '../../../boton-largo'
import { PAUSA_ENTRE_ENSAYOS } from '../../../etapas-ensayo'
import { decir } from '../../../voz'
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
export function urlImagen(imagenes: ImagenesBanco, concepto: string | null, fase: string, ensayo: number) {
  if (!concepto) return null
  const ejemplares = imagenes[concepto]
  if (!ejemplares) return null
  if (fase === 'generalizacion') return ejemplares['3'] ?? ejemplares['1'] ?? null
  return ejemplares[ensayo % 2 === 0 ? '1' : '2'] ?? ejemplares['1'] ?? null
}


function lado(n: number, maxVh: number, margenRem = 4) {
  return `min(calc((100vw - ${margenRem}rem) / ${n} - 2.5vmin), ${maxVh}vh)`
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
  onElegir: (e: Eleccion) => void
  // Salen las opciones: desde aquí se mide la latencia
  onOpciones: () => void
}) {
  const muestraOida = esOido(origen)
  const respuestaOral = comparativos.some((c) => esOido(c.estimulo))
  // Test de transformación de funciones: sin muestra (se retiran los A); solo
  // las opciones y la pregunta
  const sinMuestra = fase === 'transformacion_funciones' && !respuestaOral
  const [conMuestra, setConMuestra] = useState(false)
  const [observada, setObservada] = useState(false)
  const conOpciones = conMuestra && (respuestaOral || sinMuestra || !observacion || observada)
  const hablar = () => {
    if (consigna) decir(consigna)
    else if (muestraOida) decir(textoOido(origen.nombre))
  }

  useEffect(() => {
    const t = setTimeout(() => setConMuestra(true), PAUSA_ENTRE_ENSAYOS)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    if (conMuestra) hablar()
    // Solo al aparecer la muestra
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conMuestra])
  useEffect(() => {
    if (conOpciones) onOpciones()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conOpciones])
  // Ayuda de menor a mayor: en cada nivel se repite la muestra
  useEffect(() => {
    if (nivel > 0) hablar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nivel])

  // Ayuda con demora (mayor a menor): la correcta se resalta pasada la demora
  const demora = apoyo?.demora ?? null
  const [resaltadaPorDemora, setResaltadaPorDemora] = useState(false)
  useEffect(() => {
    if (!conOpciones || demora === null) return
    const t = setTimeout(() => setResaltadaPorDemora(true), demora * 1000)
    return () => clearTimeout(t)
  }, [conOpciones, demora])

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
  const urlMuestra = urlImagen(imagenes, origen.concepto_imagen, fase, ensayo)
  const urlConcepto = (concepto: string) => urlImagen(imagenes, concepto, fase, ensayo)
  const tocarMuestra = () => {
    if (!conMuestra) return
    hablar()
    setObservada(true)
  }
  // Ámbar y latiendo cuando se repite la muestra como ayuda
  const marcoMuestra = nivel > 0 ? 'animate-pulse border-amber-400' : 'border-slate-200'

  return (
    <>
      <div className={`flex flex-1 flex-col items-center justify-center gap-[5vmin] overflow-hidden px-4 pb-2 ${conMuestra ? '' : 'invisible'}`}>
        <div className="flex items-center justify-center">
          {sinMuestra ? (
            <button
              type="button"
              onClick={hablar}
              className="rounded-full border border-slate-200 bg-white px-[3vmin] py-[1.5vmin] text-[2.5vmin] text-slate-500 shadow-sm"
              aria-label="Escuchar la pregunta"
            >
              🔊 Escuchar
            </button>
          ) : muestraOida ? (
            <button
              type="button"
              onClick={tocarMuestra}
              style={{ width: ladoAudio, height: ladoAudio }}
              className={`flex flex-col items-center justify-center gap-2 rounded-[2.5vmin] border-2 bg-white shadow-sm ${marcoMuestra}`}
              aria-label="Escuchar de nuevo"
            >
              <span className="leading-none" style={{ fontSize: `calc(${ladoAudio} * 0.38)` }}>
                🔊
              </span>
              <span className="text-slate-500" style={{ fontSize: `calc(${ladoAudio} * 0.1)` }}>
                Escuchar
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
        </div>

        {/* Las opciones ocupan su sitio desde el principio para que nada se mueva */}
        {!respuestaOral && (
          <div className={`flex flex-col items-center gap-[2.5vmin] ${conOpciones ? '' : 'invisible'}`}>
            <div className="flex flex-wrap justify-center gap-[2.5vmin]">
              {comparativos.map((c) => {
                const oculta = !c.esCorrecto && !visibles.has(c.claseId)
                return (
                  <button
                    key={c.claseId}
                    type="button"
                    disabled={oculta}
                    onClick={() => conOpciones && onElegir({ correcto: c.esCorrecto, respuesta: textoOido(c.estimulo.nombre), conAyudaPantalla: resaltadaPorDemora })}
                    style={{ width: ladoOpcion, height: ladoOpcion, ...estiloDistractor(c) }}
                    className={`flex items-center justify-center rounded-[2.5vmin] border-2 bg-white shadow-sm transition-transform active:scale-[0.98] ${
                      oculta ? 'invisible' : ''
                    } ${resaltada && c.esCorrecto ? 'animate-pulse border-amber-400 ring-[1vmin] ring-amber-300' : 'border-slate-200'}`}
                  >
                    <Tarjeta
                      estimulo={c.estimulo}
                      url={urlImagen(imagenes, c.estimulo.concepto_imagen, fase, ensayo)}
                      lado={ladoOpcion}
                      urlConcepto={urlConcepto}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex min-h-12 justify-end gap-2 px-3 pb-2">
        {respuestaOral && conMuestra && (
          <>
            <BotonLargo onActivar={() => onElegir({ correcto: true, respuesta: null, conAyudaPantalla: false })}>✓ Correcto</BotonLargo>
            <BotonLargo onActivar={() => onElegir({ correcto: false, respuesta: null, conAyudaPantalla: false })}>✗ Incorrecto</BotonLargo>
          </>
        )}
      </div>
    </>
  )
}

// Un ensayo (se monta de nuevo en cada uno). Con ayudas de menor a mayor,
// cada error sube un nivel de ayuda sobre la misma presentación; un acierto con
// ayuda da paso al ensayo de transferencia (el mismo, sin ayuda), que no escala.
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
  onResponder: (r: RespuestaTablet) => void
  onMuestra: () => void
  onPrimeraRespuesta: () => void
}) {
  const [nivel, setNivel] = useState(0)
  const [transferencia, setTransferencia] = useState(false)
  const primera = useRef<string | null>(null)
  const inicioTransferencia = useRef(0)
  const nDistractores = comparativos.filter((c) => !c.esCorrecto).length

  const elegir = (e: Eleccion) => {
    if (transferencia) {
      onResponder({
        correcto: false,
        respuesta: primera.current,
        conAyudaPantalla: false,
        nivelAyuda: nivel,
        transferencia: { correcto: e.correcto, respuesta: e.respuesta, latenciaMs: Date.now() - inicioTransferencia.current },
      })
      return
    }
    if (nivel === 0) onPrimeraRespuesta()
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
      key={transferencia ? 'transferencia' : 'ensayo'}
      origen={origen}
      comparativos={comparativos}
      fase={fase}
      ensayo={ensayo}
      imagenes={imagenes}
      apoyo={transferencia ? null : apoyo}
      observacion={observacion}
      nivel={transferencia ? 0 : nivel}
      consigna={consigna}
      onElegir={elegir}
      onOpciones={
        transferencia
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

  const responder = ({ correcto, respuesta, conAyudaPantalla, nivelAyuda, transferencia }: RespuestaTablet) => {
    // La ayuda anotada solo cuenta en un acierto (un error se registra sin ayuda);
    // un acierto después de resaltarse la correcta es un acierto con ayuda visual
    onResponder(correcto, !correcto ? 'independiente' : (ayuda ?? (conAyudaPantalla ? 'visual' : 'independiente')), respuesta, {
      nivelAyuda,
      transferencia,
    })
    setAyuda(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex select-none flex-col bg-white">
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

      <EnsayoTablet
        key={ensayo}
        origen={origen}
        comparativos={comparativos}
        fase={fase}
        ensayo={ensayo}
        imagenes={imagenes}
        apoyo={apoyo}
        observacion={observacion}
        menorAMayor={menorAMayor}
        consigna={consigna}
        onResponder={responder}
        onMuestra={onMuestra}
        onPrimeraRespuesta={onPrimeraRespuesta}
      />

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
  )
}
