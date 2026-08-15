import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import NuevoConjuntoForm from './nuevo-conjunto-form'
import ConjuntoCard from './conjunto-card'
import EditarProgramaForm from './editar-programa-form'

export default async function ProgramaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('id, rol, clinica_id')
    .eq('id', user.id)
    .single()

  if (!perfil || !['superadmin', 'clinica_admin', 'terapeuta'].includes(perfil.rol)) {
    redirect('/dashboard')
  }

  const { data: programa } = await supabase
    .from('programas_base')
    .select(
      'id, nombre, tipo, area, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, tipo_relacion, orden, clinica_id, creado_por'
    )
    .eq('id', id)
    .single()

  if (!programa) notFound()

  const puedeVer =
    perfil.rol === 'superadmin' ||
    (perfil.rol === 'clinica_admin' && programa.clinica_id === perfil.clinica_id) ||
    (perfil.rol === 'terapeuta' && programa.creado_por === perfil.id)

  if (!puedeVer) redirect('/dashboard')

  const { data: conjuntos } = await supabase
    .from('conjuntos_estimulos_base')
    .select('id, nombre, estimulos_base(id, nombre, descripcion)')
    .eq('programa_base_id', id)
    .order('orden')

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6 sm:space-y-8">
      <div>
        <Link href="/dashboard/curriculo" className="text-sm text-indigo-600 hover:underline">
          ← Volver al currículo
        </Link>
        <h1 className="mt-2 text-xl sm:text-2xl font-bold text-slate-800">{programa.nombre}</h1>
        <p className="text-sm text-slate-500">{programa.area}</p>
      </div>

      <EditarProgramaForm programa={programa as any} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-sm">
        <div className="sm:col-span-3">
          <span className="text-slate-400">Objetivo</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.objetivo || '—'}</p>
        </div>
        <div className="sm:col-span-3">
          <span className="text-slate-400">Materiales</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.materiales || '—'}</p>
        </div>
        <div className="sm:col-span-3">
          <span className="text-slate-400">Instrucciones para el terapeuta</span>
          <p className="text-slate-700 whitespace-pre-wrap">
            {programa.instrucciones_terapeuta || '—'}
          </p>
        </div>
        <div className="sm:col-span-3">
          <span className="text-slate-400">Ayudas posibles</span>
          <p className="text-slate-700 whitespace-pre-wrap">
            {programa.ayudas_posibles || '—'}
          </p>
        </div>
        {programa.tipo === 'rft' && (
          <div className="sm:col-span-3">
            <span className="text-slate-400">Tipo de relación</span>
            <p className="text-slate-700">{programa.tipo_relacion}</p>
          </div>
        )}
        <div>
          <span className="text-slate-400">Ensayos por bloque</span>
          <p className="text-slate-700">{programa.ensayos_por_bloque}</p>
        </div>
        <div>
          <span className="text-slate-400">Criterio de dominio</span>
          <p className="text-slate-700">
            {programa.bloques_para_dominio} bloques al {programa.porcentaje_dominio}%
          </p>
        </div>
      </div>

      {programa.tipo === 'aba_clasico' && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Conjuntos de estímulos (plantilla)</h2>
          <NuevoConjuntoForm programaBaseId={id} />

          <div className="space-y-4">
            {conjuntos?.map((c: any) => (
              <ConjuntoCard key={c.id} conjunto={c} programaBaseId={id} />
            ))}
          </div>

          {(!conjuntos || conjuntos.length === 0) && (
            <p className="text-center text-slate-400">Sin conjuntos de estímulos todavía.</p>
          )}
        </section>
      )}
    </div>
  )
}