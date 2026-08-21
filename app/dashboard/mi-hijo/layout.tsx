import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function MiHijoLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'familia') redirect('/dashboard')

  return <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">{children}</div>
}