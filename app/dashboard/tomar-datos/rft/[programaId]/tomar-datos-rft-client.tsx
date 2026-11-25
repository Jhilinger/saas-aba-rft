'use client'

import AjustesRefuerzo from '../../../ajustes-refuerzo'
import { useState, useTransition, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { guardarBloqueRft, guardarTextoTablet, obtenerSiguientesPasos } from './actions'
import PanelSiguientePaso from '../../../panel-siguiente-paso'
import type { AccionPaso, Paso } from '../../../siguiente-paso'
import VideoDiferido from '../../../video-diferido'
import { useToast } from '../../../../providers/toast-provider'
import { Button, Panel } from '../../../../ui'
import { leerProgreso, guardarProgreso, borrarProgreso, esFalloDeRed } from '../../offline-sync'
import { BannerSinConexion, PantallaGuardadoPendiente } from '../../estado-sincronizacion'
import {
  FASES_QUE_REQUIEREN_CONEXION,
  construirGrafoEntrenado,
  estanConectadas,
  relacionesDominadasTexto,
  type ParEntrenado,
} from './relaciones-rft'
import { coerceNivelRft, FASES_POR_NIVEL, NOMBRE_NIVEL_RFT } from '../../../niveles-rft'
import { marcaDeTiempo, segundosDesde, useCronometroEnsayo } from '../../cronometro'
import { configRespuesta, opcionesDeClase, respuestaEsperada } from '../../../respuestas-rft'
import type { Json } from '@/database.types'
import { NOMBRE_FASE_SECUENCIA, recomendarBloque, type FaseSecuencia, type Recomendacion } from '../../../secuencia-rft'
import PantallaTablet, { esOido, esVisible, textoOido, urlImagen, type ImagenesBanco } from './pantalla-tablet'
import MiniaturaEstimulo from '../../../miniatura-estimulo'
import { consignaPara, leerConsignasClase, leerConsignasPrograma } from '../../../consignas-rft'
import { desbloquearAudio, precargarFraseRft } from '../../../voz'
import {
  describirEscalon,
  leerEscalonBloque,
  siguienteEscalon,
  textoMovimiento,
  type ConfigSinError,
  type Escalon,
  type EscalonBloque,
} from '../../../sin-error'
import AyudaTermino from '../../../ayuda-termino'
import SelectorAyuda, { ayudasDelPrograma, etiquetaAyuda } from '../../../selector-ayuda'
import { GLOSARIO_POR_FASE } from '../../../glosario-rft'

type Estimulo = { id: string; nombre: string; posicion: string | null; concepto_imagen: string | null; pantalla: unknown }

// Miniatura de lo que el alumno tiene delante (figura dibujada o foto), para
// que el terapeuta sepa qué estímulo es aunque su nombre sea genérico
function VistaEstimulo({ estimulo, imagenes }: { estimulo: Estimulo; imagenes: ImagenesBanco }) {
  if (estimulo.pantalla) return <MiniaturaEstimulo pantalla={estimulo.pantalla} imagenes={imagenes} />
  const url = estimulo.concepto_imagen ? urlImagen(imagenes, estimulo.concepto_imagen, 'entrenamiento', 0) : null
  if (!url) return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-white object-contain" />
}
// generado: la clase la creó el generador de grupos (sin voz grabada)
type Clase = { id: string; nombre: string; grupo: string; respuestas_esperadas: Json; opciones_por_fase?: Json; consignas: Json; generado?: Json | null; estimulos_rft: Estimulo[] }
type DominioFase = { grupo: string; fase: string; posicion_origen: string; posicion_destino: string; forma_respuesta?: string }
// Oyente: elige entre opciones; hablante: responde sin opciones y el terapeuta puntúa
type Forma = 'oyente' | 'hablante'

type EnsayoRft = {
  claseId: string
  claseNombre: string
  estimuloOrigenId: string
  estimuloOrigenNombre: string
  estimuloDestinoId: string
  estimuloDestinoNombre: string
  pregunta?: string
  correcto: boolean
  ayuda: string
  latenciaMs?: number | null
  respuesta?: string | null
  // Ayudas de menor a mayor: nivel con que acertó tras fallar
  nivelAyuda?: number | null
}

// Ensayo de transferencia (el mismo ensayo sin ayuda tras acertar con ayuda):
// se guarda aparte y no cuenta para el %
type TransferenciaRft = {
  claseId: string
  estimuloOrigenId: string
  estimuloDestinoId: string
  correcto: boolean
  latenciaMs: number
  respuesta: string | null
}

// Pregunta extra durante el bloque (ej. de asimetría): se guarda con su
// resultado, pero no cuenta para el % de acierto ni para el dominio
type ControlRft = {
  claseId: string
  estimuloOrigenId: string
  pregunta: string
  respuesta: string | null
  correcto: boolean
}

const FASES_TODAS = [
  { value: 'entrenamiento', label: 'Entrenamiento' },
  { value: 'test_mutuo', label: 'Test de vínculo mutuo' },
  { value: 'test_combinatorio', label: 'Test de vínculo combinatorio' },
  { value: 'transformacion_funciones', label: 'Transformación de funciones' },
]

function barajar<T>(arr: T[]): T[] {
  const copia = [...arr]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

function generarSecuenciaClases(clases: Clase[], n: number): Clase[] {
  const k = clases.length
  const base = Math.floor(n / k)
  const remainder = n % k
  const barajadas = barajar(clases)

  let pool: Clase[] = []
  barajadas.forEach((c, idx) => {
    const count = base + (idx < remainder ? 1 : 0)
    for (let i = 0; i < count; i++) pool.push(c)
  })

  pool = barajar(pool)

  for (let i = 1; i < pool.length; i++) {
    if (pool[i].id === pool[i - 1].id) {
      const j = pool.findIndex((c, idx) => idx > i && c.id !== pool[i - 1].id)
      if (j !== -1) {
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
    }
  }

  return pool
}

function encontrarEstimulo(clase: Clase, posicion: string): Estimulo | undefined {
  return clase.estimulos_rft.find((e) => e.posicion === posicion)
}

function ordenEstable(valor: string) {
  return [...valor].reduce((total, caracter) => total + caracter.charCodeAt(0), 0)
}

// Orden pseudoaleatorio pero reproducible (no cambia al volver a pintar)
function hashEstable(valor: string) {
  let h = 2166136261
  for (const caracter of valor) h = Math.imul(h ^ caracter.charCodeAt(0), 16777619)
  return h >>> 0
}

// Bloque guardado en el dispositivo mientras se toma (ver offline-sync)
type ProgresoGuardado = {
  secuencia: Clase[]
  ensayos: EnsayoRft[]
  notas: string
  grupoSeleccionado: string
  fase: string
  posicionOrigen: string
  posicionDestino: string
  tamanoBloque: number
  inicioBloque?: number | null
  duracionBloque?: number | null
  controles?: ControlRft[]
  modo?: 'material' | 'tableta'
  forma?: Forma
  apoyoVisual?: boolean
  escalon?: EscalonActivo | null
  menorAMayor?: boolean
  transferencias?: TransferenciaRft[]
}

// Escalón de aprendizaje sin error con que se hace un bloque
type EscalonActivo = { indice: number; total: number; escalon: Escalon; comparaciones: number; tamano: boolean }

// Con material físico o en la tableta (solo si el bloque se puede presentar en pantalla)
function SelectorModo({
  disponible,
  modo,
  onCambiar,
  conTexto,
  onTexto,
  fuera = 0,
  textoFijo = false,
  forma,
  onForma,
  apoyoVisual,
  onApoyoVisual,
  soloTableta = false,
}: {
  // Programas verbales del nivel 3: si el bloque se puede presentar en la tableta, solo ahí
  soloTableta?: boolean
  forma: Forma
  onForma: (f: Forma) => void
  // Fichas iguales (programas verbales); undefined = no se ofrece
  apoyoVisual?: boolean
  onApoyoVisual?: (v: boolean) => void
  disponible: boolean
  // Clases del grupo que no se pueden mostrar en la tableta (se quedan fuera)
  fuera?: number
  // Presentación siempre en texto (sin casilla)
  textoFijo?: boolean
  modo: 'material' | 'tableta'
  onCambiar: (m: 'material' | 'tableta') => void
  // En la tableta, la clave y las opciones también en texto (activado por
  // defecto: el alumno lector las tiene presentes y, si no lee, se las lee el terapeuta)
  conTexto: boolean
  onTexto: (v: boolean) => void
}) {
  const selectorForma = (
    <span className="flex rounded-lg bg-white p-0.5 text-sm">
      {(['oyente', 'hablante'] as const).map((f) => (
        <button
          key={f}
          onClick={() => onForma(f)}
          title={f === 'oyente' ? 'El alumno elige entre opciones' : 'El alumno responde sin opciones; usted puntúa'}
          className={`rounded-md px-3 py-1.5 font-medium ${forma === f ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          {f === 'oyente' ? '👂 Oyente' : '🗣 Hablante'}
        </button>
      ))}
    </span>
  )
  const selectorApoyo = apoyoVisual !== undefined && onApoyoVisual && (
    <label className="flex items-center gap-1.5 text-sm text-slate-600" title="Fichas iguales con el nombre debajo, para ver y señalar. Los bloques con fichas no cuentan para el dominio: el apoyo se retira después">
      <input type="checkbox" checked={apoyoVisual} onChange={(e) => onApoyoVisual(e.target.checked)} className="h-4 w-4" />
      Con fichas iguales (apoyo visual; no cuenta para el dominio)
    </label>
  )
  if (!disponible) return <span className="inline-flex flex-wrap items-center gap-3">{selectorForma}{selectorApoyo}</span>
  return (
    <span className="inline-flex flex-wrap items-center gap-3">
    {selectorForma}
    {selectorApoyo}
    {soloTableta ? (
      <span className="text-sm font-medium text-slate-600">🖥 En tableta</span>
    ) : (
    <span className="flex rounded-lg bg-white p-0.5 text-sm">
      {(['material', 'tableta'] as const).map((m) => (
        <button
          key={m}
          onClick={() => onCambiar(m)}
          className={`rounded-md px-3 py-1.5 font-medium ${modo === m ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          {m === 'material' ? 'Con material' : '🖥 En tableta'}
        </button>
      ))}
    </span>
    )}
    {modo === 'tableta' && !textoFijo && (
      <label className="flex items-center gap-1.5 text-sm text-slate-600">
        <input type="checkbox" checked={conTexto} onChange={(e) => onTexto(e.target.checked)} className="h-4 w-4" />
        Presentación en texto (desmarcada: solo audio)
      </label>
    )}
    {forma === 'hablante' && (
      <span className="text-xs text-slate-500">Sin opciones: el alumno responde y usted marca ✓/✗{modo === 'tableta' ? ' (la respuesta esperada, oculta tras «👁»)' : ''}.</span>
    )}
    {modo === 'tableta' && (
      <span className="basis-full">
        <AjustesRefuerzo plegable />
      </span>
    )}
    {modo === 'tableta' && fuera > 0 && (
      <span className="text-xs font-medium text-amber-700">
        ⚠ {fuera} clase(s) sin imagen se quedan fuera del bloque en la tableta
      </span>
    )}
    </span>
  )
}

function TarjetaRecomendacion({
  rec,
  conGrupo,
  ejemplo,
  tamanoBloque,
  onTamano,
  onEmpezar,
  selectorModo,
  apoyo,
}: {
  rec: Recomendacion
  conGrupo: boolean
  ejemplo: string | null
  tamanoBloque: number
  onTamano: (n: number) => void
  onEmpezar: () => void
  selectorModo: React.ReactNode
  apoyo: React.ReactNode
}) {
  return (
    <div className="space-y-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Siguiente bloque recomendado</p>
      <div>
        <p className="text-lg font-bold text-slate-800">
          {NOMBRE_FASE_SECUENCIA[rec.paso.fase]}
          <AyudaTermino clave={GLOSARIO_POR_FASE[rec.paso.fase] ?? 'entrenamiento'} /> {rec.paso.origen}→{rec.paso.destino}
          {conGrupo && <span className="font-normal text-slate-500"> · {rec.grupo}</span>}
        </p>
        <p className="text-xs text-slate-500">
          Paso {rec.indice + 1} de {rec.total} de la secuencia del programa
          <AyudaTermino clave="secuencia" />
          {ejemplo && ` · ej.: ${ejemplo}`}
        </p>
        {apoyo}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {[10, 20].map((n) => (
          <button
            key={n}
            onClick={() => onTamano(n)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              tamanoBloque === n ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {n} ensayos
          </button>
        ))}
        {selectorModo}
        <Button onClick={onEmpezar} className="ml-auto px-6 py-3 text-base sm:py-2">
          Empezar
        </Button>
      </div>
    </div>
  )
}

function LineaApoyo({ escalon, menorAMayor }: { escalon: Escalon | null; menorAMayor: boolean }) {
  if (escalon) {
    return (
      <p className="mt-1 text-xs text-amber-700">
        Aprendizaje sin error: <strong>{escalon.nombre}</strong> · {describirEscalon(escalon)}
      </p>
    )
  }
  if (menorAMayor) {
    return <p className="mt-1 text-xs text-amber-700">Ayudas de menor a mayor: tras cada error, el mismo ensayo con más ayuda</p>
  }
  return null
}

export default function TomarDatosRftClient({
  programaAlumnoId,
  alumnoId,
  clases,
  ensayosPorBloqueDefecto,
  instrucciones,
  ayudasPosibles,
  videoUrl,
  grupoInicial,
  dominioFases,
  nivelRft,
  respuesta,
  secuenciaPrograma,
  imagenes,
  sinError,
  ultimosEscalones,
  consignas,
  opcionesClase = false,
  alternarEjemplares = false,
  sinAudio = false,
  textoTablet = true,
  siguientesPasos = [],
}: {
  programaAlumnoId: string
  alumnoId: string
  clases: Clase[]
  ensayosPorBloqueDefecto: number
  instrucciones: string | null
  ayudasPosibles: string | null
  videoUrl: string | null
  grupoInicial?: string | null
  dominioFases: DominioFase[]
  nivelRft: string | null
  respuesta: { tipo_respuesta: string; opciones_respuesta: string[] | null; respuesta_por_fase: Json }
  // Secuencia de bloques del programa (ver secuencia-rft.ts)
  secuenciaPrograma: Json
  // Imágenes del banco por concepto y ejemplar (modo tableta)
  imagenes: ImagenesBanco
  // Aprendizaje sin error (solo si está activo) y escalón del último bloque por grupo__origen__destino
  sinError: ConfigSinError | null
  ultimosEscalones: Record<string, Json>
  // Consignas del programa (claves relacionales por paso; ver consignas-rft.ts)
  consignas: Json
  // Opciones de la propia clase (relaciones enunciadas verbalmente): los dos
  // elementos de la relación y un distractor de otra clase del grupo
  opcionesClase?: boolean
  // Alternar las fotos 1 y 2 de cada concepto entre ensayos («… con sus Nombres»)
  alternarEjemplares?: boolean
  // Programa sin audio en la tableta: siempre en texto, lo lee el alumno o el terapeuta
  sinAudio?: boolean
  // Clave y opciones también en texto en la tableta (se recuerda en el programa)
  textoTablet?: boolean
  // Lo que la app propone hacer con los datos (ver siguiente-paso.ts)
  siguientesPasos?: Paso[]
}) {
  const nivel = coerceNivelRft(nivelRft)
  const FASES = FASES_TODAS.filter((f) => FASES_POR_NIVEL[nivel].includes(f.value))

  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(grupoInicial ?? null)
  const [fase, setFase] = useState('entrenamiento')
  const [posicionOrigen, setPosicionOrigen] = useState('')
  const [posicionDestino, setPosicionDestino] = useState('')
  const [tipoSonda, setTipoSonda] = useState<'normal' | 'generalizacion' | 'mantenimiento'>('normal')
  const [tamanoBloque, setTamanoBloque] = useState(ensayosPorBloqueDefecto)
  // El terapeuta elige la combinación a mano en lugar de la recomendada
  const [manual, setManual] = useState(false)
  // Siguiente paso recalculado tras guardar el bloque (null: aún no)
  const [pasosTrasBloque, setPasosTrasBloque] = useState<Paso[] | null>(null)
  // Modo del próximo bloque, y si la pantalla del alumno está abierta. El modo
  // con que empezó el bloque se guarda con él (ref, como los controles)
  // Programas verbales del nivel 3 (sin audio): se registran solo en la tableta
  // cuando el bloque se puede presentar en ella; si no (respuesta de ejecución,
  // estímulos que no se ven), con material
  const soloTableta = sinAudio
  const [modo, setModo] = useState<'material' | 'tableta'>(soloTableta ? 'tableta' : 'material')
  // Forma de respuesta del próximo bloque; la del bloque en curso va en una ref
  const [forma, setForma] = useState<Forma>('oyente')
  const formaBloqueRef = useRef<Forma>('oyente')
  const [formaBloque, setFormaBloque] = useState<Forma>('oyente')
  // Fichas iguales como apoyo visual (programas verbales): elegido y del bloque en curso
  const [apoyoVisual, setApoyoVisual] = useState(false)
  const apoyoVisualBloqueRef = useRef(false)
  const [apoyoVisualBloque, setApoyoVisualBloque] = useState(false)
  const fijarApoyoVisualBloque = (v: boolean) => {
    apoyoVisualBloqueRef.current = v
    setApoyoVisualBloque(v)
  }
  const fijarFormaBloque = (f: Forma) => {
    formaBloqueRef.current = f
    setFormaBloque(f)
  }
  const [enTableta, setEnTableta] = useState(false)
  const [conTextoElegido, setConTexto] = useState(textoTablet)
  // Sin audio (nivel 3 salvo la abstracción de claves): siempre en texto
  const conTexto = sinAudio || conTextoElegido
  const cambiarTexto = (v: boolean) => {
    setConTexto(v)
    void guardarTextoTablet(programaAlumnoId, v)
  }
  const modoBloqueRef = useRef<'material' | 'tableta'>('material')
  // Escalón de apoyo del bloque en curso (null = sin aprendizaje sin error)
  const escalonRef = useRef<EscalonActivo | null>(null)
  const [escalonBloque, setEscalonBloque] = useState<EscalonActivo | null>(null)
  const fijarEscalon = (e: EscalonActivo | null) => {
    escalonRef.current = e
    setEscalonBloque(e)
  }
  // Ayudas de menor a mayor en el bloque en curso, y sus ensayos de transferencia
  const menorAMayorRef = useRef(false)
  const [menorAMayorBloque, setMenorAMayorBloque] = useState(false)
  const fijarMenorAMayor = (v: boolean) => {
    menorAMayorRef.current = v
    setMenorAMayorBloque(v)
  }
  const transferenciasRef = useRef<TransferenciaRft[]>([])
  const [secuencia, setSecuencia] = useState<Clase[] | null>(null)
  const [ensayos, setEnsayos] = useState<EnsayoRft[]>([])
  const [mostrandoAyudas, setMostrandoAyudas] = useState(false)
  // Registro con material (misma pantalla que la tableta): ayuda elegida antes
  // de responder (se anota en el siguiente acierto), menú «⋯», respuesta
  // correcta visible solo al mantener pulsado y, tras registrar, el resultado
  // con qué hacer hasta pulsar «Siguiente ensayo»
  const [ayudaPendiente, setAyudaPendiente] = useState<string | null>(null)
  const [masAbierto, setMasAbierto] = useState(false)
  const [verRespuesta, setVerRespuesta] = useState(false)
  const [tras, setTras] = useState<{ correcto: boolean; ayuda: string; correcta: string | null; test: boolean; repeticion?: boolean } | null>(null)
  // Corrección del error con material (entrenamiento): modelo con solo la correcta
  // y repetición del ensayo sin ayuda, que se guarda aparte (como en la tableta)
  const [correccion, setCorreccion] = useState<{ paso: 'modelo' | 'repetir'; primera: string | null; inicio: number } | null>(null)
  const [preguntaActual, setPreguntaActual] = useState('')
  const [notas, setNotas] = useState('')
  const [isPending, startTransition] = useTransition()
  const [resultado, setResultado] = useState<{
    porcentaje: number
    clasesDominadasAhora: string[]
    derivado: boolean
    controles: { total: number; aciertos: number }
    escalon: EscalonBloque | null
    transferencias: { total: number; aciertos: number }
  } | null>(null)
  // Respuesta de opciones elegida, a falta de marcar ✓/✗ (si la clase no tiene respuesta esperada)
  const [respuestaPendiente, setRespuestaPendiente] = useState<string | null>(null)
  const [respuestaAbierta, setRespuestaAbierta] = useState('')
  const [controles, setControles] = useState<ControlRft[]>([])
  const controlesRef = useRef<ControlRft[]>([])
  const [controlAbierto, setControlAbierto] = useState(false)
  const [controlPregunta, setControlPregunta] = useState('')
  const [controlRespuesta, setControlRespuesta] = useState('')
  const [estadoGuardado, setEstadoGuardado] = useState<'idle' | 'pendiente' | 'error'>('idle')
  const [sinConexion, setSinConexion] = useState(false)
  // Duración del bloque: desde que empieza hasta el último ensayo registrado
  const [inicioBloque, setInicioBloque] = useState<number | null>(null)
  const [duracionBloque, setDuracionBloque] = useState<number | null>(null)
  const cronometro = useCronometroEnsayo(secuencia ? ensayos.length : null)
  const fijarControles = (lista: ControlRft[]) => {
    controlesRef.current = lista
    setControles(lista)
  }
  const router = useRouter()
  const toast = useToast()

  const claveProgreso = `rft:${programaAlumnoId}`

  const grupos = [...new Set(clases.map((c) => c.grupo))]
  const clasesDelGrupo = clases.filter((c) => c.grupo === grupoSeleccionado)
  const posicionesDisponibles = [
    ...new Set(
      clasesDelGrupo.flatMap((c) => c.estimulos_rft.map((e) => e.posicion).filter(Boolean) as string[])
    ),
  ].sort()

  // Dominio de la forma de respuesta elegida (oyente y hablante van por separado)
  const dominioForma = dominioFases.filter((d) => (d.forma_respuesta ?? 'oyente') === forma)

  // Una clase se puede presentar en la tableta si sus dos estímulos se ven o se
  // dicen (con opciones de la propia clase todo se dice en audio)
  // Opciones fijas (Igual / Diferente / No se sabe, Sí / No): la frase de la clase y
  // las opciones como botones de texto; no hace falta que los estímulos se vean
  const opcionesFijas = respuesta.tipo_respuesta === 'opciones'
  const presentable = (c: Clase, origen: string, destino: string) =>
    opcionesClase || opcionesFijas || [encontrarEstimulo(c, origen), encontrarEstimulo(c, destino)].every((e) => !!e && (esVisible(e) || esOido(e)))
  const clasesConPosiciones = clasesDelGrupo.filter(
    (c) => encontrarEstimulo(c, posicionOrigen) && encontrarEstimulo(c, posicionDestino)
  )
  // En la tableta se quedan fuera las clases que no se pueden mostrar
  const clasesValidas = enTableta
    ? clasesConPosiciones.filter((c) => presentable(c, posicionOrigen, posicionDestino))
    : clasesConPosiciones
  // Los distractores no entrenados (un solo estímulo, sin el de origen) no son
  // clases incompletas: solo aparecen en el test de transformación
  const esDistractorNoEntrenado = (c: Clase) => c.estimulos_rft.length === 1 && !encontrarEstimulo(c, posicionOrigen)
  const clasesSinPosiciones = clasesDelGrupo.length - clasesConPosiciones.length - clasesDelGrupo.filter(esDistractorNoEntrenado).length

  const entrenamientosDominados: ParEntrenado[] = dominioForma
    .filter((d) => d.fase === 'entrenamiento')
    .map((d) => ({ grupo: d.grupo, posicion_origen: d.posicion_origen, posicion_destino: d.posicion_destino }))
  const combosDominados = dominioForma
    .filter((d) => d.fase !== 'entrenamiento')
    .map((d) => `${d.grupo}__${d.posicion_origen}__${d.posicion_destino}`)

  // Solo se puede registrar una sonda de generalización/mantenimiento sobre
  // una combinación grupo+posiciones que ya haya demostrado dominio en
  // alguna fase de test — si no, no hay nada que "mantener" todavía.
  const puedeSonda =
    !!grupoSeleccionado &&
    !!posicionOrigen &&
    !!posicionDestino &&
    combosDominados.includes(`${grupoSeleccionado}__${posicionOrigen}__${posicionDestino}`)
  const faseEfectiva = puedeSonda && tipoSonda !== 'normal' ? tipoSonda : fase

  // Un test de vínculo mutuo/combinatorio (o transformación de funciones)
  // solo tiene sentido una vez dominada en entrenamiento una cadena de
  // relaciones que conecte las dos posiciones elegidas — si no, no se
  // estaría probando nada emergente.
  const requiereConexion =
    grupoSeleccionado !== null && (FASES_QUE_REQUIEREN_CONEXION as readonly string[]).includes(fase)
  const grafoEntrenado = grupoSeleccionado ? construirGrafoEntrenado(entrenamientosDominados, grupoSeleccionado) : new Map()
  const conectadas =
    !requiereConexion || (!!posicionOrigen && !!posicionDestino && estanConectadas(grafoEntrenado, posicionOrigen, posicionDestino))
  const relacionesYaDominadas = grupoSeleccionado
    ? relacionesDominadasTexto(entrenamientosDominados, grupoSeleccionado)
    : []

  const intentarGuardar = useCallback(
    (
      listaEnsayos: EnsayoRft[],
      notasActuales: string,
      grupo: string,
      faseActual: string,
      origen: string,
      destino: string,
      numComparativos: number,
      duracionSegundos: number | null
    ) => {
      const activo = escalonRef.current
      const conApoyo = listaEnsayos.length ? listaEnsayos.filter((e) => e.correcto).length / listaEnsayos.length : 0
      const escalon: EscalonBloque | null =
        activo && faseActual === 'entrenamiento'
          ? {
              ...activo.escalon,
              indice: activo.indice,
              total: activo.total,
              final: activo.indice === activo.total - 1,
              aciertos_con_apoyo: Math.round(conApoyo * 100),
            }
          : null
      startTransition(async () => {
        try {
          const res = await guardarBloqueRft(
            programaAlumnoId,
            alumnoId,
            grupo,
            faseActual,
            origen,
            destino,
            escalon ? activo!.comparaciones : numComparativos,
            listaEnsayos.map(({ claseId, estimuloOrigenId, estimuloDestinoId, pregunta, correcto, ayuda, latenciaMs, respuesta, nivelAyuda }) => ({
              claseId,
              estimuloOrigenId,
              estimuloDestinoId,
              pregunta,
              correcto,
              ayuda,
              latenciaMs,
              respuesta,
              nivelAyuda,
            })),
            notasActuales,
            duracionSegundos,
            controlesRef.current,
            modoBloqueRef.current,
            escalon,
            transferenciasRef.current,
            conTexto,
            formaBloqueRef.current,
            apoyoVisualBloqueRef.current
          )
          if (res.error) {
            setEstadoGuardado('error')
            toast(res.error, 'error')
            return
          }
          borrarProgreso(claveProgreso)
          setEstadoGuardado('idle')
          setPasosTrasBloque(null)
          obtenerSiguientesPasos(programaAlumnoId).then(setPasosTrasBloque, () => setPasosTrasBloque([]))
          setResultado({
            porcentaje: res.porcentaje ?? 0,
            clasesDominadasAhora: res.clasesDominadasAhora ?? [],
            derivado: res.derivado ?? false,
            controles: {
              total: controlesRef.current.length,
              aciertos: controlesRef.current.filter((c) => c.correcto).length,
            },
            escalon,
            transferencias: {
              total: transferenciasRef.current.length,
              aciertos: transferenciasRef.current.filter((t) => t.correcto).length,
            },
          })
        } catch (e) {
          if (esFalloDeRed(e)) {
            setEstadoGuardado('pendiente')
          } else {
            setEstadoGuardado('error')
            toast('No se pudo guardar el bloque', 'error')
          }
        }
      })
    },
    [programaAlumnoId, alumnoId, claveProgreso, toast, conTexto]
  )

  const restaurar = (guardado: ProgresoGuardado) => {
    setGrupoSeleccionado(guardado.grupoSeleccionado)
    setFase(guardado.fase)
    setPosicionOrigen(guardado.posicionOrigen)
    setPosicionDestino(guardado.posicionDestino)
    setTamanoBloque(guardado.tamanoBloque)
    setSecuencia(guardado.secuencia)
    setEnsayos(guardado.ensayos)
    setNotas(guardado.notas)
    setInicioBloque(guardado.inicioBloque ?? null)
    setDuracionBloque(guardado.duracionBloque ?? null)
    controlesRef.current = guardado.controles ?? []
    setControles(guardado.controles ?? [])
    modoBloqueRef.current = guardado.modo ?? 'material'
    fijarFormaBloque(guardado.forma ?? 'oyente')
    fijarApoyoVisualBloque(guardado.apoyoVisual ?? false)
    setForma(guardado.forma ?? 'oyente')
    fijarEscalon(guardado.escalon ?? null)
    fijarMenorAMayor(guardado.menorAMayor ?? false)
    transferenciasRef.current = guardado.transferencias ?? []
    if (guardado.ensayos.length > 0 && guardado.ensayos.length === guardado.secuencia.length) {
      const clasesDelGrupoGuardado = clases.filter((c) => c.grupo === guardado.grupoSeleccionado)
      const numComparativos = clasesDelGrupoGuardado.filter(
        (c) => encontrarEstimulo(c, guardado.posicionOrigen) && encontrarEstimulo(c, guardado.posicionDestino)
      ).length
      intentarGuardar(
        guardado.ensayos,
        guardado.notas,
        guardado.grupoSeleccionado,
        guardado.fase,
        guardado.posicionOrigen,
        guardado.posicionDestino,
        numComparativos,
        guardado.duracionBloque ?? null
      )
    }
  }

  // Bloque a medias guardado en el dispositivo: se pregunta si continuarlo o
  // descartarlo, para que no se imponga al grupo que se ha elegido
  const [pendiente, setPendiente] = useState<ProgresoGuardado | null>(null)

  // Al cargar: un bloque completo pero sin sincronizar (fallo de red) se guarda
  // sin preguntar; uno a medias, se ofrece continuarlo.
  useEffect(() => {
    const guardado = leerProgreso<ProgresoGuardado>(claveProgreso)
    if (!guardado) return
    if (guardado.ensayos.length > 0 && guardado.ensayos.length === guardado.secuencia.length) restaurar(guardado)
    else if (guardado.ensayos.length === 0) borrarProgreso(claveProgreso)
    else setPendiente(guardado)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const descartarBloque = () => {
    borrarProgreso(claveProgreso)
    setSecuencia(null)
    setEnsayos([])
    setNotas('')
    fijarControles([])
    fijarEscalon(null)
    fijarMenorAMayor(false)
    transferenciasRef.current = []
    setEnTableta(false)
    setInicioBloque(null)
    setDuracionBloque(null)
  }

  // Reintenta solo en cuanto vuelva la conexión, y muestra un aviso mientras
  // se está tomando el bloque sin conexión.
  useEffect(() => {
    const actualizarEstado = () => setSinConexion(!navigator.onLine)
    actualizarEstado()
    const onOnline = () => {
      actualizarEstado()
      if (estadoGuardado === 'pendiente' && grupoSeleccionado) {
        intentarGuardar(ensayos, notas, grupoSeleccionado, faseEfectiva, posicionOrigen, posicionDestino, clasesValidas.length, duracionBloque)
      }
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', actualizarEstado)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', actualizarEstado)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoGuardado, ensayos, notas, grupoSeleccionado, faseEfectiva, posicionOrigen, posicionDestino, duracionBloque, intentarGuardar])

  const claseActualId = secuencia?.[ensayos.length]?.id

  // Distractores de otros grupos del programa, para escalones con más
  // opciones que clases tiene el grupo (solo los que se ven en pantalla)
  const distractoresExtra = (grupo: string, destino: string, validas: Clase[]) => {
    const nombres = new Set(validas.map((c) => encontrarEstimulo(c, destino)?.nombre))
    return clases.filter((c) => {
      const e = c.grupo !== grupo ? encontrarEstimulo(c, destino) : undefined
      if (!e || !esVisible(e) || nombres.has(e.nombre)) return false
      nombres.add(e.nombre)
      return true
    })
  }

  const comparativos = (() => {
    if (!secuencia) return []
    const claseActual = secuencia[ensayos.length]
    if (!claseActual) return []
    const cfg = configRespuesta(respuesta, fase)
    if (cfg.tipo === 'opciones') {
      // Opciones fijas como palabras (botones de texto); correcta, la respuesta esperada
      const esperadaClase = respuestaEsperada(claseActual.respuestas_esperadas, fase, posicionOrigen, posicionDestino)
      const opcionesClaseActual = opcionesDeClase(claseActual.opciones_por_fase, fase, posicionOrigen, posicionDestino) ?? cfg.opciones
      return opcionesClaseActual.map((op, i) => ({
        claseId: `${claseActual.id}-op${i}`,
        estimulo: { id: `${claseActual.id}-op${i}`, posicion: null, nombre: `"${op}"`, concepto_imagen: null, pantalla: null },
        esCorrecto: op === esperadaClase,
      }))
    }
    if (opcionesClase && claseActual.estimulos_rft.length >= 3) {
      // Redes de 3 o más miembros: las opciones son todos los de la clase (sin
      // distractor de otra clase), dichas en audio
      const semilla = `${ensayos.length}-${claseActual.id}`
      const oida = (e: Estimulo): Estimulo => ({ ...e, nombre: `"${e.nombre}"`, concepto_imagen: null, pantalla: null })
      return claseActual.estimulos_rft
        .map((e) => ({ claseId: `${claseActual.id}-${e.posicion}`, estimulo: oida(e), esCorrecto: e.posicion === posicionDestino }))
        .sort((a, b) => hashEstable(`${semilla}-${a.claseId}`) - hashEstable(`${semilla}-${b.claseId}`))
    }
    if (opcionesClase) {
      const semilla = `${ensayos.length}-${claseActual.id}`
      const otras = clasesValidas.filter((c) => c.id !== claseActual.id)
      const otra = otras.length ? otras[hashEstable(semilla) % otras.length] : null
      // El distractor ocupa el mismo papel que la respuesta (otra causa, otro
      // consecuente…), para que no se descarte solo por el tipo de frase
      const distractor = otra ? encontrarEstimulo(otra, posicionDestino) : undefined
      // Las opciones son palabras oídas (la relación es verbal): se presentan
      // como estímulos oídos aunque tengan imagen en el currículo
      const oida = (e: Estimulo): Estimulo => ({ ...e, nombre: `"${e.nombre}"`, concepto_imagen: null, pantalla: null })
      return [
        { claseId: `${claseActual.id}-o`, estimulo: oida(encontrarEstimulo(claseActual, posicionOrigen)!), esCorrecto: false },
        { claseId: `${claseActual.id}-d`, estimulo: oida(encontrarEstimulo(claseActual, posicionDestino)!), esCorrecto: true },
        ...(distractor && otra ? [{ claseId: `${otra.id}-x`, estimulo: oida(distractor), esCorrecto: false }] : []),
      ].sort((a, b) => hashEstable(`${semilla}-${a.claseId}`) - hashEstable(`${semilla}-${b.claseId}`))
    }
    let opciones = clasesValidas
    if (escalonBloque) {
      // Con aprendizaje sin error: la correcta y tantos distractores como pida el escalón
      const semilla = `${ensayos.length}-${claseActual.id}`
      const distractores = [
        ...clasesValidas.filter((c) => c.id !== claseActual.id),
        ...distractoresExtra(claseActual.grupo, posicionDestino, clasesValidas),
      ]
        .map((c, i) => ({ c, orden: hashEstable(`${semilla}-${c.id}`) + (i < clasesValidas.length - 1 ? 0 : 2 ** 32) }))
        .sort((a, b) => a.orden - b.orden)
        .map((x) => x.c)
      opciones = [claseActual, ...distractores.slice(0, escalonBloque.comparaciones - 1)]
    }
    // Test de transformación: se añaden los distractores no entrenados del grupo
    // (clases con el estímulo de la posición de respuesta pero sin el de origen,
    // que nunca se entrenan ni se relacionan con nada)
    if (fase === 'transformacion_funciones') {
      const noEntrenados = clasesDelGrupo.filter((c) => {
        const e = encontrarEstimulo(c, posicionDestino)
        return !encontrarEstimulo(c, posicionOrigen) && !!e && (!enTableta || esVisible(e) || esOido(e))
      })
      opciones = [...opciones, ...noEntrenados]
    }
    return opciones
      .map((c) => ({
        claseId: c.id,
        estimulo: encontrarEstimulo(c, posicionDestino)!,
        esCorrecto: c.id === claseActual.id,
      }))
      .sort((a, b) => ordenEstable(`${claseActualId}-${a.claseId}`) - ordenEstable(`${claseActualId}-${b.claseId}`))
    // Solo recalculamos al cambiar de ensayo, no en cada tecla pulsada
  })()

  const empezarBloque = () => {
    if (clasesConPosiciones.length < 2) {
      toast('Necesitas al menos 2 clases con esas posiciones en este grupo para poder comparar.', 'error')
      return
    }
    if (!conectadas) {
      toast('Antes hay que dominar en entrenamiento una cadena de relaciones que conecte esas posiciones.', 'error')
      return
    }
    const modoInicial = grupoSeleccionado ? modoPara(grupoSeleccionado, posicionOrigen, posicionDestino, faseEfectiva) : 'material'
    const validas = modoInicial === 'tableta' ? clasesConPosiciones.filter((c) => presentable(c, posicionOrigen, posicionDestino)) : clasesConPosiciones
    iniciarBloque(
      validas,
      modoInicial,
      grupoSeleccionado ? escalonPara(grupoSeleccionado, posicionOrigen, posicionDestino, faseEfectiva, modoInicial, validas) : null,
      menorAMayorPara(posicionDestino, faseEfectiva, modoInicial, validas)
    )
  }

  const iniciarBloque = (
    validas: Clase[],
    modoInicial: 'material' | 'tableta' = modo,
    escalon: EscalonActivo | null = null,
    menorAMayor = false
  ) => {
    // Se llama desde un toque: desbloquea el audio para que las claves grabadas suenen solas
    desbloquearAudio()
    modoBloqueRef.current = modoInicial
    fijarFormaBloque(forma)
    fijarApoyoVisualBloque(sinAudio && apoyoVisual)
    fijarEscalon(escalon)
    fijarMenorAMayor(menorAMayor)
    transferenciasRef.current = []
    setEnTableta(modoInicial === 'tableta')
    setSecuencia(generarSecuenciaClases(validas, tamanoBloque))
    setInicioBloque(marcaDeTiempo())
    setDuracionBloque(null)
    fijarControles([])
    setEnsayos([])
    setNotas('')
    setResultado(null)
    setEstadoGuardado('idle')
    setTras(null)
    setCorreccion(null)
    setAyudaPendiente(null)
    setMasAbierto(false)
  }

  // «Preparar este bloque» desde el siguiente paso: deja elegida la combinación a mano
  const preparar = (a: AccionPaso) => {
    setResultado(null)
    setSecuencia(null)
    setEstadoGuardado('idle')
    setGrupoSeleccionado(a.grupo)
    setFase(a.fase)
    setPosicionOrigen(a.origen)
    setPosicionDestino(a.destino)
    setTipoSonda('normal')
    setForma(a.forma)
    setApoyoVisual(a.apoyoVisual)
    setManual(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Recomendación: primer paso pendiente de la secuencia del programa
  const posicionesDe = (grupo: string) => [
    ...new Set(clases.filter((c) => c.grupo === grupo).flatMap((c) => c.estimulos_rft.map((e) => e.posicion).filter(Boolean) as string[])),
  ]
  const recomendacionGlobal = recomendarBloque(
    secuenciaPrograma,
    nivel,
    grupos.map((g) => ({ grupo: g, posiciones: posicionesDe(g) })),
    dominioForma
  )
  // Solo se da por completada la secuencia si el grupo tiene algo dominado
  const grupoConDatos = dominioForma.some((d) => d.grupo === grupoSeleccionado)
  const recomendacionGrupo = grupoSeleccionado
    ? recomendarBloque(secuenciaPrograma, nivel, [{ grupo: grupoSeleccionado, posiciones: posicionesDe(grupoSeleccionado) }], dominioForma)
    : null
  const clasesCon = (grupo: string, origen: string, destino: string) =>
    clases.filter((c) => c.grupo === grupo && encontrarEstimulo(c, origen) && encontrarEstimulo(c, destino))

  // Clases del grupo que se pueden mostrar en la tableta
  const clasesTableta = (grupo: string, origen: string, destino: string) =>
    clasesCon(grupo, origen, destino).filter((c) => presentable(c, origen, destino))
  // Se puede presentar en pantalla si el alumno elige un estímulo y al menos 2
  // clases tienen sus estímulos con imagen del banco o como palabras que se
  // dicen; las demás se quedan fuera del bloque (con aviso)
  const tabletaPosible = (grupo: string, origen: string, destino: string, faseBloque: string) => {
    const tipo = configRespuesta(respuesta, faseBloque).tipo
    if (tipo === 'opciones') {
      // Cada clase necesita su frase y su respuesta esperada para corregirse sola
      const conFrase = clasesCon(grupo, origen, destino).filter(
        (c) => !!respuestaEsperada(c.respuestas_esperadas, faseBloque, origen, destino) && !!leerConsignasClase(c.consignas)[`${faseBloque}:${origen}→${destino}`]
      )
      return conFrase.length > 0 && conFrase.length === clasesCon(grupo, origen, destino).length
    }
    if (tipo === 'orden') {
      // Ordenar: opciones de la propia clase (3 o más miembros) y el orden esperado en cada clase
      const cs = clasesCon(grupo, origen, destino)
      return opcionesClase && cs.length > 0 && cs.every((c) => c.estimulos_rft.length >= 3 && !!respuestaEsperada(c.respuestas_esperadas, faseBloque, origen, destino))
    }
    if (tipo !== 'seleccion') return false
    const validas = clasesTableta(grupo, origen, destino)
    if (validas.length < 2) return false
    // Con opciones de la propia clase todo se dice en audio (clave y opciones):
    // no hace falta que ningún estímulo tenga imagen
    if (opcionesClase) return true
    return validas.some((c) => esVisible(encontrarEstimulo(c, origen)!) || esVisible(encontrarEstimulo(c, destino)!))
  }
  const fueraDeTableta = (grupo: string, origen: string, destino: string) =>
    clasesCon(grupo, origen, destino).length - clasesTableta(grupo, origen, destino).length
  const modoPara = (grupo: string, origen: string, destino: string, faseBloque: string) =>
    modo === 'tableta' && tabletaPosible(grupo, origen, destino, faseBloque) ? 'tableta' : 'material'

  // Aprendizaje sin error: solo en entrenamiento, en la tableta y si las
  // opciones se ven en pantalla. El escalón sale del último bloque hecho con él
  const escalonPara = (
    grupo: string,
    origen: string,
    destino: string,
    faseBloque: string,
    modoBloque: 'material' | 'tableta',
    validas: Clase[]
  ): EscalonActivo | null => {
    // Como hablante no hay opciones en pantalla: sin aprendizaje sin error
    if (forma === 'hablante' || !sinError?.activo || sinError.modo !== 'mayor_a_menor' || faseBloque !== 'entrenamiento' || modoBloque !== 'tableta') return null
    if (!validas.every((c) => esVisible(encontrarEstimulo(c, destino)!))) return null
    const { indice } = siguienteEscalon(sinError, leerEscalonBloque(ultimosEscalones[`${grupo}__${origen}__${destino}`]))
    const escalon = sinError.escalones[indice]
    const disponibles = validas.length + distractoresExtra(grupo, destino, validas).length
    return {
      indice,
      total: sinError.escalones.length,
      escalon,
      comparaciones: Math.min(escalon.comparaciones ?? validas.length, disponibles),
      tamano: sinError.tamano,
    }
  }
  // Ayudas de menor a mayor: mismas condiciones (entrenamiento, tableta, opciones visibles)
  const menorAMayorPara = (destino: string, faseBloque: string, modoBloque: 'material' | 'tableta', validas: Clase[]) =>
    forma === 'oyente' &&
    !!sinError?.activo &&
    sinError.modo === 'menor_a_mayor' &&
    faseBloque === 'entrenamiento' &&
    modoBloque === 'tableta' &&
    validas.every((c) => esVisible(encontrarEstimulo(c, destino)!))
  const apoyoRecomendado = (rec: Recomendacion) => {
    const m = modoPara(rec.grupo, rec.paso.origen, rec.paso.destino, rec.paso.fase)
    const validas = clasesCon(rec.grupo, rec.paso.origen, rec.paso.destino)
    return (
      <LineaApoyo
        escalon={escalonPara(rec.grupo, rec.paso.origen, rec.paso.destino, rec.paso.fase, m, validas)?.escalon ?? null}
        menorAMayor={menorAMayorPara(rec.paso.destino, rec.paso.fase, m, validas)}
      />
    )
  }

  // Ejemplo con los estímulos reales de la primera clase que encaja
  const ejemploDe = (rec: Recomendacion) => {
    const clase = clasesCon(rec.grupo, rec.paso.origen, rec.paso.destino)[0]
    const origen = clase && encontrarEstimulo(clase, rec.paso.origen)
    const destino = clase && encontrarEstimulo(clase, rec.paso.destino)
    return origen && destino ? `${origen.nombre} → ${destino.nombre}` : null
  }

  const empezarRecomendado = (rec: Recomendacion) => {
    const validas = clasesCon(rec.grupo, rec.paso.origen, rec.paso.destino)
    if (validas.length < 2) {
      toast(`Necesitas al menos 2 clases con las posiciones ${rec.paso.origen} y ${rec.paso.destino} en "${rec.grupo}".`, 'error')
      return
    }
    const requiere = (FASES_QUE_REQUIEREN_CONEXION as readonly string[]).includes(rec.paso.fase)
    if (requiere && !estanConectadas(construirGrafoEntrenado(entrenamientosDominados, rec.grupo), rec.paso.origen, rec.paso.destino)) {
      toast('Antes hay que dominar en entrenamiento una cadena de relaciones que conecte esas posiciones.', 'error')
      return
    }
    setGrupoSeleccionado(rec.grupo)
    setFase(rec.paso.fase)
    setPosicionOrigen(rec.paso.origen)
    setPosicionDestino(rec.paso.destino)
    setTipoSonda('normal')
    const modoInicial = modoPara(rec.grupo, rec.paso.origen, rec.paso.destino, rec.paso.fase)
    const enPantalla = modoInicial === 'tableta' ? clasesTableta(rec.grupo, rec.paso.origen, rec.paso.destino) : validas
    iniciarBloque(
      enPantalla,
      modoInicial,
      escalonPara(rec.grupo, rec.paso.origen, rec.paso.destino, rec.paso.fase, modoInicial, enPantalla),
      menorAMayorPara(rec.paso.destino, rec.paso.fase, modoInicial, enPantalla)
    )
  }

  const registrar = (
    correcto: boolean,
    ayuda: string,
    pregunta?: string,
    respuestaAlumno?: string | null,
    extra: { nivelAyuda?: number; transferencia?: { correcto: boolean; respuesta: string | null; latenciaMs: number } } = {}
  ) => {
    if (!secuencia) return
    const claseActual = secuencia[ensayos.length]
    const origen = encontrarEstimulo(claseActual, posicionOrigen)!
    const destino = encontrarEstimulo(claseActual, posicionDestino)!
    if (extra.transferencia) {
      transferenciasRef.current = [
        ...transferenciasRef.current,
        { claseId: claseActual.id, estimuloOrigenId: origen.id, estimuloDestinoId: destino.id, ...extra.transferencia },
      ]
    }

    const nuevos = [
      ...ensayos,
      {
        claseId: claseActual.id,
        claseNombre: claseActual.nombre,
        estimuloOrigenId: origen.id,
        estimuloOrigenNombre: origen.nombre,
        estimuloDestinoId: destino.id,
        estimuloDestinoNombre: destino.nombre,
        pregunta,
        correcto,
        ayuda,
        latenciaMs: cronometro.leer(),
        respuesta: respuestaAlumno ?? null,
        nivelAyuda: extra.nivelAyuda ?? null,
      },
    ]
    setEnsayos(nuevos)
    setMostrandoAyudas(false)
    setPreguntaActual('')
    setRespuestaPendiente(null)
    setRespuestaAbierta('')

    if (nuevos.length === secuencia.length) {
      const duracion = segundosDesde(inicioBloque)
      setDuracionBloque(duracion)
      intentarGuardar(nuevos, notas, grupoSeleccionado!, faseEfectiva, posicionOrigen, posicionDestino, clasesValidas.length, duracion)
    }
  }

  const deshacerUltimo = () => {
    setTras(null)
    setCorreccion(null)
    setEnsayos((prev) => prev.slice(0, -1))
  }

  // En la tableta, descarga al empezar las claves grabadas de todo el bloque
  // (así suenan sin esperas y aunque se corte la conexión)
  useEffect(() => {
    if (!enTableta || !secuencia) return
    const programa = leerConsignasPrograma(consignas)
    for (const clase of new Set(secuencia)) {
      const origen = encontrarEstimulo(clase, posicionOrigen)
      if (!origen) continue
      const texto =
        consignaPara(programa, leerConsignasClase(clase.consignas), faseEfectiva, posicionOrigen, posicionDestino, textoOido(origen.nombre)) ??
        (esOido(origen) ? textoOido(origen.nombre) : null)
      if (texto) void precargarFraseRft(texto)
      // Palabras oídas de las opciones (tests por selección entre palabras)
      if (sinError?.seleccionOida) {
        const destino = encontrarEstimulo(clase, posicionDestino)
        if (destino && esOido(destino)) void precargarFraseRft(textoOido(destino.nombre).toLowerCase())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enTableta, secuencia])

  // Guarda el progreso en el dispositivo según se registra cada ensayo
  useEffect(() => {
    if (!secuencia) return
    guardarProgreso(claveProgreso, {
      secuencia,
      ensayos,
      notas,
      grupoSeleccionado,
      fase: faseEfectiva,
      posicionOrigen,
      posicionDestino,
      tamanoBloque,
      inicioBloque,
      duracionBloque,
      controles,
      modo: modoBloqueRef.current,
      forma: formaBloqueRef.current,
      apoyoVisual: apoyoVisualBloqueRef.current,
      escalon: escalonRef.current,
      menorAMayor: menorAMayorRef.current,
      transferencias: transferenciasRef.current,
    })
  }, [secuencia, ensayos, notas, grupoSeleccionado, faseEfectiva, posicionOrigen, posicionDestino, tamanoBloque, inicioBloque, duracionBloque, controles, claveProgreso, escalonBloque, menorAMayorBloque])

  if (resultado) {
    const hayDominio = resultado.clasesDominadasAhora.length > 0
    return (
      <div className={`rounded-2xl border p-4 sm:p-6 text-center space-y-3 ${
        hayDominio ? 'border-amber-300 bg-amber-50' : 'border-emerald-200 bg-emerald-50'
      }`}>
        {hayDominio && <p className="text-2xl">🎉</p>}
        <p className={`text-base sm:text-lg font-semibold ${hayDominio ? 'text-amber-800' : 'text-emerald-800'}`}>
          {hayDominio
            ? resultado.derivado
              ? `¡Derivado en ${resultado.clasesDominadasAhora.join(', ')}! (superado en un solo bloque, sin ayudas)`
              : `¡Dominio conseguido en ${resultado.clasesDominadasAhora.join(', ')}!`
            : `Bloque guardado — ${resultado.porcentaje}% de acierto`}
          {hayDominio && <AyudaTermino clave={resultado.derivado ? 'derivado' : 'dominado'} />}
        </p>
        {hayDominio && (
          <p className="text-sm text-amber-700">{resultado.porcentaje}% de acierto en este último bloque</p>
        )}
        {resultado.escalon && sinError && (() => {
          const { indice, movimiento } = siguienteEscalon(sinError, resultado.escalon)
          return (
            <p className="text-sm text-slate-600">
              {resultado.escalon.nombre}: {resultado.escalon.aciertos_con_apoyo}% de aciertos con o sin ayuda en pantalla
              {movimiento && <strong className="block text-amber-800">{textoMovimiento(movimiento, sinError.escalones[indice])}</strong>}
              {!resultado.escalon.final && <span className="block text-xs text-slate-500">Los bloques con apoyo no cuentan para el dominio.</span>}
            </p>
          )
        })()}
        {resultado.transferencias.total > 0 && (
          <p className="text-sm text-slate-600">
            Ensayos de transferencia: {resultado.transferencias.aciertos}/{resultado.transferencias.total} correctos sin ayuda (no
            cuentan para el %)
          </p>
        )}
        {resultado.controles.total > 0 && (
          <p className="text-sm text-slate-600">
            Ensayos de control: {resultado.controles.aciertos}/{resultado.controles.total} correctos (no cuentan para el dominio)
          </p>
        )}
        {pasosTrasBloque === null ? (
          <p className="text-xs text-slate-400">Calculando el siguiente paso…</p>
        ) : (
          <PanelSiguientePaso pasos={pasosTrasBloque} onPreparar={preparar} />
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            onClick={() => {
              setResultado(null)
              setSecuencia(null)
              setEstadoGuardado('idle')
              setManual(false)
              // Trae lo dominado con este bloque para recomendar el siguiente
              router.refresh()
            }}
            className="py-3 sm:py-2 text-base sm:text-sm"
          >
            Registrar otro bloque
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`/dashboard/programas-rft/${programaAlumnoId}`)}
            className="py-3 sm:py-2 text-base sm:text-sm"
          >
            Volver al programa
          </Button>
        </div>
      </div>
    )
  }

  if (estadoGuardado === 'pendiente' || estadoGuardado === 'error') {
    return (
      <PantallaGuardadoPendiente
        tipo={estadoGuardado}
        reintentando={isPending}
        onReintentar={() =>
          intentarGuardar(ensayos, notas, grupoSeleccionado!, faseEfectiva, posicionOrigen, posicionDestino, clasesValidas.length, duracionBloque)
        }
        onVolver={() => router.push(`/dashboard/programas-rft/${programaAlumnoId}`)}
      />
    )
  }

  if (pendiente && !secuencia) {
    return (
      <Panel className="space-y-4 p-4 sm:p-6">
        <div>
          <p className="font-semibold text-slate-800">Hay un bloque sin terminar en este dispositivo</p>
          <p className="text-sm text-slate-600">
            {pendiente.grupoSeleccionado} · {NOMBRE_FASE_SECUENCIA[pendiente.fase as FaseSecuencia] ?? pendiente.fase}{' '}
            {pendiente.posicionOrigen}→{pendiente.posicionDestino} · {pendiente.ensayos.length} de {pendiente.secuencia.length} ensayos
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={() => {
              restaurar(pendiente)
              setPendiente(null)
            }}
            className="py-3 text-base sm:py-2 sm:text-sm"
          >
            Continuar ese bloque
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              borrarProgreso(claveProgreso)
              setPendiente(null)
            }}
            className="py-3 text-base sm:py-2 sm:text-sm"
          >
            Descartarlo y empezar otro
          </Button>
        </div>
        <p className="text-xs text-slate-500">Si lo descartas, esos ensayos no se guardan.</p>
      </Panel>
    )
  }

  if (!grupoSeleccionado) {
    return (
      <Panel className="p-4 sm:p-6 space-y-4">
        {recomendacionGlobal && (
          <TarjetaRecomendacion
            rec={recomendacionGlobal}
            conGrupo
            ejemplo={ejemploDe(recomendacionGlobal)}
            tamanoBloque={tamanoBloque}
            onTamano={setTamanoBloque}
            onEmpezar={() => empezarRecomendado(recomendacionGlobal)}
            apoyo={apoyoRecomendado(recomendacionGlobal)}
            selectorModo={
              <SelectorModo
                disponible={tabletaPosible(recomendacionGlobal.grupo, recomendacionGlobal.paso.origen, recomendacionGlobal.paso.destino, recomendacionGlobal.paso.fase)}
                fuera={fueraDeTableta(recomendacionGlobal.grupo, recomendacionGlobal.paso.origen, recomendacionGlobal.paso.destino)}
                modo={modo}
                onCambiar={setModo} conTexto={conTexto} onTexto={cambiarTexto} textoFijo={sinAudio} forma={forma} onForma={setForma} apoyoVisual={sinAudio ? apoyoVisual : undefined} onApoyoVisual={setApoyoVisual} soloTableta={soloTableta}
              />
            }
          />
        )}
        <PanelSiguientePaso pasos={siguientesPasos} onPreparar={preparar} />
        <p className="text-sm font-medium text-slate-600">
          {recomendacionGlobal ? 'O elige un grupo:' : '¿Qué grupo de clases vas a trabajar?'}
        </p>
        <div className="flex flex-wrap gap-2">
          {grupos.map((g) => (
            <button
              key={g}
              onClick={() => setGrupoSeleccionado(g)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 sm:py-2 text-base sm:text-sm font-medium hover:bg-slate-50"
            >
              {g}
            </button>
          ))}
        </div>
        {grupos.length === 0 && (
          <p className="text-sm text-slate-500">No hay clases todavía en este programa.</p>
        )}
      </Panel>
    )
  }

  if (!secuencia && recomendacionGrupo && !manual) {
    return (
      <Panel className="p-4 sm:p-6 space-y-4">
        {sinConexion && <BannerSinConexion />}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">{grupoSeleccionado}</p>
          {!grupoInicial && (
            <button onClick={() => setGrupoSeleccionado(null)} className="text-xs text-indigo-600 hover:underline">
              Cambiar grupo
            </button>
          )}
        </div>
        <TarjetaRecomendacion
          rec={recomendacionGrupo}
          conGrupo={false}
          ejemplo={ejemploDe(recomendacionGrupo)}
          tamanoBloque={tamanoBloque}
          onTamano={setTamanoBloque}
          onEmpezar={() => empezarRecomendado(recomendacionGrupo)}
          apoyo={apoyoRecomendado(recomendacionGrupo)}
          selectorModo={
            <SelectorModo
              disponible={tabletaPosible(recomendacionGrupo.grupo, recomendacionGrupo.paso.origen, recomendacionGrupo.paso.destino, recomendacionGrupo.paso.fase)}
              fuera={fueraDeTableta(recomendacionGrupo.grupo, recomendacionGrupo.paso.origen, recomendacionGrupo.paso.destino)}
              modo={modo}
              onCambiar={setModo} conTexto={conTexto} onTexto={cambiarTexto} textoFijo={sinAudio} forma={forma} onForma={setForma} apoyoVisual={sinAudio ? apoyoVisual : undefined} onApoyoVisual={setApoyoVisual} soloTableta={soloTableta}
            />
          }
        />
        <PanelSiguientePaso pasos={siguientesPasos} grupo={grupoSeleccionado} onPreparar={preparar} />
        <button onClick={() => setManual(true)} className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Elegir otra combinación o una sonda →
        </button>
      </Panel>
    )
  }

  if (!secuencia) {
    return (
      <Panel className="p-4 sm:p-6 space-y-4">
        {sinConexion && <BannerSinConexion />}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{grupoSeleccionado}</p>
            <p className="text-xs text-slate-400">Nivel: {NOMBRE_NIVEL_RFT[nivel]}</p>
          </div>
          {!grupoInicial && (
            <button
              onClick={() => setGrupoSeleccionado(null)}
              className="text-xs text-indigo-600 hover:underline"
            >
              Cambiar grupo
            </button>
          )}
        </div>

        <PanelSiguientePaso pasos={siguientesPasos} grupo={grupoSeleccionado} titulo="Lo que propone la app" />
        {recomendacionGrupo ? (
          <button onClick={() => setManual(false)} className="text-sm font-medium text-indigo-600 hover:underline">
            ← Volver al bloque recomendado
          </button>
        ) : grupoConDatos ? (
          <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">
            Secuencia del programa completada en este grupo: puedes registrar sondas de mantenimiento o generalización, o
            trabajar otro grupo.
          </p>
        ) : (
          <p className="rounded-lg bg-amber-50 p-2 text-sm text-amber-800">
            No hay un bloque recomendado para este grupo: elige la fase y las posiciones a mano.
          </p>
        )}

        <div className="space-y-1">
          <label className="text-sm text-slate-600">
            Fase
            <AyudaTermino clave={GLOSARIO_POR_FASE[fase] ?? 'entrenamiento'} />
          </label>
          <select
            value={fase}
            onChange={(e) => setFase(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          >
            {FASES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
            {fase === 'entrenamiento' &&
              'Elige la posición que enseñas como muestra (Origen) y con la que se relaciona (Destino). Ej.: para entrenar A→B, Origen=A, Destino=B. Para abstracción de clave relacional, usa la MISMA posición en ambos (ej. A→A).'}
            {fase === 'test_mutuo' &&
              'Usa la posición INVERSA a la que entrenaste. Ej.: si entrenaste A→B, aquí Origen=B, Destino=A. Se evalúa en un solo bloque: si lo supera sin ayudas, se considera DERIVADO. Si no, repite el test marcando "Correcto con ayuda" cuando haga falta — a partir de ahí se le exige el mismo criterio que a un entrenamiento para darlo por DOMINADO.'}
            {fase === 'test_combinatorio' &&
              'Usa las posiciones que NO entrenaste directamente, pero que deberían emerger. Ej.: si entrenaste A→B y B→C, aquí Origen=A, Destino=C (o al revés). Se evalúa en un solo bloque: si lo supera sin ayudas, se considera DERIVADO. Si no, repite el test marcando "Correcto con ayuda" cuando haga falta — a partir de ahí se le exige el mismo criterio que a un entrenamiento para darlo por DOMINADO.'}
            {fase === 'transformacion_funciones' &&
              'Origen = posición conocida (con significado real). Destino = posición desconocida, sobre la que preguntas. Se evalúa en un solo bloque: si lo supera sin ayudas, se considera DERIVADO. Si no, repite marcando "Correcto con ayuda" cuando haga falta — a partir de ahí se le exige el mismo criterio que a un entrenamiento para darlo por DOMINADO.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-slate-600 block min-h-[40px] sm:min-h-[20px]">
              {fase === 'transformacion_funciones' ? 'Posición conocida' : 'Posición muestra'}
              <AyudaTermino clave="muestra_comparacion" />
            </label>
            <select
              value={posicionOrigen}
              onChange={(e) => setPosicionOrigen(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            >
              <option value="">-</option>
              {posicionesDisponibles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-600 block min-h-[40px] sm:min-h-[20px]">
              {fase === 'transformacion_funciones' ? 'Posición desconocida' : 'Posición comparativos'}
            </label>
            <select
              value={posicionDestino}
              onChange={(e) => setPosicionDestino(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            >
              <option value="">-</option>
              {posicionesDisponibles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {posicionOrigen && posicionDestino && (
          <p className="text-xs text-slate-500">
            {clasesValidas.length} clase(s) del grupo tienen ambas posiciones — se usarán como
            comparativos entre sí.
            {clasesSinPosiciones > 0 && (
              <span className="block mt-1 font-medium text-amber-700">
                ⚠ {clasesSinPosiciones} clase(s) de "{grupoSeleccionado}" no tienen las posiciones{' '}
                {posicionOrigen} y/o {posicionDestino} y se quedan fuera de este bloque — revisa si
                les falta esa posición o está mal etiquetada.
              </span>
            )}
          </p>
        )}

        {requiereConexion && posicionOrigen && posicionDestino && !conectadas && (
          <p className="text-xs font-medium text-rose-700 bg-rose-50 rounded-lg p-2">
            ⚠ Todavía no se puede probar {posicionOrigen}→{posicionDestino}: hace falta dominar antes
            en entrenamiento una cadena de relaciones que conecte {posicionOrigen} con{' '}
            {posicionDestino}.{' '}
            {relacionesYaDominadas.length > 0
              ? `Relaciones ya dominadas en "${grupoSeleccionado}": ${relacionesYaDominadas.join(', ')}.`
              : `Todavía no hay ninguna relación dominada en entrenamiento en este grupo.`}
          </p>
        )}

        {puedeSonda && (
          <div className="space-y-1">
            <p className="text-sm text-slate-600">
              Tipo de bloque
              <AyudaTermino clave="sonda_mantenimiento" />
              <AyudaTermino clave="sonda_generalizacion" />
            </p>
            <div className="flex gap-2">
              {(['normal', 'mantenimiento', 'generalizacion'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipoSonda(t)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium ${
                    tipoSonda === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t === 'normal' ? 'Normal' : t === 'mantenimiento' ? 'Sonda de mantenimiento' : 'Sonda de generalización'}
                </button>
              ))}
            </div>
            {tipoSonda !== 'normal' && (
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
                Esta combinación ya está dominada — este bloque se guardará como sonda de{' '}
                {tipoSonda === 'mantenimiento' ? 'mantenimiento' : 'generalización'} y no afecta al
                cálculo de dominio.
              </p>
            )}
          </div>
        )}

        {grupoSeleccionado && posicionOrigen && posicionDestino && tabletaPosible(grupoSeleccionado, posicionOrigen, posicionDestino, faseEfectiva) && (
          <div className="space-y-1">
            <p className="text-sm text-slate-600">Presentación</p>
            <span className="inline-flex rounded-lg bg-slate-100 p-0.5">
              <SelectorModo disponible modo={modo} onCambiar={setModo} conTexto={conTexto} onTexto={cambiarTexto} textoFijo={sinAudio} forma={forma} onForma={setForma} apoyoVisual={sinAudio ? apoyoVisual : undefined} onApoyoVisual={setApoyoVisual} soloTableta={soloTableta} fuera={fueraDeTableta(grupoSeleccionado, posicionOrigen, posicionDestino)} />
            </span>
            {(() => {
              const m = modoPara(grupoSeleccionado, posicionOrigen, posicionDestino, faseEfectiva)
              return (
                <LineaApoyo
                  escalon={escalonPara(grupoSeleccionado, posicionOrigen, posicionDestino, faseEfectiva, m, clasesValidas)?.escalon ?? null}
                  menorAMayor={menorAMayorPara(posicionDestino, faseEfectiva, m, clasesValidas)}
                />
              )
            })()}
          </div>
        )}

        <div className="space-y-1">
          <p className="text-sm text-slate-600">Tamaño del bloque</p>
          <div className="flex gap-2">
            {[10, 20].map((n) => (
              <button
                key={n}
                onClick={() => setTamanoBloque(n)}
                className={`flex-1 sm:flex-none rounded-lg px-4 py-3 sm:py-2 text-base sm:text-sm font-medium ${
                  tamanoBloque === n
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {n} ensayos
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={empezarBloque}
          disabled={!posicionOrigen || !posicionDestino || !conectadas}
          className="w-full rounded-lg bg-slate-800 py-4 sm:py-3 text-base font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          Generar secuencia y empezar
        </button>
      </Panel>
    )
  }

  const claseActual = secuencia[ensayos.length]

  if (!claseActual) {
    return (
      <Panel className="p-8 text-center">
        <p className="text-slate-500">Guardando bloque...</p>
      </Panel>
    )
  }

  const origenActual = encontrarEstimulo(claseActual, posicionOrigen)!
  // Clave relacional del ensayo: la dice la tableta y la lee el terapeuta con material
  const consignaActual = consignaPara(
    leerConsignasPrograma(consignas),
    leerConsignasClase(claseActual.consignas),
    faseEfectiva,
    posicionOrigen,
    posicionDestino,
    textoOido(origenActual.nombre)
  )
  // Sin pregunta escrita, se registra la consigna como pregunta del ensayo
  const preguntaRegistro = preguntaActual.trim() || consignaActual || ''
  const esTransformacion = fase === 'transformacion_funciones'
  // La fase elegida decide el tipo de respuesta (las sondas usan el de su fase)
  // Las opciones fijas pueden ser propias de la clase (p. ej. las funciones de su red)
  const configPrograma = configRespuesta(respuesta, fase)
  const config = {
    ...configPrograma,
    opciones: opcionesDeClase(claseActual.opciones_por_fase, fase, posicionOrigen, posicionDestino) ?? configPrograma.opciones,
  }
  const esperada =
    respuestaEsperada(claseActual.respuestas_esperadas, fase, posicionOrigen, posicionDestino)
  const conPregunta = esTransformacion || config.tipo === 'opciones' || config.tipo === 'abierta'
  const etiquetas =
    config.tipo === 'ejecucion'
      ? { correcto: '✓ Lo hace sin ayuda', ayuda: '✓ Lo hace con ayuda', incorrecto: '✗ No lo hace' }
      : { correcto: '✓ Correcto sin ayuda', ayuda: '✓ Correcto con ayuda', incorrecto: '✗ Incorrecto' }
  const respuestaRegistrada = config.tipo === 'abierta' ? respuestaAbierta.trim() || null : null

  const anadirControl = (correcto: boolean) => {
    fijarControles([
      ...controles,
      {
        claseId: claseActual.id,
        estimuloOrigenId: origenActual.id,
        pregunta: controlPregunta.trim(),
        respuesta: controlRespuesta.trim() || null,
        correcto,
      },
    ])
    setControlPregunta('')
    setControlRespuesta('')
    setControlAbierto(false)
  }

  if (enTableta) {
    return (
      <PantallaTablet
        origen={origenActual}
        comparativos={comparativos}
        fase={faseEfectiva}
        ensayo={ensayos.length}
        total={secuencia.length}
        imagenes={imagenes}
        apoyo={
          escalonBloque && {
            nombre: escalonBloque.escalon.nombre,
            opacidad: escalonBloque.escalon.opacidad,
            tamano: escalonBloque.tamano,
            demora: escalonBloque.escalon.demora,
          }
        }
        observacion={!!sinError?.observacion}
        seleccionOida={!!sinError?.seleccionOida || opcionesClase || configRespuesta(respuesta, fase).tipo === 'opciones'}
        menorAMayor={menorAMayorBloque}
        consigna={consignaActual}
        sinMuestra={opcionesClase}
        alternarEjemplares={alternarEjemplares}
        sinVozAutomatica={sinAudio || !!claseActual.generado}
        sinAudio={sinAudio}
        conTexto={conTexto}
        hablante={formaBloque === 'hablante'}
        apoyoVisual={apoyoVisualBloque}
        ordenEsperado={
          configRespuesta(respuesta, fase).tipo === 'orden'
            ? (respuestaEsperada(claseActual.respuestas_esperadas, fase, posicionOrigen, posicionDestino) ?? '').split(',').map((x) => x.trim()).filter(Boolean)
            : undefined
        }
        // Corrección del error en entrenamiento (modelo y repetición sin ayuda), salvo con
        // aprendizaje sin error, que ya tiene su propia forma de evitar el error
        correccion={!escalonBloque}
        ayudasPosibles={ayudasPosibles}
        onResponder={(correcto, ayuda, respuestaAlumno, extra) => registrar(correcto, ayuda, undefined, respuestaAlumno, extra)}
        onMuestra={() => cronometro.reiniciar()}
        onPrimeraRespuesta={() => cronometro.capturar()}
        onSalir={() => setEnTableta(false)}
      />
    )
  }

  // ── Registro con material: la misma pantalla que la tableta, vista por el
  // terapeuta. Toca lo que ha elegido el alumno y la app corrige; la guía dice
  // qué colocar, qué decir y qué hacer después; «Siguiente ensayo» da tiempo a
  // reforzar y preparar el material ──
  const esTest = faseEfectiva !== 'entrenamiento'
  const hablanteMaterial = formaBloque === 'hablante'
  const nombreVisible = (nombre: string) => textoOido(nombre)
  const correctaActual =
    config.tipo === 'seleccion'
      ? (() => {
          const c = comparativos.find((x) => x.esCorrecto)
          return c ? nombreVisible(c.estimulo.nombre) : null
        })()
      : esperada ?? null
  const etiquetaAyudaPendiente = etiquetaAyuda(ayudaPendiente)
  // Corrección del error: solo en entrenamiento, como oyente, sin ayudas
  // automáticas de pantalla y con una respuesta que se pueda repetir
  const correccionPosible = !esTest && !hablanteMaterial && !menorAMayorBloque && !escalonBloque && config.tipo !== 'abierta'
  // Registra y, si no es el último ensayo, deja a la vista el resultado hasta «Siguiente ensayo»
  const registrarMaterial = (correcto: boolean, respuestaAlumno: string | null) => {
    const ultimo = ensayos.length + 1 >= secuencia.length
    // Repetición tras la corrección: el ensayo cuenta como el error de la primera
    // respuesta y la repetición se guarda aparte (no cuenta para el porcentaje)
    if (correccion?.paso === 'repetir') {
      registrar(false, 'independiente', preguntaRegistro, correccion.primera, {
        transferencia: { correcto, respuesta: respuestaAlumno, latenciaMs: marcaDeTiempo() - correccion.inicio },
      })
      setCorreccion(null)
      setAyudaPendiente(null)
      setVerRespuesta(false)
      if (!ultimo) setTras({ correcto: false, ayuda: 'independiente', correcta: correctaActual, test: false, repeticion: correcto })
      return
    }
    if (!correcto && correccionPosible) {
      cronometro.capturar()
      setAyudaPendiente(null)
      setMostrandoAyudas(false)
      setRespuestaPendiente(null)
      setCorreccion({ paso: 'modelo', primera: respuestaAlumno, inicio: 0 })
      return
    }
    const ayuda = correcto && ayudaPendiente ? ayudaPendiente : 'independiente'
    registrar(correcto, ayuda, preguntaRegistro, respuestaAlumno)
    setAyudaPendiente(null)
    setVerRespuesta(false)
    if (!ultimo) setTras({ correcto, ayuda, correcta: correctaActual, test: esTest })
  }
  const siguienteEnsayo = () => {
    setTras(null)
    cronometro.reiniciar()
  }
  const guia: { titulo: string; texto: string }[] = []
  if (correccion?.paso === 'modelo')
    guia.push({
      titulo: 'Corrección (1 de 2):',
      texto:
        config.tipo === 'ejecucion'
          ? 'hágalo usted como modelo y ayúdele a hacerlo. Cuando lo haya hecho con su ayuda, pulse «Hecho».'
          : `retire las otras opciones y deje solo «${correctaActual ?? 'la correcta'}». Diga otra vez la consigna y ayúdele a elegirla. Cuando lo haya hecho, pulse «Hecho».`,
    })
  else if (correccion?.paso === 'repetir')
    guia.push({
      titulo: 'Corrección (2 de 2):',
      texto:
        config.tipo === 'ejecucion'
          ? 'repita la instrucción sin ayuda. ¿Lo hace?'
          : 'vuelva a colocar todo como al principio y repita el ensayo sin ayuda. Toque lo que elija. Esta respuesta se guarda aparte y no cuenta para el porcentaje.',
    })
  if (correccion && consignaActual) guia.push({ titulo: 'Diga', texto: `«${consignaActual}»` })
  if (correccion) {
    // solo la guía de la corrección
  } else {
  if (hablanteMaterial)
    guia.push({ titulo: 'Como hablante:', texto: 'diga la consigna sin presentar las opciones; el alumno responde y usted marca si es correcto.' })
  if (apoyoVisualBloque)
    guia.push({ titulo: 'Con fichas iguales:', texto: 'coloque una ficha igual por cada nombre de la red y señálela al decirlo. Este bloque no cuenta para el dominio.' })
  if (config.tipo === 'seleccion' && !hablanteMaterial)
    guia.push({
      titulo: 'Coloque',
      texto: `${esTransformacion ? '' : `«${nombreVisible(origenActual.nombre)}» delante del alumno y, debajo, `}de izquierda a derecha: ${comparativos.map((c) => `«${nombreVisible(c.estimulo.nombre)}»`).join(', ')}.`,
    })
  if (config.tipo === 'opciones') guia.push({ titulo: 'Lea', texto: 'la frase en voz alta y espere a que el alumno responda.' })
  if (config.tipo === 'ejecucion') guia.push({ titulo: 'Presente', texto: `«${nombreVisible(origenActual.nombre)}».` })
  if (consignaActual) guia.push({ titulo: 'Diga', texto: `«${consignaActual}»` })
  else if (config.tipo !== 'opciones') guia.push({ titulo: 'Diga', texto: 'la instrucción del programa (está en «⋯ › Instrucciones»).' })
  guia.push(
    esTest
      ? { titulo: 'Es un test:', texto: 'no diga si está bien o mal ni dé ayudas; solo registre.' }
      : { titulo: 'Toque', texto: config.tipo === 'seleccion' && !hablanteMaterial ? 'lo que haya elegido el alumno.' : 'la respuesta del alumno.' }
  )
  if (etiquetaAyudaPendiente) guia.push({ titulo: `Ayuda: ${etiquetaAyudaPendiente}.`, texto: 'Se anotará en la próxima respuesta correcta.' })
  }

  const botonVerRespuesta = correctaActual && (
    <button
      type="button"
      onPointerDown={() => setVerRespuesta(true)}
      onPointerUp={() => setVerRespuesta(false)}
      onPointerLeave={() => setVerRespuesta(false)}
      onPointerCancel={() => setVerRespuesta(false)}
      onContextMenu={(e) => e.preventDefault()}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 [touch-action:none]"
    >
      {verRespuesta ? (
        <span>
          Correcta: <strong className="text-emerald-700">{correctaActual}</strong>
        </span>
      ) : (
        '👁 Ver respuesta (mantener pulsado)'
      )}
    </button>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      {sinConexion && <BannerSinConexion />}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2 text-sm text-slate-500">
          <span aria-live="polite">
            {NOMBRE_FASE_SECUENCIA[faseEfectiva as FaseSecuencia] ?? faseEfectiva} · ensayo <strong>{ensayos.length + 1}</strong> de {secuencia.length}
            {correccion && <span className="ml-2 font-medium text-amber-700">· corrección</span>}
          </span>
          <span className="flex flex-wrap items-center gap-2">
            {grupoSeleccionado && tabletaPosible(grupoSeleccionado, posicionOrigen, posicionDestino, faseEfectiva) && (
              <button
                onClick={() => {
                  // Si aún no hay ensayos, el bloque pasa a hacerse con el escalón de apoyo que toque
                  if (ensayos.length === 0 && !escalonRef.current) {
                    fijarEscalon(escalonPara(grupoSeleccionado, posicionOrigen, posicionDestino, faseEfectiva, 'tableta', clasesValidas))
                    fijarMenorAMayor(menorAMayorPara(posicionDestino, faseEfectiva, 'tableta', clasesValidas))
                  }
                  desbloquearAudio()
                  modoBloqueRef.current = 'tableta'
                  setTras(null)
                  setEnTableta(true)
                }}
                className="rounded-lg border border-slate-200 px-3 py-1 font-medium text-indigo-600 hover:bg-indigo-50"
              >
                🖥 Pantalla del alumno
              </button>
            )}
            {!esTest && !tras && !correccion && (
              <button
                onClick={() => setMostrandoAyudas((v) => !v)}
                className={`rounded-lg border px-3 py-1 ${ayudaPendiente ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                {etiquetaAyudaPendiente ? `Ayuda: ${etiquetaAyuda}` : 'Ayuda'}
              </button>
            )}
            {correccion ? (
              <button onClick={() => setCorreccion(null)} className="rounded-lg border border-slate-200 px-3 py-1 text-rose-700 hover:bg-rose-50">
                Deshacer
              </button>
            ) : (
              ensayos.length > 0 && (
                <button onClick={deshacerUltimo} className="rounded-lg border border-slate-200 px-3 py-1 text-rose-700 hover:bg-rose-50">
                  Deshacer
                </button>
              )
            )}
            <button
              onClick={() => setMasAbierto((v) => !v)}
              aria-expanded={masAbierto}
              className="rounded-lg border border-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-50"
            >
              ⋯
            </button>
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Progreso del bloque"
          aria-valuemin={0}
          aria-valuemax={secuencia.length}
          aria-valuenow={ensayos.length}
          className="h-1.5 bg-indigo-100"
        >
          <div className="h-full bg-indigo-600 transition-[width] duration-300" style={{ width: `${(ensayos.length / secuencia.length) * 100}%` }} />
        </div>

        {mostrandoAyudas && !tras && !correccion && (
          <div className="border-b border-amber-200 bg-amber-50 p-3">
            <SelectorAyuda
              elegida={ayudaPendiente}
              sugeridas={ayudasDelPrograma(ayudasPosibles)}
              onElegir={(v) => {
                setAyudaPendiente(v)
                setMostrandoAyudas(false)
              }}
            />
          </div>
        )}

        {tras ? (
          <div className="space-y-4 p-4 text-center sm:p-8">
            <div
              className={`rounded-xl p-4 text-left text-sm ${tras.correcto ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}
            >
              <p className="text-base font-semibold">
                {tras.correcto ? '✓ Correcto' : '✗ Incorrecto'}
                {tras.correcto && tras.ayuda !== 'independiente' ? ` (con ayuda: ${etiquetaAyuda(tras.ayuda)})` : ''}
                {tras.repeticion !== undefined ? (tras.repeticion ? ' · en la repetición, bien' : ' · en la repetición, tampoco') : ''}
              </p>
              <p className="mt-1">
                {tras.repeticion !== undefined
                  ? tras.repeticion
                    ? 'Refuerce que lo haya hecho bien en la repetición.'
                    : 'No pasa nada: siga con el siguiente. Si vuelve a fallar con esta clase, elija una ayuda antes de que responda.'
                  : tras.test
                  ? 'Es un test: no le diga si está bien o mal.'
                  : tras.correcto
                    ? 'Refuércelo ahora.'
                    : tras.correcta
                      ? `La respuesta correcta era «${tras.correcta}». Muéstresela antes de seguir.`
                      : 'Muéstrele cómo se hace antes de seguir.'}
              </p>
            </div>
            <p className="text-sm text-slate-500">Recoja y prepare el material. Cuando esté listo, pase al siguiente: verá qué colocar y qué decir.</p>
            <Button variant="primary" onClick={siguienteEnsayo} className="w-full py-4 text-base active:scale-[0.98] sm:w-auto sm:px-10">
              Siguiente ensayo →
            </Button>
          </div>
        ) : (
          <div className="space-y-5 p-4 text-center sm:p-8">
            <div className="space-y-1 rounded-xl bg-indigo-50 px-4 py-3 text-left text-sm text-slate-700">
              {guia.map((g, i) => (
                <p key={i}>
                  <strong className="text-indigo-800">{g.titulo}</strong> {g.texto}
                </p>
              ))}
            </div>

            {config.tipo === 'seleccion' && !esTransformacion && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center gap-3 rounded-xl border-2 border-slate-200 px-4 py-3">
                  <VistaEstimulo estimulo={origenActual} imagenes={imagenes} />
                  <p className="text-xl font-bold text-slate-800 sm:text-2xl">{nombreVisible(origenActual.nombre)}</p>
                </div>
                <p className="text-xs text-slate-400">{claseActual.nombre}</p>
              </div>
            )}
            {esTransformacion && config.tipo === 'seleccion' && (
              <p className="text-sm text-slate-500">
                Pregunta sobre: <strong>{nombreVisible(origenActual.nombre)}</strong> ({claseActual.nombre})
              </p>
            )}
            {(config.tipo === 'opciones' || config.tipo === 'ejecucion' || config.tipo === 'abierta') && (
              <div className="space-y-1">
                <p className="text-lg font-medium text-slate-800">{consignaActual ?? nombreVisible(origenActual.nombre)}</p>
                <p className="text-xs text-slate-400">{claseActual.nombre}</p>
              </div>
            )}

            {conPregunta && !consignaActual && (
              <textarea
                value={preguntaActual}
                onChange={(e) => {
                  setPreguntaActual(e.target.value)
                  cronometro.reiniciar()
                }}
                placeholder="Escriba aquí la pregunta que le hace al alumno (se guarda con el ensayo)"
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
            )}
            {config.tipo === 'abierta' && (
              <textarea
                value={respuestaAbierta}
                onChange={(e) => setRespuestaAbierta(e.target.value)}
                placeholder="Respuesta del alumno (opcional)"
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
            )}

            {correccion?.paso === 'modelo' ? (
              <Button
                variant="primary"
                onClick={() => setCorreccion({ ...correccion, paso: 'repetir', inicio: marcaDeTiempo() })}
                className="w-full py-4 text-base active:scale-[0.98] sm:w-auto sm:px-10"
              >
                Hecho: repetir el ensayo
              </Button>
            ) : config.tipo === 'seleccion' && !hablanteMaterial ? (
              <div className="flex flex-wrap justify-center gap-3">
                {comparativos.map((c) => (
                  <button
                    key={c.claseId}
                    onClick={() => registrarMaterial(c.esCorrecto, nombreVisible(c.estimulo.nombre))}
                    disabled={isPending}
                    className="inline-flex min-w-[7rem] flex-col items-center gap-1 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 hover:border-indigo-400 active:scale-[0.98] disabled:opacity-50"
                  >
                    <VistaEstimulo estimulo={c.estimulo} imagenes={imagenes} />
                    {nombreVisible(c.estimulo.nombre)}
                  </button>
                ))}
              </div>
            ) : config.tipo === 'opciones' && respuestaPendiente !== null ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">
                  Ha respondido: <strong>{respuestaPendiente}</strong>. ¿Es correcto?
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="success" onClick={() => registrarMaterial(true, respuestaPendiente)} disabled={isPending} className="flex-1 py-4 text-base sm:py-3">
                    ✓ Correcto
                  </Button>
                  <Button variant="danger" onClick={() => registrarMaterial(false, respuestaPendiente)} disabled={isPending} className="flex-1 py-4 text-base sm:py-3">
                    ✗ Incorrecto
                  </Button>
                </div>
                <button onClick={() => setRespuestaPendiente(null)} className="py-2 text-sm text-slate-500 hover:text-slate-600">
                  Cambiar respuesta
                </button>
              </div>
            ) : config.tipo === 'opciones' ? (
              <div className="flex flex-wrap justify-center gap-3">
                {config.opciones.map((opcion) => (
                  <Button
                    key={opcion}
                    variant="secondary"
                    onClick={() => {
                      if (esperada) registrarMaterial(opcion === esperada, opcion)
                      else {
                        cronometro.capturar()
                        setRespuestaPendiente(opcion)
                      }
                    }}
                    disabled={isPending}
                    className="min-w-[7rem] py-4 text-base active:scale-[0.98] sm:py-3"
                  >
                    {opcion}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="success"
                  onClick={() => registrarMaterial(true, config.tipo === 'abierta' ? respuestaRegistrada : null)}
                  disabled={isPending}
                  className="flex-1 py-4 text-base active:scale-[0.98] sm:py-3"
                >
                  {etiquetas.correcto.replace(' sin ayuda', '')}
                  {etiquetaAyudaPendiente ? ` (con ayuda: ${etiquetaAyudaPendiente})` : ''}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => registrarMaterial(false, config.tipo === 'abierta' ? respuestaRegistrada : null)}
                  disabled={isPending}
                  className="flex-1 py-4 text-base active:scale-[0.98] sm:py-3"
                >
                  {etiquetas.incorrecto}
                </Button>
              </div>
            )}
            {correccion?.paso !== 'modelo' && botonVerRespuesta}
          </div>
        )}

        {masAbierto && (
          <div className="space-y-4 border-t border-slate-200 bg-slate-50 p-3 text-left text-sm">
            {(instrucciones || ayudasPosibles || videoUrl) && (
              <details className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
                <summary className="cursor-pointer text-sm font-medium text-slate-700">Instrucciones del programa</summary>
                <div className="mt-2 space-y-2">
                  {instrucciones && <p className="whitespace-pre-wrap">{instrucciones}</p>}
                  {ayudasPosibles && (
                    <div>
                      <strong>Ayudas sugeridas:</strong>
                      <p className="whitespace-pre-wrap">{ayudasPosibles}</p>
                    </div>
                  )}
                  {videoUrl && (
                    <div>
                      <strong>Vídeo de ejemplo:</strong>
                      <VideoDiferido url={videoUrl} />
                    </div>
                  )}
                </div>
              </details>
            )}

            {conPregunta && consignaActual && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">Otra pregunta (si no usa la de la guía)</label>
                <textarea
                  value={preguntaActual}
                  onChange={(e) => setPreguntaActual(e.target.value)}
                  placeholder={`Si no escribe otra, se guarda «${consignaActual}»`}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
                />
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              {controlAbierto ? (
                <div className="space-y-2">
                  <p className="font-medium text-slate-700">Ensayo de control</p>
                  <p className="text-xs text-slate-500">
                    Pregunta extra (ej. de asimetría). Se guarda con el bloque, pero no cuenta para el % de acierto ni para el dominio.
                  </p>
                  <textarea
                    value={controlPregunta}
                    onChange={(e) => setControlPregunta(e.target.value)}
                    placeholder="Pregunta (ej. ¿Todos los animales son ZOG?)"
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
                  />
                  {config.tipo === 'opciones' ? (
                    <div className="flex flex-wrap gap-2">
                      {config.opciones.map((opcion) => (
                        <button
                          key={opcion}
                          onClick={() => setControlRespuesta(opcion)}
                          className={`rounded-lg px-3 py-2 text-sm font-medium ${
                            controlRespuesta === opcion ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {opcion}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      value={controlRespuesta}
                      onChange={(e) => setControlRespuesta(e.target.value)}
                      placeholder="Respuesta del alumno"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
                    />
                  )}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="success" onClick={() => anadirControl(true)} disabled={!controlPregunta.trim()} className="flex-1">
                      ✓ Correcto
                    </Button>
                    <Button variant="danger" onClick={() => anadirControl(false)} disabled={!controlPregunta.trim()} className="flex-1">
                      ✗ Incorrecto
                    </Button>
                    <Button variant="secondary" onClick={() => setControlAbierto(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    {controles.length > 0
                      ? `Ensayos de control: ${controles.filter((c) => c.correcto).length}/${controles.length} correctos`
                      : 'Sin ensayos de control en este bloque'}
                  </span>
                  <button onClick={() => setControlAbierto(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    + Ensayo de control
                  </button>
                  <AyudaTermino clave="ensayo_control" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">Notas del bloque (opcional)</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Observaciones sobre este bloque: motivación, distracciones, contexto..."
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
            </div>

            {ensayos.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-slate-600">Ensayos registrados</p>
                <ul className="max-h-40 space-y-1 overflow-y-auto sm:max-h-48">
                  {ensayos.map((e, i) => (
                    <li key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm">
                      <span>
                        {i + 1}. {e.claseNombre}
                        {e.ayuda !== 'independiente' ? ` (${e.ayuda})` : ''}
                      </span>
                      <span className={e.correcto ? 'text-emerald-700' : 'text-rose-600'}>{e.correcto ? '✓' : '✗'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => {
                if (ensayos.length === 0 || window.confirm('¿Descartar este bloque? Los ensayos registrados no se guardarán.')) descartarBloque()
              }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Descartar bloque
            </button>
          </div>
        )}
      </div>

      {isPending && <p className="text-center text-sm text-slate-500">Guardando bloque...</p>}
    </div>
  )
}
