import type { ImagenesBanco } from './tomar-datos/rft/[programaId]/pantalla-tablet'

// La foto del concepto que sale en las sondas de generalización (la 3); en
// entrenamiento y en los tests se usa siempre la 1, la de la ficha
export default function OtrosEjemplares({ imagenes, concepto }: { imagenes: ImagenesBanco; concepto: string | null }) {
  if (!concepto) return null
  const ejemplares = imagenes[concepto]
  if (!ejemplares) return null
  const otros = [{ clave: '3', etiqueta: 'Sondas de generalización' }].filter((o) => ejemplares[o.clave] && ejemplares[o.clave] !== ejemplares['1'])
  if (!otros.length) return null
  return (
    <span className="flex shrink-0 gap-1">
      {otros.map((o) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={o.clave}
          src={ejemplares[o.clave]}
          alt=""
          title={o.etiqueta}
          className={`h-8 w-8 rounded border bg-white object-contain ${o.clave === '3' ? 'border-dashed border-violet-300' : 'border-slate-200'}`}
        />
      ))}
    </span>
  )
}
