import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ConductaClient from './conducta-client'

const FORMATOS = ['intervalo', 'duracion', 'tasa', 'abc'] as const
type Formato = (typeof FORMATOS)[number]
const DIRECCIONES = ['aumentar', 'reducir'] as const
type Direccion = (typeof DIRECCIONES)[number]

export default async function ConductaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: alumnoId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin', 'terapeuta'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  const { data: alumno } = await supabase.from('alumnos').select('id').eq('id', alumnoId).single()
  if (!alumno) notFound()

  const { data: programas } = await supabase
    .from('programas_alumno')
    .select('id, nombre, formato_recogida, direccion_objetivo, estado, visible_familia, created_at')
    .eq('alumno_id', alumnoId)
    .eq('tipo', 'conducta')
    .order('created_at', { ascending: false })

  const programasValidos = (programas ?? []).flatMap((programa) => {
    if (!FORMATOS.includes(programa.formato_recogida as Formato)) return []
    if (programa.direccion_objetivo !== null && !DIRECCIONES.includes(programa.direccion_objetivo as Direccion)) return []
    return [{
      ...programa,
      formato_recogida: programa.formato_recogida as Formato,
      direccion_objetivo: programa.direccion_objetivo as Direccion | null,
    }]
  })

  return <ConductaClient alumnoId={alumnoId} programasIniciales={programasValidos} />
}