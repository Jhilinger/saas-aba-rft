'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { guardarBloqueAba } from './actions'
import { segundosDesde, useCronometroEnsayo } from '../../cronometro'
import VideoDiferido from '../../../video-diferido'
import { useToast } from '../../../../providers/toast-provider'
import { Button, Panel } from '../../../../ui'
import { leerProgreso, guardarProgreso, borrarProgreso, esFalloDeRed } from '../../offline-sync'
import { BannerSinConexion, PantallaGuardadoPendiente } from '../../estado-sincronizacion'
import PantallaVasos from './pantalla-vasos'
import { describirActividad, leerActividad } from '../../../vasos'
import { urlImagen, type ImagenesBanco } from '../../rft/[programaId]/pantalla-tablet'
import { desbloquearAudio, precargarFraseRft } from '../../../voz'
import type { Json } from '@/database.types'
import SelectorAyuda, { ayudasDelPrograma, etiquetaAyuda } from '../../../selector-ayuda'

type Estimulo = { id: string; nombre: string; concepto_imagen?: string | null }

type EnsayoRegistrado = {
  estimuloId: string
  estimuloNombre: string
  correcto: boolean
  ayuda: string
  latenciaMs?: number | null
}


function generarSecuencia(estimulos: Estimulo[], n: number): Estimulo[] {
  const k = estimulos.length
  const base = Math.floor(n / k)
  const remainder = n % k
  const barajados = [...estimulos].sort(() => Math.random() - 0.5)

  const pool: Estimulo[] = []
  barajados.forEach((e, idx) => {
    const count = base + (idx < remainder ? 1 : 0)
    for (let i = 0; i < count; i++) pool.push(e)
  })

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  for (let i = 1; i < pool.length; i++) {
    if (pool[i].id === pool[i - 1].id) {
      const j = pool.findIndex((e, idx) => idx > i && e.id !== pool[i - 1].id)
      if (j !== -1) {
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }
    }
  }

  return pool
}

