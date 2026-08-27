'use client'

import { useState, useMemo } from 'react'
import { descargarCSV } from '@/utils/csv'

type Sesion = {
  id: string
  fecha_hora: string
  estado: 'asistio' | 'cancelada' | 'no_asistio'
  cancelado_por: string | null
  confirmada_familia: boolean
  alumno_id: string
  alumnos: { nombre_anonimizado: string } | null
  terapeuta: { nombre: string } | null
}

const ETIQUETA_ESTADO: Record<string, { label: string; color: string }> = {
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

type DatosFacturacion = {
  alumno_id: string
  nombre_razon_social: string | null
  nif: string | null
  direccion: string | null
  codigo_postal: string | null
  ciudad: string | null
  pais: string | null
  updated_at: string
}

export default function FacturacionClient({
  alumnos,
  sesiones,
  datosFacturacion,
}: {
  alumnos: { id: string; nombre_anonimizado: string }[]
  sesiones: Sesion[]
  datosFacturacion: DatosFacturacion[]
}) {
  const [filtroAlumnoId, setFiltroAlumnoId] = useState('')
  const [filtroDesde, setFiltroDesde] = useState(primerDiaDelMes())
  const [filtroHasta, setFiltroHasta] = useState(hoy())

  const sesionesFiltradas = useMemo(() => {
    if (!filtroAlumnoId) return []
    const desde = new Date(filtroDesde + 'T00:00:00')
    const hasta = new Date(filtroHasta + 'T23:59:59')
    return sesiones
      .filter((s) => s.alumno_id === filtroAlumnoId)
      .filter((s) => {
        const f = new Date(s.fecha_hora)
        return f >= desde && f <= hasta
      })
      .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
  }, [sesiones, filtroAlumnoId, filtroDesde, filtroHasta])

  const resumen = useMemo(() => {
    const asistio = sesionesFiltradas.filter((s) => s.estado === 'asistio').length
    const cancelada = sesionesFiltradas.filter((s) => s.estado === 'cancelada').length
    const noAsistio = sesionesFiltradas.filter((s) => s.estado === 'no_asistio').length
    return { total: sesionesFiltradas.length, asistio, cancelada, noAsistio }
  }, [sesionesFiltradas])

  const nombreAlumnoSeleccionado = alumnos.find((a) => a.id === filtroAlumnoId)?.nombre_anonimizado ?? 'alumno'

  const exportar = () => {
    const filas = sesionesFiltradas.map((s) => ({
      Alumno: nombreAlumnoSeleccionado,
      Fecha: new Date(s.fecha_hora).toLocaleDateString('es-ES'),
      Terapeuta: s.terapeuta?.nombre ?? '—',
      Estado: ETIQUETA_ESTADO[s.estado].label,
      'Confirmada por familia': s.confirmada_familia ? 'Sí' : 'Pendiente',
    }))
    descargarCSV(`facturacion-${nombreAlumnoSeleccionado}-${filtroDesde}-a-${filtroHasta}.csv`, filas)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
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

        {!filtroAlumnoId && (
          <p className="text-sm text-slate-400">Selecciona un alumno para ver sus sesiones realizadas.</p>
        )}
      </div>
            {filtroAlumnoId && (
        <>
          {(() => {
            const datos = datosFacturacion.find((d) => d.alumno_id === filtroAlumnoId)
            return (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Datos de facturación (aportados por la familia)</h3>
                {datos ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                    <p><span className="text-slate-400">Nombre/razón social:</span> {datos.nombre_razon_social || '—'}</p>
                    <p><span className="text-slate-400">NIF/DNI:</span> {datos.nif || '—'}</p>
                    <p className="sm:col-span-2"><span className="text-slate-400">Dirección:</span> {datos.direccion || '—'}</p>
                    <p><span className="text-slate-400">Código postal:</span> {datos.codigo_postal || '—'}</p>
                    <p><span className="text-slate-400">Ciudad:</span> {datos.ciudad || '—'}</p>
                    <p><span className="text-slate-400">País:</span> {datos.pais || '—'}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">La familia todavía no ha aportado sus datos de facturación.</p>
                )}
              </div>
            )
          })()}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-white p-3 text-center">
              <p className="text-xl font-bold text-slate-800">{resumen.total}</p>
              <p className="text-xs text-slate-500">Total sesiones</p>
            </div>
            <div className="rounded-xl bg-white p-3 text-center">
              <p className="text-xl font-bold text-emerald-600">{resumen.asistio}</p>
              <p className="text-xs text-slate-500">Asistidas</p>
            </div>
            <div className="rounded-xl bg-white p-3 text-center">
              <p className="text-xl font-bold text-amber-600">{resumen.cancelada}</p>
              <p className="text-xs text-slate-500">Canceladas</p>
            </div>
            <div className="rounded-xl bg-white p-3 text-center">
              <p className="text-xl font-bold text-rose-600">{resumen.noAsistio}</p>
              <p className="text-xs text-slate-500">No asistió</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={exportar}
              disabled={sesionesFiltradas.length === 0}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-40"
            >
              Exportar CSV
            </button>
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
                {sesionesFiltradas.map((s) => (
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
            {sesionesFiltradas.length === 0 && (
              <p className="p-6 text-center text-slate-400">
                Sin sesiones realizadas para este alumno en el período seleccionado.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}