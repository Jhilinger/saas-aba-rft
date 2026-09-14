'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { enlaceActivo, enlacesAlumno } from '../../alumno-nav-utils'

export default function AlumnoSubnav({ alumnoId }: { alumnoId: string }) {
  const pathname = usePathname()
  const enlaces = enlacesAlumno(alumnoId)
  const hrefActivo = enlaceActivo(pathname, enlaces)

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
      {enlaces.map((e) => (
        <Link
          key={e.href}
          href={e.href}
          className={`shrink-0 whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            e.href === hrefActivo
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
