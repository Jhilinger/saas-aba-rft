import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type Articulo = { href: string; titulo: string; resumen: string }

const ARTICULOS_POR_ROL: Record<string, Articulo[]> = {
  clinica_admin: [
    {
      href: '/dashboard/ayuda/primeros-pasos-admin',
      titulo: 'Primeros pasos como administrador',
      resumen: 'Crea tu equipo de terapeutas, da de alta a tus alumnos, y configura el currículo de tu clínica.',
    },
  ],
  terapeuta: [
    {
      href: '/dashboard/ayuda/dia-a-dia-terapeuta',
      titulo: 'Tu día a día como terapeuta',
      resumen: 'Agenda, toma de datos en el PEI, Registros de conducta, preferencias, y progreso.',
    },
  ],
  familia: [],
}

export default async function AyudaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase.from('perfiles').select('rol').eq('id', user.id).single()
  if (!perfil) redirect('/login')

  const articulos = ARTICULOS_POR_ROL[perfil.rol] ?? []

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Ayuda</h1>
      <p className="text-sm text-slate-500">
        Estamos ampliando el manual poco a poco. Si no encuentras lo que buscas,
        escríbenos a soporte@abacontext.com.
      </p>

      <div className="space-y-3">
        {articulos.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="block rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300"
          >
            <p className="font-semibold text-slate-800">{a.titulo}</p>
            <p className="mt-1 text-sm text-slate-500">{a.resumen}</p>
          </Link>
        ))}
        {articulos.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
            Todavía no hay artículos para tu rol. ¡Vuelve pronto!
          </p>
        )}
      </div>
    </div>
  )
}