import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '../logout-action'
import MobileNav from './mobile-nav'

type Enlace = { href: string; label: string }

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
      { href: '/dashboard/equipo', label: 'Equipo y Alumnos' },
      { href: '/dashboard/agenda', label: 'Agenda' },
    ]
    if (tambienTerapeuta) {
      enlaces.push({ href: '/dashboard/mis-alumnos', label: 'Mis Alumnos' })
    }
    enlaces.push(
      { href: '/dashboard/curriculo', label: 'Currículo clínica' },
      { href: '/dashboard/mis-programas', label: 'Mis programas' }
    )
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
    return [{ href: '/dashboard/mi-hijo', label: 'Mi hijo/a' }]
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

  // Cuenta desactivada: cerramos su sesión y la expulsamos al login con aviso
  if (perfil && perfil.activo === false) {
    await supabase.auth.signOut()
    redirect('/login?error=' + encodeURIComponent('Tu cuenta ha sido desactivada. Contacta con tu clínica.'))
  }

  const enlaces = construirEnlaces(perfil?.rol ?? '', perfil?.tambien_terapeuta ?? false)

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50">
      {/* Menú móvil (barra superior + panel deslizante), oculto en escritorio */}
      <MobileNav enlaces={enlaces} nombre={perfil?.nombre ?? ''} rol={perfil?.rol ?? ''} />

      {/* Barra lateral fija, solo visible en escritorio */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-200 bg-white p-5 flex-col">
        <div className="mb-8">
          <p className="font-bold text-slate-800">SaaS ABA/RFT</p>
          <p className="text-xs text-slate-400">{perfil?.nombre}</p>
          <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {perfil?.rol}
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {e.label}
            </Link>
          ))}
        </nav>

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
  )
}