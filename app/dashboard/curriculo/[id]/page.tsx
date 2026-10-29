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
import RequisitosPrograma from './requisitos-programa'
import { usaRespuestasSinSeleccion } from '../../respuestas-rft'
import { Breadcrumb, Panel } from '../../../ui'
import { cargarEstructuraCurriculo, crearCodificador } from '../estructura'

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
      'id, nombre, tipo, area, dominio_id, visibilidad, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles, ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, tipo_relacion, orden, clinica_id, creado_por, video_url, formato_recogida, direccion_objetivo, direccion_cadena, nivel_rft, tipo_respuesta, opciones_respuesta, respuesta_por_fase'
    )
    .eq('id', id)
    .single()

  if (!programa) notFound()

  const estructura = await cargarEstructuraCurriculo(supabase)
  const codigo = crearCodificador(estructura).codigo(programa)
  const dominio = programa.clinica_id === null ? estructura.dominios.find((d) => d.id === programa.dominio_id) : undefined
  const nivel = dominio ? estructura.niveles.find((n) => n.numero === dominio.nivel) : undefined

  // Editar: superadmin (todo), clinica_admin (los de su clínica), terapeuta
  // (los suyos). Ver: además, cualquiera del personal ve el currículo global y
  // los complementarios compartidos de su clínica (solo lectura).
  const puedeEditar =
    perfil.rol === 'superadmin' ||
    (perfil.rol === 'clinica_admin' && programa.clinica_id !== null && programa.clinica_id === perfil.clinica_id) ||
    (perfil.rol === 'terapeuta' && programa.creado_por === perfil.id)
  const puedeVer =
    puedeEditar ||
    programa.clinica_id === null ||
    (programa.clinica_id === perfil.clinica_id && programa.visibilidad === 'clinica')

  if (!puedeVer) redirect('/dashboard')
  const soloLectura = !puedeEditar
  const migaCurriculo =
    programa.clinica_id === null
      ? { label: 'Currículo', href: perfil.rol === 'superadmin' ? '/dashboard/curriculo' : '/dashboard/curriculo-base' }
      : programa.visibilidad === 'privado'
        ? { label: 'Mis programas', href: '/dashboard/mis-programas' }
        : { label: 'Programas de la clínica', href: '/dashboard/curriculo' }

    const { data: conjuntos } = await supabase
    .from('conjuntos_estimulos_base')
    .select('id, nombre, estimulos_base(id, nombre, descripcion)')
    .eq('programa_base_id', id)
    .order('orden')

  const { data: clasesRft } = await supabase
    .from('clases_rft_base')
    .select('id, nombre, grupo, respuestas_esperadas, estimulos_rft_base(id, etiqueta, nombre, posicion)')
    .eq('programa_base_id', id)
    .order('orden')

  const { data: pasosTarea } = await supabase
    .from('pasos_tarea_base')
    .select('id, nombre, descripcion, orden')
    .eq('programa_base_id', id)
    .order('orden')

  // Requisitos previos y, para editarlos, los programas que se pueden elegir
  const codificador = crearCodificador(estructura)
  const [{ data: requisitosRaw }, { data: candidatosRaw }] = await Promise.all([
    supabase
      .from('requisitos_programa')
      .select('programas_base!requisitos_programa_requisito_id_fkey(id, nombre, dominio_id, orden, clinica_id)')
      .eq('programa_base_id', id),
    soloLectura
      ? Promise.resolve({ data: [] })
      : supabase.from('programas_base').select('id, nombre, dominio_id, orden, clinica_id').eq('activo', true).neq('id', id),
  ])
  const aReferencia = (p: { id: string; nombre: string; dominio_id: string | null; orden: number | null; clinica_id: string | null }) => ({
    id: p.id,
    nombre: p.nombre,
    codigo: codificador.codigo(p),
    ordenGlobal: codificador.ordenGlobal(p),
  })
  const porOrden = (a: { ordenGlobal: number | null; nombre: string }, b: { ordenGlobal: number | null; nombre: string }) =>
    (a.ordenGlobal ?? Infinity) - (b.ordenGlobal ?? Infinity) || a.nombre.localeCompare(b.nombre)
  const requisitos = (requisitosRaw ?? [])
    .map((r) => r.programas_base)
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map(aReferencia)
    .sort(porOrden)
  const candidatos = (candidatosRaw ?? []).map(aReferencia).sort(porOrden)

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8 sm:space-y-8">
      <div>
        <Breadcrumb items={[migaCurriculo, { label: programa.nombre }]} />
        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
          {codigo && <span className="mr-2 font-mono text-indigo-600">{codigo}</span>}
          {programa.nombre}
        </h1>
        {dominio && nivel ? (
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700">
              Nivel {nivel.numero} · {nivel.nombre}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
              Dominio {dominio.codigo} · {dominio.nombre}
            </span>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            {programa.clinica_id === null ? 'Sin dominio asignado' : `Programa complementario · ${programa.area}`}
          </p>
        )}
      </div>

      {!soloLectura && <EditarProgramaForm programa={programa} estructura={estructura} />}

      <RequisitosPrograma programaBaseId={id} requisitos={requisitos} candidatos={candidatos} soloLectura={soloLectura} />

      <Panel className="grid grid-cols-1 gap-4 p-4 text-sm sm:grid-cols-3 sm:p-5">
        <div className="sm:col-span-3">
          <span className="font-semibold text-slate-700">Objetivo</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.objetivo || '—'}</p>
        </div>
        <div className="sm:col-span-3">
          <span className="font-semibold text-slate-700">Materiales</span>
          <p className="text-slate-700 whitespace-pre-wrap">{programa.materiales || '—'}</p>
        </div>
        <div className="sm:col-span-3">
          <span className="font-semibold text-slate-700">Instrucciones para el terapeuta</span>
          <p className="text-slate-700 whitespace-pre-wrap">
            {programa.instrucciones_terapeuta || '—'}
          </p>
        </div>
        <div className="sm:col-span-3">
          <span className="font-semibold text-slate-700">Ayudas posibles</span>
          <p className="text-slate-700 whitespace-pre-wrap">
            {programa.ayudas_posibles || '—'}
          </p>
        </div>
        {programa.video_url && (
          <div className="sm:col-span-3">
            <span className="font-semibold text-slate-700">Vídeo de ejemplo</span>
            <VideoDiferido url={programa.video_url} />
          </div>
        )}
        {programa.tipo === 'rft' && programa.nivel_rft !== 'relacion_relaciones' && (
          <div className="sm:col-span-3">
            <span className="font-semibold text-slate-700">Tipo de relación</span>
            <p className="text-slate-700">{programa.tipo_relacion}</p>
          </div>
        )}
        <div>
          <span className="font-semibold text-slate-700">Ensayos por bloque</span>
          <p className="text-slate-700">{programa.ensayos_por_bloque}</p>
        </div>
        <div>
          <span className="font-semibold text-slate-700">Criterio de dominio</span>
          <p className="text-slate-700">
            {programa.bloques_para_dominio} bloques al {programa.porcentaje_dominio}%
          </p>
        </div>
      </Panel>

            {programa.tipo === 'aba_clasico' && programa.formato_recogida === 'ensayo_discreto' && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Conjuntos de estímulos (plantilla)</h2>
          {!soloLectura && <NuevoConjuntoForm programaBaseId={id} />}

          <div className="space-y-4">
            {conjuntos?.map((c) => (
              <ConjuntoCard key={c.id} conjunto={c} programaBaseId={id} soloLectura={soloLectura} />
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
          {!soloLectura && <NuevoPasoBaseForm programaBaseId={id} />}

          <div className="space-y-2">
            {pasosTarea?.map((p) => (
              <PasoBaseCard key={p.id} paso={p} programaBaseId={id} soloLectura={soloLectura} />
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
              Cada clase tiene 2 miembros (A y B). Escribe directamente en cada estímulo el contenido
              de la relación que quieras enseñar o probar (ej. A1 "frío-calor", B1 "guapo-feo") — el
              sistema no interpreta la relación, así que documenta en las instrucciones del programa
              qué clases combinan entre sí y por qué.
            </p>
          )}
          {!soloLectura && <NuevaClaseRftForm programaBaseId={id} />}

          <div className="space-y-4">
            {clasesRft?.map((c) => (
              <ClaseRftBaseCard key={c.id} clase={c} programaBaseId={id} nivelRft={programa.nivel_rft} soloLectura={soloLectura} conRespuestasEsperadas={usaRespuestasSinSeleccion(programa)} />
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