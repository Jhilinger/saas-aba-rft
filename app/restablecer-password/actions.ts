'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function actualizarPassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmar = formData.get('confirmar') as string

  if (password !== confirmar) {
    redirect('/restablecer-password?error=' + encodeURIComponent('Las contraseñas no coinciden'))
  }

  if (password.length < 8) {
    redirect('/restablecer-password?error=' + encodeURIComponent('La contraseña debe tener al menos 8 caracteres'))
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/restablecer-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/dashboard')
}