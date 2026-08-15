import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// ⚠️ Este cliente usa la service_role key: acceso total, sin RLS.
// SOLO se debe importar desde archivos 'use server' (Server Actions),
// nunca desde un componente de cliente ni exponerlo al navegador.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}