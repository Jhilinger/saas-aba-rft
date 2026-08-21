'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MiHijoSubnav() {
  const pathname = usePathname()
  const base = '/dashboard/mi-hijo'

  const enlaces = [
    { href: base, label: 'Progreso' },
    { href: `${base}/asistencia`, label: 'Asistencia' },
    { href: `${base}/informes`, label: 'Informes' },
    { href: `${base}/documentos`, label: 'Documentos' },
    { href: `${base}/facturacion`, label: 'Facturación' },
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