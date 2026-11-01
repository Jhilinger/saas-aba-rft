// Graba con Gemini TTS las consignas de los guiones de la evaluación y las
// sube al bucket «biblioteca» (voz/<voz>/<hash>.m4a).
//
//   node --env-file=.env.local scripts/voz/grabar.mjs [--solo N] [--rehacer]
//
// Lee las consignas distintas de evaluacion_items.guion, salta las que ya
// están grabadas en scripts/voz/salida (se puede interrumpir y reanudar) y
// convierte cada WAV a AAC con afconvert (macOS). --rehacer las graba todas
// de nuevo. Al final sube todas las de salida, sobrescribiendo.

import { access, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { VOZ_GRABADA, rutaConsignaGrabada, textoParaVoz } from '../../app/dashboard/consignas-grabadas.ts'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const salida = path.join(aqui, 'salida')
const MODELO = 'gemini-3.8-flash-tts'
const URL_API = 'https://generativelanguage.googleapis.com/v1beta/interactions'
const ESTILO =
  'Clear, warm and calm, at a slightly slow pace, as a therapist speaking to a young child. Neutral Castilian Spanish. ' +
  'Say exactly the text, nothing else.'
const REINTENTOS = 4

const args = process.argv.slice(2)
const solo = args.includes('--solo') ? Number(args[args.indexOf('--solo') + 1]) : Infinity
const rehacer = args.includes('--rehacer')

async function existe(fichero) {
  try {
    await access(fichero)
    return true
  } catch {
    return false
  }
}

async function sintetizar(texto) {
  for (let intento = 1; intento <= REINTENTOS; intento++) {
    const res = await fetch(URL_API, {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODELO,
        store: false,
        input: [{ type: 'user_input', content: [{ type: 'text', text: texto, annotations: [{ type: 'speech_metadata', style: ESTILO }] }] }],
        response_format: { type: 'audio' },
        generation_config: { speech_config: [{ voice: VOZ_GRABADA }] },
      }),
    })
    if (res.ok) {
      const json = await res.json()
      for (const paso of json.steps ?? []) for (const b of paso.content ?? []) if (b.type === 'audio' && b.data) return Buffer.from(b.data, 'base64')
      throw new Error('La respuesta no trae audio')
    }
    const cuerpo = await res.text()
    // El límite diario no se recupera esperando unos segundos
    const reintentable = (res.status === 429 && !cuerpo.includes('per day')) || res.status >= 500
    if (!reintentable || intento === REINTENTOS) throw new Error(`HTTP ${res.status}: ${cuerpo.slice(0, 300)}`)
    await new Promise((r) => setTimeout(r, 2000 * 2 ** intento))
  }
}

async function main() {
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: clave, GEMINI_API_KEY } = process.env
  if (!url || !clave || !GEMINI_API_KEY) {
    console.error('Faltan variables de entorno (ejecuta con --env-file=.env.local).')
    process.exit(1)
  }
  const supabase = createClient(url, clave, { auth: { persistSession: false } })
  const { data: items, error } = await supabase.from('evaluacion_items').select('guion')
  if (error) throw error
  const consignas = [
    ...new Set(
      items.flatMap((i) => (Array.isArray(i.guion) ? i.guion : [])).flatMap((p) => (typeof p?.consigna === 'string' && p.consigna.trim() ? [p.consigna.trim()] : []))
    ),
  ]

  await mkdir(salida, { recursive: true })
  const pendientes = []
  for (const c of consignas) {
    const fichero = path.join(salida, rutaConsignaGrabada(c))
    if (rehacer || !(await existe(fichero))) pendientes.push({ consigna: c, fichero })
  }
  const aGrabar = pendientes.slice(0, solo)
  console.log(`${consignas.length} consignas, ${pendientes.length} sin grabar, se graban ${aGrabar.length}.`)

  const manifiestoFichero = path.join(salida, 'manifiesto.json')
  const manifiesto = (await existe(manifiestoFichero)) ? JSON.parse(await readFile(manifiestoFichero, 'utf8')) : {}
  let fallos = 0
  for (const { consigna, fichero } of aGrabar) {
    try {
      const wav = await sintetizar(textoParaVoz(consigna))
      await mkdir(path.dirname(fichero), { recursive: true })
      const temporal = fichero.replace(/\.m4a$/, '.wav')
      await writeFile(temporal, wav)
      await promisify(execFile)('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', temporal, fichero])
      await rm(temporal)
      manifiesto[rutaConsignaGrabada(consigna)] = { consigna, voz: VOZ_GRABADA, modelo: MODELO, grabada: new Date().toISOString() }
      console.log(`✓ ${consigna}`)
    } catch (e) {
      fallos++
      console.error(`✗ ${consigna}: ${e.message}`)
    }
  }
  await writeFile(manifiestoFichero, JSON.stringify(manifiesto, null, 2))

  let subidas = 0
  for (const c of consignas) {
    const ruta = rutaConsignaGrabada(c)
    const fichero = path.join(salida, ruta)
    if (!(await existe(fichero))) continue
    const { error: errorSubida } = await supabase.storage
      .from('biblioteca')
      .upload(ruta, await readFile(fichero), { contentType: 'audio/mp4', upsert: true, cacheControl: '86400' })
    if (errorSubida) throw new Error(`${ruta}: ${errorSubida.message}`)
    subidas++
  }
  console.log(`Fallos ${fallos}. Subidas ${subidas} de ${consignas.length}.`)
}

main()
