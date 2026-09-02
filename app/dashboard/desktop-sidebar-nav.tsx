'use client'

import Link from 'next/link'
import { useEnlacesEfectivos } from './use-enlaces-efectivos'
import type { Enlace } from './alumno-nav-utils'

const NOMBRE_GRUPO: Record<string, string> = {
  centro: 'Gestión del centro',
  perfiles: 'Gestión de perfiles',
  trabajo: 'Mi trabajo',
}

export default function DesktopSidebarNav({ enlacesRol }: { enlacesRol: Enlace[] }) {
  const { enModoAlumno, alumnoNombre, volver, enlaces } = useEnlacesEfectivos(enlacesRol)

  let grupoAnterior: string | undefined = undefined

  return (
    <nav className="flex-1">
      {enModoAlumno && volver && (
        <div className="mb-4">
            <Link href={volver.href} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
            {volver.label}
          </Link>
          {alumnoNombre && (
            <p className="mt-1 font-semibold text-slate-800 text-sm truncate">{alumnoNombre}</p>
          )}
        </div>
      )}

      {enlaces.map((e, i) => {
        const mostrarCabecera = e.grupo && e.grupo !== grupoAnterior
        grupoAnterior = e.grupo
        return (
          <div key={e.href}>
                        {mostrarCabecera && (
              <p className={`mb-2 px-3 text-xs font-bold uppercase tracking-wide text-slate-600 border-b border-slate-100 pb-1 ${i === 0 ? '' : 'mt-6'}`}>
                {NOMBRE_GRUPO[e.grupo!]}
              </p>
            )}
            <Link
              href={e.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {e.label}
            </Link>
          </div>
        )
      })}
    </nav>
  )
}