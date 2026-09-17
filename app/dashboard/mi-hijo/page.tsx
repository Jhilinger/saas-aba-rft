import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProgresoTabla from '../alumnos/[id]/progreso/progreso-tabla'
import type { Tables } from '@/database.types'

type VinculoAlumno = {
  alumnos: Pick<Tables<'alumnos'>, 'id' | 'nombre_anonimizado' | 'clinica_id'> | null
}

function simplificar(estado: string | null): 'dominado' | 'adquisicion' | 'sin_ensenar' {
  if (!estado) return 'sin_ensenar'
  if (estado === 'dominado' || estado === 'mantenimiento') return 'dominado'
  return 'adquisicion'
}

export default async function ProgresoFamiliaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vinculos } = await supabase
    .from('alumno_familia')
    .select('alumno_id, alumnos(id, nombre_anonimizado, clinica_id)')
    .eq('perfil_id', user.id)

  const alumnos = ((vinculos ?? []) as unknown as VinculoAlumno[])
    .map((v) => v.alumnos)
    .filter((a): a is Pick<Tables<'alumnos'>, 'id' | 'nombre_anonimizado' | 'clinica_id'> => Boolean(a))

  if (alumnos.length === 0) {
    return <p className="text-center text-slate-500 py-8">Sin alumnos vinculados todavía.</p>
  }

  const secciones = await Promise.all(
    alumnos.map(async (alumno) => {
      const { data: curriculo } = await supabase
        .from('programas_base')
        .select('id, nombre, tipo, area, orden')
        .eq('activo', true)
        .or(`clinica_id.is.null,and(clinica_id.eq.${alumno.clinica_id},visibilidad.eq.clinica)`)
        .order('orden', { ascending: true, nullsFirst: false })

      const { data: importados } = await supabase
        .from('programas_alumno')
        .select('id, programa_base_id, estado')
        .eq('alumno_id', alumno.id)
        .not('programa_base_id', 'is', null)

      const importadoPorBase = new Map((importados ?? []).map((p) => [p.programa_base_id, p]))

      const filas = (curriculo ?? []).map((p) => {
        const importado = importadoPorBase.get(p.id)
        return {
          id: p.id,
          nombre: p.nombre,
          tipo: p.tipo,
          area: p.area || 'General',
          orden: p.orden ?? 999999,
          estado: simplificar(importado?.estado ?? null),
          graficoHref: !importado
            ? null
            : p.tipo === 'aba_clasico'
              ? `/dashboard/mi-hijo/programa/${importado.id}`
              : p.tipo === 'rft'
                ? `/dashboard/mi-hijo/programa-rft/${importado.id}`
                : null,
        }
      })

      return { alumnoId: alumno.id, alumnoNombre: alumno.nombre_anonimizado, filas }
    })
  )

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Seguimiento</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">Progreso</h1>
      </div>

      {secciones.map((s) => (
        <div key={s.alumnoId} className="space-y-3">
          {secciones.length > 1 && (
            <h2 className="text-lg font-bold text-slate-800">{s.alumnoNombre}</h2>
          )}
          <ProgresoTabla filas={s.filas} ocultarSinEnsenar mostrarColumnaGrafico />
        </div>
      ))}
    </div>
  )
}