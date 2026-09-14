export type Enlace = { href: string; label: string; grupo?: string }

// Entre todos los enlaces cuyo href coincide con la ruta actual (exacto o
// como prefijo de una subruta), devuelve el de href más largo — así un
// enlace "raíz" (ej. /dashboard) no queda resaltado a la vez que uno de
// sus hermanos (ej. /dashboard/curriculo), que también empieza por él.
export function enlaceActivo(pathname: string, enlaces: Enlace[]): string | null {
  let mejor: string | null = null
  for (const e of enlaces) {
    const coincide = pathname === e.href || pathname.startsWith(`${e.href}/`)
    if (coincide && (mejor === null || e.href.length > mejor.length)) {
      mejor = e.href
    }
  }
  return mejor
}

export function enlacesAlumno(alumnoId: string): Enlace[] {
  const base = `/dashboard/alumnos/${alumnoId}`
  return [
    { href: base, label: 'Inicio' },
    { href: `${base}/datos-clinicos`, label: 'Datos clínicos' },
    { href: `${base}/progreso`, label: 'Progreso' },
    { href: `${base}/valoracion`, label: 'Valoración' },
    { href: `${base}/pei`, label: 'PEI' },
    { href: `${base}/conducta`, label: 'Registros de conducta' },
    { href: `${base}/preferencias`, label: 'Preferencias' },
    { href: `${base}/informes`, label: 'Informes' },
  ]
}