import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { avatar } from './avatares'
import ControlAdultos from './control-adultos'

// ¿Quién va a jugar? El niño toca su animal (en una tableta compartida, cada
// uno el suyo). Sin niños todavía, se pide a un adulto que los cree.
export default async function AppInfantilInicio() {
  const supabase = await createClient()
  const { data: ninos } = await supabase.from('alumnos').select('id, nombre_anonimizado, avatar').eq('activo', true).order('created_at')

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 py-6">
      <div className="flex w-full max-w-4xl justify-end">
        <ControlAdultos destino="/app/adultos" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-[#0F4C5C] sm:text-4xl">¿Quién va a jugar?</h1>
      {(ninos ?? []).length === 0 ? (
        <p className="mt-10 max-w-sm text-center text-slate-500">
          Todavía no hay ningún niño. Pide a un adulto que mantenga pulsado «Adultos» y lo añada.
        </p>
      ) : (
        <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {(ninos ?? []).map((n) => {
            const a = avatar(n.avatar)
            return (
              <Link
                key={n.id}
                href={`/app/nino/${n.id}`}
                className="flex flex-col items-center gap-3 rounded-3xl p-5 shadow-sm transition-transform active:scale-95"
                style={{ background: a.color }}
              >
                <span className="text-7xl leading-none sm:text-8xl">{a.emoji}</span>
                <span className="text-lg font-semibold">{n.nombre_anonimizado}</span>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
