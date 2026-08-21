'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  crearTipoDocumento,
  editarTipoDocumento,
  toggleTipoDocumento,
  listarFirmasDeTipo,
} from './actions'
import { useToast } from '../../providers/toast-provider'

type Tipo = { id: string; titulo: string; contenido: string; activo: boolean; created_at: string }
type Firma = { id: string; alumnoNombre: string; firmadoPorNombre: string; fechaFirma: string; pdfUrl: string | null }

export default function DocumentosLegalesClient({ tiposIniciales }: { tiposIniciales: Tipo[] }) {
  const [tipos, setTipos] = useState(tiposIniciales)
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [nuevoContenido, setNuevoContenido] = useState('')
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [tituloEdit, setTituloEdit] = useState('')
  const [contenidoEdit, setContenidoEdit] = useState('')
  const [firmasAbiertoId, setFirmasAbiertoId] = useState<string | null>(null)
  const [firmas, setFirmas] = useState<Firma[]>([])
  const [cargandoFirmas, setCargandoFirmas] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const crear = () => {
    if (!nuevoTitulo.trim() || !nuevoContenido.trim()) return
    startTransition(async () => {
      const res = await crearTipoDocumento(nuevoTitulo.trim(), nuevoContenido.trim())
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      setNuevoTitulo('')
      setNuevoContenido('')
      toast('Documento creado', 'exito')
      router.refresh()
    })
  }

  const empezarEdicion = (t: Tipo) => {
    setEditandoId(t.id)
    setTituloEdit(t.titulo)
    setContenidoEdit(t.contenido)
  }

  const guardarEdicion = () => {
    startTransition(async () => {
      const res = await editarTipoDocumento(editandoId!, tituloEdit, contenidoEdit)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Documento actualizado', 'exito')
      setEditandoId(null)
      router.refresh()
    })
  }

  const toggleActivo = (id: string, activo: boolean) => {
    startTransition(async () => {
      const res = await toggleTipoDocumento(id, activo)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      router.refresh()
    })
  }

  const verFirmas = (id: string) => {
    if (firmasAbiertoId === id) {
      setFirmasAbiertoId(null)
      return
    }
    setFirmasAbiertoId(id)
    setCargandoFirmas(true)
    listarFirmasDeTipo(id).then((res) => {
      setFirmas(res)
      setCargandoFirmas(false)
    })
  }
  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="font-semibold text-slate-700">Nuevo documento</h2>
        <input
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          placeholder="Título (ej. Consentimiento informado)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <textarea
          value={nuevoContenido}
          onChange={(e) => setNuevoContenido(e.target.value)}
          placeholder="Texto completo del documento..."
          rows={6}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <button
          onClick={crear}
          disabled={isPending || !nuevoTitulo.trim() || !nuevoContenido.trim()}
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Crear documento
        </button>
      </div>

      <div className="space-y-3">
        {tipos.map((t) => (
          <div key={t.id} className={`rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-2 ${!t.activo ? 'opacity-60' : ''}`}>
            {editandoId === t.id ? (
              <div className="space-y-2">
                <input
                  value={tituloEdit}
                  onChange={(e) => setTituloEdit(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <textarea
                  value={contenidoEdit}
                  onChange={(e) => setContenidoEdit(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <div className="flex gap-3">
                  <button onClick={guardarEdicion} disabled={isPending} className="text-sm font-medium text-emerald-600 hover:text-emerald-800">
                    Guardar
                  </button>
                  <button onClick={() => setEditandoId(null)} className="text-sm text-slate-500 hover:text-slate-700">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{t.titulo}</p>
                    {!t.activo && <span className="text-xs text-slate-400">Desactivado</span>}
                  </div>
                  <div className="flex gap-3 text-xs font-medium">
                    <button onClick={() => verFirmas(t.id)} className="text-indigo-600 hover:text-indigo-800">
                      {firmasAbiertoId === t.id ? 'Ocultar firmas' : 'Ver firmas'}
                    </button>
                    <button onClick={() => empezarEdicion(t)} className="text-indigo-600 hover:text-indigo-800">
                      Editar
                    </button>
                    <button onClick={() => toggleActivo(t.id, t.activo)} className="text-slate-500 hover:text-slate-700">
                      {t.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 whitespace-pre-wrap">{t.contenido}</p>

                {firmasAbiertoId === t.id && (
                  <div className="mt-2 rounded-lg bg-slate-50 p-3 space-y-1.5 text-sm">
                    {cargandoFirmas && <p className="text-slate-400">Cargando...</p>}
                    {!cargandoFirmas && firmas.length === 0 && (
                      <p className="text-slate-400">Nadie ha firmado este documento todavía.</p>
                    )}
                    {firmas.map((f) => (
                      <div key={f.id} className="flex flex-wrap items-center justify-between gap-2 rounded bg-white px-2 py-1.5">
                        <span>
                          <strong className="text-slate-700">{f.alumnoNombre}</strong>
                          <span className="text-slate-500"> — firmado por {f.firmadoPorNombre}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {new Date(f.fechaFirma).toLocaleDateString('es-ES')}
                          </span>
                          {f.pdfUrl && (
                            <a href={f.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">
                              Ver PDF
                            </a>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        {tipos.length === 0 && <p className="text-center text-slate-400 py-6">Sin documentos creados todavía.</p>}
      </div>
    </div>
  )
}