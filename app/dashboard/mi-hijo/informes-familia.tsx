'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'

type Informe = {
  id: string
  periodo_desde: string
  periodo_hasta: string
  contenido: string
  created_at: string
  alumno_nombre: string
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

function descargarPdf(informe: Informe, nombreClinica: string) {
  const doc = new jsPDF()
  const margen = 15
  const anchoUtil = 180
  const altoPagina = 297
  let y = 20

  const dibujarCabecera = () => {
    doc.setFontSize(9)
    doc.setTextColor(150)
    doc.text(nombreClinica, margen, 10)
    doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, 210 - margen, 10, { align: 'right' })
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
  doc.text(`Informe de progreso — ${informe.alumno_nombre}`, margen, y)
  y += 8
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Período: ${informe.periodo_desde} a ${informe.periodo_hasta}`, margen, y)
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

  doc.save(`informe-${informe.alumno_nombre}-${informe.periodo_hasta}.pdf`)
}

export default function InformesFamilia({
  informes,
  nombreClinica,
}: {
  informes: Informe[]
  nombreClinica: string
}) {
  const [abierto, setAbierto] = useState<string | null>(null)

  if (informes.length === 0) {
    return (
      <p className="text-center text-slate-400 py-6">
        Todavía no hay informes disponibles.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {informes.map((informe) => (
        <div key={informe.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-slate-800">{informe.alumno_nombre}</p>
              <p className="text-sm text-slate-500">
                {informe.periodo_desde} a {informe.periodo_hasta}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAbierto(abierto === informe.id ? null : informe.id)}
                className="text-xs font-medium text-indigo-600 hover:underline"
              >
                {abierto === informe.id ? 'Ocultar' : 'Ver'}
              </button>
              <button
                onClick={() => descargarPdf(informe, nombreClinica)}
                className="text-xs font-medium text-emerald-600 hover:underline"
              >
                Descargar PDF
              </button>
            </div>
          </div>
          {abierto === informe.id && (
            <div className="rounded-lg bg-slate-50 p-4">
              <ContenidoInforme contenido={informe.contenido} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}