import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DocumentosClient from './documentos-client'

export default async function DocumentosFamiliaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'familia') redirect('/dashboard')

  const { data: vinculos } = await supabase
    .from('alumno_familia')
    .select('alumno_id, alumnos(id, nombre_anonimizado, clinica_id)')
    .eq('perfil_id', user.id)

  const alumnos = (vinculos ?? []).map((v: any) => v.alumnos).filter(Boolean)

  if (alumnos.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <p className="text-center text-slate-400">
          Todavía no hay ningún alumno vinculado a tu cuenta.
        </p>
      </div>
    )
  }

  const datosPorAlumno = await Promise.all(
    alumnos.map(async (alumno: any) => {
      const { data: tipos } = await supabase
        .from('tipos_documento_clinica')
        .select('id, titulo, contenido')
        .eq('clinica_id', alumno.clinica_id)
        .eq('activo', true)
        .order('created_at', { ascending: true })

      const { data: firmas } = await supabase
        .from('documentos_firmados')
        .select('id, tipo_documento_id, fecha_firma, pdf_url')
        .eq('alumno_id', alumno.id)
        .order('fecha_firma', { ascending: false })

      const firmasPorTipo = new Map<string, { fecha: string; pdfUrl: string | null }>()
      for (const f of firmas ?? []) {
        if (!firmasPorTipo.has(f.tipo_documento_id)) {
          const { data: signed } = await supabase.storage
            .from('documentos-firmados')
            .createSignedUrl(f.pdf_url, 60 * 10)
          firmasPorTipo.set(f.tipo_documento_id, { fecha: f.fecha_firma, pdfUrl: signed?.signedUrl ?? null })
        }
      }

      return {
        alumnoId: alumno.id,
        alumnoNombre: alumno.nombre_anonimizado,
        documentos: (tipos ?? []).map((t) => ({
          id: t.id,
          titulo: t.titulo,
          contenido: t.contenido,
          firmado: firmasPorTipo.get(t.id) ?? null,
        })),
      }
    })
  )

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Documentos</h1>
        <p className="text-sm text-slate-500">
          Revisa y firma los documentos que la clínica necesita de ti.
        </p>
      </div>

      <DocumentosClient datosPorAlumno={datosPorAlumno} />
    </div>
  )
}