'use client'

import { useState } from 'react'
import { crearPrograma } from './actions'
import { useRouter } from 'next/navigation'

export default function ProgramaForm({ esGlobal }: { esGlobal: boolean }) {
  const [tipo, setTipo] = useState('aba_clasico')
  const router = useRouter()

  return (
    <form
      action={async (formData) => {
        const res = await crearPrograma(formData)
        if (!res.error && res.id) router.push(`/dashboard/curriculo/${res.id}`)
      }}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
    >
      <h2 className="font-semibold text-slate-700">
        Nuevo programa {esGlobal ? '(global, para todas las clínicas)' : '(compartido con toda tu clínica)'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Nombre del programa</label>
          <input name="nombre" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Orden</label>
          <input
            name="orden"
            type="number"
            placeholder="ej. 1 (opcional)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Tipo</label>
          <select
            name="tipo"
            required
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          >
            <option value="aba_clasico">Aprendizaje Directo</option>
            <option value="rft">Aprendizaje Relacional</option>
          </select>
        </div>

        {tipo === 'rft' && (
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm text-slate-600">Tipo de relación</label>
            <select
              name="tipo_relacion"
              required
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

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Área</label>
          <input name="area" required placeholder="ej. Lenguaje receptivo" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Objetivo / habilidad</label>
          <textarea
            name="objetivo"
            rows={2}
            placeholder="ej. Identificar colores primarios por su nombre"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Materiales</label>
          <textarea
            name="materiales"
            rows={2}
            placeholder="ej. Tarjetas de colores, objetos de distintos colores"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Instrucciones para el terapeuta</label>
          <textarea name="instrucciones_terapeuta" rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Ayudas posibles</label>
          <textarea
            name="ayudas_posibles"
            rows={2}
            placeholder="ej. Verbal, modelado al inicio, retirar gradualmente"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Ensayos por bloque</label>
          <input name="ensayos_por_bloque" type="number" defaultValue="10" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Bloques consecutivos para dominio</label>
          <input name="bloques_para_dominio" type="number" defaultValue="3" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
        </div>

                <div className="space-y-1">
          <label className="text-sm text-slate-600">% de acierto para dominio</label>
          <input name="porcentaje_dominio" type="number" step="0.01" defaultValue="90" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm text-slate-600">Vídeo de ejemplo (opcional)</label>
          <input
            name="video_url"
            type="url"
            placeholder="https://youtube.com/watch?v=... (recomendado: subido como 'No listado')"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
          />
        </div>
      </div>

      <button type="submit" className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-3 sm:py-2 text-base sm:text-sm font-semibold text-white hover:bg-indigo-500">
        Crear programa
      </button>
    </form>
  )
}