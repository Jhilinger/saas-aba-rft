'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AlumnoSubNav({ alumnoId }: { alumnoId: string }) {
  const pathname = usePathname()
  const base = `/dashboard/alumnos/${alumnoId}`

  const enlaces = [
    { href: `${base}/datos-clinicos`, label: 'Datos clínicos' },
    { href: `${base}/progreso`, label: 'Progreso' },
    { href: `${base}/valoracion`, label: 'Valoración' },
    { href: base, label: 'PEI' },
    { href: `${base}/preferencias`, label: 'Preferencias' },
    { href: `${base}/informes`, label: 'Informes' },
  ]

  const activo = (href: string) => (href === base ? pathname === base : pathname.startsWith(href))

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0">
      {enlaces.map((e) => (
        <Link
          key={e.href}
          href={e.href}
          className={`shrink-0 px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
            activo(e.href)
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {e.label}
        </Link>
      ))}
    </div>
  )
}