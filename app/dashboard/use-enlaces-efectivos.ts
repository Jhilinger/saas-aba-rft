'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { extraerAlumnoId, enlacesAlumno, type Enlace } from './alumno-nav-utils'

export function useEnlacesEfectivos(enlacesRol: Enlace[]) {
  const pathname = usePathname()
  const alumnoId = extraerAlumnoId(pathname)
  const [alumnoNombre, setAlumnoNombre] = useState<string | null>(null)

  useEffect(() => {
    if (!alumnoId) {
      setAlumnoNombre(null)
      return
    }
    const supabase = createClient()
    supabase
      .from('alumnos')
      .select('nombre_anonimizado')
      .eq('id', alumnoId)
      .single()
      .then(({ data }) => setAlumnoNombre(data?.nombre_anonimizado ?? null))
  }, [alumnoId])

  if (alumnoId) {
    return {
      enModoAlumno: true,
      alumnoNombre,
      volver: { href: '/dashboard/alumnos', label: '← Volver a Alumnos' },
      enlaces: enlacesAlumno(alumnoId),
    }
  }

  return {
    enModoAlumno: false,
    alumnoNombre: null,
    volver: null,
    enlaces: enlacesRol,
  }
}