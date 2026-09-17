'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { confirmarObservacion, descartarObservacion } from './observaciones-actions'
import { useToast } from '../../../providers/toast-provider'
import { Button, Panel } from '../../../ui'

type Observacion = {
  id: string
  texto: string
  consiguio: boolean | null
  fechaEvento: string
  autorNombre: string
}

type ConjuntoElegible = { id: string; nombre: string }

function TarjetaObservacion({
  obs,
  conjuntosElegibles,
  programaAlumnoId,
  alumnoId,
}: {
  obs: Observacion
  conjuntosElegibles: ConjuntoElegible[]
  programaAlumnoId: string
  alumnoId: string
}) {
  const [expandido, setExpandido] = useState(false)
  const [conjuntoId, setConjuntoId] = useState(conjuntosElegibles[0]?.id ?? '')
  const [tipoSonda, setTipoSonda] = useState<'generalizacion' | 'mantenimiento'>('generalizacion')
  const [resultado, setResultado] = useState(obs.consiguio ?? true)
  const [respuesta, setRespuesta] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  const confirmar = () => {
    if (!conjuntoId) {
      toast('Este programa no tiene ningún conjunto dominado todavía', 'error')
      return
    }
    startTransition(async () => {
      const res = await confirmarObservacion(obs.id, conjuntoId, tipoSonda, resultado, programaAlumnoId, alumnoId)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Sonda registrada', 'exito')
      router.refresh()
    })
  }

  const descartar = () => {
    startTransition(async () => {
      const res = await descartarObservacion(obs.id, programaAlumnoId, respuesta)
      if (res?.error) {
        toast(res.error, 'error')
        return
      }
      toast('Observación descartada', 'exito')
      router.refresh()
    })
  }

  return (
    <li className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium text-slate-800">{obs.autorNombre}</span>
        <span className="text-slate-600">{new Date(obs.fechaEvento).toLocaleDateString('es-ES')}</span>
      </div>
      <p className="text-sm text-slate-700">{obs.texto}</p>
      {obs.consiguio !== null && (
        <p className="text-xs text-slate-600">
          La familia marcó: <strong>{obs.consiguio ? 'sí lo consiguió' : 'no lo consiguió'}</strong>
        </p>
      )}

      {!expandido ? (
        <div className="space-y-2">
          <input
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            aria-label="Responder a la familia"
            placeholder="Responder a la familia (opcional, solo si descartas)"
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setExpandido(true)}
              disabled={isPending || conjuntosElegibles.length === 0}
              className="px-3 py-1.5 text-xs font-semibold"
            >
              Confirmar como sonda
            </Button>
            <Button
              variant="secondary"
              onClick={descartar}
              disabled={isPending}
              className="px-3 py-1.5 text-xs font-medium"
            >
              Descartar
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 rounded-lg bg-white p-3 border border-amber-200">
          {conjuntosElegibles.length > 1 && (
            <select
              value={conjuntoId}
              onChange={(e) => setConjuntoId(e.target.value)}
              aria-label="Conjunto"
              className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
            >
              {conjuntosElegibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          )}
          <div className="flex gap-2">
            {(['generalizacion', 'mantenimiento'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTipoSonda(t)}
                className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium ${
                  tipoSonda === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {t === 'generalizacion' ? 'Generalización' : 'Mantenimiento'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setResultado(true)}
              className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium ${
                resultado ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              ✓ Lo consiguió
            </button>
            <button
              onClick={() => setResultado(false)}
              className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium ${
                !resultado ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              ✗ No lo consiguió
            </button>
          </div>
          <div className="flex gap-2 pt-1">
            <Button onClick={confirmar} disabled={isPending} className="px-3 py-1.5 text-xs font-semibold">
              {isPending ? 'Guardando...' : 'Guardar sonda'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setExpandido(false)}
              disabled={isPending}
              className="px-3 py-1.5 text-xs font-medium"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </li>
  )
}

export default function ObservacionesPendientes({
  observaciones,
  conjuntosElegibles,
  programaAlumnoId,
  alumnoId,
}: {
  observaciones: Observacion[]
  conjuntosElegibles: ConjuntoElegible[]
  programaAlumnoId: string
  alumnoId: string
}) {
  return (
    <Panel className="p-4 sm:p-5 space-y-3 border-amber-300">
      <p className="text-sm font-semibold text-amber-800">
        {observaciones.length} observación{observaciones.length === 1 ? '' : 'es'} de la familia pendiente
        {observaciones.length === 1 ? '' : 's'} de revisar
      </p>
      <ul className="space-y-3">
        {observaciones.map((obs) => (
          <TarjetaObservacion
            key={obs.id}
            obs={obs}
            conjuntosElegibles={conjuntosElegibles}
            programaAlumnoId={programaAlumnoId}
            alumnoId={alumnoId}
          />
        ))}
      </ul>
    </Panel>
  )
}
