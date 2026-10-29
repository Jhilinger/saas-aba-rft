import type { createClient } from '@/utils/supabase/server'

type Supabase = Awaited<ReturnType<typeof createClient>>

export const SIN_PERMISO_DISENO = 'Solo quien diseña la intervención (el supervisor del alumno) puede hacer este cambio.'

// Diseñar la intervención: PEI, configuración de programas, estados,
// valoración, colocación e informes. Lo decide la clínica (solo supervisores
// o cada terapeuta); el acceso a cada alumno se comprueba aparte (RLS).
export async function puedeDisenar(supabase: Supabase): Promise<boolean> {
  const { data } = await supabase.rpc('auth_puede_disenar')
  return data === true
}
