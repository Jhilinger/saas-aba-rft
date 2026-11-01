import { aleatorio } from './aleatorio'

// Figuras generadas a partir de una semilla: siempre iguales y sin depender
// de un banco de ilustraciones. Las usan la evaluación y la tableta RFT; las
// de intervención llevan semillas con prefijo «rft-» para no coincidir nunca
// con las de la evaluación. viewBox 100×100.

const TONOS = [12, 35, 55, 95, 160, 195, 220, 265, 300, 335]

function poligono(rnd: () => number, cx: number, cy: number, r: number, lados: number, irregular: number) {
  const puntos = Array.from({ length: lados }, (_, i) => {
    const angulo = (i / lados) * Math.PI * 2 + rnd() * 0.4
    const radio = r * (1 - irregular + rnd() * irregular)
    return [cx + Math.cos(angulo) * radio, cy + Math.sin(angulo) * radio]
  })
  return puntos.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')
}

// familia: 0 polígono, 1 estrella, 2 contorno redondeado (al azar si no se fija);
// tono: índice de TONOS (sin él, el añil de la evaluación)
function Abstracta({ rnd, familia: fija, tono }: { rnd: () => number; familia?: number; tono?: number }) {
  const relleno = tono === undefined ? '#4F46E5' : `hsl(${TONOS[tono % TONOS.length]} 60% 48%)`
  const azar = Math.floor(rnd() * 3)
  const familia = fija === undefined ? azar : fija % 3
  const lados = 5 + Math.floor(rnd() * 5)
  const conHueco = rnd() > 0.5
  let forma: React.ReactNode
  if (familia === 0) forma = <polygon points={poligono(rnd, 50, 50, 42, lados, 0.55)} fill={relleno} />
  else if (familia === 1) {
    // Estrella irregular: radios alternos
    const puntos = Array.from({ length: lados * 2 }, (_, i) => {
      const angulo = (i / (lados * 2)) * Math.PI * 2
      const radio = i % 2 === 0 ? 40 + rnd() * 6 : 14 + rnd() * 12
      return `${(50 + Math.cos(angulo) * radio).toFixed(1)},${(50 + Math.sin(angulo) * radio).toFixed(1)}`
    })
    forma = <polygon points={puntos.join(' ')} fill={relleno} />
  } else {
    // Contorno redondeado con curvas entre puntos medios
    const puntos = Array.from({ length: lados }, (_, i) => {
      const angulo = (i / lados) * Math.PI * 2
      const radio = 22 + rnd() * 22
      return [50 + Math.cos(angulo) * radio, 50 + Math.sin(angulo) * radio]
    })
    const medio = (i: number) => {
      const [x1, y1] = puntos[i]
      const [x2, y2] = puntos[(i + 1) % lados]
      return `${((x1 + x2) / 2).toFixed(1)},${((y1 + y2) / 2).toFixed(1)}`
    }
    const d = `M${medio(lados - 1)} ` + puntos.map(([x, y], i) => `Q${x.toFixed(1)},${y.toFixed(1)} ${medio(i)}`).join(' ') + ' Z'
    forma = <path d={d} fill={relleno} />
  }
  return (
    <>
      {forma}
      {conHueco && <polygon points={poligono(rnd, 50 + (rnd() - 0.5) * 12, 50 + (rnd() - 0.5) * 12, 10, 3 + Math.floor(rnd() * 3), 0.3)} fill="#fff" />}
    </>
  )
}

function Simbolo({ rnd }: { rnd: () => number }) {
  const trazos = 3 + Math.floor(rnd() * 2)
  const p = () => 18 + Math.floor(rnd() * 3) * 32
  const elementos = Array.from({ length: trazos }, (_, i) => {
    const tipo = Math.floor(rnd() * 4)
    const [x1, y1, x2, y2] = [p(), p(), p(), p()]
    if (tipo === 0 || (x1 === x2 && y1 === y2)) {
      const nulo = x1 === x2 && y1 === y2
      return <line key={i} x1={x1} y1={y1} x2={nulo ? (x1 === 50 ? 82 : 100 - x1) : x2} y2={nulo ? 100 - y1 : y2} />
    }
    if (tipo === 1) return <circle key={i} cx={x1} cy={y1} r={8 + rnd() * 6} />
    if (tipo === 2) return <path key={i} d={`M${x1},${y1} Q50,50 ${x2},${y2}`} />
    return <polyline key={i} points={`${x1},${y1} ${(x1 + x2) / 2},${y1 < 50 ? y1 + 20 : y1 - 20} ${x2},${y2}`} />
  })
  return (
    <g fill="none" stroke="#1E293B" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
      {elementos}
    </g>
  )
}

