import type { EstructuraCurriculo } from './estructura'

// Programas complementarios (de clínica o de un terapeuta): no tienen dominio,
// solo un área libre para agruparlos (ej. Autonomía, Conducta)
export function CampoArea({ area }: { area?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-700">Área</label>
      <input
        name="area"
        required
        defaultValue={area ?? ''}
        placeholder="ej. Autonomía, Conducta, Habilidades sociales"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
    </div>
  )
}

// Selector de dominio (agrupado por nivel) + posición dentro del dominio.
// Solo para programas del currículo (globales).
export default function CamposDominio({
  estructura,
  dominioId,
  posicion,
}: {
  estructura: EstructuraCurriculo
  dominioId?: string | null
  posicion?: number | null
}) {
  return (
    <>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Dominio</label>
        <select
          name="dominio_id"
          required
          defaultValue={dominioId ?? ''}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        >
          <option value="" disabled>
            Elige un dominio...
          </option>
          {estructura.niveles.map((n) => (
            <optgroup key={n.numero} label={`Nivel ${n.numero} · ${n.nombre}`}>
              {estructura.dominios
                .filter((d) => d.nivel === n.numero)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.codigo} · {d.nombre}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Posición en el dominio</label>
        <input
          name="posicion"
          type="number"
          min={1}
          defaultValue={posicion ?? ''}
          placeholder="vacío = al final"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
        />
      </div>
    </>
  )
}
