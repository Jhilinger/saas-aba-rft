import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import FacturacionClient from './facturacion-client'

export default async function FacturacionFamiliaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vinculos } = await supabase
    .from('alumno_familia')
    .select('alumno_id, alumnos(id, nombre_anonimizado)')
    .eq('perfil_id', user.id)

  const alumnos = (vinculos ?? []).map((v: any) => v.alumnos).filter(Boolean)

  if (alumnos.length === 0) {
    return <p className="text-center text-slate-400 py-8">Sin alumnos vinculados todavía.</p>
  }

  const alumnoIds = alumnos.map((a: any) => a.id)

  const { data: datosExistentes } = await supabase
    .from('datos_facturacion_familia')
    .select('alumno_id, nombre_razon_social, nif, direccion, codigo_postal, ciudad, pais')
    .in('alumno_id', alumnoIds)

  const datosPorAlumno = new Map((datosExistentes ?? []).map((d) => [d.alumno_id, d]))

  const alumnosConDatos = alumnos.map((a: any) => ({
    alumnoId: a.id,
    alumnoNombre: a.nombre_anonimizado,
    datos: datosPorAlumno.get(a.id) ?? null,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Facturación</h1>
        <p className="text-sm text-slate-500">
          Estos datos los usará la clínica para emitirte las facturas correctamente.
        </p>
      </div>

      <FacturacionClient alumnosConDatos={alumnosConDatos} />
    </div>
  )
}