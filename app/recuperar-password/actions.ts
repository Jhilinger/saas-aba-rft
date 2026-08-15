'use server'

import { createClient } from '@/utils/supabase/server'

export async function solicitarRecuperacion(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/restablecer-password`,
  })

  // Por seguridad, no revelamos si el email existe o no
  if (error) {
    console.error('Error en resetPasswordForEmail:', error.message)
  }

  return { success: true }
}