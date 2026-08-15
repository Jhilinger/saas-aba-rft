'use client'

import { useState, useTransition } from 'react'
import jsPDF from 'jspdf'
import { generarInforme, eliminarInforme } from './informes/actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'

type Informe = {
  id: string
  destinatario: string
  periodo_desde: string
  periodo_hasta: string
  contenido: string
  created_at: string
}

function hace30Dias(): string {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().split('T')[0]
}

function hoy(): string {
  return new Date().toISOString().split('T')[0]
}

function esTitulo(linea: string): boolean {
  const limpia = linea.trim()
  if (limpia.length === 0) return false
  const soloLetras = limpia.replace(/[^A-ZÁÉÍÓÚÑ]/g, '')
  return soloLetras.length >= 3 && limpia === limpia.toUpperCase() && limpia.length < 80
}

function ContenidoInforme({ contenido }: { contenido: string }) {
  const parrafos = contenido.split('\n').filter((l) => l.trim() !== '')
  return (
    <div className="space-y-3">
      {parrafos.map((linea, i) =>
        esTitulo(linea) ? (
          <p key={i} className="font-semibold text-slate-800 mt-4 first:mt-0">
            {linea.trim()}
          </p>
        ) : (
          <p key={i} className="text-slate-700 leading-relaxed">
            {linea.trim()}
          </p>
        )
      )}
    </div>
  )
}

function descargarPdf(informe: Informe, nombreAlumno: string, nombreClinica: string) {
  const doc = new jsPDF()
  const margen = 15
  const anchoUtil = 180
  const altoPagina = 297
  let y = 20

  const dibujarCabecera = () => {
    doc.setFontSize(9)
    doc.setTextColor(150)
    doc.text(nombreClinica, margen, 10)
    doc.text(
      `Generado el ${new Date().toLocaleDateString('es-ES')}`,
      210 - margen,
      10,
      { align: 'right' }
    )
    doc.setTextColor(0)
  }

  const dibujarPiePagina = (numeroPagina: number) => {
    doc.setFontSize(9)
    doc.setTextColor(150)
    doc.text(`Página ${numeroPagina}`, 210 / 2, altoPagina - 10, { align: 'center' })
    doc.setTextColor(0)
  }

  let numeroPagina = 1
  dibujarCabecera()
  dibujarPiePagina(numeroPagina)

  doc.setFontSize(16)
  doc.text(`Informe de progreso — ${nombreAlumno}`, margen, y)
  y += 8
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(
    `Período: ${informe.periodo_desde} a ${informe.periodo_hasta}  ·  ${informe.destinatario === 'familia' ? 'Para la familia' : 'Informe formal'}`,
    margen,
    y
  )
  doc.setTextColor(0)
  y += 12

  const parrafos = informe.contenido.split('\n').filter((l) => l.trim() !== '')

  for (const parrafo of parrafos) {
    const linea = parrafo.trim()
    const titulo = esTitulo(linea)

    doc.setFontSize(titulo ? 12 : 11)
    doc.setFont('helvetica', titulo ? 'bold' : 'normal')

    const lineasEnvueltas = doc.splitTextToSize(linea, anchoUtil)

    for (const l of lineasEnvueltas) {
      if (y > altoPagina - 20) {
        doc.addPage()
        numeroPagina++
        y = 20
        dibujarCabecera()
        dibujarPiePagina(numeroPagina)
      }
      doc.text(l, margen, y)
      y += titulo ? 7 : 6
    }
    y += titulo ? 2 : 4
  }

  doc.save(`informe-${nombreAlumno}-${informe.periodo_hasta}.pdf`)
}
export default function InformesSection({
  alumnoId,
  nombreAlumno,
  nombreClinica,
  informesIniciales,
}: {
  alumnoId: string
  nombreAlumno: string
  nombreClinica: string
  informesIniciales: Informe[]
}) {
  const [destinatario, setDestinatario] = useState<'familia' | 'formal'>('familia')
  const [periodoDesde, setPeriodoDesde] = useState(hace30Dias())
  const [periodoHasta, setPeriodoHasta] = useState(hoy())
  const [informes, setInformes] = useState<Informe[]>(informesIniciales)
  const [informeAbierto, setInformeAbierto] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const confirmar = useConfirm()
  const toast = useToast()

  const generar = () => {
    setError(null)
    startTransition(async () => {
      const res = await generarInforme(alumnoId, destinatario, periodoDesde, periodoHasta)
      if (res.error) {
        setError(res.error)
        return
      }
      const nuevo: Informe = {
        id: res.id!,
        destinatario,
        periodo_desde: periodoDesde,
        periodo_hasta: periodoHasta,
        contenido: res.contenido!,
        created_at: new Date().toISOString(),
      }
      setInformes((prev) => [nuevo, ...prev])
      setInformeAbierto(nuevo.id)
      toast('Informe generado', 'exito')
    })
  }

  const borrar = async (id: string) => {
    const ok = await confirmar({
      titulo: 'Eliminar informe',
      mensaje: '¿Eliminar este informe? No se puede deshacer.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarInforme(id, alumnoId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      setInformes((prev) => prev.filter((i) => i.id !== id))
      if (informeAbierto === id) setInformeAbierto(null)
      toast('Informe eliminado', 'exito')
    })
  }
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">Generar informe de progreso</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Destinatario</label>
            <select
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value as 'familia' | 'formal')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            >
              <option value="familia">Para la familia</option>
              <option value="formal">Informe formal (colegio/aseguradora)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Desde</label>
            <input
              type="date"
              value={periodoDesde}
              onChange={(e) => setPeriodoDesde(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Hasta</label>
            <input
              type="date"
              value={periodoHasta}
              onChange={(e) => setPeriodoHasta(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            />
          </div>
        </div>

        <button
          onClick={generar}
          disabled={isPending}
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {isPending ? 'Generando...' : 'Generar informe'}
        </button>

        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-slate-700">Historial</h2>
        {informes.length === 0 && (
          <p className="text-sm text-slate-400">Todavía no se ha generado ningún informe.</p>
        )}
        {informes.map((informe) => (
          <div key={informe.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 mr-2">
                  {informe.destinatario === 'familia' ? 'Para la familia' : 'Informe formal'}
                </span>
                <span className="text-sm text-slate-500">
                  {informe.periodo_desde} a {informe.periodo_hasta}
                </span>
              </div>
              <div className="flex gap-3 sm:gap-2">
                <button
                  onClick={() => setInformeAbierto(informeAbierto === informe.id ? null : informe.id)}
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  {informeAbierto === informe.id ? 'Ocultar' : 'Ver'}
                </button>
                <button
                  onClick={() => descargarPdf(informe, nombreAlumno, nombreClinica)}
                  className="text-xs font-medium text-emerald-600 hover:underline"
                >
                  Descargar PDF
                </button>
                <button
                  onClick={() => borrar(informe.id)}
                  className="text-xs font-medium text-rose-500 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
            {informeAbierto === informe.id && (
              <div className="rounded-lg bg-slate-50 p-4">
                <ContenidoInforme contenido={informe.contenido} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}