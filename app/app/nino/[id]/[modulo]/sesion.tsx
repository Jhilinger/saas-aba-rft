'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import PantallaTablet, { textoOido, type ComparativoTablet, type EstimuloTablet, type RespuestaTablet } from '../../../../dashboard/tomar-datos/rft/[programaId]/pantalla-tablet'
import { guardarBloqueRft } from '../../../../dashboard/tomar-datos/rft/[programaId]/actions'
import { consignaPara, leerConsignasClase, leerConsignasPrograma } from '../../../../dashboard/consignas-rft'
import { generarBloque } from '../../../../dashboard/conceptos'
import { desbloquearAudio, decirFraseRft, precargarFraseRft } from '../../../../dashboard/voz'
import type { Json } from '@/database.types'
import { prepararSesion, type PlanSesion } from './acciones'
import { pegatinaDeSesion } from '../../../pegatinas'

// Una sesión de la app infantil: 10 ensayos de la actividad que elige el
// motor, celebración tras cada acierto en el entrenamiento (en los tests,
// transición neutra para no reforzar) y pegatina al terminar.

const ENSAYOS = 10
export const FRASES_REFUERZO = ['¡Muy bien!', '¡Genial!', '¡Bravo!']

type Ensayo = {
  origen: EstimuloTablet
  comparativos: ComparativoTablet[]
  consigna: string | null
  sinMuestra: boolean
  // Lo que se guarda del ensayo
  claseId: string | null
  estimuloOrigenId: string | null
  estimuloDestinoId: string | null
  generado: Json | null
}

type Registro = {
  claseId: string | null
  estimuloOrigenId: string | null
  estimuloDestinoId: string | null
  correcto: boolean
  ayuda: string
  latenciaMs: number | null
  respuesta: string | null
  nivelAyuda?: number
  generado?: Json
}

