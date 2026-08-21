'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'
import { createClient } from '@/utils/supabase/client'
import { guardarFirmaDocumento } from './actions'
import { useToast } from '../../../providers/toast-provider'

type Documento = {
  id: string
  titulo: string
  contenido: string
  firmado: { fecha: string; pdfUrl: string | null } | null
}
type AlumnoDatos = { alumnoId: string; alumnoNombre: string; documentos: Documento[] }

export default function DocumentosClient({ datosPorAlumno }: { datosPorAlumno: AlumnoDatos[] }) {
  const [firmando, setFirmando] = useState<{ alumnoId: string; alumnoNombre: string; doc: Documento } | null>(null)
  const [subiendo, setSubiendo] = useState(false)
  const [haDibujado, setHaDibujado] = useState(false)
  const [nombreFirmante, setNombreFirmante] = useState('')
  const [dniFirmante, setDniFirmante] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dibujandoRef = useRef(false)
  const toast = useToast()
  const router = useRouter()

  const posicion = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const empezarTrazo = (e: any) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    dibujandoRef.current = true
    const ctx = canvas.getContext('2d')!
    const { x, y } = posicion(e, canvas)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const dibujar = (e: any) => {
    if (!dibujandoRef.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const { x, y } = posicion(e, canvas)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHaDibujado(true)
  }

  const terminarTrazo = () => {
    dibujandoRef.current = false
  }

  const limpiarFirma = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHaDibujado(false)
  }

  const abrirFirma = (alumnoId: string, alumnoNombre: string, doc: Documento) => {
    setFirmando({ alumnoId, alumnoNombre, doc })
    setHaDibujado(false)
    setNombreFirmante('')
    setDniFirmante('')
    setTimeout(() => {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')!
        ctx.strokeStyle = '#1e293b'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    }, 0)
  }
  const confirmarFirma = async () => {
    if (!firmando || !canvasRef.current || !haDibujado || !nombreFirmante.trim() || !dniFirmante.trim()) return
    setSubiendo(true)

    const supabase = createClient()
    const idArchivo = crypto.randomUUID()
    const dataUrlFirma = canvasRef.current.toDataURL('image/png')

    try {
      const blobFirma = await (await fetch(dataUrlFirma)).blob()
      const pathFirma = `${firmando.alumnoId}/firma-${idArchivo}.png`

      const { error: errorFirma } = await supabase.storage
        .from('documentos-firmados')
        .upload(pathFirma, blobFirma, { contentType: 'image/png' })

      if (errorFirma) throw new Error('Error subiendo la firma: ' + errorFirma.message)

      const doc = new jsPDF()
      const margen = 15
      const anchoUtil = 180
      let y = 20

      doc.setFontSize(16)
      doc.text(firmando.doc.titulo, margen, y)
      y += 10

      doc.setFontSize(11)
      const lineas = doc.splitTextToSize(firmando.doc.contenido, anchoUtil)
      for (const linea of lineas) {
        if (y > 260) {
          doc.addPage()
          y = 20
        }
        doc.text(linea, margen, y)
        y += 6
      }

      y += 10
      if (y > 220) {
        doc.addPage()
        y = 20
      }
      doc.setFontSize(10)
      doc.text(`Alumno: ${firmando.alumnoNombre}`, margen, y)
      y += 6
      doc.text(`Firmante: ${nombreFirmante} (DNI: ${dniFirmante})`, margen, y)
      y += 6
      doc.text(`Firmado el ${new Date().toLocaleString('es-ES')}`, margen, y)
      y += 8
      doc.addImage(dataUrlFirma, 'PNG', margen, y, 60, 30)

      const pdfBlob = doc.output('blob')
      const pathPdf = `${firmando.alumnoId}/pdf-${idArchivo}.pdf`

      const { error: errorPdf } = await supabase.storage
        .from('documentos-firmados')
        .upload(pathPdf, pdfBlob, { contentType: 'application/pdf' })

      if (errorPdf) throw new Error('Error subiendo el PDF: ' + errorPdf.message)

      const res = await guardarFirmaDocumento(
        firmando.alumnoId,
        firmando.doc.id,
        firmando.doc.contenido,
        pathFirma,
        pathPdf,
        nombreFirmante.trim(),
        dniFirmante.trim()
      )

      if (res.error) throw new Error(res.error)

      toast('Documento firmado correctamente', 'exito')
      setFirmando(null)
      router.refresh()
    } catch (err: any) {
      toast(err.message ?? 'Error al firmar', 'error')
    } finally {
      setSubiendo(false)
    }
  }
  if (firmando) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">{firmando.doc.titulo}</h2>

        <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
          {firmando.doc.contenido}
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={nombreFirmante}
            onChange={(e) => setNombreFirmante(e.target.value)}
            placeholder="Tu nombre completo"
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <input
            value={dniFirmante}
            onChange={(e) => setDniFirmante(e.target.value)}
            placeholder="Tu DNI/NIF"
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
          <p className="mb-2 text-sm font-medium text-slate-600">Dibuja tu firma aquí:</p>
          <canvas
            ref={canvasRef}
            width={500}
            height={180}
            className="w-full touch-none rounded-lg border-2 border-dashed border-slate-300 bg-white"
            onMouseDown={empezarTrazo}
            onMouseMove={dibujar}
            onMouseUp={terminarTrazo}
            onMouseLeave={terminarTrazo}
            onTouchStart={empezarTrazo}
            onTouchMove={dibujar}
            onTouchEnd={terminarTrazo}
          />
          <button onClick={limpiarFirma} className="mt-1 text-xs text-slate-400 hover:text-slate-600">
            Limpiar firma
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={confirmarFirma}
            disabled={!haDibujado || subiendo || !nombreFirmante.trim() || !dniFirmante.trim()}
            className="flex-1 rounded-lg bg-indigo-600 py-3 text-base font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {subiendo ? 'Guardando firma...' : 'Firmar y confirmar'}
          </button>
          <button
            onClick={() => setFirmando(null)}
            disabled={subiendo}
            className="rounded-lg bg-slate-100 px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {datosPorAlumno.map((a) => (
        <div key={a.alumnoId} className="space-y-3">
          {datosPorAlumno.length > 1 && (
            <h2 className="text-lg font-bold text-slate-800">{a.alumnoNombre}</h2>
          )}
          {a.documentos.map((d) => (
            <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-800">{d.titulo}</p>
                {d.firmado && (
                  <p className="text-xs text-emerald-600">
                    ✓ Firmado el {new Date(d.firmado.fecha).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {d.firmado?.pdfUrl && (
                  <a href={d.firmado.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:underline">
                    Ver PDF firmado
                  </a>
                )}
                <button
                  onClick={() => abrirFirma(a.alumnoId, a.alumnoNombre, d)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${
                    d.firmado ? 'bg-slate-400 hover:bg-slate-500' : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  {d.firmado ? 'Volver a firmar' : 'Firmar'}
                </button>
              </div>
            </div>
          ))}
          {a.documentos.length === 0 && (
            <p className="text-sm text-slate-400">La clínica no tiene documentos pendientes de firma.</p>
          )}
        </div>
      ))}
    </div>
  )
}