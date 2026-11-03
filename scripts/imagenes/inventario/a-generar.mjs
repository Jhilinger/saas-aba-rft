// Convierte el inventario (inventario.json) al formato de generar.mjs: un
// «programa» por categoría y, por concepto, tres ejemplares que varían lo que
// el niño tiene que generalizar (otro modelo, otra persona, otra escena).
//   node scripts/imagenes/inventario/a-generar.mjs
// Escribe generar.json (todo) y prueba.json (el primer concepto de cada
// categoría, para revisar el estilo antes de la tanda grande).

import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const aqui = path.dirname(fileURLToPath(import.meta.url))
const inv = JSON.parse(readFileSync(path.join(aqui, 'inventario.json'), 'utf8'))

const PERSONAS = ['a girl about 7 years old', 'a man about 35 years old', 'a boy about 10 years old with a different skin tone']
// Las profesiones, siempre con adultos
const ADULTOS = ['a woman about 30 years old', 'a man about 45 years old', 'a man about 55 years old with a different skin tone']
const CON_PERSONAS = new Set(['profesiones', 'acciones', 'deportes', 'sensaciones', 'emociones'])
const ESCENAS = new Set(['lugares', 'dependencias de la casa', 'estaciones', 'tiempo atmosférico', 'momentos', 'transportes', 'universo', 'escenas'])

function ejemplares(categoria, en) {
  // Características: la descripción trae ejemplos entre paréntesis, uno por ejemplar
  const ejemplos = en.match(/\(([^)]+)\)/)?.[1].replace(/…$/, '').split(/,\s*/)
  if (ejemplos?.length >= 2) {
    const base = en.replace(/\s*\(.*\)/, '')
    return [0, 1, 2].map((i) => `${ejemplos[i % ejemplos.length]}, clearly ${base.replace(/^something /, '')}`)
  }
  if (categoria === 'emociones') return PERSONAS.map((p) => en.replace('a person', p))
  if (CON_PERSONAS.has(categoria)) {
    const personas = categoria === 'profesiones' ? ADULTOS : PERSONAS
    return personas.map((p) => (/^(a child|a person|an adult)\b/.test(en) ? en.replace(/^(a child|a person|an adult)/, p) : `${en} (the person shown is ${p})`))
  }
  if (categoria === 'partes del cuerpo') return [en, `${en.replace("a child's", "an adult's").replace('a child', 'an adult')}`, `${en}, a child with a different skin tone`]
  if (categoria === 'cuentos') return [en, `${en}, a different scene from the same tale`, `${en}, another key scene from the same tale`]
  if (categoria === 'señales') return [en, `${en}, a different person or a different version`, `${en}, another different version`]
  if (ESCENAS.has(categoria)) return [en, `${en}, a different place and composition`, `${en}, another different example`]
  return [en, `${en}, a different model, color or variety from the first one`, `a single ${en.replace(/^an? /, '')}, different-looking again, seen from a different angle`]
}

