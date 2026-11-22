'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Panel } from '../../../../ui'
import { useToast } from '../../../../providers/toast-provider'
import { guardarBloqueRft } from './actions'
import PantallaTablet, { type ImagenesBanco, type RespuestaTablet } from './pantalla-tablet'
import PantallaHablante from './pantalla-hablante'
import { aHablante, generarBloque, type ActividadConceptos, type Concepto, type EnsayoGenerado, type EnsayoHablante } from '../../../conceptos'
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
  // Repetición sin ayuda tras corregir un error (o tras acertar con ayuda)
  transferencia?: RespuestaTablet['transferencia']
}

export default function ConceptosTablet({
  programaAlumnoId,
  alumnoId,
  actividad,
  conceptos,
  imagenes,
  dominados,
  dominadosHablante,
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
  // Niveles dominados como hablante (se registran aparte, con la forma de respuesta)
  dominadosHablante: string[]
  ensayosPorBloque: number
  sinError: ConfigSinError | null
  ultimosEscalones: Record<string, Json>
}) {
  // Respuesta de oyente (toca la opción) o de hablante (dice la relación y el terapeuta la puntúa)
  const [hablante, setHablante] = useState(false)
  const dominadosDe = (h: boolean) => (h ? dominadosHablante : dominados)
  const recomendadoEn = (h: boolean) => Math.max(0, actividad.niveles.findIndex((n) => !dominadosDe(h).includes(n.nombre)))
  const recomendado = recomendadoEn(hablante)
  const [indice, setIndice] = useState(recomendado)
  const [versionHablante, setVersionHablante] = useState<EnsayoHablante[]>([])
  const [sonda, setSonda] = useState(false)
  // Ensayos por bloque (las sondas de generalización son siempre de 5)
  const [tamano, setTamano] = useState(ensayosPorBloque === 20 ? 20 : 10)
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
  const grupo = nivel.nombre
  const dominadosForma = dominadosDe(hablante)
  const menorAMayor = !hablante && !sonda && !!sinError?.activo && sinError.modo === 'menor_a_mayor'

  // Escalón de aprendizaje sin error del nivel (si está activo y es entrenamiento)
  const escalonDelNivel = () => {
    if (hablante || sonda || !sinError?.activo || sinError.modo !== 'mayor_a_menor') return null
    const { indice: i } = siguienteEscalon(sinError, leerEscalonBloque(ultimosEscalones[`${nivel.nombre}__A__A`]))
    const e = sinError.escalones[i]
    return { ...e, indice: i, total: sinError.escalones.length, final: i === sinError.escalones.length - 1, aciertos_con_apoyo: 0 }
  }

  const empezar = () => {
    desbloquearAudio()
    const lista = generarBloque(actividad, indice, sonda ? conceptos.generalizacion : conceptos.entrenamiento, sonda ? 5 : tamano, sonda)
    if (!lista.length) {
      toast('No hay imágenes para generar los ensayos.', 'error')
      return
    }
    for (const consigna of new Set(lista.map((e) => e.consigna))) void precargarFraseRft(consigna)
    setEscalon(escalonDelNivel())
    setVersionHablante(hablante ? lista.map((e) => aHablante(actividad.tipo, e)) : [])
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
        grupo,
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
        escalonBloque,
        lista
          .filter((r) => r.transferencia)
          .map((r) => ({
            claseId: null,
            estimuloOrigenId: null,
            estimuloDestinoId: null,
            correcto: r.transferencia!.correcto,
            latenciaMs: r.transferencia!.latenciaMs,
            respuesta: r.transferencia!.respuesta,
            generado: r.generado,
          })),
        false,
        hablante ? 'hablante' : 'oyente'
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
    // Ordenar: siempre todos los elementos de la serie
    if (!escalon || escalon.comparaciones === null || e.orden) return e.opciones
    const correctas = e.opciones.filter((o) => o.correcta)
    const otras = e.opciones.filter((o) => !o.correcta).slice(0, Math.max(0, escalon.comparaciones - 1))
    return e.opciones.filter((o) => correctas.includes(o) || otras.includes(o))
  }

  if (ensayos) {
    const n = registros.length
    const actual = ensayos[n]
    if (!actual) return <Panel className="p-6 text-center text-slate-500">Guardando bloque…</Panel>
    if (hablante) {
      const h = versionHablante[n]
      return (
        <PantallaHablante
          key={n}
          ensayo={h}
          numero={n}
          total={ensayos.length}
          fase={fase}
          imagenes={imagenes}
          onResponder={(correcto) => {
            const registro: Registro = {
              correcto,
              ayuda: 'independiente',
              latenciaMs: null,
              respuesta: correcto ? h.esperada : null,
              generado: { nivel: nivel.nombre, modo: 'hablante', clave: h.clave, consigna: h.pregunta, esperada: h.esperada },
            }
            const lista = [...registros, registro]
            setRegistros(lista)
            if (lista.length === ensayos.length) guardar(lista, ensayos)
          }}
          onSalir={() => {
            setEnsayos(null)
            setRegistros([])
          }}
        />
      )
    }
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
        secuencia={actual.secuencia?.map((p, i) => ({ id: `s${n}-${i}`, nombre: '', concepto_imagen: null, pantalla: p }))}
        etiquetasSecuencia={actual.etiquetasSecuencia}
        ordenEsperado={actual.orden}
        // Corrección del error en entrenamiento (modelo y repetición sin
        // ayuda): de momento solo en las claves temporales
        correccion={actividad.tipo === 'temporal'}
        // Conceptos generados: cada ensayo alterna las fotos 1 y 2 del concepto (múltiples ejemplares)
        alternarEjemplares
        onResponder={(correcto, ayuda, respuesta, extra: Pick<RespuestaTablet, 'nivelAyuda' | 'transferencia'>) => {
          const registro: Registro = {
            correcto,
            ayuda,
            latenciaMs: latencia.current,
            respuesta,
            nivelAyuda: extra.nivelAyuda,
            transferencia: extra.transferencia,
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
          {resultado.dominio ? `🎉 ¡Nivel «${grupo}» dominado${hablante ? ' como hablante' : ''}! ` : 'Bloque guardado: '}
          {resultado.porcentaje}% de acierto
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span>Respuesta</span>
        {([false, true] as const).map((h) => (
          <button
            key={String(h)}
            onClick={() => {
              setHablante(h)
              setIndice(recomendadoEn(h))
              setSonda(false)
              setResultado(null)
            }}
            className={`rounded-lg px-4 py-2 font-medium ${hablante === h ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {h ? 'Hablante (dice la relación)' : 'Oyente (toca la opción)'}
          </button>
        ))}
      </div>
      {hablante && (
        <p className="text-xs text-slate-500">
          El alumno ve los estímulos y dice la relación; usted hace la pregunta que aparece abajo y marca la respuesta (mantenga pulsado).
          Se registra aparte de la selección.
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
            {dominadosForma.includes(nv.nombre) ? '✓ ' : ''}
            {nv.nombre}
            {i === recomendado && !dominadosForma.includes(nv.nombre) ? ' · recomendado' : ''}
          </button>
        ))}
      </div>
      {dominadosForma.includes(grupo) && (
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={sonda} onChange={(e) => setSonda(e.target.checked)} />
          Sonda de generalización con objetos nuevos (5 ensayos, no cuenta para el dominio)
        </label>
      )}
      {!sonda && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Tamaño del bloque</span>
          {[10, 20].map((t) => (
            <button
              key={t}
              onClick={() => setTamano(t)}
              className={`rounded-lg px-4 py-2 font-medium ${tamano === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {t} ensayos
            </button>
          ))}
        </div>
      )}
      {!sonda && escalonDelNivel() && (
        <p className="text-xs text-amber-700">
          Aprendizaje sin error: <strong>{escalonDelNivel()!.nombre}</strong> · {describirEscalon(escalonDelNivel()!)}
        </p>
      )}
      <Button onClick={empezar} disabled={isPending} className="w-full py-3 text-base">
        Empezar «{nivel.nombre}»{hablante ? ' como hablante' : ''}{sonda ? ' (sonda)' : ''} en la tableta
      </Button>
    </Panel>
  )
}
