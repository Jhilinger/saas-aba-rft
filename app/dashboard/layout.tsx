import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../logout-action'
import MobileNav from './mobile-nav'
import DesktopSidebarNav from './desktop-sidebar-nav'
import { ConfirmProvider } from '../providers/confirm-provider'
import { ToastProvider } from '../providers/toast-provider'
import type { Enlace } from './alumno-nav-utils'

function construirEnlaces(rol: string, tambienTerapeuta: boolean): Enlace[] {
  if (rol === 'superadmin') {
    return [
      { href: '/dashboard', label: 'Inicio' },
      { href: '/dashboard/clinicas', label: 'Clínicas' },
      { href: '/dashboard/curriculo', label: 'Currículo Base' },
    ]
  }

  if (rol === 'clinica_admin') {
    const enlaces: Enlace[] = [
      { href: '/dashboard', label: 'Inicio' },
      { href: '/dashboard/facturacion', label: 'Suscripción', grupo: 'centro' },
      { href: '/dashboard/facturacion-alumnos', label: 'Facturación', grupo: 'centro' },
      { href: '/dashboard/curriculo', label: 'Currículo clínica', grupo: 'centro' },
      { href: '/dashboard/documentos-legales', label: 'Documentos legales', grupo: 'centro' },
      { href: '/dashboard/informes-lote', label: 'Informes en lote', grupo: 'centro' },
      { href: '/dashboard/equipo', label: 'Terapeutas', grupo: 'perfiles' },
      { href: '/dashboard/alumnos', label: 'Alumnos', grupo: 'perfiles' },
      { href: '/dashboard/familia', label: 'Familia', grupo: 'perfiles' },
    ]
    if (tambienTerapeuta) {
      enlaces.push(
        { href: '/dashboard/mis-alumnos', label: 'Mis Alumnos', grupo: 'trabajo' },
        { href: '/dashboard/agenda', label: 'Agenda', grupo: 'trabajo' },
        { href: '/dashboard/mis-programas', label: 'Mis programas', grupo: 'trabajo' }
      )
    }
    return enlaces
  }

  if (rol === 'terapeuta') {
    return [
      { href: '/dashboard', label: 'Inicio' },
      { href: '/dashboard/mis-alumnos', label: 'Mis Alumnos' },
      { href: '/dashboard/agenda', label: 'Agenda' },
      { href: '/dashboard/mis-programas', label: 'Mis programas' },
    ]
  }

  if (rol === 'familia') {
    return [
      { href: '/dashboard/mi-hijo', label: 'Progreso' },
      { href: '/dashboard/mi-hijo/asistencia', label: 'Asistencia' },
      { href: '/dashboard/mi-hijo/informes', label: 'Informes' },
      { href: '/dashboard/mi-hijo/documentos', label: 'Documentos' },
      { href: '/dashboard/mi-hijo/facturacion', label: 'Facturación' },
    ]
  }

  return []
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre, rol, activo, tambien_terapeuta')
    .eq('id', user.id)
    .single()

  if (perfil && perfil.activo === false) {
    await supabase.auth.signOut()
    redirect('/login?error=' + encodeURIComponent('Tu cuenta ha sido desactivada. Contacta con tu clínica.'))
  }

  const enlacesRol = construirEnlaces(perfil?.rol ?? '', perfil?.tambien_terapeuta ?? false)

  return (
    <ToastProvider>
    <ConfirmProvider>
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50">
      <MobileNav enlaces={enlacesRol} nombre={perfil?.nombre ?? ''} rol={perfil?.rol ?? ''} />

      <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-200 bg-white p-5 flex-col">
        <div className="mb-8">
          <p className="font-bold text-slate-800">SaaS ABA/RFT</p>
          <p className="text-xs text-slate-400">{perfil?.nombre}</p>
          <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {perfil?.rol}
          </span>
        </div>

        <DesktopSidebarNav enlacesRol={enlacesRol} />

        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-500 hover:bg-rose-50"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
    </ConfirmProvider>
    </ToastProvider>
  )
}