// Ejemplares rehechos tras revisar la primera tanda: el genérico salía ambiguo
// (árboles como bonsáis, vasos llenos que parecían vacíos, lluvia y nublado
// indistinguibles…)
const ARBOL = (en) => [`${en}, a full-size tree`, `${en}, a different full-size specimen`, `${en}, another full-size specimen of a different shape`]
const AJUSTES = {
  Pino: ARBOL('a pine tree'),
  Palmera: ARBOL('a tall palm tree with a long trunk'),
  Roble: ARBOL('an oak tree'),
  Olivo: ARBOL('an olive tree'),
  Sauce: ARBOL('a weeping willow tree'),
  Banco: ['a wooden park bench with a backrest', 'a park bench with a backrest, a different model and color', 'a long wooden bench with a backrest and armrests, seen from a different angle'],
  Lleno: ['a glass filled to the brim with orange juice, clearly full', 'a basket full to the top with apples, clearly full', 'a glass filled to the brim with milk, clearly full'],
  Apagado: ['an intact table lamp that is switched off, the bulb dark, in perfect condition', 'a TV that is off, black screen, clearly switched off', 'an intact floor lamp that is switched off, the bulb dark, in perfect condition'],
  Pelota: ['a ball', 'a ball, a different model, color or variety from the first one', 'a plain rubber play ball for children, a third different color'],
  Lluvioso: ['heavy rain falling on a city street, rain streaks clearly visible, big puddles with splashes, wet shiny pavement', 'heavy rain falling on a country road, rain streaks clearly visible, puddles with splashes', 'raindrops pouring down a window with a rainy garden behind, rain clearly visible'],
  Nublado: ['a dry green meadow under a completely overcast sky of thick grey clouds, no rain', 'a calm town square under a heavy grey cloudy sky, dry ground, no rain', 'a beach under a sky completely covered by big grey clouds, no rain'],
  Niebla: ['a foggy day landscape', 'a street with lampposts and trees fading into thick white fog, only the nearest ones visible', 'a foggy day landscape, another different example'],
  Granizo: ['close-up of many white hailstones, round balls of ice, piled on a green lawn', 'round white hailstones bouncing on a car bonnet, close-up', 'a hand-sized pile of round white hailstones on a wooden table outside, close-up, the ice balls clearly visible'],
  'El sol brilla': ['a bright round sun high in a clear deep-blue sky above a green meadow, the sun disc clearly visible', 'a bright sun shining over a calm blue sea on a cloudless day, the sun disc clearly visible', 'a bright sun shining over a small village with red roofs on a cloudless summer day, the sun disc clearly visible'],
  Blancanieves: [
    "a children's illustration of a fairy-tale princess with black hair and a red apple in the forest, with seven little bearded miners, no text",
    "a children's illustration of seven little bearded miners with lanterns walking home through the forest, a black-haired fairy-tale princess waving at the door of their small cottage, no text",
    "a children's illustration of a black-haired fairy-tale princess in a tiny cottage with seven little beds, friendly forest animals around her, no text",
  ],
  // Forma clásica de cinco puntas, la que el niño reconoce como «estrella»
  'universo/Estrella': [
    'a glowing golden five-pointed star, the classic star shape, shining against a dark blue night sky',
    'a large bright silver-white five-pointed star, the classic star shape, filling most of the picture, glowing in a dark night sky',
    'a shining yellow five-pointed star, the classic star shape, with a soft glow, in a deep purple night sky with a few tiny distant stars',
  ],
  // Mismo nombre en otra categoría: se distingue con la categoría delante
  'objetos/Bicicleta': ['a blue city bicycle with a front basket, side view', 'a bicycle, a different model, color or variety from the first one', 'a single bicycle, different-looking again, seen from a different angle'],
}

const porCategoria = new Map()
for (const [, c] of Object.entries(inv.conceptos)) {
  const ajuste = AJUSTES[`${c.categoria}/${c.nombre}`] ?? AJUSTES[c.nombre]
  porCategoria.set(c.categoria, [...(porCategoria.get(c.categoria) ?? []), { concepto: c.nombre, ejemplares: ajuste ?? ejemplares(c.categoria, c.en) }])
}
const programas = [...porCategoria].map(([categoria, conceptos]) => ({ programa: `Inventario · ${categoria}`, categoria, grupos: [conceptos] }))
writeFileSync(path.join(aqui, 'generar.json'), JSON.stringify({ descripcion: 'Banco de imágenes de los programas RFT (inventario 2026-11)', programas }, null, 1))
writeFileSync(path.join(aqui, 'prueba.json'), JSON.stringify({ descripcion: 'Prueba de estilo: primer concepto de cada categoría', programas: programas.map((p) => ({ ...p, grupos: [p.grupos[0].slice(0, 1)] })) }, null, 1))
console.log(`${programas.length} categorías, ${programas.reduce((a, p) => a + p.grupos[0].length, 0)} conceptos`)