function Criatura({ rnd }: { rnd: () => number }) {
  const tono = TONOS[Math.floor(rnd() * TONOS.length)]
  const color = `hsl(${tono} 65% 55%)`
  const oscuro = `hsl(${tono} 55% 32%)`
  const cuerpo = Math.floor(rnd() * 3)
  const ancho = 24 + rnd() * 12
  const alto = 20 + rnd() * 12
  const ojos = 1 + Math.floor(rnd() * 3)
  const patas = 2 + Math.floor(rnd() * 3) * 2
  const accesorio = Math.floor(rnd() * 4)
  const manchas = rnd() > 0.5
  const arriba = 56 - alto
  return (
    <>
      {Array.from({ length: patas }, (_, i) => {
        const x = 50 - ancho * 0.7 + (i * (ancho * 1.4)) / Math.max(patas - 1, 1)
        return <line key={i} x1={x} y1={56} x2={x + (rnd() - 0.5) * 10} y2={Math.min(56 + alto + 4, 96)} stroke={oscuro} strokeWidth={5} strokeLinecap="round" />
      })}
      {accesorio === 1 && (
        <g stroke={oscuro} strokeWidth={4} fill={oscuro}>
          <line x1={42} y1={arriba + 2} x2={34} y2={arriba - 12} />
          <line x1={58} y1={arriba + 2} x2={66} y2={arriba - 12} />
          <circle cx={34} cy={arriba - 12} r={4} />
          <circle cx={66} cy={arriba - 12} r={4} />
        </g>
      )}
      {accesorio === 2 && (
        <g fill={oscuro}>
          <polygon points={`36,${arriba + 6} 30,${arriba - 12} 46,${arriba + 2}`} />
          <polygon points={`64,${arriba + 6} 70,${arriba - 12} 54,${arriba + 2}`} />
        </g>
      )}
      {accesorio === 3 && <path d={`M40,${arriba + 4} Q50,${arriba - 16} 60,${arriba + 4}`} fill={oscuro} />}
      {cuerpo === 0 && <ellipse cx={50} cy={56} rx={ancho} ry={alto} fill={color} />}
      {cuerpo === 1 && <rect x={50 - ancho} y={arriba} width={ancho * 2} height={alto * 2} rx={12} fill={color} />}
      {cuerpo === 2 && <polygon points={`50,${arriba - 4} ${50 + ancho + 4},${56 + alto} ${50 - ancho - 4},${56 + alto}`} fill={color} />}
      {manchas && (
        <g fill={oscuro} opacity={0.35}>
          <circle cx={50 - ancho * 0.5} cy={64} r={4} />
          <circle cx={50 + ancho * 0.45} cy={66} r={5} />
        </g>
      )}
      {Array.from({ length: ojos }, (_, i) => {
        const x = 50 + (i - (ojos - 1) / 2) * 12
        return (
          <g key={i}>
            <circle cx={x} cy={50} r={6} fill="#fff" />
            <circle cx={x + 1.5} cy={51} r={3} fill="#0F172A" />
          </g>
        )
      })}
      <path d={`M43,${62 + rnd() * 3} Q50,${67 + rnd() * 5} 57,${62 + rnd() * 3}`} stroke="#0F172A" strokeWidth={3} fill="none" strokeLinecap="round" />
    </>
  )
}

