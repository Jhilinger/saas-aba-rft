import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logout } from '../../logout-action'
import { avatar } from '../avatares'
import NinoForm from './nino-form'

// Zona de adultos (tras la puerta de la suma): niños de la cuenta y, más
// adelante, su progreso en lenguaje sencillo
export default async function ZonaAdultos() {
  const supabase = await createClient()
  const { data: ninos } = await supabase
    .from('alumnos')
    .select('id, nombre_anonimizado, avatar, fecha_nacimiento')
    .eq('activo', true)
    .order('created_at')

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <Link href="/app" className="text-sm font-medium text-[#0F4C5C]">
          ← Volver a jugar
        </Link>
        <form action={logout}>
          <button className="text-sm text-slate-400 hover:text-slate-600">Cerrar sesión</button>
        </form>
      </div>
      <h1 className="text-2xl font-bold text-[#0F4C5C]">Zona de adultos</h1>

      <section className="space-y-2">
        <h2 className="font-semibold">Niños</h2>
        {(ninos ?? []).length === 0 && <p className="text-sm text-slate-500">Todavía no hay ninguno.</p>}
        <ul className="space-y-2">
          {(ninos ?? []).map((n) => {
            const a = avatar(n.avatar)
            return (
              <li key={n.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl text-3xl" style={{ background: a.color }}>
                  {a.emoji}
                </span>
                <span className="font-medium">{n.nombre_anonimizado}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <NinoForm />
    </main>
  )
}
