'use server'

import { createClient } from '@/utils/supabase/server'
import { puedeDisenar, SIN_PERMISO_DISENO } from '../permisos'
import { revalidatePath } from 'next/cache'

// Requisitos previos entre programas. La RLS decide quién puede editarlos
// (quien puede editar el programa); aquí solo se evitan los ciclos.

export async function agregarRequisito(programaBaseId: string, requisitoId: string) {
  const supabase = await createClient()
  if (!(await puedeDisenar(supabase))) return { error: SIN_PERMISO_DISENO }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }
  if (programaBaseId === requisitoId) return { error: 'Un programa no puede ser requisito de sí mismo' }

  // Ciclo: el nuevo requisito ya depende (directa o indirectamente) de este programa
  const { data: todos } = await supabase.from('requisitos_programa').select('programa_base_id, requisito_id')
  const requisitosDe = new Map<string, string[]>()
  for (const r of todos ?? []) {
    requisitosDe.set(r.programa_base_id, [...(requisitosDe.get(r.programa_base_id) ?? []), r.requisito_id])
  }
  const pendientes = [requisitoId]
  const visitados = new Set<string>()
  while (pendientes.length > 0) {
    const actual = pendientes.pop()!
    if (actual === programaBaseId) {
      return { error: 'No se puede añadir: ese programa ya depende de este (se crearía un ciclo de requisitos)' }
    }
    if (visitados.has(actual)) continue
    visitados.add(actual)
    pendientes.push(...(requisitosDe.get(actual) ?? []))
  }

  const { error } = await supabase
    .from('requisitos_programa')
    .insert({ programa_base_id: programaBaseId, requisito_id: requisitoId })
  if (error) {
    if (error.code === '23505') return { error: 'Ese requisito ya está añadido' }
    return { error: error.message }
  }

  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true }
}

export async function quitarRequisito(programaBaseId: string, requisitoId: string) {
  const supabase = await createClient()
  if (!(await puedeDisenar(supabase))) return { error: SIN_PERMISO_DISENO }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('requisitos_programa')
    .delete()
    .eq('programa_base_id', programaBaseId)
    .eq('requisito_id', requisitoId)
  if (error) return { error: error.message }

  revalidatePath(`/dashboard/curriculo/${programaBaseId}`)
  return { success: true }
}