function Objeto({ rnd }: { rnd: () => number }) {
  const tono = TONOS[Math.floor(rnd() * TONOS.length)]
  const color = `hsl(${tono} 55% 60%)`
  const oscuro = `hsl(${tono} 45% 32%)`
  const forma = Math.floor(rnd() * 5)
  const decoracion = Math.floor(rnd() * 3)
  const asa = Math.floor(rnd() * 3)
  return (
    <>
      {asa === 1 && <path d="M72,38 C94,38 94,70 72,70" stroke={oscuro} strokeWidth={6} fill="none" />}
      {asa === 2 && <rect x={42} y={6} width={12} height={18} rx={3} fill={oscuro} />}
      {forma === 0 && <rect x={22} y={22} width={52} height={60} rx={10} fill={color} />}
      {forma === 1 && <circle cx={48} cy={54} r={30} fill={color} />}
      {forma === 2 && <polygon points="48,18 82,84 14,84" fill={color} />}
      {forma === 3 && <polygon points="48,16 78,38 70,82 26,82 18,38" fill={color} />}
      {forma === 4 && <path d="M26,30 Q48,10 70,30 L76,82 L20,82 Z" fill={color} />}
      {decoracion === 0 &&
        [0, 1, 2].map((i) => <line key={i} x1={28} y1={46 + i * 10} x2={68} y2={46 + i * 10} stroke={oscuro} strokeWidth={3} />)}
      {decoracion === 1 &&
        [0, 1, 2, 3].map((i) => <circle key={i} cx={34 + (i % 2) * 28} cy={48 + Math.floor(i / 2) * 18} r={5} fill={oscuro} />)}
      {decoracion === 2 && <polyline points="26,60 36,48 46,60 56,48 66,60" stroke={oscuro} strokeWidth={4} fill="none" />}
    </>
  )
}

// Figuras geométricas con nombre (la semilla es el nombre): mismo color y
// tamaño parecido, para que solo cambie la forma
const GEOMETRICAS: Record<string, React.ReactNode> = {
  circulo: <circle cx={50} cy={50} r={38} />,
  cuadrado: <rect x={16} y={16} width={68} height={68} />,
  triangulo: <polygon points="50,10 90,84 10,84" />,
  rectangulo: <rect x={8} y={28} width={84} height={44} />,
  rombo: <polygon points="50,6 88,50 50,94 12,50" />,
  ovalo: <ellipse cx={50} cy={50} rx={42} ry={28} />,
  pentagono: <polygon points="50,8 90,38 75,88 25,88 10,38" />,
  hexagono: <polygon points="28,12 72,12 94,50 72,88 28,88 6,50" />,
  estrella: <polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" />,
  corazon: <path d="M50,88 C14,62 6,40 18,24 C30,10 46,16 50,30 C54,16 70,10 82,24 C94,40 86,62 50,88 Z" />,
  semicirculo: <path d="M8,66 A42,42 0 0 1 92,66 Z" />,
  cruz: <polygon points="36,8 64,8 64,36 92,36 92,64 64,64 64,92 36,92 36,64 8,64 8,36 36,36" />,
}

function Geometrica({ nombre }: { nombre: string }) {
  return <g fill="#4F46E5">{GEOMETRICAS[nombre] ?? GEOMETRICAS.circulo}</g>
}

function Personaje() {
  return (
    <g fill="#64748B">
      <circle cx={50} cy={28} r={14} />
      <rect x={32} y={45} width={36} height={34} rx={14} />
      <rect x={36} y={74} width={10} height={18} rx={4} />
      <rect x={54} y={74} width={10} height={18} rx={4} />
    </g>
  )
}

export default function Figura({
  tipo,
  semilla,
  variante,
  tono,
  className = '',
}: {
  tipo: string
  semilla: string
  variante?: number
  tono?: number
  className?: string
}) {
  const rnd = aleatorio(`${tipo}:${semilla}`)
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {tipo === 'abstracta' && <Abstracta rnd={rnd} familia={variante} tono={tono} />}
      {tipo === 'simbolo' && <Simbolo rnd={rnd} />}
      {tipo === 'criatura' && <Criatura rnd={rnd} />}
      {tipo === 'objeto' && <Objeto rnd={rnd} />}
      {tipo === 'personaje' && <Personaje />}
      {tipo === 'geometrica' && <Geometrica nombre={semilla} />}
    </svg>
  )
}
