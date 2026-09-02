'use client'

import { useState } from 'react'
import Link from 'next/link'
import { logout } from '../logout-action'
import AbacontextIcon from '../abacontext-icon'
import { useEnlacesEfectivos } from './use-enlaces-efectivos'
import type { Enlace } from './alumno-nav-utils'

const NOMBRE_GRUPO: Record<string, string> = {
  centro: 'Gestión del centro',
  perfiles: 'Gestión de perfiles',
  trabajo: 'Mi trabajo',
}

export default function MobileNav({
  enlaces,
  nombre,
  rol,
}: {
  enlaces: Enlace[]
  nombre: string
  rol: string
}) {
  const [abierto, setAbierto] = useState(false)
  const { enModoAlumno, alumnoNombre, volver, enlaces: enlacesEfectivos } = useEnlacesEfectivos(enlaces)
  let grupoAnterior: string | undefined = undefined

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 md:hidden">
                <div className="flex items-center gap-2">
          <AbacontextIcon className="w-6 h-6" />
          <div>
            <p className="text-sm font-bold text-slate-800">abacontext</p>
          <p className="text-xs text-slate-400">
            {enModoAlumno && alumnoNombre ? alumnoNombre : nombre}
          </p>
        </div>
      </div>  
                <button
          onClick={() => setAbierto(true)}
          className="rounded-lg border border-slate-300 p-2 text-slate-700"
          aria-label="Abrir menú"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      {abierto && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setAbierto(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-5 shadow-xl flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">{nombre}</p>
                <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  {rol}
                </span>
              </div>
              <button
                onClick={() => setAbierto(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Cerrar menú"
              >
                ✕
              </button>
            </div>

            {enModoAlumno && volver && (
              <div className="mb-4">
                                <Link
                  href={volver.href}
                  onClick={() => setAbierto(false)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {volver.label}
                </Link>
                {alumnoNombre && (
                  <p className="mt-1 font-semibold text-slate-800 text-sm truncate">{alumnoNombre}</p>
                )}
              </div>
            )}

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {enlacesEfectivos.map((e, i) => {
                const mostrarCabecera = e.grupo && e.grupo !== grupoAnterior
                grupoAnterior = e.grupo
                return (
                  <div key={e.href}>
                      {mostrarCabecera && (
                      <p className={`mb-2 px-3 text-xs font-bold uppercase tracking-wide text-slate-600 border-b border-slate-100 pb-1 ${i === 0 ? '' : 'mt-4'}`}>
                        {NOMBRE_GRUPO[e.grupo!]}
                      </p>
                    )}
                    <Link
                      href={e.href}
                      onClick={() => setAbierto(false)}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-slate-600 hover:bg-slate-100"
                    >
                      {e.label}
                    </Link>
                  </div>
                )
              })}
            </nav>

            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-3 text-left text-base font-medium text-rose-500 hover:bg-rose-50"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}