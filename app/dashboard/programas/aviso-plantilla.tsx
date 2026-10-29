'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { actualizarDesdePlantilla, descartarAvisoPlantilla } from './plantilla-actions'
import type { CampoPlantilla, DiferenciasPlantilla } from './plantilla'
import { useToast } from '../../providers/toast-provider'
import { Button } from '../../ui'

export default function AvisoPlantilla({
  programaAlumnoId,
  diferencias,
}: {
  programaAlumnoId: string
  diferencias: DiferenciasPlantilla
}) {
  const [abierto, setAbierto] = useState(false)
  const [seleccion, setSeleccion] = useState<CampoPlantilla[]>(diferencias.campos.map((c) => c.campo))
  const [anadirElementos, setAnadirElementos] = useState(diferencias.elementosNuevos.length > 0)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const alternar = (campo: CampoPlantilla) =>
    setSeleccion((prev) => (prev.includes(campo) ? prev.filter((c) => c !== campo) : [...prev, campo]))

  const actualizar = () =>
    startTransition(async () => {
      const res = await actualizarDesdePlantilla(programaAlumnoId, seleccion, anadirElementos)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      toast('Programa actualizado desde la plantilla', 'exito')
      router.refresh()
    })

  const descartar = () =>
    startTransition(async () => {
      const res = await descartarAvisoPlantilla(programaAlumnoId)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      router.refresh()
    })

  if (diferencias.tipoCambiado) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-sky-900">
          <strong>La plantilla de este programa ha cambiado de tipo.</strong> Su contenido nuevo no se
          puede aplicar a esta copia; para usarlo, importa de nuevo el programa en el PEI.
        </p>
        <Button variant="secondary" onClick={descartar} disabled={isPending} className="shrink-0">
          Entendido
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sky-900">
          <strong>Hay una versión nueva de la plantilla de este programa.</strong> Puedes revisar los
          cambios y aplicar los que quieras; los datos registrados no se modifican.
        </p>
        {!abierto && (
          <Button variant="secondary" onClick={() => setAbierto(true)} className="shrink-0">
            Revisar cambios
          </Button>
        )}
      </div>

      {abierto && (
        <div className="mt-4 space-y-3">
          {diferencias.campos.map((c) => (
            <label key={c.campo} className="block rounded-xl border border-sky-200 bg-white p-3">
              <span className="flex items-center gap-2 font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={seleccion.includes(c.campo)}
                  onChange={() => alternar(c.campo)}
                  disabled={isPending}
                />
                {c.etiqueta}
              </span>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">Versión del alumno</p>
                  <p className="max-h-48 overflow-y-auto whitespace-pre-wrap text-slate-600">{c.actual || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-sky-700">Versión de la plantilla</p>
                  <p className="max-h-48 overflow-y-auto whitespace-pre-wrap text-slate-800">{c.plantilla || '—'}</p>
                </div>
              </div>
            </label>
          ))}

          {diferencias.elementosNuevos.length > 0 && (
            <label className="block rounded-xl border border-sky-200 bg-white p-3">
              <span className="flex items-center gap-2 font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={anadirElementos}
                  onChange={(e) => setAnadirElementos(e.target.checked)}
                  disabled={isPending}
                />
                Añadir los elementos nuevos de la plantilla
              </span>
              <ul className="mt-2 list-disc pl-6 text-slate-600">
                {diferencias.elementosNuevos.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <p className="mt-1 text-xs text-slate-500">Las clases y conjuntos que ya tiene el alumno no se modifican.</p>
            </label>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={descartar} disabled={isPending}>
              Mantener la versión del alumno
            </Button>
            <Button onClick={actualizar} disabled={isPending || (seleccion.length === 0 && !anadirElementos)}>
              {isPending ? 'Actualizando…' : 'Aplicar los cambios seleccionados'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
