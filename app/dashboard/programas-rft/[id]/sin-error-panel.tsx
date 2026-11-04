'use client'

import { useState, useTransition } from 'react'
import { Button, Panel } from '../../../ui'
import { useToast } from '../../../providers/toast-provider'
import { guardarSinError } from './actions'
import {
  BAJAR_DEFECTO,
  MAX_COMPARACIONES,
  SUBIR_DEFECTO,
  describirEscalon,
  errorConfig,
  escaleraPorDefecto,
  nombresPorDefecto,
  type ConfigSinError,
  type Escalon,
  type Procedimientos,
} from '../../sin-error'

// Configuración del aprendizaje sin error en la tableta (programas_alumno.sin_error)

const DEMORAS = [0, 1, 2, 3, 4, 5, 8, 10]

const NOMBRES_PROCEDIMIENTO: { clave: keyof Procedimientos; label: string; detalle: string }[] = [
  { clave: 'campo', label: 'Tamaño del campo', detalle: 'de 1 opción a todas' },
  { clave: 'desvanecimiento', label: 'Desvanecimiento de distractores', detalle: 'los incorrectos ganan opacidad' },
  { clave: 'demora', label: 'Demora de la ayuda', detalle: 'la correcta se resalta cada vez más tarde' },
]

function configInicial(): ConfigSinError {
  return {
    activo: false,
    escalones: escaleraPorDefecto({ campo: true, desvanecimiento: true, demora: true }),
    subir: SUBIR_DEFECTO,
    bajar: BAJAR_DEFECTO,
    tamano: false,
  }
}

