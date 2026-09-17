'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { editarPrograma } from '../actions'
import { useToast } from '../../../providers/toast-provider'
import { Button } from '../../../ui'

type Programa = {
  id: string
  nombre: string
  tipo: string
  area: string
  objetivo: string | null
  materiales: string | null
  instrucciones_terapeuta: string | null
  ayudas_posibles: string | null
  ensayos_por_bloque: number
  bloques_para_dominio: number
  porcentaje_dominio: number
  tipo_relacion: string | null
  orden: number | null
  video_url: string | null
  formato_recogida: string
  direccion_objetivo: string | null
}

const FORMATOS_REGISTRO = [
  { value: 'ensayo_discreto', label: 'Ensayo discreto (DTT) — % de acierto' },
  { value: 'tasa', label: 'Tasa / frecuencia' },
  { value: 'duracion', label: 'Duración' },
  { value: 'intervalo', label: 'Intervalo' },
  { value: 'latencia', label: 'Latencia' },
  { value: 'abc', label: 'Registro ABC' },
]

export default function EditarProgramaForm({ programa }: { programa: Programa }) {
  const [editando, setEditando] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formatoRecogida, setFormatoRecogida] = useState(programa.formato_recogida)
  const router = useRouter()
  const toast = useToast()

  if (!editando) {
    return (
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={() => setEditando(true)}
          className="px-3 py-1.5 font-medium"
        >
          Editar programa
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startTransition(async () => {
          const res = await editarPrograma(programa.id, fd)
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
      <input type="hidden" name="tipo" value={programa.tipo} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Nombre</label>
          <input
            name="nombre"
            defaultValue={programa.nombre}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Orden</label>
          <input
            name="orden"
            type="number"
            defaultValue={programa.orden ?? ''}
            placeholder="ej. 1 (opcional)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Área</label>
          <input
            name="area"
            defaultValue={programa.area}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        {programa.tipo === 'aba_clasico' && (
          <>
            <div className="space-y-1">
              <label className="text-sm text-slate-600">Tipo de registro</label>
              <select
                name="formato_recogida"
                value={formatoRecogida}
                onChange={(e) => setFormatoRecogida(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              >
                {FORMATOS_REGISTRO.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {formatoRecogida !== 'ensayo_discreto' && formatoRecogida !== 'abc' && (
              <div className="space-y-1">
                <label className="text-sm text-slate-600">Dirección del objetivo</label>
                <select
                  name="direccion_objetivo"
                  defaultValue={programa.direccion_objetivo ?? 'aumentar'}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
                >
                  <option value="aumentar">Aumentar la conducta</option>
                  <option value="reducir">Reducir la conducta</option>
                </select>
              </div>
            )}
          </>
        )}

        {programa.tipo === 'rft' && (
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm text-slate-600">Tipo de relación</label>
            <select
              name="tipo_relacion"
              defaultValue={programa.tipo_relacion ?? 'coordinacion'}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
            >
              <option value="coordinacion">Coordinación</option>
              <option value="distincion">Distinción</option>
              <option value="oposicion">Oposición</option>
              <option value="comparacion">Comparación</option>
              <option value="jerarquia">Jerarquía</option>
              <option value="temporal">Temporal</option>
              <option value="causal">Causal</option>
              <option value="deictica">Deíctico</option>
            </select>
          </div>
        )}

        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Objetivo / habilidad</label>
          <textarea
            name="objetivo"
            defaultValue={programa.objetivo ?? ''}
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Materiales</label>
          <textarea
            name="materiales"
            defaultValue={programa.materiales ?? ''}
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Instrucciones para el terapeuta</label>
          <textarea
            name="instrucciones_terapeuta"
            defaultValue={programa.instrucciones_terapeuta ?? ''}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Ayudas posibles</label>
          <textarea
            name="ayudas_posibles"
            defaultValue={programa.ayudas_posibles ?? ''}
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        {(programa.tipo !== 'aba_clasico' || formatoRecogida === 'ensayo_discreto') && (
          <>
            <div className="space-y-1">
              <label className="text-sm text-slate-600">Ensayos por bloque</label>
              <input
                name="ensayos_por_bloque"
                type="number"
                defaultValue={programa.ensayos_por_bloque}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-600">Bloques para dominio</label>
              <input
                name="bloques_para_dominio"
                type="number"
                defaultValue={programa.bloques_para_dominio}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-600">% de dominio</label>
              <input
                name="porcentaje_dominio"
                type="number"
                step="0.01"
                defaultValue={programa.porcentaje_dominio}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
              />
            </div>
          </>
        )}

        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Vídeo de ejemplo (opcional)</label>
          <input
            name="video_url"
            type="url"
            defaultValue={programa.video_url ?? ''}
            placeholder="https://youtube.com/watch?v=... (recomendado: subido como 'No listado')"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="submit"
          disabled={isPending}
          className="py-3 sm:py-2 text-base sm:text-sm"
        >
          Guardar cambios
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setEditando(false)}
          className="py-3 sm:py-2 text-base sm:text-sm font-medium"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}