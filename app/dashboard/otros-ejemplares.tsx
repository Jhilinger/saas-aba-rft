import type { ImagenesBanco } from './tomar-datos/rft/[programaId]/pantalla-tablet'

// Las otras fotos del concepto que salen al tomar datos: la 3 en las sondas de
// generalización y, si el programa alterna ejemplares, la 2 en entrenamiento y
// tests. La ficha muestra la 1
export default function OtrosEjemplares({ imagenes, concepto, alternar = false }: { imagenes: ImagenesBanco; concepto: string | null; alternar?: boolean }) {
  if (!concepto) return null
  const ejemplares = imagenes[concepto]
  if (!ejemplares) return null
  const otros = [
    ...(alternar ? [{ clave: '2', etiqueta: 'Se alterna con la 1 en entrenamiento y tests' }] : []),
    { clave: '3', etiqueta: 'Sondas de generalización' },
  ].filter((o) => ejemplares[o.clave] && ejemplares[o.clave] !== ejemplares['1'])
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
