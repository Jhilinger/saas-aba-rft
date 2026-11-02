import { readFileSync, writeFileSync } from 'node:fs'
const inv = JSON.parse(readFileSync('inventario.json', 'utf8'))
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const banco = new Set(inv.banco)
const nombre = (k) => inv.conceptos[k]?.nombre ?? k.split('/')[1]
const marca = (k) => banco.has(k) ? '<span class="b">banco</span>' : (inv.conceptos[k]?.programas.length > 1 ? `<span class="c">×${inv.conceptos[k].programas.length}</span>` : '')
const cel = (e) => `<td>${e.oido ? `<div class="o">🔊 ${esc(e.oido)}</div>` : ''}<div class="i">📷 ${esc(nombre(e.concepto))} ${marca(e.concepto)}</div><div class="k">${esc(e.concepto)}</div>${e.respuesta ? `<div class="o">🔊 ${esc(e.respuesta)}</div>` : ''}</td>`
let h = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inventario de imágenes</title><style>
body{font-family:-apple-system,system-ui,sans-serif;margin:0;padding:16px;background:#f8fafc;color:#0f172a}h1{font-size:22px;margin:0 0 4px}.sub{color:#475569;font-size:14px;margin:0 0 16px}
section{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:14px;margin-bottom:16px}h2{font-size:16px;margin:0 0 8px}
table{border-collapse:collapse;width:100%;font-size:12px;margin-bottom:6px}td,th{border-top:1px solid #e2e8f0;padding:4px 6px;vertical-align:top;text-align:left}th{background:#f1f5f9;width:70px}th.g1{background:#fef3c7}
.o{color:#7c3aed}.i{font-weight:600}.k{font-size:10px;color:#94a3b8}.b{background:#dcfce7;color:#166534;border-radius:4px;padding:0 4px;font-size:10px}.c{background:#e0e7ff;color:#3730a3;border-radius:4px;padding:0 4px;font-size:10px}
.cats{columns:3;font-size:12px}.cats div{break-inside:avoid;margin-bottom:8px}@media(max-width:700px){.cats{columns:1}}</style></head><body>
<h1>Inventario de imágenes</h1><p class="sub">${Object.keys(inv.conceptos).length} conceptos nuevos + ${inv.banco.length} del banco · ${Object.keys(inv.conceptos).length * 3} imágenes (3 ejemplares) ≈ ${(Object.keys(inv.conceptos).length * 3 * 0.0336).toFixed(0)} € · <span class="b">banco</span> ya existe · <span class="c">×n</span> lo usan n programas · fila amarilla = grupo 1 actual</p>`
h += '<section><h2>Conceptos nuevos por categoría</h2><div class="cats">'
const porCat = {}
for (const [k, c] of Object.entries(inv.conceptos)) (porCat[c.categoria] ??= []).push(c.nombre)
for (const [c, ns] of Object.entries(porCat)) h += `<div><b>${esc(c)}</b> (${ns.length}): ${ns.map(esc).join(', ')}</div>`
h += '</div></section>'
for (const p of inv.programas) {
  h += `<section><h2>${esc(p.programa)} · ${p.grupos.length} grupos</h2><table>`
  p.grupos.forEach((g, i) => { h += `<tr><th class="${i === 0 ? 'g1' : ''}">Grupo ${i + 1}</th>${g.map(cel).join('')}</tr>` })
  h += '</table></section>'
}
h += '<section><h2>Anclas de programas que ya tienen grupos</h2>'
for (const [prog, xs] of Object.entries(inv.anclas)) h += `<p><b>${esc(prog)}</b>: ${xs.map((x) => `${esc(x.nombre)} → <span class="k">${esc(x.concepto)}</span>`).join(' · ')}</p>`
h += '</section></body></html>'
writeFileSync('revision-inventario.html', h)
