import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProgresoCurriculo from '../alumnos/[id]/progreso/progreso-curriculo'
import { calcularProgreso } from '../alumnos/[id]/progreso/calcular-progreso'
import { cargarEstructuraCurriculo } from '../curriculo/estructura'
import type { Tables } from '@/database.types'

type VinculoAlumno = {
  alumnos: Pick<Tables<'alumnos'>, 'id' | 'nombre_anonimizado' | 'clinica_id'> | null
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

  const estructura = await cargarEstructuraCurriculo(supabase)

  const secciones = await Promise.all(
    alumnos.map(async (alumno) => {
      const [{ data: curriculo }, { data: importados }, { data: dominadosValoracion }] = await Promise.all([
        supabase
          .from('programas_base')
          .select('id, nombre, tipo, dominio_id, orden, clinica_id')
          .eq('activo', true)
          .or(`clinica_id.is.null,and(clinica_id.eq.${alumno.clinica_id},visibilidad.eq.clinica)`),
        supabase
          .from('programas_alumno')
          .select('id, programa_base_id, estado, nombre, tipo, formato_recogida, visible_familia, programas_base(id, nombre, tipo, dominio_id, orden, clinica_id, activo)')
          .eq('alumno_id', alumno.id)
          .in('tipo', ['aba_clasico', 'rft']),
        // Solo los ids dominados en la valoración inicial (sin notas), para
        // que los porcentajes coincidan con los del terapeuta
        supabase.rpc('programas_dominados_valoracion', { p_alumno_id: alumno.id }),
      ])

      // Fuera del currículo se respeta "visible para la familia" cuando el
      // formato no es ensayo discreto (igual que en la página del programa).
      const progreso = calcularProgreso({
        estructura,
        curriculo: curriculo ?? [],
        asignados: importados ?? [],
        dominadoEnValoracion: new Set(dominadosValoracion ?? []),
        hrefAsignado: ({ id, tipo }) =>
          tipo === 'aba_clasico' ? `/dashboard/mi-hijo/programa/${id}` : `/dashboard/mi-hijo/programa-rft/${id}`,
        mostrarFueraDelCurriculo: (p) =>
          p.tipo === 'rft' || p.formato_recogida === 'ensayo_discreto' || p.visible_familia,
      })

      return { alumnoId: alumno.id, alumnoNombre: alumno.nombre_anonimizado, ...progreso }
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
          <ProgresoCurriculo niveles={s.niveles} fueraDelCurriculo={s.fueraDelCurriculo} ocultarSinEnsenar />
        </div>
      ))}
    </div>
  )
}