export default function SinErrorPanel({
  programaAlumnoId,
  config: guardada,
  soloLectura,
}: {
  programaAlumnoId: string
  config: ConfigSinError | null
  soloLectura: boolean
}) {
  const [config, setConfig] = useState<ConfigSinError>(guardada ?? configInicial())
  const [procedimientos, setProcedimientos] = useState<Procedimientos>({ campo: true, desvanecimiento: true, demora: true })
  const [abierto, setAbierto] = useState(false)
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  if (soloLectura && !guardada?.activo) return null

  const cambiarEscalon = (i: number, cambio: Partial<Escalon>) =>
    setConfig((c) => ({ ...c, escalones: c.escalones.map((e, j) => (j === i ? { ...e, ...cambio } : e)) }))

  // Los intermedios se añaden justo antes del escalón final
  const anadirEscalon = () =>
    setConfig((c) => {
      const final = c.escalones[c.escalones.length - 1]
      const previo = c.escalones[c.escalones.length - 2] ?? final
      const nuevos = [...c.escalones.slice(0, -1), { ...previo, nombre: 'Apoyo bajo' }, final]
      return { ...c, escalones: nuevos }
    })

  const quitarEscalon = (i: number) => setConfig((c) => ({ ...c, escalones: c.escalones.filter((_, j) => j !== i) }))

  const proponer = () => {
    if (!procedimientos.campo && !procedimientos.desvanecimiento && !procedimientos.demora) {
      toast('Elige al menos un procedimiento.', 'error')
      return
    }
    setConfig((c) => ({ ...c, escalones: escaleraPorDefecto(procedimientos) }))
  }

  const renombrarPorDefecto = () =>
    setConfig((c) => {
      const nombres = nombresPorDefecto(c.escalones)
      return { ...c, escalones: c.escalones.map((e, i) => ({ ...e, nombre: nombres[i] })) }
    })

  const guardar = (siguiente: ConfigSinError) => {
    const problema = errorConfig(siguiente)
    if (problema) {
      toast(problema, 'error')
      return
    }
    startTransition(async () => {
      const res = await guardarSinError(programaAlumnoId, siguiente)
      if (res.error) {
        toast(res.error, 'error')
        return
      }
      setConfig(siguiente)
      toast(siguiente.activo ? 'Aprendizaje sin error guardado.' : 'Aprendizaje sin error desactivado.', 'exito')
    })
  }

  const resumen = config.escalones.map((e) => e.nombre).join(' → ')

  return (
    <Panel className="space-y-4 p-4 text-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-700">Aprendizaje sin error (tableta)</h2>
          <p className="text-xs text-slate-500">
            {guardada?.activo
              ? `Activo en el entrenamiento: ${resumen}.`
              : 'Desactivado. En el entrenamiento en la tableta, el apoyo se retira por escalones según los aciertos de cada bloque.'}
          </p>
        </div>
        {!soloLectura && (
          <button onClick={() => setAbierto((a) => !a)} className="text-sm font-medium text-indigo-600 hover:underline">
            {abierto ? 'Cerrar' : guardada?.activo ? 'Editar' : 'Configurar'}
          </button>
        )}
      </div>

      {soloLectura && guardada?.activo && (
        <ol className="space-y-1 text-xs text-slate-600">
          {guardada.escalones.map((e, i) => (
            <li key={i}>
              <strong>{e.nombre}</strong>: {describirEscalon(e)}
            </li>
          ))}
        </ol>
      )}

      {abierto && !soloLectura && (
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-600">Procedimientos</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {NOMBRES_PROCEDIMIENTO.map((p) => (
                <label key={p.clave} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={procedimientos[p.clave]}
                    onChange={(e) => setProcedimientos((prev) => ({ ...prev, [p.clave]: e.target.checked }))}
                    className="mt-0.5"
                  />
                  <span>
                    {p.label}
                    <span className="block text-xs text-slate-400">{p.detalle}</span>
                  </span>
                </label>
              ))}
            </div>
            <button onClick={proponer} className="text-xs font-medium text-indigo-600 hover:underline">
              Proponer escalera con estos procedimientos
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-1 pr-2 font-medium">Escalón</th>
                  <th className="py-1 pr-2 font-medium">Opciones</th>
                  <th className="py-1 pr-2 font-medium">Distractores</th>
                  <th className="py-1 pr-2 font-medium">Ayuda en pantalla</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {config.escalones.map((e, i) => {
                  const final = i === config.escalones.length - 1
                  return (
                    <tr key={i}>
                      <td className="py-1.5 pr-2">
                        <input
                          value={e.nombre}
                          onChange={(ev) => cambiarEscalon(i, { nombre: ev.target.value })}
                          maxLength={40}
                          className="w-32 rounded border border-slate-300 px-2 py-1"
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <select
                          value={e.comparaciones ?? 'todas'}
                          disabled={final}
                          onChange={(ev) => cambiarEscalon(i, { comparaciones: ev.target.value === 'todas' ? null : Number(ev.target.value) })}
                          className="rounded border border-slate-300 px-1 py-1 disabled:bg-slate-50"
                        >
                          {Array.from({ length: MAX_COMPARACIONES }, (_, k) => k + 1).map((n) => (
                            <option key={n} value={n}>
                              {n === 1 ? 'Solo la correcta' : n}
                            </option>
                          ))}
                          <option value="todas">Todas las del grupo</option>
                        </select>
                      </td>
                      <td className="py-1.5 pr-2">
                        <select
                          value={Math.round(e.opacidad * 100)}
                          disabled={final || e.comparaciones === 1}
                          onChange={(ev) => cambiarEscalon(i, { opacidad: Number(ev.target.value) / 100 })}
                          className="rounded border border-slate-300 px-1 py-1 disabled:bg-slate-50"
                        >
                          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => (
                            <option key={n} value={n}>
                              al {n} %
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-1.5 pr-2">
                        <select
                          value={e.demora ?? 'no'}
                          disabled={final || e.comparaciones === 1}
                          onChange={(ev) => cambiarEscalon(i, { demora: ev.target.value === 'no' ? null : Number(ev.target.value) })}
                          className="rounded border border-slate-300 px-1 py-1 disabled:bg-slate-50"
                        >
                          <option value="no">Sin ayuda</option>
                          {DEMORAS.map((d) => (
                            <option key={d} value={d}>
                              {d === 0 ? 'Inmediata' : `A los ${d} s`}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-1.5 text-right">
                        {!final && config.escalones.length > 2 && (
                          <button onClick={() => quitarEscalon(i)} className="text-rose-600 hover:text-rose-700" aria-label="Quitar escalón">
                            ✕
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <button onClick={anadirEscalon} className="font-medium text-indigo-600 hover:underline">
              + Añadir escalón
            </button>
            <button onClick={renombrarPorDefecto} className="font-medium text-slate-500 hover:underline">
              Poner los nombres por defecto
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
            <label className="flex items-center gap-2">
              Sube con
              <input
                type="number"
                min={1}
                max={100}
                value={config.subir}
                onChange={(e) => setConfig((c) => ({ ...c, subir: Number(e.target.value) }))}
                className="w-16 rounded border border-slate-300 px-2 py-1"
              />
              % de aciertos o más
            </label>
            <label className="flex items-center gap-2">
              Baja con menos de
              <input
                type="number"
                min={0}
                max={100}
                value={config.bajar}
                onChange={(e) => setConfig((c) => ({ ...c, bajar: Number(e.target.value) }))}
                className="w-16 rounded border border-slate-300 px-2 py-1"
              />
              %
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={config.tamano} onChange={(e) => setConfig((c) => ({ ...c, tamano: e.target.checked }))} />
              Desvanecer también el tamaño de los distractores
            </label>
          </div>

          <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
            Se aplica solo al entrenamiento en la tableta; los tests y las sondas no cambian. Para subir o bajar cuentan los
            aciertos con o sin la ayuda en pantalla. Los bloques de los escalones intermedios se guardan, pero solo los del último
            («{config.escalones[config.escalones.length - 1].nombre}») cuentan para el dominio. Si se piden más opciones de las
            que tiene el grupo, los distractores que faltan se toman de otros grupos del programa.
          </p>

          <div className="flex flex-wrap justify-end gap-2">
            {guardada?.activo && (
              <Button variant="secondary" disabled={isPending} onClick={() => guardar({ ...config, activo: false })}>
                Desactivar
              </Button>
            )}
            <Button disabled={isPending} onClick={() => guardar({ ...config, activo: true })}>
              {guardada?.activo ? 'Guardar cambios' : 'Activar'}
            </Button>
          </div>
        </div>
      )}
    </Panel>
  )
}
