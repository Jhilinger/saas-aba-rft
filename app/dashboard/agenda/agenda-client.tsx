'use client'

import { useState, useTransition, useMemo } from 'react'
import {
  crearSesionesRecurrentes,
  crearSesionUnica,
  marcarAsistencia,
  eliminarSesion,
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

const ETIQUETA_ESTADO: Record<string, { label: string; color: string }> = {
  programada: { label: 'Programada', color: 'bg-slate-100 text-slate-600' },
  asistio: { label: 'Asistió', color: 'bg-emerald-50 text-emerald-700' },
  cancelada: { label: 'Cancelada', color: 'bg-amber-50 text-amber-700' },
  no_asistio: { label: 'No asistió', color: 'bg-rose-50 text-rose-700' },
}

function primerDiaDelMes(): string {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
}

function hoy(): string {
  return new Date().toISOString().split('T')[0]
}

export default function AgendaClient({
  miPerfilId,
  miRol,
  alumnos,
  terapeutas,
  sesionesIniciales,
}: {
  miPerfilId: string
  miRol: string
  alumnos: { id: string; nombre_anonimizado: string }[]
  terapeutas: { id: string; nombre: string }[]
  sesionesIniciales: Sesion[]
}) {
  const [modo, setModo] = useState<'recurrente' | 'unica'>('recurrente')
  const [sesiones, setSesiones] = useState<Sesion[]>(sesionesIniciales)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)
  const confirmar = useConfirm()
  const toast = useToast()

  const [filtroAlumnoId, setFiltroAlumnoId] = useState('')
  const [filtroDesde, setFiltroDesde] = useState(primerDiaDelMes())
  const [filtroHasta, setFiltroHasta] = useState(hoy())

  const ahora = new Date()

  const { pendientes, proximas, historial } = useMemo(() => {
    const pendientes = sesiones.filter((s) => s.estado === 'programada' && new Date(s.fecha_hora) < ahora)
    const proximas = sesiones.filter((s) => s.estado === 'programada' && new Date(s.fecha_hora) >= ahora)
    const historial = sesiones.filter((s) => s.estado !== 'programada')
    return { pendientes, proximas, historial }
  }, [sesiones])

  const sesionesFacturacion = useMemo(() => {
    if (!filtroAlumnoId) return []
    const desde = new Date(filtroDesde + 'T00:00:00')
    const hasta = new Date(filtroHasta + 'T23:59:59')
    return sesiones
      .filter((s) => s.estado !== 'programada')
      .filter((s) => s.alumno_id === filtroAlumnoId)
      .filter((s) => {
        const f = new Date(s.fecha_hora)
        return f >= desde && f <= hasta
      })
      .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
  }, [sesiones, filtroAlumnoId, filtroDesde, filtroHasta])

  const resumenFacturacion = useMemo(() => {
    const asistio = sesionesFacturacion.filter((s) => s.estado === 'asistio').length
    const cancelada = sesionesFacturacion.filter((s) => s.estado === 'cancelada').length
    const noAsistio = sesionesFacturacion.filter((s) => s.estado === 'no_asistio').length
    return { total: sesionesFacturacion.length, asistio, cancelada, noAsistio }
  }, [sesionesFacturacion])

  const recargar = () => window.location.reload()

  const marcar = (sesionId: string, estado: 'asistio' | 'cancelada' | 'no_asistio', canceladoPor?: 'terapeuta' | 'familia') => {
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

  const filaSesion = (s: Sesion, mostrarAcciones: boolean) => (
    <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium text-slate-800">{s.alumnos?.nombre_anonimizado ?? '—'}</p>
          <p className="text-sm text-slate-500">
            {new Date(s.fecha_hora).toLocaleString('es-ES', {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
            {' · '}
            {s.duracion_minutos} min
            {s.terapeuta?.nombre && ` · ${s.terapeuta.nombre}`}
          </p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${ETIQUETA_ESTADO[s.estado].color}`}>
          {ETIQUETA_ESTADO[s.estado].label}
          {s.estado !== 'programada' && (s.confirmada_familia ? ' · Confirmada por familia' : ' · Sin confirmar')}
        </span>
      </div>

      {mostrarAcciones && (
        <div className="flex flex-wrap gap-2">
          <button
            disabled={isPending}
            onClick={() => marcar(s.id, 'asistio')}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            ✓ Asistió
          </button>
          <button
            disabled={isPending}
            onClick={() => marcar(s.id, 'cancelada', 'terapeuta')}
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
          >
            Cancelada (terapeuta)
          </button>
          <button
            disabled={isPending}
            onClick={() => marcar(s.id, 'cancelada', 'familia')}
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
          >
            Cancelada (familia)
          </button>
          <button
            disabled={isPending}
            onClick={() => marcar(s.id, 'no_asistio')}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
          >
            No asistió
          </button>
        </div>
      )}

      {!mostrarAcciones && s.estado === 'programada' && (
        <button
          onClick={() => borrar(s.id)}
          className="text-xs font-medium text-rose-500 hover:text-rose-700"
        >
          Eliminar
        </button>
      )}
    </div>
  )
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
              <input
                name="fecha_inicio"
                type="date"
                required
                className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
              <input
                name="hora"
                type="time"
                required
                className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
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
                <input
                  name="duracion_minutos"
                  type="number"
                  defaultValue="60"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-600">Nº de semanas</label>
                <input
                  name="numero_semanas"
                  type="number"
                  defaultValue="8"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
                />
              </div>
            </>
          ) : (
            <>
              <input
                name="fecha"
                type="date"
                required
                className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
              <input
                name="hora"
                type="time"
                required
                className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
              <input
                name="duracion_minutos"
                type="number"
                defaultValue="60"
                placeholder="Duración (min)"
                className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
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

      {miRol === 'clinica_admin' && (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">Sesiones por alumno (para facturación)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={filtroAlumnoId}
              onChange={(e) => setFiltroAlumnoId(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            >
              <option value="">Selecciona un alumno...</option>
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre_anonimizado}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filtroDesde}
              onChange={(e) => setFiltroDesde(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            />
            <input
              type="date"
              value={filtroHasta}
              onChange={(e) => setFiltroHasta(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            />
          </div>

          {filtroAlumnoId && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-white p-3 text-center">
                  <p className="text-xl font-bold text-slate-800">{resumenFacturacion.total}</p>
                  <p className="text-xs text-slate-500">Total sesiones</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-center">
                  <p className="text-xl font-bold text-emerald-600">{resumenFacturacion.asistio}</p>
                  <p className="text-xs text-slate-500">Asistidas</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-center">
                  <p className="text-xl font-bold text-amber-600">{resumenFacturacion.cancelada}</p>
                  <p className="text-xs text-slate-500">Canceladas</p>
                </div>
                <div className="rounded-xl bg-white p-3 text-center">
                  <p className="text-xl font-bold text-rose-600">{resumenFacturacion.noAsistio}</p>
                  <p className="text-xs text-slate-500">No asistió</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
                <table className="w-full text-sm min-w-[450px]">
                  <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                    <tr>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Terapeuta</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Confirmada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sesionesFacturacion.map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 last:border-0">
                        <td className="p-3 text-slate-700 whitespace-nowrap">
                          {new Date(s.fecha_hora).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-3 text-slate-600">{s.terapeuta?.nombre ?? '—'}</td>
                        <td className="p-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${ETIQUETA_ESTADO[s.estado].color}`}>
                            {ETIQUETA_ESTADO[s.estado].label}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{s.confirmada_familia ? '✓ Sí' : 'Pendiente'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sesionesFacturacion.length === 0 && (
                  <p className="p-6 text-center text-slate-400">
                    Sin sesiones realizadas para este alumno en el período seleccionado.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      )}
      {pendientes.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-700">Pendientes de marcar ({pendientes.length})</h2>
          <div className="space-y-2">{pendientes.map((s) => filaSesion(s, true))}</div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Próximas sesiones ({proximas.length})</h2>
        <div className="space-y-2">{proximas.map((s) => filaSesion(s, false))}</div>
        {proximas.length === 0 && <p className="text-sm text-slate-400">No hay sesiones próximas programadas.</p>}
      </section>

      {historial.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-700">Historial</h2>
          <div className="space-y-2">{historial.slice(0, 20).map((s) => filaSesion(s, false))}</div>
        </section>
      )}
    </div>
  )
}