import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { moduloPorClave } from '../../../modulos'
import { avatar } from '../../../avatares'
import Sesion from './sesion'

// Sesión de un módulo: el motor elige la actividad al empezar (acción de servidor)
export default async function SesionModulo({ params }: { params: Promise<{ id: string; modulo: string }> }) {
  const { id, modulo: clave } = await params
  const modulo = moduloPorClave(clave)
  if (!modulo) notFound()
  const supabase = await createClient()
  const { data: nino } = await supabase.from('alumnos').select('id, nombre_anonimizado, avatar').eq('id', id).single()
  if (!nino) notFound()
  const a = avatar(nino.avatar)
  return <Sesion alumnoId={nino.id} modulo={modulo.clave} nombreModulo={modulo.nombre} emojiModulo={modulo.emoji} color={modulo.color} avatarEmoji={a.emoji} />
}
