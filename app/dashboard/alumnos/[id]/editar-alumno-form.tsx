'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { editarAlumno } from './actions'
import { useToast } from '../../../providers/toast-provider'
import { Button, Panel } from '../../../ui'

type Alumno = {
  id: string
  nombre_anonimizado: string
  fecha_nacimiento: string
  fecha_inicio_intervencion: string | null
  diagnostico: string | null
  modalidad_comunicacion: string | null
  idiomas_entorno: string | null
  colegio: string | null
  otras_terapias: string | null
  medicacion: string | null
  alergias: string | null
  conductas_riesgo: string | null
  contacto_emergencia: string | null
  notas_clinicas: string | null
}

export const MODALIDADES_COMUNICACION: Record<string, string> = {
  vocal: 'Vocal',
  signos: 'Signos',
  pictogramas: 'Pictogramas / intercambio de imágenes',
  saac: 'Comunicador o tableta (SAAC)',
  mixta: 'Mixta',
  no_funcional: 'Sin comunicación funcional todavía',
}

const inputClase = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base sm:text-sm'

function Dato({ label, valor, ancho = false }: { label: string; valor: string | null; ancho?: boolean }) {
  return (
    <div className={ancho ? 'sm:col-span-2' : ''}>
      <span className="text-slate-500">{label}</span>
      <p className="whitespace-pre-wrap text-slate-700">{valor || '—'}</p>
    </div>
  )
}

function Campo({
  label,
  name,
  valor,
  ancho = false,
  multilinea = false,
  placeholder,
}: {
  label: string
  name: string
  valor: string | null
  ancho?: boolean
  multilinea?: boolean
  placeholder?: string
}) {
  return (
    <div className={`space-y-1 ${ancho ? 'sm:col-span-2' : ''}`}>
      <label className="text-sm text-slate-600">{label}</label>
      {multilinea ? (
        <textarea name={name} defaultValue={valor ?? ''} rows={3} placeholder={placeholder} className={inputClase} />
      ) : (
        <input name={name} defaultValue={valor ?? ''} placeholder={placeholder} className={inputClase} />
      )}
    </div>
  )
}

const fecha = (f: string | null) => (f ? new Date(f).toLocaleDateString('es-ES') : null)

export default function EditarAlumnoForm({ alumno }: { alumno: Alumno }) {
  const [editando, setEditando] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const toast = useToast()

  if (!editando) {
    return (
      <Panel className="p-4 sm:p-5 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-700">Datos clínicos</h2>
          <Button variant="secondary" onClick={() => setEditando(true)} className="px-3 py-1.5 text-xs font-medium">
            Editar datos
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Dato label="Fecha de inicio de la intervención" valor={fecha(alumno.fecha_inicio_intervencion)} />
          <Dato label="Diagnóstico / condición" valor={alumno.diagnostico} />
          <Dato
            label="Modalidad de comunicación"
            valor={alumno.modalidad_comunicacion ? MODALIDADES_COMUNICACION[alumno.modalidad_comunicacion] : null}
          />
          <Dato label="Idiomas del entorno" valor={alumno.idiomas_entorno} />
          <Dato label="Colegio" valor={alumno.colegio} />
          <Dato label="Otras terapias o profesionales" valor={alumno.otras_terapias} />
          <Dato label="Medicación actual" valor={alumno.medicacion} />
          <Dato label="Alergias / condiciones médicas" valor={alumno.alergias} />
          <Dato label="Contacto de emergencia" valor={alumno.contacto_emergencia} />
          <Dato label="Conductas de riesgo y plan de actuación" valor={alumno.conductas_riesgo} ancho />
          <Dato label="Notas clínicas" valor={alumno.notas_clinicas} ancho />
        </div>
      </Panel>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startTransition(async () => {
          const res = await editarAlumno(alumno.id, fd)
          if (res.error) {
            toast(res.error, 'error')
            return
          }
          setEditando(false)
          router.refresh()
        })
      }}
      className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-5"
    >
      <h2 className="font-semibold text-slate-700">Editar datos del alumno</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Iniciales</label>
          <input name="nombre_anonimizado" defaultValue={alumno.nombre_anonimizado} required className={inputClase} />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Fecha de nacimiento</label>
          <input name="fecha_nacimiento" type="date" defaultValue={alumno.fecha_nacimiento} required className={inputClase} />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Fecha de inicio de la intervención</label>
          <input
            name="fecha_inicio_intervencion"
            type="date"
            defaultValue={alumno.fecha_inicio_intervencion ?? ''}
            className={inputClase}
          />
        </div>
        <Campo label="Diagnóstico / condición" name="diagnostico" valor={alumno.diagnostico} />
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Modalidad de comunicación</label>
          <select name="modalidad_comunicacion" defaultValue={alumno.modalidad_comunicacion ?? ''} className={inputClase}>
            <option value="">Sin indicar</option>
            {Object.entries(MODALIDADES_COMUNICACION).map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Campo label="Idiomas del entorno" name="idiomas_entorno" valor={alumno.idiomas_entorno} placeholder="ej. Castellano y catalán" />
        <Campo label="Colegio" name="colegio" valor={alumno.colegio} />
        <Campo
          label="Otras terapias o profesionales"
          name="otras_terapias"
          valor={alumno.otras_terapias}
          placeholder="ej. Logopedia (2 h/semana), terapia ocupacional"
        />
        <Campo label="Medicación actual" name="medicacion" valor={alumno.medicacion} />
        <Campo label="Alergias / condiciones médicas" name="alergias" valor={alumno.alergias} />
        <Campo label="Contacto de emergencia" name="contacto_emergencia" valor={alumno.contacto_emergencia} placeholder="Nombre y teléfono" />
        <Campo
          label="Conductas de riesgo y plan de actuación"
          name="conductas_riesgo"
          valor={alumno.conductas_riesgo}
          ancho
          multilinea
          placeholder="ej. Intentos de fuga en transiciones: mantener la puerta cerrada y anticipar con agenda visual"
        />
        <Campo label="Notas clínicas" name="notas_clinicas" valor={alumno.notas_clinicas} ancho multilinea />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="submit" disabled={isPending} className="px-4 py-3 sm:py-2 text-base sm:text-sm">
          Guardar cambios
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => setEditando(false)}
          className="px-4 py-3 sm:py-2 text-base sm:text-sm font-medium"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
