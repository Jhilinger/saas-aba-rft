'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  crearSesionesRecurrentes,
  crearSesionUnica,
  marcarAsistencia,
  eliminarSesion,
  cancelarSerieFutura,
  eliminarSerieFutura,
  cambiarHoraSerie,
} from './actions'
import { useConfirm } from '../../providers/confirm-provider'
import { useToast } from '../../providers/toast-provider'

type Sesion = {
  id: string
  fecha_hora: string
  duracion_minutos: number
  estado: 'programada' | 'asistio' | 'cancelada' | 'no_asistio'
  cancelado_por: string | null
  notas: string | null
  confirmada_familia: boolean
  alumno_id: string
  terapeuta_id: string
  serie_id: string | null
  alumnos: { nombre_anonimizado: string } | null
  terapeuta?: { nombre: string } | null
}

const DIAS_SEMANA = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' },
]

const NOMBRE_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const ETIQUETA_ESTADO: Record<string, { label: string; color: string; borde: string }> = {
  programada: { label: 'Programada', color: 'bg-slate-100 text-slate-600', borde: 'border-slate-300' },
  asistio: { label: 'Asistió', color: 'bg-emerald-50 text-emerald-700', borde: 'border-emerald-300' },
  cancelada: { label: 'Cancelada', color: 'bg-amber-50 text-amber-700', borde: 'border-amber-300' },
  no_asistio: { label: 'No asistió', color: 'bg-rose-50 text-rose-700', borde: 'border-rose-300' },
}

