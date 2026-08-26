'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { editarClinica, archivarClinica, reactivarClinica } from './actions'
import { useConfirm } from '../../providers/confirm-provider'
import { useToast } from '../../providers/toast-provider'

type Clinica = {
  id: string
  nombre: string
  logo_url: string | null
  estado_suscripcion: string
  precio_fijo_mensual: number
  precio_por_alumno: number
  activa: boolean
  sin_facturacion: boolean
  telefono: string | null
  ciudad: string | null
  pais: string | null
  admin_nombre: string | null
  admin_email: string | null
}

const ETIQUETA_ESTADO: Record<string, { label: string; color: string }> = {
  trialing: { label: 'Periodo de prueba', color: 'bg-sky-50 text-sky-700' },
  active: { label: 'Activa', color: 'bg-emerald-50 text-emerald-700' },
  past_due: { label: 'Pago pendiente', color: 'bg-amber-50 text-amber-700' },
  canceled: { label: 'Cancelada', color: 'bg-slate-100 text-slate-500' },
  unpaid: { label: 'Impagada', color: 'bg-rose-50 text-rose-700' },
  incomplete: { label: 'Incompleta', color: 'bg-slate-100 text-slate-500' },
  incomplete_expired: { label: 'Caducada', color: 'bg-slate-100 text-slate-500' },
  paused: { label: 'Pausada', color: 'bg-slate-100 text-slate-500' },
}

function EstadoBadge({ estado }: { estado: string }) {
  const info = ETIQUETA_ESTADO[estado] ?? { label: estado, color: 'bg-slate-100 text-slate-500' }
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${info.color}`}>
      {info.label}
    </span>
  )
}

export default function ClinicaRow({ clinica }: { clinica: Clinica }) {
  const [editando, setEditando] = useState(false)
  const [mostrarContacto, setMostrarContacto] = useState(false)
  const [nombre, setNombre] = useState(clinica.nombre)
  const [precioFijo, setPrecioFijo] = useState(String(clinica.precio_fijo_mensual))
  const [precioAlumno, setPrecioAlumno] = useState(String(clinica.precio_por_alumno))
  const [nuevoLogo, setNuevoLogo] = useState<File | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const confirmar = useConfirm()
  const toast = useToast()

  if (editando) {
    return (
      <tr className="border-b border-slate-100 last:border-0 bg-slate-50">
        <td className="p-3">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-1 mb-1"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNuevoLogo(e.target.files?.[0] ?? null)}
            className="w-full text-xs"
          />
        </td>
        <td className="p-3">
          <EstadoBadge estado={clinica.estado_suscripcion} />
        </td>
        <td className="p-3">
          <input
            value={precioFijo}
            onChange={(e) => setPrecioFijo(e.target.value)}
            type="number"
            step="0.01"
            className="w-24 rounded-lg border border-slate-300 px-2 py-1"
          />
        </td>
        <td className="p-3">
          <input
            value={precioAlumno}
            onChange={(e) => setPrecioAlumno(e.target.value)}
            type="number"
            step="0.01"
            className="w-24 rounded-lg border border-slate-300 px-2 py-1"
          />
        </td>
        <td className="p-3 flex gap-2">
          <button
            disabled={isPending}
            onClick={() => {
              const fd = new FormData()
              fd.set('nombre', nombre)
              fd.set('precio_fijo_mensual', precioFijo)
              fd.set('precio_por_alumno', precioAlumno)
              if (nuevoLogo) fd.set('logo', nuevoLogo)
              startTransition(async () => {
                const res = await editarClinica(clinica.id, fd)
                if (res?.error) {
                  toast(res.error, 'error')
                  return
                }
                toast('Clínica actualizada', 'exito')
                setEditando(false)
                router.refresh()
              })
            }}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
          >
            Guardar
          </button>
          <button
            onClick={() => {
              setNombre(clinica.nombre)
              setPrecioFijo(String(clinica.precio_fijo_mensual))
              setPrecioAlumno(String(clinica.precio_por_alumno))
              setNuevoLogo(null)
              setEditando(false)
            }}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Cancelar
          </button>
        </td>
      </tr>
    )
  }
    return (
    <>
      <tr className={`border-b border-slate-100 last:border-0 ${!clinica.activa ? 'opacity-50' : ''}`}>
        <td className="p-3 font-medium text-slate-800">
          <div className="flex items-center gap-2">
            {clinica.logo_url ? (
              <img src={clinica.logo_url} alt="" className="h-7 w-7 rounded object-contain bg-slate-50 border border-slate-100" />
            ) : (
              <div className="h-7 w-7 rounded bg-slate-100" />
            )}
            <span>
              {clinica.nombre}
              {!clinica.activa && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                  Archivada
                </span>
              )}
              {clinica.sin_facturacion && (
                <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 whitespace-nowrap">
                  Sin facturación
                </span>
              )}
            </span>
          </div>
        </td>
        <td className="p-3">
          <EstadoBadge estado={clinica.estado_suscripcion} />
        </td>
        <td className="p-3 text-slate-600">{clinica.precio_fijo_mensual} €</td>
        <td className="p-3 text-slate-600">{clinica.precio_por_alumno} €</td>
        <td className="p-3 flex gap-3">
          <button
            onClick={() => setMostrarContacto((v) => !v)}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            {mostrarContacto ? 'Ocultar' : 'Ver'} contacto
          </button>
          <button
            onClick={() => setEditando(true)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            Editar
          </button>
          {clinica.activa ? (
            <button
              disabled={isPending}
              onClick={async () => {
                const ok = await confirmar({
                  titulo: 'Archivar clínica',
                  mensaje: `¿Archivar "${clinica.nombre}"? Sus terapeutas y familias perderán acceso, pero los datos se conservan.`,
                  textoConfirmar: 'Archivar',
                  peligroso: true,
                })
                if (!ok) return
                startTransition(async () => {
                  const res = await archivarClinica(clinica.id)
                  if (res?.error) {
                    toast(res.error, 'error')
                    return
                  }
                  toast('Clínica archivada', 'exito')
                  router.refresh()
                })
              }}
              className="text-xs font-medium text-rose-500 hover:text-rose-700"
            >
              Archivar
            </button>
          ) : (
            <button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const res = await reactivarClinica(clinica.id)
                  if (res?.error) {
                    toast(res.error, 'error')
                    return
                  }
                  toast('Clínica reactivada', 'exito')
                  router.refresh()
                })
              }}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
            >
              Reactivar
            </button>
          )}
        </td>
      </tr>

      {mostrarContacto && (
        <tr className="border-b border-slate-100 last:border-0 bg-slate-50">
          <td colSpan={5} className="px-3 py-3 text-xs text-slate-600">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <p><span className="text-slate-400">Admin:</span> {clinica.admin_nombre ?? '—'}</p>
              <p><span className="text-slate-400">Email:</span> {clinica.admin_email ?? '—'}</p>
              <p><span className="text-slate-400">Teléfono:</span> {clinica.telefono ?? '—'}</p>
              <p><span className="text-slate-400">Ciudad:</span> {clinica.ciudad ?? '—'}, {clinica.pais ?? '—'}</p>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}