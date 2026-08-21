'use client'

import { useState, useTransition } from 'react'
import { guardarDatosFacturacion } from './actions'
import { useToast } from '../../../providers/toast-provider'

type Datos = {
  nombre_razon_social: string | null
  nif: string | null
  direccion: string | null
  codigo_postal: string | null
  ciudad: string | null
  pais: string | null
} | null

type AlumnoConDatos = { alumnoId: string; alumnoNombre: string; datos: Datos }

function FormularioAlumno({ alumnoId, alumnoNombre, datos }: { alumnoId: string; alumnoNombre: string; datos: Datos }) {
  const [nombreRazonSocial, setNombreRazonSocial] = useState(datos?.nombre_razon_social ?? '')
  const [nif, setNif] = useState(datos?.nif ?? '')
  const [direccion, setDireccion] = useState(datos?.direccion ?? '')
  const [codigoPostal, setCodigoPostal] = useState(datos?.codigo_postal ?? '')
  const [ciudad, setCiudad] = useState(datos?.ciudad ?? '')
  const [pais, setPais] = useState(datos?.pais ?? 'España')
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  const guardar = () => {
    startTransition(async () => {
      const res = await guardarDatosFacturacion(alumnoId, {
        nombreRazonSocial: nombreRazonSocial.trim(),
        nif: nif.trim(),
        direccion: direccion.trim(),
        codigoPostal: codigoPostal.trim(),
        ciudad: ciudad.trim(),
        pais: pais.trim(),
      })
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Datos de facturación guardados', 'exito')
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-3">
      <h2 className="font-semibold text-slate-700">{alumnoNombre}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          value={nombreRazonSocial}
          onChange={(e) => setNombreRazonSocial(e.target.value)}
          placeholder="Nombre / Razón social"
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <input
          value={nif}
          onChange={(e) => setNif(e.target.value)}
          placeholder="NIF / DNI"
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección"
          className="sm:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <input
          value={codigoPostal}
          onChange={(e) => setCodigoPostal(e.target.value)}
          placeholder="Código postal"
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <input
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Ciudad"
          className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
        <input
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          placeholder="País"
          className="sm:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
      </div>
      <button
        onClick={guardar}
        disabled={isPending}
        className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {isPending ? 'Guardando...' : 'Guardar datos'}
      </button>
    </div>
  )
}
export default function FacturacionClient({ alumnosConDatos }: { alumnosConDatos: AlumnoConDatos[] }) {
  return (
    <div className="space-y-6">
      {alumnosConDatos.map((a) => (
        <FormularioAlumno key={a.alumnoId} alumnoId={a.alumnoId} alumnoNombre={a.alumnoNombre} datos={a.datos} />
      ))}
    </div>
  )
}