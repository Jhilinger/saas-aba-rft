import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import FacturacionClient from './facturacion-client'
import type { Tables, Enums } from '@/database.types'

type SesionFacturacion = Pick<
  Tables<'sesiones_programadas'>,
  'id' | 'fecha_hora' | 'cancelado_por' | 'confirmada_familia' | 'alumno_id'
> & {
  estado: Exclude<Enums<'estado_sesion'>, 'programada'>
  alumnos: Pick<Tables<'alumnos'>, 'nombre_anonimizado'> | null
  terapeuta: Pick<Tables<'perfiles'>, 'nombre'> | null
}

export default async function FacturacionAlumnosPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.rol !== 'clinica_admin') {
    redirect('/dashboard')
  }

  const clinicaId = perfil.clinica_id
  if (!clinicaId) redirect('/dashboard')

  const { data: alumnos } = await supabase
    .from('alumnos')
    .select('id, nombre_anonimizado')
    .eq('clinica_id', clinicaId)
    .eq('activo', true)
    .order('nombre_anonimizado')

  const alumnoIds = (alumnos ?? []).map((a) => a.id)

  const { data: sesiones } = alumnoIds.length
    ? await supabase
        .from('sesiones_programadas')
        .select('id, fecha_hora, estado, cancelado_por, confirmada_familia, alumno_id, alumnos(nombre_anonimizado), terapeuta:terapeuta_id(nombre)')
        .in('alumno_id', alumnoIds)
        .neq('estado', 'programada')
        .order('fecha_hora', { ascending: false })
    : { data: [] }

    const { data: datosFacturacion } = alumnoIds.length
    ? await supabase
        .from('datos_facturacion_familia')
        .select('alumno_id, nombre_razon_social, nif, direccion, codigo_postal, ciudad, pais, updated_at')
        .in('alumno_id', alumnoIds)
    : { data: [] }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Facturación</h1>
        <p className="text-sm text-slate-500">Consulta las sesiones realizadas por alumno para facilitar su facturación a las familias.</p>
      </div>

      <FacturacionClient
        alumnos={alumnos ?? []}
        sesiones={(sesiones as SesionFacturacion[] | null) ?? []}
        datosFacturacion={datosFacturacion ?? []}
      />
    </div>
  )
}