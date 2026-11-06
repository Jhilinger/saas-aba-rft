'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Panel } from '../../../../ui'
import { useToast } from '../../../../providers/toast-provider'
import { guardarBloqueRft } from './actions'
import PantallaTablet, { type ImagenesBanco, type RespuestaTablet } from './pantalla-tablet'
import { generarBloque, type ActividadConceptos, type Concepto, type EnsayoGenerado } from '../../../conceptos'
import { leerEscalonBloque, siguienteEscalon, describirEscalon, type ConfigSinError, type EscalonBloque } from '../../../sin-error'
import { desbloquearAudio, precargarFraseRft } from '../../../voz'
import { segundosDesde, marcaDeTiempo } from '../../cronometro'
import type { Json } from '@/database.types'

// Conceptos básicos en la tableta: los ensayos se generan con imágenes del
// banco (ver conceptos.ts). Cada nivel es un grupo A → A; el siguiente
// recomendado es el primero sin dominar. Las sondas de generalización usan
// objetos de otras categorías que no salen en el entrenamiento.

type Registro = {
  correcto: boolean
  ayuda: string
  latenciaMs: number | null
  respuesta: string | null
  nivelAyuda?: number
  generado: Json
}

export default function ConceptosTablet({
  programaAlumnoId,
  alumnoId,
  actividad,
  conceptos,
  imagenes,
  dominados,
  ensayosPorBloque,
  sinError,
  ultimosEscalones,
}: {
  programaAlumnoId: string
  alumnoId: string
  actividad: ActividadConceptos
  conceptos: { entrenamiento: Concepto[]; generalizacion: Concepto[] }
  imagenes: ImagenesBanco
  // Niveles (grupos) ya dominados en entrenamiento
  dominados: string[]
  ensayosPorBloque: number
  sinError: ConfigSinError | null
  ultimosEscalones: Record<string, Json>
}) {
  const recomendado = Math.max(0, actividad.niveles.findIndex((n) => !dominados.includes(n.nombre)))
  const [indice, setIndice] = useState(recomendado)
  const [sonda, setSonda] = useState(false)
  const [ensayos, setEnsayos] = useState<EnsayoGenerado[] | null>(null)
  const [registros, setRegistros] = useState<Registro[]>([])
  const [inicio, setInicio] = useState<number | null>(null)
  const [escalon, setEscalon] = useState<EscalonBloque | null>(null)
  const [resultado, setResultado] = useState<{ porcentaje: number; dominio: boolean } | null>(null)
  const [isPending, startTransition] = useTransition()
  const toast = useToast()
  const router = useRouter()
  // Latencia: desde que salen las opciones hasta la primera respuesta
  const inicioOpciones = useRef(0)
  const latencia = useRef<number | null>(null)

  const nivel = actividad.niveles[indice]
  const fase = sonda ? 'generalizacion' : 'entrenamiento'
  const menorAMayor = !sonda && !!sinError?.activo && sinError.modo === 'menor_a_mayor'

  // Escalón de aprendizaje sin error del nivel (si está activo y es entrenamiento)
  const escalonDelNivel = () => {
    if (sonda || !sinError?.activo || sinError.modo !== 'mayor_a_menor') return null
    const { indice: i } = siguienteEscalon(sinError, leerEscalonBloque(ultimosEscalones[`${nivel.nombre}__A__A`]))
    const e = sinError.escalones[i]
    return { ...e, indice: i, total: sinError.escalones.length, final: i === sinError.escalones.length - 1, aciertos_con_apoyo: 0 }
  }

  const empezar = () => {
    desbloquearAudio()
    const lista = generarBloque(actividad, indice, sonda ? conceptos.generalizacion : conceptos.entrenamiento, sonda ? 5 : ensayosPorBloque, sonda)
    if (!lista.length) {
      toast('No hay imágenes para generar los ensayos.', 'error')
      return
    }
    for (const consigna of new Set(lista.map((e) => e.consigna))) void precargarFraseRft(consigna)
    setEscalon(escalonDelNivel())
    setEnsayos(lista)
    setRegistros([])
    setInicio(marcaDeTiempo())
    setResultado(null)
  }

  const guardar = (lista: Registro[], ens: EnsayoGenerado[]) => {
    const conApoyo = lista.filter((r) => r.correcto).length / lista.length
    const escalonBloque = escalon ? { ...escalon, aciertos_con_apoyo: Math.round(conApoyo * 100) } : null
    startTransition(async () => {
      const res = await guardarBloqueRft(
        programaAlumnoId,
        alumnoId,
        nivel.nombre,
        fase,
        'A',
        'A',
        Math.max(...ens.map((e) => e.opciones.length)),
        lista.map((r) => ({
          claseId: null,
          estimuloOrigenId: null,
          estimuloDestinoId: null,
          pregunta: (r.generado as { consigna?: string }).consigna,
          correcto: r.correcto,
          ayuda: r.ayuda,
          latenciaMs: r.latenciaMs,
          respuesta: r.respuesta,
          nivelAyuda: r.nivelAyuda,
          generado: r.generado,
        })),
        undefined,
        segundosDesde(inicio),
        [],
        'tableta',
        escalonBloque
      )
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      setEnsayos(null)
      setResultado({ porcentaje: res.porcentaje ?? 0, dominio: !!res.dominadoAhora })
      router.refresh()
    })
  }

  // Opciones del ensayo según el escalón de apoyo (campo reducido)
  const opcionesDe = (e: EnsayoGenerado) => {
    if (!escalon || escalon.comparaciones === null) return e.opciones
    const correctas = e.opciones.filter((o) => o.correcta)
    const otras = e.opciones.filter((o) => !o.correcta).slice(0, Math.max(0, escalon.comparaciones - 1))
    return e.opciones.filter((o) => correctas.includes(o) || otras.includes(o))
  }

  if (ensayos) {
    const n = registros.length
    const actual = ensayos[n]
    if (!actual) return <Panel className="p-6 text-center text-slate-500">Guardando bloque…</Panel>
    const opciones = opcionesDe(actual)
    return (
      <PantallaTablet
        origen={{ id: `m${n}`, nombre: '', concepto_imagen: null, pantalla: actual.muestra }}
        comparativos={opciones.map((o, i) => ({
          claseId: `o${n}-${i}`,
          estimulo: { id: `o${n}-${i}`, nombre: o.etiqueta, concepto_imagen: null, pantalla: o.pantalla },
          esCorrecto: o.correcta,
        }))}
        fase={fase}
        ensayo={n}
        total={ensayos.length}
        imagenes={imagenes}
        apoyo={escalon && { nombre: escalon.nombre, opacidad: escalon.opacidad, tamano: !!sinError?.tamano, demora: escalon.demora }}
        observacion={!!sinError?.observacion}
        menorAMayor={menorAMayor}
        consigna={actual.consigna}
        sinMuestra={!actual.muestra}
        onResponder={(correcto, ayuda, respuesta, extra: Pick<RespuestaTablet, 'nivelAyuda' | 'transferencia'>) => {
          const registro: Registro = {
            correcto,
            ayuda,
            latenciaMs: latencia.current,
            respuesta,
            nivelAyuda: extra.nivelAyuda,
            generado: {
              nivel: nivel.nombre,
              clave: actual.clave,
              consigna: actual.consigna,
              muestra: actual.muestra,
              opciones: opciones.map((o) => o.etiqueta),
              correcta: opciones.find((o) => o.correcta)?.etiqueta ?? null,
              elegida: respuesta,
            },
          }
          const lista = [...registros, registro]
          setRegistros(lista)
          if (lista.length === ensayos.length) guardar(lista, ensayos)
        }}
        onMuestra={() => {
          inicioOpciones.current = Date.now()
          latencia.current = null
        }}
        onPrimeraRespuesta={() => {
          if (latencia.current === null) latencia.current = Date.now() - inicioOpciones.current
        }}
        onSalir={() => {
          setEnsayos(null)
          setRegistros([])
        }}
      />
    )
  }

  return (
    <Panel className="space-y-3 p-4 sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">En la tableta · ensayos generados</p>
        <p className="text-xs text-slate-500">Imágenes del banco, claves alternadas en cada bloque. Cada nivel se registra como un grupo.</p>
      </div>
      {resultado && (
        <p className={`rounded-lg p-2 text-sm ${resultado.dominio ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>
          {resultado.dominio ? `🎉 ¡Nivel «${nivel.nombre}» dominado! ` : 'Bloque guardado: '}
          {resultado.porcentaje}% de acierto
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {actividad.niveles.map((nv, i) => (
          <button
            key={nv.nombre}
            onClick={() => {
              setIndice(i)
              setSonda(false)
            }}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${i === indice ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {dominados.includes(nv.nombre) ? '✓ ' : ''}
            {nv.nombre}
            {i === recomendado && !dominados.includes(nv.nombre) ? ' · recomendado' : ''}
          </button>
        ))}
      </div>
      {dominados.includes(nivel.nombre) && (
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={sonda} onChange={(e) => setSonda(e.target.checked)} />
          Sonda de generalización con objetos nuevos (5 ensayos, no cuenta para el dominio)
        </label>
      )}
      {!sonda && escalonDelNivel() && (
        <p className="text-xs text-amber-700">
          Aprendizaje sin error: <strong>{escalonDelNivel()!.nombre}</strong> · {describirEscalon(escalonDelNivel()!)}
        </p>
      )}
      <Button onClick={empezar} disabled={isPending} className="w-full py-3 text-base">
        Empezar «{nivel.nombre}»{sonda ? ' (sonda)' : ''} en la tableta
      </Button>
    </Panel>
  )
}
