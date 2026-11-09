import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { avatar } from '../../avatares'
import { MODULOS } from '../../modulos'
import ControlAdultos from '../../control-adultos'

// Los módulos del niño: tarjetas grandes; la app elige después la actividad
export default async function ModulosNino({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: nino } = await supabase.from('alumnos').select('id, nombre_anonimizado, avatar').eq('id', id).single()
  if (!nino) notFound()
  const a = avatar(nino.avatar)

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 py-6">
      <div className="flex w-full max-w-4xl items-center justify-between">
        <Link href="/app" className="flex items-center gap-2 rounded-full px-3 py-1" style={{ background: a.color }}>
          <span className="text-3xl">{a.emoji}</span>
          <span className="font-semibold">{nino.nombre_anonimizado}</span>
        </Link>
        <ControlAdultos destino="/app/adultos" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-[#0F4C5C] sm:text-4xl">¿A qué jugamos?</h1>
      <div className="mt-10 grid w-full max-w-4xl gap-6 sm:grid-cols-3">
        {MODULOS.map((m) => (
          <Link
            key={m.clave}
            href={`/app/nino/${nino.id}/${m.clave}`}
            className="flex flex-col items-center gap-4 rounded-3xl p-8 shadow-sm transition-transform active:scale-95"
            style={{ background: m.color }}
          >
            <span className="text-8xl leading-none">{m.emoji}</span>
            <span className="text-center text-xl font-bold">{m.nombre}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
