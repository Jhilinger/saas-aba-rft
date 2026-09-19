import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import NuevoConjuntoForm from './nuevo-conjunto-form'
import ConjuntoCard from './conjunto-card'
import EditarProgramaForm from './editar-programa-form'
import VideoDiferido from '../../video-diferido'
import NuevaClaseRftForm from './nueva-clase-rft-form'
import ClaseRftBaseCard from './clase-rft-base-card'
import NuevoPasoBaseForm from './nuevo-paso-base-form'
import PasoBaseCard from './paso-base-card'
import { Breadcrumb, Panel } from '../../../ui'

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
      'id, nombre, tipo, area, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, tipo_relacion, orden, clinica_id, creado_por, video_url, formato_recogida, direccion_objetivo, direccion_cadena, nivel_rft'
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

  const { data: clasesRft } = await supabase
    .from('clases_rft_base')
    .select('id, nombre, grupo, estimulos_rft_base(id, etiqueta, nombre, posicion, elemento)')
    .eq('programa_base_id', id)
    .order('orden')

  const { data: pasosTarea } = await supabase
    .from('pasos_tarea_base')
    .select('id, nombre, descripcion, orden')
    .eq('programa_base_id', id)
    .order('orden')

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8 sm:space-y-8">
      <div>
        <Breadcrumb items={[{ label: 'Currículo', href: '/dashboard/curriculo' }, { label: programa.nombre }]} />
        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">{programa.nombre}</h1>
        <p className="text-sm text-slate-500">{programa.area}</p>
      </div>

      <EditarProgramaForm programa={programa} />

      <Panel className="grid grid-cols-1 gap-4 p-4 text-sm sm:grid-cols-3 sm:p-5">
        <div className="sm:col-span-3">
          <span className="text-slate-500">Objetivo</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.objetivo || '—'}</p>
        </div>
        <div className="sm:col-span-3">
          <span className="text-slate-500">Materiales</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.materiales || '—'}</p>
        </div>
        <div className="sm:col-span-3">
          <span className="text-slate-500">Instrucciones para el terapeuta</span>
          <p className="text-slate-700 whitespace-pre-wrap">
            {programa.instrucciones_terapeuta || '—'}
          </p>
        </div>
        <div className="sm:col-span-3">
          <span className="text-slate-500">Ayudas posibles</span>
          <p className="text-slate-700 whitespace-pre-wrap">
            {programa.ayudas_posibles || '—'}
          </p>
        </div>
        {programa.video_url && (
          <div className="sm:col-span-3">
            <span className="text-slate-500">Vídeo de ejemplo</span>
            <VideoDiferido url={programa.video_url} />
          </div>
        )}
        {programa.tipo === 'rft' && programa.nivel_rft !== 'relacion_relaciones' && (
          <div className="sm:col-span-3">
            <span className="text-slate-500">Tipo de relación</span>
            <p className="text-slate-700">{programa.tipo_relacion}</p>
          </div>
        )}
        <div>
          <span className="text-slate-500">Ensayos por bloque</span>
          <p className="text-slate-700">{programa.ensayos_por_bloque}</p>
        </div>
        <div>
          <span className="text-slate-500">Criterio de dominio</span>
          <p className="text-slate-700">
            {programa.bloques_para_dominio} bloques al {programa.porcentaje_dominio}%
          </p>
        </div>
      </Panel>

            {programa.tipo === 'aba_clasico' && programa.formato_recogida === 'ensayo_discreto' && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Conjuntos de estímulos (plantilla)</h2>
          <NuevoConjuntoForm programaBaseId={id} />

          <div className="space-y-4">
            {conjuntos?.map((c) => (
              <ConjuntoCard key={c.id} conjunto={c} programaBaseId={id} />
            ))}
          </div>

          {(!conjuntos || conjuntos.length === 0) && (
            <p className="text-center text-slate-500">Sin conjuntos de estímulos todavía.</p>
          )}
        </section>
      )}

      {programa.tipo === 'aba_clasico' && programa.formato_recogida === 'analisis_tareas' && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Pasos de la tarea (plantilla)</h2>
          <p className="text-sm text-slate-500">
            Orden {programa.direccion_cadena === 'atras' ? '— se enseñará empezando por el último paso' : '— se enseñará empezando por el primer paso'}.
          </p>
          <NuevoPasoBaseForm programaBaseId={id} />

          <div className="space-y-2">
            {pasosTarea?.map((p) => (
              <PasoBaseCard key={p.id} paso={p} programaBaseId={id} />
            ))}
          </div>

          {(!pasosTarea || pasosTarea.length === 0) && (
            <p className="text-center text-slate-500">Sin pasos todavía.</p>
          )}
        </section>
      )}

      {programa.tipo === 'rft' && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Clases (plantilla)</h2>
          {programa.nivel_rft === 'relacion_relaciones' && (
            <p className="text-sm text-slate-500">
              Cada clase es un grupo de estímulos. Marca con el mismo "elemento" los que sean el mismo
              dentro de la clase (ej. dos círculos comparten elemento aunque se llamen distinto) — el
              patrón (cuántos coinciden) se calcula solo, y dos clases combinan cuando tienen el mismo patrón.
            </p>
          )}
          <NuevaClaseRftForm programaBaseId={id} />

          <div className="space-y-4">
            {clasesRft?.map((c) => (
              <ClaseRftBaseCard key={c.id} clase={c} programaBaseId={id} nivelRft={programa.nivel_rft} />
            ))}
          </div>

          {(!clasesRft || clasesRft.length === 0) && (
            <p className="text-center text-slate-500">Sin clases todavía.</p>
          )}
        </section>
      )}
    </div>
  )
}