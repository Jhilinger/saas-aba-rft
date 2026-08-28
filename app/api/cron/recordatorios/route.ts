import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { enviarEmail } from '@/utils/email'

function primerDiaDelMes(): string {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
}

async function recordatorioTerapeutas() {
  const admin = createAdminClient()
  const ahora = new Date().toISOString()

  const { data: terapeutas } = await admin
    .from('perfiles')
    .select('id, nombre, email')
    .eq('rol', 'terapeuta')
    .eq('activo', true)

  let enviados = 0

  for (const t of terapeutas ?? []) {
    const { count } = await admin
      .from('sesiones_programadas')
      .select('id', { count: 'exact', head: true })
      .eq('terapeuta_id', t.id)
      .eq('estado', 'programada')
      .lt('fecha_hora', ahora)

    if (!count || count === 0) continue

    await enviarEmail({
      to: t.email,
      subject: `Tienes ${count} sesión${count > 1 ? 'es' : ''} pendiente${count > 1 ? 's' : ''} de marcar`,
      html: `
        <p>Hola ${t.nombre},</p>
        <p>Tienes <strong>${count}</strong> sesión${count > 1 ? 'es' : ''} programada${count > 1 ? 's' : ''} en el pasado que todavía no has marcado como asistida, cancelada o no asistida.</p>
        <p>Puedes revisarlas y marcarlas desde tu Agenda en Abacontext.</p>
      `,
    })
    enviados++
  }

  return enviados
}
async function recordatorioFamilias() {
  const admin = createAdminClient()
  const inicioMes = primerDiaDelMes()

  const { data: familias } = await admin
    .from('perfiles')
    .select('id, nombre, email')
    .eq('rol', 'familia')

  let enviados = 0

  for (const f of familias ?? []) {
    const { data: vinculos } = await admin
      .from('alumno_familia')
      .select('alumno_id')
      .eq('perfil_id', f.id)

    const alumnoIds = (vinculos ?? []).map((v) => v.alumno_id)
    if (alumnoIds.length === 0) continue

    const { count } = await admin
      .from('sesiones_programadas')
      .select('id', { count: 'exact', head: true })
      .in('alumno_id', alumnoIds)
      .neq('estado', 'programada')
      .eq('confirmada_familia', false)
      .gte('fecha_hora', inicioMes)

    if (!count || count === 0) continue

    await enviarEmail({
      to: f.email,
      subject: `Tienes ${count} sesión${count > 1 ? 'es' : ''} por confirmar este mes`,
      html: `
        <p>Hola ${f.nombre},</p>
        <p>Antes de que acabe el mes, te pedimos que confirmes <strong>${count}</strong> sesión${count > 1 ? 'es' : ''} realizada${count > 1 ? 's' : ''} desde tu Portal de Familia en Abacontext.</p>
        <p>Solo te llevará un minuto, y nos ayuda a mantener el registro al día.</p>
      `,
    })
    enviados++
  }

  return enviados
}
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const hoy = new Date()
  const diaSemana = hoy.getDay() // 0 = domingo, 1 = lunes...
  const diaMes = hoy.getDate()

  const resultado: Record<string, number> = {}

  if (diaSemana === 1) {
    resultado.terapeutas = await recordatorioTerapeutas()
  }

  if (diaMes === 28) {
    resultado.familias = await recordatorioFamilias()
  }

  return NextResponse.json({ ok: true, ...resultado })
}