function sumarDias(fechaISO: string, n: number) {
  const d = new Date(fechaISO + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function formatearRangoSemana(lunes: string) {
  const inicio = new Date(lunes + 'T12:00:00')
  const fin = new Date(sumarDias(lunes, 6) + 'T12:00:00')
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }
  return `${inicio.toLocaleDateString('es-ES', opts)} — ${fin.toLocaleDateString('es-ES', opts)}`
}

export default function AgendaClient({
  miPerfilId,
  miRol,
  alumnos,
  terapeutas,
  sesiones,
  lunes,
  vista,
  pendientesCount,
}: {
  miPerfilId: string
  miRol: string
  alumnos: { id: string; nombre_anonimizado: string }[]
  terapeutas: { id: string; nombre: string }[]
  sesiones: Sesion[]
  lunes: string
  vista: 'semana' | 'pendientes'
  pendientesCount: number
}) {
  const [modo, setModo] = useState<'recurrente' | 'unica'>('recurrente')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)
  const [serieAbierta, setSerieAbierta] = useState<string | null>(null)
  const [nuevaHoraSerie, setNuevaHoraSerie] = useState('')
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null)
  const [mostrarFinde, setMostrarFinde] = useState(false)
  const confirmar = useConfirm()
  const toast = useToast()
  const router = useRouter()

  const ahora = new Date()
    const seriesFuturas = (() => {
    const mapa = new Map<string, { serieId: string; count: number; alumnoNombre: string }>()
    for (const s of sesiones) {
      if (s.estado !== 'programada' || new Date(s.fecha_hora) < ahora || !s.serie_id) continue
      if (!mapa.has(s.serie_id)) {
        mapa.set(s.serie_id, { serieId: s.serie_id, count: 0, alumnoNombre: s.alumnos?.nombre_anonimizado ?? '—' })
      }
      mapa.get(s.serie_id)!.count++
    }
    return [...mapa.values()]
  })()

  const recargar = () => router.refresh()

  const marcar = (sesionId: string, estado: 'asistio' | 'cancelada' | 'no_asistio', canceladoPor?: 'terapeuta' | 'familia') => {
    setMenuAbierto(null)
    startTransition(async () => {
      const res = await marcarAsistencia(sesionId, estado, canceladoPor)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast('Asistencia registrada', 'exito')
      recargar()
    })
  }

  const borrar = async (sesionId: string) => {
    setMenuAbierto(null)
    const ok = await confirmar({
      titulo: 'Eliminar sesión',
      mensaje: '¿Eliminar esta sesión programada? No se puede deshacer.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarSesion(sesionId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Sesión eliminada', 'exito')
      recargar()
    })
  }

  const cancelarSerie = async (serieId: string, count: number) => {
    const ok = await confirmar({
      titulo: 'Cancelar serie completa',
      mensaje: `¿Cancelar las ${count} sesiones futuras de esta serie?`,
      textoConfirmar: 'Cancelar todas',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await cancelarSerieFutura(serieId, 'terapeuta')
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Serie cancelada', 'exito')
      recargar()
    })
  }

  const eliminarSerie = async (serieId: string, count: number) => {
    const ok = await confirmar({
      titulo: 'Eliminar serie completa',
      mensaje: `¿Eliminar las ${count} sesiones futuras de esta serie? No se puede deshacer.`,
      textoConfirmar: 'Eliminar todas',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarSerieFutura(serieId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Serie eliminada', 'exito')
      recargar()
    })
  }

  const cambiarHora = (serieId: string) => {
    if (!nuevaHoraSerie) return
    startTransition(async () => {
      const res = await cambiarHoraSerie(serieId, nuevaHoraSerie)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast(`${res.actualizadas} sesiones actualizadas`, 'exito')
      setSerieAbierta(null)
      setNuevaHoraSerie('')
      recargar()
    })
  }

  const tarjetaSesion = (s: Sesion, compacta: boolean) => {
    const esPasadaSinMarcar = s.estado === 'programada' && new Date(s.fecha_hora) < ahora
    const abierto = menuAbierto === s.id
    const info = ETIQUETA_ESTADO[s.estado]

    return (
      <div key={s.id} className={`rounded-lg border ${info.borde} bg-white p-2 text-xs space-y-1`}>
        <button
          onClick={() => (esPasadaSinMarcar || s.estado === 'programada' ? setMenuAbierto(abierto ? null : s.id) : undefined)}
          className="w-full text-left"
        >
          <p className="font-semibold text-slate-800 truncate">{s.alumnos?.nombre_anonimizado ?? '—'}</p>
          <p className="text-slate-500">
            {new Date(s.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            {!compacta && s.terapeuta?.nombre && ` · ${s.terapeuta.nombre}`}
          </p>
          <span className={`inline-block rounded-full px-1.5 py-0.5 mt-0.5 font-medium ${info.color}`}>
            {info.label}
          </span>
        </button>

        {abierto && (
          <div className="pt-1 border-t border-slate-100 space-y-1">
            {esPasadaSinMarcar && (
              <>
                <button onClick={() => marcar(s.id, 'asistio')} className="block w-full rounded bg-emerald-600 py-1 text-white font-medium">
                  ✓ Asistió
                </button>
                <button onClick={() => marcar(s.id, 'cancelada', 'terapeuta')} className="block w-full rounded bg-amber-500 py-1 text-white font-medium">
                  Cancelada (terapeuta)
                </button>
                <button onClick={() => marcar(s.id, 'cancelada', 'familia')} className="block w-full rounded bg-amber-500 py-1 text-white font-medium">
                  Cancelada (familia)
                </button>
                <button onClick={() => marcar(s.id, 'no_asistio')} className="block w-full rounded bg-rose-600 py-1 text-white font-medium">
                  No asistió
                </button>
              </>
            )}
            {!esPasadaSinMarcar && s.estado === 'programada' && (
              <button onClick={() => borrar(s.id)} className="block w-full rounded bg-rose-50 py-1 text-rose-600 font-medium">
                Eliminar sesión
              </button>
            )}
            <button onClick={() => setMenuAbierto(null)} className="block w-full py-1 text-slate-400">
              Cerrar
            </button>
          </div>
        )}
      </div>
    )
  }
    const columnasTodas = Array.from({ length: 7 }, (_, i) => {
    const fechaCol = sumarDias(lunes, i)
    const sesionesDia = sesiones
      .filter((s) => s.fecha_hora.split('T')[0] === fechaCol)
      .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
    const diaSemana = new Date(fechaCol + 'T12:00:00').getDay()
    return { fecha: fechaCol, nombre: NOMBRE_DIA[diaSemana], diaSemana, sesiones: sesionesDia }
  })

  const columnas = mostrarFinde ? columnasTodas : columnasTodas.filter((c) => c.diaSemana !== 0 && c.diaSemana !== 6)

  const sesionesFindeCount = columnasTodas
    .filter((c) => c.diaSemana === 0 || c.diaSemana === 6)
    .reduce((acc, c) => acc + c.sesiones.length, 0)

  const hoyStr = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setModo('recurrente')}
            className={`rounded-lg px-3 py-1.5 font-medium ${modo === 'recurrente' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Sesiones recurrentes
          </button>
          <button
            onClick={() => setModo('unica')}
            className={`rounded-lg px-3 py-1.5 font-medium ${modo === 'unica' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Sesión única
          </button>
        </div>

        <form
          action={(formData: FormData) => {
            setError(null)
            setMensajeExito(null)
            startTransition(async () => {
              const res =
                modo === 'recurrente'
                  ? await crearSesionesRecurrentes(formData)
                  : await crearSesionUnica(formData)
              if (res.error) {
                setError(res.error)
                return
              }
              setMensajeExito(
                modo === 'recurrente' && 'creadas' in res
                  ? `${res.creadas} sesiones creadas`
                  : 'Sesión creada'
              )
              recargar()
            })
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <select name="alumno_id" required className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm">
            <option value="">Alumno...</option>
            {alumnos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre_anonimizado}
              </option>
            ))}
          </select>

          {miRol === 'clinica_admin' ? (
            <select name="terapeuta_id" required className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm">
              <option value="">Terapeuta...</option>
              {terapeutas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          ) : (
            <input type="hidden" name="terapeuta_id" value={miPerfilId} />
          )}

          {modo === 'recurrente' ? (
            <>
              <input name="fecha_inicio" type="date" required className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
              <input name="hora" type="time" required className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                {DIAS_SEMANA.map((d) => (
                  <label key={d.value} className="flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1 text-sm">
                    <input type="checkbox" name="dias_semana" value={d.value} />
                    {d.label}
                  </label>
                ))}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">Duración (min)</label>
                <input name="duracion_minutos" type="number" defaultValue="60" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">Nº de semanas</label>
                <input name="numero_semanas" type="number" defaultValue="8" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
              </div>
            </>
          ) : (
            <>
              <input name="fecha" type="date" required className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
              <input name="hora" type="time" required className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
              <input name="duracion_minutos" type="number" defaultValue="60" placeholder="Duración (min)" className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
            </>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="sm:col-span-2 rounded-lg bg-indigo-600 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isPending ? 'Creando...' : 'Programar'}
          </button>
        </form>

        {error && <p className="text-sm text-rose-600">{error}</p>}
        {mensajeExito && <p className="text-sm text-emerald-600">{mensajeExito}</p>}
      </div>

      {pendientesCount > 0 && (
        <Link
          href="/dashboard/agenda?vista=pendientes"
          className="block rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 hover:bg-rose-100"
        >
          ⚠️ Tienes {pendientesCount} sesión{pendientesCount > 1 ? 'es' : ''} pasada{pendientesCount > 1 ? 's' : ''} sin marcar — Ver todas
        </Link>
      )}
            {vista === 'pendientes' ? (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Sesiones pendientes de marcar</h2>
            <Link href="/dashboard/agenda" className="text-xs font-medium text-indigo-600 hover:underline">
              ← Volver a la agenda
            </Link>
          </div>
          <div className="space-y-2 max-w-md">
            {sesiones.map((s) => (
              <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="font-medium text-slate-800">{s.alumnos?.nombre_anonimizado ?? '—'}</p>
                <p className="text-sm text-slate-500 mb-2">
                  {new Date(s.fecha_hora).toLocaleString('es-ES', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => marcar(s.id, 'asistio')} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">✓ Asistió</button>
                  <button onClick={() => marcar(s.id, 'cancelada', 'terapeuta')} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white">Cancelada (terapeuta)</button>
                  <button onClick={() => marcar(s.id, 'cancelada', 'familia')} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white">Cancelada (familia)</button>
                  <button onClick={() => marcar(s.id, 'no_asistio')} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white">No asistió</button>
                </div>
              </div>
            ))}
          </div>
          {sesiones.length === 0 && <p className="text-sm text-slate-400">Nada pendiente por aquí 🎉</p>}
        </section>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/dashboard/agenda?fecha=${sumarDias(lunes, -7)}`}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200"
            >
              ← Semana anterior
            </Link>
            <div className="text-center">
              <p className="font-semibold text-slate-800">{formatearRangoSemana(lunes)}</p>
              <Link href="/dashboard/agenda" className="text-xs text-indigo-600 hover:underline">
                Ir a esta semana
              </Link>
            </div>
            <Link
              href={`/dashboard/agenda?fecha=${sumarDias(lunes, 7)}`}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200"
            >
              Semana siguiente →
            </Link>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={mostrarFinde} onChange={(e) => setMostrarFinde(e.target.checked)} />
            Mostrar fin de semana
            {!mostrarFinde && sesionesFindeCount > 0 && (
              <span className="text-xs text-amber-600">({sesionesFindeCount} sesión{sesionesFindeCount > 1 ? 'es' : ''} oculta{sesionesFindeCount > 1 ? 's' : ''})</span>
            )}
          </label>

          {seriesFuturas.map((serie) => (
            <div key={serie.serieId} className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-indigo-800">
                  Serie de <strong>{serie.alumnoNombre}</strong>
                </p>
                <button
                  onClick={() => setSerieAbierta(serieAbierta === serie.serieId ? null : serie.serieId)}
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  {serieAbierta === serie.serieId ? 'Ocultar' : 'Gestionar serie'}
                </button>
              </div>
              {serieAbierta === serie.serieId && (
                <div className="flex flex-wrap items-center gap-2 border-t border-indigo-200 pt-2">
                  <input
                    type="time"
                    value={nuevaHoraSerie}
                    onChange={(e) => setNuevaHoraSerie(e.target.value)}
                    className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                  />
                  <button onClick={() => cambiarHora(serie.serieId)} disabled={!nuevaHoraSerie || isPending} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                    Cambiar hora de todas las futuras
                  </button>
                  <button onClick={() => cancelarSerie(serie.serieId, serie.count)} disabled={isPending} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 disabled:opacity-50">
                    Cancelar todas las futuras
                  </button>
                  <button onClick={() => eliminarSerie(serie.serieId, serie.count)} disabled={isPending} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50">
                    Eliminar todas las futuras
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className={`grid grid-cols-1 gap-2 overflow-x-auto ${mostrarFinde ? 'sm:grid-cols-7' : 'sm:grid-cols-5'}`}>
            {columnas.map((col) => (
              <div
                key={col.fecha}
                className={`rounded-xl border p-2 space-y-2 min-h-[100px] ${col.fecha === hoyStr ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200 bg-white'}`}
              >
                <p className={`text-xs font-semibold text-center ${col.fecha === hoyStr ? 'text-indigo-700' : 'text-slate-500'}`}>
                  {col.nombre.slice(0, 3)} {new Date(col.fecha + 'T12:00:00').getDate()}
                </p>
                <div className="space-y-1.5">
                  {col.sesiones.map((s) => tarjetaSesion(s, true))}
                  {col.sesiones.length === 0 && <p className="text-center text-xs text-slate-300 py-2">—</p>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}