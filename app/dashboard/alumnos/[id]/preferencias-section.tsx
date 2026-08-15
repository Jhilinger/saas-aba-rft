'use client'

import { useState, useTransition, useMemo } from 'react'
import { crearPreferencia, eliminarPreferencia } from './preferencias/actions'
import { useConfirm } from '../../../providers/confirm-provider'
import { useToast } from '../../../providers/toast-provider'

type Preferencia = {
  id: string
  nombre: string
  tipo: string
  fecha: string
  created_at: string
}

type ClaveOrden = 'nombre' | 'tipo' | 'fecha'

const TIPOS = [
  { value: 'comida', label: 'Comida' },
  { value: 'juguete', label: 'Juguete' },
  { value: 'actividad', label: 'Actividad' },
  { value: 'sensorial', label: 'Sensorial' },
  { value: 'social', label: 'Social' },
  { value: 'musica', label: 'Música' },
  { value: 'otro', label: 'Otro' },
]

const ETIQUETA_TIPO: Record<string, string> = Object.fromEntries(TIPOS.map((t) => [t.value, t.label]))

const POR_PAGINA = 20

function flechaOrden(activa: boolean, dir: 'asc' | 'desc') {
  if (!activa) return null
  return <span className="ml-1">{dir === 'asc' ? '▲' : '▼'}</span>
}

export default function PreferenciasSection({
  alumnoId,
  preferenciasIniciales,
}: {
  alumnoId: string
  preferenciasIniciales: Preferencia[]
}) {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('juguete')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [preferencias, setPreferencias] = useState<Preferencia[]>(preferenciasIniciales)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const confirmar = useConfirm()
  const toast = useToast()

  const [claveOrden, setClaveOrden] = useState<ClaveOrden>('fecha')
  const [direccion, setDireccion] = useState<'asc' | 'desc'>('desc')
  const [pagina, setPagina] = useState(1)

  const cambiarOrden = (clave: ClaveOrden) => {
    if (clave === claveOrden) {
      setDireccion((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setClaveOrden(clave)
      setDireccion('asc')
    }
    setPagina(1)
  }

  const ordenadas = useMemo(() => {
    const copia = [...preferencias]
    copia.sort((a, b) => {
      const va = a[claveOrden].toLowerCase()
      const vb = b[claveOrden].toLowerCase()
      if (va < vb) return direccion === 'asc' ? -1 : 1
      if (va > vb) return direccion === 'asc' ? 1 : -1
      return 0
    })
    return copia
  }, [preferencias, claveOrden, direccion])

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const paginadas = ordenadas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  const crear = () => {
    if (!nombre.trim()) return
    setError(null)
    startTransition(async () => {
      const res = await crearPreferencia(alumnoId, nombre.trim(), tipo, fecha)
      if (res.error) {
        setError(res.error)
        return
      }
      setPreferencias((prev) => [
        { id: crypto.randomUUID(), nombre: nombre.trim(), tipo, fecha, created_at: new Date().toISOString() },
        ...prev,
      ])
      setNombre('')
      toast('Preferencia añadida', 'exito')
    })
  }

  const borrar = async (id: string) => {
    const ok = await confirmar({
      titulo: 'Eliminar preferencia',
      mensaje: '¿Eliminar esta preferencia? No se puede deshacer.',
      textoConfirmar: 'Eliminar',
      peligroso: true,
    })
    if (!ok) return
    startTransition(async () => {
      const res = await eliminarPreferencia(id, alumnoId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      setPreferencias((prev) => prev.filter((p) => p.id !== id))
      toast('Preferencia eliminada', 'exito')
    })
  }

  const th = (clave: ClaveOrden, label: string) => (
    <th
      className="p-3 cursor-pointer select-none hover:text-slate-700 whitespace-nowrap"
      onClick={() => cambiarOrden(clave)}
    >
      {label}
      {flechaOrden(claveOrden === clave, direccion)}
    </th>
  )
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-3">
        <h2 className="font-semibold text-slate-700">Añadir preferencia / reforzador</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre (ej. Piruleta de fresa)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
        <button
          onClick={crear}
          disabled={!nombre.trim() || isPending}
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Añadir
        </button>
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              {th('nombre', 'Nombre')}
              {th('tipo', 'Tipo')}
              {th('fecha', 'Fecha')}
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {paginadas.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="p-3 font-medium text-slate-800">{p.nombre}</td>
                <td className="p-3">
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 whitespace-nowrap">
                    {ETIQUETA_TIPO[p.tipo] ?? p.tipo}
                  </span>
                </td>
                <td className="p-3 text-slate-600 whitespace-nowrap">{p.fecha}</td>
                <td className="p-3">
                  <button
                    onClick={() => borrar(p.id)}
                    className="text-xs font-medium text-rose-500 hover:text-rose-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ordenadas.length === 0 && (
          <p className="p-6 text-center text-slate-400">Sin preferencias registradas todavía.</p>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <button
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-40"
          >
            ← Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas} ({ordenadas.length} en total)
          </span>
          <button
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      )}
    </section>
  )
}