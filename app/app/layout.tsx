import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ToastProvider } from '../providers/toast-provider'

// App infantil (cuentas de familia y de escuela): pantallas a pantalla
// completa, sin el panel profesional. Las cuentas de centro van al panel.
export default async function AppInfantilLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase.from('perfiles').select('activo, clinicas(tipo)').eq('id', user.id).single()
  const tipo = (perfil?.clinicas as { tipo: string } | null)?.tipo
  if (tipo !== 'familia' && tipo !== 'escuela') redirect('/dashboard')

  return (
    <ToastProvider>
      <div className="min-h-dvh select-none bg-[#FFFBF5] text-slate-800">{children}</div>
    </ToastProvider>
  )
}
