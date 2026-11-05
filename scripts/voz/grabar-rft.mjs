// Graba con Google Cloud Text-to-Speech (voz Chirp 3 HD) las claves
// relacionales de los programas RFT del currículo global, tal como las dirá
// la tableta (consignaPara con la muestra de cada clase), y genera una página
// de revisión para escucharlas.
//
//   node --env-file=.env.local scripts/voz/grabar-rft.mjs [--solo N] [--rehacer] [--subir]
//
// Salta las ya grabadas en scripts/voz/salida/ (se puede interrumpir y
// reanudar). --subir las sube al bucket «biblioteca» (solo tras revisarlas).

import { access, mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { VOZ_RFT, rutaFraseRft, textoParaVoz } from '../../app/dashboard/consignas-grabadas.ts'
import { consignaPara, leerConsignasClase, leerConsignasPrograma } from '../../app/dashboard/consignas-rft.ts'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const salida = path.join(aqui, 'salida')
const VELOCIDAD = 0.9
const CONCURRENCIA = 2
const REINTENTOS = 4

const args = process.argv.slice(2)
const solo = args.includes('--solo') ? Number(args[args.indexOf('--solo') + 1]) : Infinity
const rehacer = args.includes('--rehacer')
const subir = args.includes('--subir')

const existe = (f) => access(f).then(() => true, () => false)
const textoOido = (nombre) => nombre.trim().replace(/^["“«]|["”»]$/g, '')
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;')

async function sintetizar(texto) {
  for (let intento = 1; intento <= REINTENTOS; intento++) {
    const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: texto },
        voice: { languageCode: 'es-ES', name: VOZ_RFT },
        audioConfig: { audioEncoding: 'MP3', speakingRate: VELOCIDAD },
      }),
    })
    if (res.ok) return Buffer.from((await res.json()).audioContent, 'base64')
    const cuerpo = await res.text()
    if ((res.status !== 429 && res.status < 500) || intento === REINTENTOS) throw new Error(`HTTP ${res.status}: ${cuerpo.slice(0, 300)}`)
    await new Promise((r) => setTimeout(r, 2000 * 2 ** intento))
  }
}

async function main() {
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: clave, GOOGLE_TTS_API_KEY } = process.env
  if (!url || !clave || !GOOGLE_TTS_API_KEY) {
    console.error('Faltan variables de entorno (ejecuta con --env-file=.env.local).')
    process.exit(1)
  }
  const supabase = createClient(url, clave, { auth: { persistSession: false } })
  const { data: programas, error } = await supabase
    .from('programas_base')
    .select('nombre, orden, consignas, clases_rft_base(grupo, nombre, consignas, estimulos_rft_base(nombre, posicion))')
    .is('clinica_id', null)
    .not('consignas', 'is', null)
    .order('orden')
  if (error) throw error

  // Frase → dónde se usa (para la página de revisión)
  const frases = new Map()
  for (const p of programas) {
    const delPrograma = leerConsignasPrograma(p.consignas)
    for (const c of p.clases_rft_base) {
      const deClase = leerConsignasClase(c.consignas)
      const claves = [...new Set([...Object.keys(delPrograma.pasos), ...Object.keys(deClase)])]
      const usos = [
        ...claves.map((k) => ({ fase: k.split(':')[0], rel: k.split(':')[1] })),
        ...Object.keys(delPrograma.alternativas).map((rel) => ({ fase: 'generalizacion', rel })),
      ]
      for (const { fase, rel } of usos) {
        const [origen, destino] = rel.split('→')
        const muestra = c.estimulos_rft_base.find((e) => e.posicion === origen)
        if (!muestra) continue
        const texto = consignaPara(delPrograma, deClase, fase, origen, destino, textoOido(muestra.nombre))
        if (!texto) continue
        const uso = `${p.nombre} · ${fase === 'generalizacion' ? 'sonda de generalización' : fase} ${rel}`
        frases.set(texto, [...(frases.get(texto) ?? []), uso])
      }
    }
  }

  const lista = [...frases.keys()]
  const pendientes = []
  for (const texto of lista) {
    const fichero = path.join(salida, rutaFraseRft(texto))
    if (rehacer || !(await existe(fichero))) pendientes.push({ texto, fichero })
  }
  const aGrabar = pendientes.slice(0, solo)
  console.log(`${lista.length} frases, ${pendientes.length} sin grabar, se graban ${aGrabar.length}.`)

  let fallos = 0
  const cola = [...aGrabar]
  await Promise.all(
    Array.from({ length: CONCURRENCIA }, async () => {
      for (let t = cola.shift(); t; t = cola.shift()) {
        try {
          const audio = await sintetizar(textoParaVoz(t.texto))
          await mkdir(path.dirname(t.fichero), { recursive: true })
          await writeFile(t.fichero, audio)
        } catch (e) {
          fallos++
          console.error(`✗ ${t.texto}: ${e.message}`)
        }
      }
    })
  )

  // Página de revisión, agrupada por programa
  const porPrograma = new Map()
  for (const [texto, usos] of frases) {
    const programa = usos[0].split(' · ')[0]
    porPrograma.set(programa, [...(porPrograma.get(programa) ?? []), { texto, usos }])
  }
  let html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Claves relacionales grabadas</title><style>
body{font:14px/1.4 system-ui;margin:24px;color:#1e293b}h2{color:#0f4c5c;margin-top:28px}table{border-collapse:collapse;width:100%}
td{border-bottom:1px solid #e2e8f0;padding:4px 8px;vertical-align:middle}audio{height:30px;width:200px}.s{color:#64748b;font-size:12px}</style></head><body>
<h1>Claves relacionales grabadas (${esc(VOZ_RFT)}, velocidad ${VELOCIDAD})</h1><p>${lista.length} frases. Apunta las que suenen mal (programa y frase).</p>`
  for (const [programa, filas] of porPrograma) {
    html += `<h2>${esc(programa)}</h2><table>`
    for (const { texto, usos } of filas) {
      html += `<tr><td><audio controls preload="none" src="${esc(rutaFraseRft(texto))}"></audio></td><td><b>${esc(texto)}</b><div class="s">${esc([...new Set(usos.map((u) => u.split(' · ')[1]))].join(' · '))}</div></td></tr>`
    }
    html += '</table>'
  }
  await writeFile(path.join(salida, 'revision-rft.html'), html + '</body></html>')

  if (subir) {
    let subidas = 0
    for (const texto of lista) {
      const ruta = rutaFraseRft(texto)
      const fichero = path.join(salida, ruta)
      if (!(await existe(fichero))) continue
      const { error: errorSubida } = await supabase.storage
        .from('biblioteca')
        .upload(ruta, await readFile(fichero), { contentType: 'audio/mpeg', upsert: true, cacheControl: '86400' })
      if (errorSubida) throw new Error(`${ruta}: ${errorSubida.message}`)
      subidas++
    }
    console.log(`Subidas ${subidas}.`)
  }
  console.log(`Fallos ${fallos}. Revisión: ${path.join(salida, 'revision-rft.html')}`)
}

main()
