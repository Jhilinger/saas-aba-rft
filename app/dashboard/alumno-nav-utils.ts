export type Enlace = { href: string; label: string; grupo?: string }

// Si la ruta actual es /dashboard/alumnos/{id}/algo, devuelve ese {id}.
// Si no, devuelve null (no estamos dentro de la ficha de un alumno).
export function extraerAlumnoId(pathname: string): string | null {
  const match = pathname.match(/^\/dashboard\/alumnos\/([^/]+)(\/|$)/)
  if (!match) return null
  if (match[1] === '') return null // /dashboard/alumnos (la lista) no cuenta
  return match[1]
}

export function enlacesAlumno(alumnoId: string): Enlace[] {
  const base = `/dashboard/alumnos/${alumnoId}`
  return [
    { href: `${base}/datos-clinicos`, label: 'Datos clínicos' },
    { href: `${base}/progreso`, label: 'Progreso' },
    { href: `${base}/valoracion`, label: 'Valoración' },
    { href: base, label: 'PEI' },
    { href: `${base}/conducta`, label: 'Registros de conducta' },
    { href: `${base}/preferencias`, label: 'Preferencias' },
    { href: `${base}/informes`, label: 'Informes' },
  ]
}