import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logout } from '../../logout-action'
import { avatar } from '../avatares'
import NinoForm from './nino-form'
import { progresoNino } from '../progreso'

// Zona de adultos (tras la puerta de la suma): niños de la cuenta y, más
// adelante, su progreso en lenguaje sencillo
export default async function ZonaAdultos() {
  const supabase = await createClient()
  const { data: ninos } = await supabase
    .from('alumnos')
    .select('id, nombre_anonimizado, avatar, fecha_nacimiento')
    .eq('activo', true)
    .order('created_at')

  const progresos = new Map(await Promise.all((ninos ?? []).map(async (n) => [n.id, await progresoNino(supabase, n.id)] as const)))

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
        <ul className="space-y-4">
          {(ninos ?? []).map((n) => {
            const a = avatar(n.avatar)
            const p = progresos.get(n.id)!
            const conActividad = p.modulos.filter((m) => m.sesiones > 0)
            return (
              <li key={n.id} className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl text-3xl" style={{ background: a.color }}>
                    {a.emoji}
                  </span>
                  <div>
                    <p className="font-semibold">{n.nombre_anonimizado}</p>
                    <p className="text-xs text-slate-500">
                      {p.minutosSemana ? `${p.minutosSemana} minutos de juego esta semana` : 'Esta semana todavía no ha jugado'}
                    </p>
                  </div>
                </div>
                {conActividad.length === 0 ? (
                  <p className="text-sm text-slate-500">Cuando juegue, aquí verás lo que va aprendiendo.</p>
                ) : (
                  <>
                    {(p.descubiertas > 0 || p.practicadas > 0) && (
                      <p className="rounded-lg bg-[#FFF6E5] p-2 text-sm">
                        ✨ Ha descubierto <strong>{p.descubiertas}</strong> relaciones nuevas sin que se las enseñaran
                        {p.practicadas > 0 && <> y ha aprendido practicando otras {p.practicadas}</>}.
                      </p>
                    )}
                    {conActividad.map((m) => (
                      <div key={m.clave} className="space-y-1 text-sm">
                        <p className="font-medium">
                          {m.emoji} {m.nombre} <span className="font-normal text-slate-400">· {m.sesiones} sesiones</span>
                        </p>
                        {m.logros.length === 0 && m.conceptos.length === 0 && <p className="text-slate-500">Está empezando.</p>}
                        <ul className="list-inside list-disc text-slate-600">
                          {m.logros.map((l) => (
                            <li key={l}>{l}</li>
                          ))}
                          {m.conceptos.map((c) => (
                            <li key={c.nombre}>
                              {c.nombre}: {c.dominados === c.total ? 'lo domina' : `${c.dominados} de ${c.total} niveles`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <NinoForm />
    </main>
  )
}