export default function TomarDatosClient({
  conjuntoId,
  programaAlumnoId,
  alumnoId,
  estimulos,
  ensayosPorBloque,
  instrucciones,
  ayudasPosibles,
  videoUrl,
  faseConjunto,
  actividadTablet,
  imagenes,
}: {
  conjuntoId: string
  programaAlumnoId: string
  alumnoId: string
  estimulos: Estimulo[]
  ensayosPorBloque: number
  instrucciones: string | null
  ayudasPosibles: string | null
  videoUrl: string | null
  faseConjunto: 'linea_base' | 'adquisicion' | 'mantenimiento' | 'dominado' | 'pausado'
  // Actividad en tableta del conjunto (juego de los vasos) e imágenes de los objetos
  actividadTablet: Json
  imagenes: ImagenesBanco
}) {
  const actividad = leerActividad(actividadTablet)
  const enLineaBase = faseConjunto === 'linea_base'
  const puedeSonda = faseConjunto === 'dominado' || faseConjunto === 'mantenimiento'
  const claveProgreso = `aba:${conjuntoId}`

  const [tamanoBloque, setTamanoBloque] = useState<number>(ensayosPorBloque)
  const [tipoSonda, setTipoSonda] = useState<'normal' | 'generalizacion' | 'mantenimiento'>('normal')
  const [contexto, setContexto] = useState('')
  // Igual que en línea base: en una sonda no se dan ayudas, se comprueba si
  // el alumno lo hace por sí mismo en el nuevo contexto o tras el tiempo.
  const enSonda = tipoSonda !== 'normal'
  const sinAyudas = enLineaBase || enSonda
  const [secuencia, setSecuencia] = useState<Estimulo[] | null>(null)
  const [mostrandoAyudas, setMostrandoAyudas] = useState(false)
  // Igual que en los niveles 2 a 4: ayuda elegida antes de responder, menú «⋯»,
  // resultado hasta «Siguiente ensayo» y corrección guiada tras un error
  const [ayudaPendiente, setAyudaPendiente] = useState<string | null>(null)
  const [masAbierto, setMasAbierto] = useState(false)
  const [tras, setTras] = useState<{ correcto: boolean; ayuda: string; repeticion?: boolean } | null>(null)
  const [correccion, setCorreccion] = useState<'modelo' | 'repetir' | null>(null)
  // Repeticiones tras la corrección (se anotan en las notas del bloque al guardarlo)
  const [correcciones, setCorrecciones] = useState({ total: 0, bien: 0 })
  const [ensayos, setEnsayos] = useState<EnsayoRegistrado[]>([])
  const [notas, setNotas] = useState('')
  const [isPending, startTransition] = useTransition()
  // Con material o en la tableta (solo si el conjunto tiene actividad)
  const [modo, setModo] = useState<'material' | 'tableta'>('material')
  const [enTableta, setEnTableta] = useState(false)
  const [resultado, setResultado] = useState<{ porcentaje: number; dominioLogrado: boolean; tipoSonda: string } | null>(null)
  const [estadoGuardado, setEstadoGuardado] = useState<'idle' | 'pendiente' | 'error'>('idle')
  const [sinConexion, setSinConexion] = useState(false)
  // Duración del bloque: desde que empieza hasta el último ensayo registrado
  const [inicioBloque, setInicioBloque] = useState<number | null>(null)
  const [duracionBloque, setDuracionBloque] = useState<number | null>(null)
  const cronometro = useCronometroEnsayo(secuencia ? ensayos.length : null)
  const router = useRouter()
  const toast = useToast()

  const intentarGuardar = useCallback(
    (
      listaEnsayos: EnsayoRegistrado[],
      notasActuales: string,
      sondaActual: 'normal' | 'generalizacion' | 'mantenimiento',
      duracionSegundos: number | null,
      modoActual: 'material' | 'tableta' = 'material'
    ) => {
      startTransition(async () => {
        try {
          const res = await guardarBloqueAba(
            conjuntoId,
            programaAlumnoId,
            alumnoId,
            listaEnsayos.map(({ estimuloId, correcto, ayuda, latenciaMs }) => ({ estimuloId, correcto, ayuda, latenciaMs })),
            notasActuales,
            sondaActual === 'normal' ? undefined : sondaActual,
            duracionSegundos,
            modoActual
          )
          if (res.error) {
            setEstadoGuardado('error')
            toast(res.error, 'error')
            return
          }
          borrarProgreso(claveProgreso)
          setEstadoGuardado('idle')
          setResultado({ porcentaje: res.porcentaje ?? 0, dominioLogrado: res.dominioLogrado ?? false, tipoSonda: sondaActual })
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
    [conjuntoId, programaAlumnoId, alumnoId, claveProgreso, toast]
  )

  // Restaura un bloque en curso (o completo pero sin sincronizar todavía) si
  // se recargó la página o se cerró tras un fallo de red.
  useEffect(() => {
    const guardado = leerProgreso<{
      secuencia: Estimulo[]
      ensayos: EnsayoRegistrado[]
      notas: string
      tamanoBloque: number
      tipoSonda: 'normal' | 'generalizacion' | 'mantenimiento'
      inicioBloque?: number | null
      duracionBloque?: number | null
      modo?: 'material' | 'tableta'
    }>(claveProgreso)
    if (guardado) {
      setSecuencia(guardado.secuencia)
      setEnsayos(guardado.ensayos)
      setNotas(guardado.notas)
      setTamanoBloque(guardado.tamanoBloque)
      setTipoSonda(guardado.tipoSonda ?? 'normal')
      setInicioBloque(guardado.inicioBloque ?? null)
      setDuracionBloque(guardado.duracionBloque ?? null)
      setModo(guardado.modo ?? 'material')
      if (guardado.ensayos.length > 0 && guardado.ensayos.length === guardado.secuencia.length) {
        intentarGuardar(guardado.ensayos, guardado.notas, guardado.tipoSonda ?? 'normal', guardado.duracionBloque ?? null, guardado.modo ?? 'material')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reintenta solo en cuanto vuelva la conexión, y muestra un aviso mientras
  // se está tomando el bloque sin conexión.
  useEffect(() => {
    const actualizarEstado = () => setSinConexion(!navigator.onLine)
    actualizarEstado()
    const onOnline = () => {
      actualizarEstado()
      if (estadoGuardado === 'pendiente') intentarGuardar(ensayos, notas, tipoSonda, duracionBloque, modo)
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', actualizarEstado)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', actualizarEstado)
    }
  }, [estadoGuardado, ensayos, notas, tipoSonda, duracionBloque, modo, intentarGuardar])

  const empezarBloque = () => {
    // Desde un toque: desbloquea el audio para la pregunta grabada
    desbloquearAudio()
    void precargarFraseRft('¿Dónde está?')
    setEnTableta(modo === 'tableta' && !!actividad)
    setSecuencia(generarSecuencia(estimulos, tamanoBloque))
    setInicioBloque(Date.now())
    setDuracionBloque(null)
    setEnsayos([])
    setNotas(tipoSonda === 'generalizacion' && contexto.trim() ? `Contexto: ${contexto.trim()}` : '')
    setResultado(null)
    setEstadoGuardado('idle')
    setTras(null)
    setCorreccion(null)
    setCorrecciones({ total: 0, bien: 0 })
    setAyudaPendiente(null)
    setMasAbierto(false)
  }

  const registrar = (correcto: boolean, ayuda: string, latenciaMs?: number, cuentaCorrecciones = correcciones) => {
    if (!secuencia) return
    const actual = secuencia[ensayos.length]
    const nuevos = [
      ...ensayos,
      { estimuloId: actual.id, estimuloNombre: actual.nombre, correcto, ayuda, latenciaMs: latenciaMs ?? cronometro.leer() },
    ]
    setEnsayos(nuevos)
    setMostrandoAyudas(false)

    if (nuevos.length === secuencia.length) {
      const duracion = segundosDesde(inicioBloque)
      setDuracionBloque(duracion)
      const resumen =
        cuentaCorrecciones.total > 0 ? `Corrección del error: ${cuentaCorrecciones.bien} de ${cuentaCorrecciones.total} repeticiones bien.` : ''
      const notasFinales = [notas.trim(), resumen].filter(Boolean).join('\n')
      if (resumen) setNotas(notasFinales)
      intentarGuardar(nuevos, notasFinales, tipoSonda, duracion, modo)
      setEnTableta(false)
    }
  }

  const deshacerUltimo = () => {
    setTras(null)
    setCorreccion(null)
    setEnsayos((prev) => prev.slice(0, -1))
  }

  // Guarda el progreso en el dispositivo según se registra cada ensayo
  useEffect(() => {
    if (!secuencia) return
    guardarProgreso(claveProgreso, { secuencia, ensayos, notas, tamanoBloque, tipoSonda, inicioBloque, duracionBloque, modo })
  }, [secuencia, ensayos, notas, tamanoBloque, tipoSonda, inicioBloque, duracionBloque, modo, claveProgreso])

  if (resultado) {
    return (
      <div className={`rounded-2xl border p-4 sm:p-6 text-center space-y-3 ${
        resultado.dominioLogrado
          ? 'border-amber-300 bg-amber-50'
          : 'border-emerald-200 bg-emerald-50'
      }`}>
        {resultado.dominioLogrado && (
          <p className="text-2xl">🎉</p>
        )}
        <p className={`text-base sm:text-lg font-semibold ${
          resultado.dominioLogrado ? 'text-amber-800' : 'text-emerald-800'
        }`}>
          {resultado.dominioLogrado
            ? '¡Dominio conseguido! Este conjunto acaba de superar el criterio'
            : resultado.tipoSonda === 'generalizacion'
              ? `Sonda de generalización guardada — ${resultado.porcentaje}% de acierto`
              : resultado.tipoSonda === 'mantenimiento'
                ? `Sonda de mantenimiento guardada — ${resultado.porcentaje}% de acierto`
                : enLineaBase
                  ? `Bloque de línea base guardado — ${resultado.porcentaje}% de acierto`
                  : `Bloque guardado — ${resultado.porcentaje}% de acierto independiente`}
        </p>
        {resultado.dominioLogrado && (
          <p className="text-sm text-amber-700">{resultado.porcentaje}% de acierto en este último bloque</p>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            onClick={() => {
              setResultado(null)
              setSecuencia(null)
              setEstadoGuardado('idle')
              setContexto('')
            }}
            className="py-3 sm:py-2 text-base sm:text-sm"
          >
            Registrar otro bloque
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`/dashboard/programas/${programaAlumnoId}`)}
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
        onReintentar={() => intentarGuardar(ensayos, notas, tipoSonda, duracionBloque, modo)}
        onVolver={() => router.push(`/dashboard/programas/${programaAlumnoId}`)}
      />
    )
  }

  if (!secuencia) {
    return (
      <Panel className="p-4 sm:p-6 space-y-4">
        {sinConexion && <BannerSinConexion />}
        {enLineaBase && (
          <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 text-sm text-sky-800">
            Estás en fase de <strong>línea base</strong>: no se evalúa el criterio de dominio ni se registran ayudas, solo el nivel de partida sin intervención.
          </div>
        )}

        {puedeSonda && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">Tipo de sesión</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'normal', label: 'Seguimiento normal' },
                { value: 'mantenimiento', label: 'Sonda de mantenimiento' },
                { value: 'generalizacion', label: 'Sonda de generalización' },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    const v = t.value as typeof tipoSonda
                    setTipoSonda(v)
                    setTamanoBloque(v === 'normal' ? ensayosPorBloque : 3)
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    tipoSonda === t.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {tipoSonda === 'generalizacion' && (
              <input
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="Contexto (opcional): con quién, dónde..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
            )}
          </div>
        )}

        <p className="text-sm font-medium text-slate-600">Tamaño del bloque</p>
        <div className="flex gap-2">
          {(tipoSonda === 'normal' ? [10, 20] : [1, 3, 5]).map((n) => (
            <button
              key={n}
              onClick={() => setTamanoBloque(n)}
              className={`flex-1 sm:flex-none rounded-lg px-4 py-3 sm:py-2 text-base sm:text-sm font-medium ${
                tamanoBloque === n
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {n} ensayo{n === 1 ? '' : 's'}
            </button>
          ))}
        </div>
        {actividad && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600">Presentación</p>
            <div className="flex gap-2">
              {(['material', 'tableta'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setModo(m)}
                  className={`flex-1 sm:flex-none rounded-lg px-4 py-3 sm:py-2 text-base sm:text-sm font-medium ${
                    modo === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m === 'material' ? 'Con material' : 'En la tableta'}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">Juego de los vasos: {describirActividad(actividad)}</p>
          </div>
        )}
        <button
          onClick={empezarBloque}
          className="w-full rounded-lg bg-slate-800 py-4 sm:py-3 text-base font-semibold text-white hover:bg-slate-700"
        >
          Generar secuencia y empezar
        </button>
      </Panel>
    )
  }

  const estimuloActual = secuencia[ensayos.length]

  if (!estimuloActual) {
    return (
      <Panel className="p-8 text-center">
        <p className="text-slate-500">Guardando bloque...</p>
      </Panel>
    )
  }

  if (enTableta && actividad) {
    return (
      <PantallaVasos
        actividad={actividad}
        imagen={urlImagen(imagenes, estimuloActual.concepto_imagen ?? null, tipoSonda === 'generalizacion' ? 'generalizacion' : 'entrenamiento', ensayos.length)}
        nombre={estimuloActual.nombre}
        ensayo={ensayos.length}
        total={secuencia.length}
        onResponder={(correcto, latenciaMs) => registrar(correcto, 'independiente', latenciaMs)}
        onSalir={() => setEnTableta(false)}
      />
    )
  }

  // ── Misma pantalla que en los niveles 2 a 4: barra con Ayuda, Deshacer y «⋯»,
  // guía siempre visible, ✓/✗, corrección guiada tras un error y «Siguiente ensayo» ──
  const correccionPosible = !sinAyudas
  const etiquetaAyudaPendiente = etiquetaAyuda(ayudaPendiente)
  const marcar = (correcto: boolean) => {
    const ultimo = ensayos.length + 1 >= secuencia.length
    if (correccion === 'repetir') {
      // La repetición no cambia el ensayo (cuenta como error): se lleva la cuenta para las notas
      setCorrecciones((c) => ({ total: c.total + 1, bien: c.bien + (correcto ? 1 : 0) }))
      setCorreccion(null)
      if (!ultimo) setTras({ correcto: false, ayuda: 'independiente', repeticion: correcto })
      registrar(false, 'independiente', undefined, { total: correcciones.total + 1, bien: correcciones.bien + (correcto ? 1 : 0) })
      return
    }
    if (!correcto && correccionPosible) {
      cronometro.capturar()
      setAyudaPendiente(null)
      setMostrandoAyudas(false)
      setCorreccion('modelo')
      return
    }
    const ayuda = correcto && ayudaPendiente ? ayudaPendiente : 'independiente'
    setAyudaPendiente(null)
    if (!ultimo) setTras({ correcto, ayuda })
    registrar(correcto, ayuda)
  }
  const guia: { titulo: string; texto: string }[] = []
  if (correccion === 'modelo')
    guia.push({ titulo: 'Corrección (1 de 2):', texto: 'hágalo usted como modelo y ayúdele a hacerlo (con la ayuda que necesite). Cuando lo haya hecho, pulse «Hecho».' })
  else if (correccion === 'repetir')
    guia.push({ titulo: 'Corrección (2 de 2):', texto: 'repita el ensayo sin ayuda. ¿Lo hace? (El ensayo ya cuenta como error; la repetición se anota en las notas del bloque.)' })
  else {
    if (enLineaBase) guia.push({ titulo: 'Línea base:', texto: 'sin ayudas y sin corregir; solo registre lo que hace por sí mismo.' })
    if (enSonda)
      guia.push({
        titulo: tipoSonda === 'generalizacion' ? 'Sonda de generalización:' : 'Sonda de mantenimiento:',
        texto: `sin ayudas; no afecta al criterio de dominio.${contexto.trim() ? ` Contexto: ${contexto.trim()}.` : ''}`,
      })
    guia.push({ titulo: 'Presente', texto: `«${estimuloActual.nombre}» y dé la instrucción del programa (está en «⋯ › Instrucciones»).` })
    guia.push({ titulo: 'Marque', texto: 'si lo hace o no.' })
    if (etiquetaAyudaPendiente) guia.push({ titulo: `Ayuda: ${etiquetaAyudaPendiente}.`, texto: 'Se anotará en la próxima respuesta correcta.' })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {sinConexion && <BannerSinConexion />}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2 text-sm text-slate-500">
          <span aria-live="polite">
            {enLineaBase ? 'Línea base' : enSonda ? 'Sonda' : 'Entrenamiento'} · ensayo <strong>{ensayos.length + 1}</strong> de {secuencia.length}
            {correccion && <span className="ml-2 font-medium text-amber-700">· corrección</span>}
          </span>
          <span className="flex flex-wrap items-center gap-2">
            {!sinAyudas && !tras && !correccion && (
              <button
                onClick={() => setMostrandoAyudas((v) => !v)}
                className={`rounded-lg border px-3 py-1 ${ayudaPendiente ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                {etiquetaAyudaPendiente ? `Ayuda: ${etiquetaAyudaPendiente}` : 'Ayuda'}
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
            <div className={`rounded-xl p-4 text-left text-sm ${tras.correcto ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
              <p className="text-base font-semibold">
                {tras.correcto ? '✓ Lo hace' : '✗ No lo hace'}
                {tras.correcto && tras.ayuda !== 'independiente' ? ` (con ayuda: ${etiquetaAyuda(tras.ayuda)})` : ''}
                {tras.repeticion !== undefined ? (tras.repeticion ? ' · en la repetición, bien' : ' · en la repetición, tampoco') : ''}
              </p>
              <p className="mt-1">
                {tras.repeticion !== undefined
                  ? tras.repeticion
                    ? 'Refuerce que lo haya hecho bien en la repetición.'
                    : 'No pasa nada: siga con el siguiente. Si vuelve a fallar, elija una ayuda antes de que responda.'
                  : sinAyudas
                    ? 'Sin consecuencias: no le diga si está bien o mal.'
                    : tras.correcto
                      ? 'Refuércelo ahora.'
                      : 'Muéstrele cómo se hace antes de seguir.'}
              </p>
            </div>
            <p className="text-sm text-slate-500">Prepare el siguiente ensayo. Cuando esté listo, pulse el botón: verá qué presentar.</p>
            <Button
              variant="primary"
              onClick={() => {
                setTras(null)
                cronometro.reiniciar()
              }}
              className="w-full py-4 text-base active:scale-[0.98] sm:w-auto sm:px-10"
            >
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
            <p className="text-xl font-bold text-slate-800 sm:text-2xl">{estimuloActual.nombre}</p>
            {correccion === 'modelo' ? (
              <Button variant="primary" onClick={() => setCorreccion('repetir')} className="w-full py-4 text-base active:scale-[0.98] sm:w-auto sm:px-10">
                Hecho: repetir el ensayo
              </Button>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="success" onClick={() => marcar(true)} disabled={isPending} className="flex-1 py-4 text-base active:scale-[0.98] sm:py-3">
                  ✓ Lo hace{etiquetaAyudaPendiente && !correccion ? ` (con ayuda: ${etiquetaAyudaPendiente})` : ''}
                </Button>
                <Button variant="danger" onClick={() => marcar(false)} disabled={isPending} className="flex-1 py-4 text-base active:scale-[0.98] sm:py-3">
                  ✗ No lo hace
                </Button>
              </div>
            )}
          </div>
        )}

        {masAbierto && (
          <div className="space-y-4 border-t border-slate-200 bg-slate-50 p-3 text-left text-sm">
            {(instrucciones || ayudasPosibles || videoUrl) && (
              <details className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
                <summary className="cursor-pointer text-sm font-medium text-slate-700">Instrucciones del programa</summary>
                <div className="mt-2 space-y-2">
                  {instrucciones && <p className="whitespace-pre-wrap">{instrucciones}</p>}
                  {!sinAyudas && ayudasPosibles && (
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
                        {i + 1}. {e.estimuloNombre}
                        {e.ayuda !== 'independiente' ? ` (${etiquetaAyuda(e.ayuda)})` : ''}
                      </span>
                      <span className={e.correcto ? 'text-emerald-700' : 'text-rose-600'}>{e.correcto ? '✓' : '✗'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {isPending && <p className="text-center text-sm text-slate-500">Guardando bloque...</p>}
    </div>
  )
}