function barajar<T>(lista: T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

// Ensayos de un plan: clases del programa o conceptos generados
function prepararEnsayos(plan: PlanSesion): Ensayo[] {
  if (plan.tipo === 'conceptos') {
    return generarBloque(plan.actividad, plan.nivel, plan.conceptos.entrenamiento, ENSAYOS).map((e, n) => ({
      origen: { id: `m${n}`, nombre: '', concepto_imagen: null, pantalla: e.muestra },
      comparativos: e.opciones.map((o, i) => ({
        claseId: `o${n}-${i}`,
        estimulo: { id: `o${n}-${i}`, nombre: o.etiqueta, concepto_imagen: null, pantalla: o.pantalla },
        esCorrecto: o.correcta,
      })),
      consigna: e.consigna,
      sinMuestra: !e.muestra,
      claseId: null,
      estimuloOrigenId: null,
      estimuloDestinoId: null,
      generado: { nivel: plan.actividad.niveles[plan.nivel].nombre, clave: e.clave, consigna: e.consigna, opciones: e.opciones.map((o) => o.etiqueta), correcta: e.opciones.find((o) => o.correcta)?.etiqueta ?? null },
    }))
  }
  const { origen, destino, fase } = plan.paso
  const de = (c: (typeof plan.clases)[number], pos: string) => c.estimulos_rft.find((e) => e.posicion === pos)
  const validas = plan.clases.filter((c) => de(c, origen) && de(c, destino))
  // Secuencia equilibrada entre las clases, sin repetir la misma seguida
  let secuencia: typeof validas = []
  while (secuencia.length < ENSAYOS) secuencia.push(...barajar(validas))
  secuencia = secuencia.slice(0, ENSAYOS)
  for (let i = 1; i < secuencia.length; i++) {
    if (secuencia[i].id === secuencia[i - 1].id) {
      const j = secuencia.findIndex((c, k) => k > i && c.id !== secuencia[i - 1].id)
      if (j > 0) [secuencia[i], secuencia[j]] = [secuencia[j], secuencia[i]]
    }
  }
  const delPrograma = leerConsignasPrograma(plan.consignas)
  return secuencia.map((clase) => {
    const o = de(clase, origen)!
    // Opciones de la propia clase: los dos elementos nombrados y un distractor de otra clase
    const otra = barajar(validas.filter((v) => v.id !== clase.id))[0]
    const comparativos = plan.opcionesClase
      ? barajar([
          { claseId: `${clase.id}-o`, estimulo: o, esCorrecto: false },
          { claseId: `${clase.id}-d`, estimulo: de(clase, destino)!, esCorrecto: true },
          ...(otra ? [{ claseId: `${otra.id}-x`, estimulo: de(otra, Math.random() < 0.5 ? origen : destino)!, esCorrecto: false }] : []),
        ])
      : barajar(validas).map((v) => ({ claseId: v.id, estimulo: de(v, destino)!, esCorrecto: v.id === clase.id }))
    return {
      origen: o,
      comparativos,
      consigna: consignaPara(delPrograma, leerConsignasClase(clase.consignas), fase, origen, destino, textoOido(o.nombre)),
      sinMuestra: plan.opcionesClase,
      claseId: clase.id,
      estimuloOrigenId: o.id,
      estimuloDestinoId: de(clase, destino)!.id,
      generado: null,
    }
  })
}

export default function Sesion({
  alumnoId,
  modulo,
  nombreModulo,
  emojiModulo,
  color,
  avatarEmoji,
}: {
  alumnoId: string
  modulo: string
  nombreModulo: string
  emojiModulo: string
  color: string
  avatarEmoji: string
}) {
  const [estado, setEstado] = useState<'inicio' | 'cargando' | 'jugando' | 'guardando' | 'fin' | 'terminado' | 'error'>('inicio')
  const [mensaje, setMensaje] = useState('')
  const [plan, setPlan] = useState<PlanSesion | null>(null)
  const [ensayos, setEnsayos] = useState<Ensayo[]>([])
  const [registros, setRegistros] = useState<Registro[]>([])
  const [celebrando, setCelebrando] = useState(false)
  const transferencias = useRef<{ claseId: string | null; estimuloOrigenId: string | null; estimuloDestinoId: string | null; correcto: boolean; latenciaMs: number; respuesta: string | null }[]>([])
  const inicio = useRef(0)
  const inicioOpciones = useRef(0)
  const latencia = useRef<number | null>(null)

  const empezar = async () => {
    // Desde un toque: desbloquea el audio para que la voz suene sola
    desbloquearAudio()
    setEstado('cargando')
    const res = await prepararSesion(alumnoId, modulo)
    if ('error' in res) {
      setMensaje(res.error)
      setEstado('error')
      return
    }
    if ('terminado' in res) {
      setEstado('terminado')
      return
    }
    const lista = prepararEnsayos(res.plan)
    if (!lista.length) {
      setMensaje('No se ha podido preparar la actividad.')
      setEstado('error')
      return
    }
    for (const t of new Set(lista.map((e) => e.consigna).filter((c): c is string => !!c))) void precargarFraseRft(t)
    for (const t of FRASES_REFUERZO) void precargarFraseRft(t)
    transferencias.current = []
    inicio.current = Date.now()
    setPlan(res.plan)
    setEnsayos(lista)
    setRegistros([])
    setEstado('jugando')
  }

  const fase = plan?.tipo === 'clases' ? plan.paso.fase : 'entrenamiento'
  const esTest = fase !== 'entrenamiento'

  const guardar = async (lista: Registro[]) => {
    if (!plan) return
    setEstado('guardando')
    const comun = { programa: plan.programaAlumnoId, numComparativos: Math.max(...ensayos.map((e) => e.comparativos.length)) }
    const grupo = plan.tipo === 'clases' ? plan.grupo : plan.actividad.niveles[plan.nivel].nombre
    const [origen, destino] = plan.tipo === 'clases' ? [plan.paso.origen, plan.paso.destino] : ['A', 'A']
    const res = await guardarBloqueRft(
      comun.programa,
      alumnoId,
      grupo,
      fase,
      origen,
      destino,
      comun.numComparativos,
      lista.map((r) => ({ ...r, pregunta: undefined, generado: r.generado })),
      'App infantil',
      Math.round((Date.now() - inicio.current) / 1000),
      [],
      'tableta',
      null,
      transferencias.current
    )
    if (res.error) {
      setMensaje(res.error)
      setEstado('error')
      return
    }
    setEstado('fin')
  }

  // Tras la celebración, el ensayo siguiente (o el final)
  useEffect(() => {
    if (!celebrando) return
    const t = setTimeout(() => setCelebrando(false), 1300)
    return () => clearTimeout(t)
  }, [celebrando])

  if (estado === 'jugando' && plan) {
    const n = registros.length
    const actual = ensayos[n]
    if (!actual) return null
    return (
      <>
        <PantallaTablet
          origen={actual.origen}
          comparativos={actual.comparativos}
          fase={fase}
          ensayo={n}
          total={ensayos.length}
          imagenes={plan.imagenes}
          // Al enseñar un test que no deriva: la correcta se resalta a los 2 s
          apoyo={plan.tipo === 'clases' && plan.ensenar ? { nombre: 'Enseñar', opacidad: 1, tamano: false, demora: 2 } : null}
          menorAMayor={!esTest}
          consigna={actual.consigna}
          sinMuestra={actual.sinMuestra}
          seleccionOida
          infantil
          onMuestra={() => {
            inicioOpciones.current = Date.now()
            latencia.current = null
          }}
          onPrimeraRespuesta={() => {
            if (latencia.current === null) latencia.current = Date.now() - inicioOpciones.current
          }}
          onResponder={(correcto, ayuda, respuesta, extra: Pick<RespuestaTablet, 'nivelAyuda' | 'transferencia'>) => {
            if (extra.transferencia) {
              transferencias.current.push({ claseId: actual.claseId, estimuloOrigenId: actual.estimuloOrigenId, estimuloDestinoId: actual.estimuloDestinoId, ...extra.transferencia })
            }
            const lista = [
              ...registros,
              {
                claseId: actual.claseId,
                estimuloOrigenId: actual.estimuloOrigenId,
                estimuloDestinoId: actual.estimuloDestinoId,
                correcto,
                ayuda,
                latenciaMs: latencia.current,
                respuesta,
                nivelAyuda: extra.nivelAyuda,
                generado: actual.generado ?? undefined,
              },
            ]
            if (correcto && !esTest) {
              setCelebrando(true)
              void decirFraseRft(FRASES_REFUERZO[Math.floor(Math.random() * FRASES_REFUERZO.length)])
            }
            setRegistros(lista)
            if (lista.length === ensayos.length) void guardar(lista)
          }}
          onSalir={() => setEstado('inicio')}
        />
        {celebrando && (
          <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center">
            <span className="animate-bounce text-[30vmin] leading-none drop-shadow-lg">⭐</span>
          </div>
        )}
      </>
    )
  }

  const pegatina = pegatinaDeSesion(plan?.sesionesHechas ?? 0)

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 py-6">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <Link href={`/app/nino/${alumnoId}`} className="rounded-full px-3 py-1 text-3xl">
          {avatarEmoji}
        </Link>
      </div>
      <div className="mt-10 flex w-full max-w-md flex-col items-center gap-6 rounded-3xl p-8 text-center shadow-sm" style={{ background: color }}>
        {estado === 'fin' ? (
          <>
            <span className="text-[30vmin] leading-none">{pegatina}</span>
            <p className="text-2xl font-bold">¡Una pegatina nueva!</p>
            <div className="flex gap-3">
              <button onClick={empezar} className="rounded-2xl bg-[#0F4C5C] px-6 py-4 text-lg font-bold text-white">
                Otra vez
              </button>
              <Link href={`/app/nino/${alumnoId}`} className="rounded-2xl bg-white px-6 py-4 text-lg font-bold text-[#0F4C5C]">
                Salir
              </Link>
            </div>
          </>
        ) : estado === 'terminado' ? (
          <>
            <span className="text-8xl">🏆</span>
            <p className="text-xl font-bold">¡Has terminado todo lo de «{nombreModulo}»!</p>
          </>
        ) : (
          <>
            <span className="text-8xl leading-none">{emojiModulo}</span>
            <p className="text-2xl font-bold">{nombreModulo}</p>
            {estado === 'error' && <p className="text-sm text-rose-700">{mensaje}</p>}
            <button
              onClick={empezar}
              disabled={estado === 'cargando' || estado === 'guardando'}
              className="rounded-full bg-[#0F4C5C] px-10 py-5 text-2xl font-bold text-white shadow disabled:opacity-60"
            >
              {estado === 'cargando' ? 'Preparando…' : estado === 'guardando' ? 'Guardando…' : '▶ Jugar'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}
