import Link from 'next/link'

export const metadata = {
  title: 'Tu día a día como terapeuta — Ayuda Abacontext',
}

export default function DiaADiaTerapeutaPage() {
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8 space-y-6">
      <Link href="/dashboard/ayuda" className="text-sm text-indigo-600 hover:underline">
        ← Volver a Ayuda
      </Link>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Tu día a día como terapeuta</h1>
      <p className="text-sm text-slate-500">
        Un recorrido por todo lo que usarás normalmente: tu agenda, la toma de datos, y el
        seguimiento del progreso.
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">1. Revisa tu agenda</h2>
          <p>
            Entra en <Link href="/dashboard/agenda" className="text-indigo-600 hover:underline">Agenda</Link>{' '}
            para ver tus sesiones de la semana en una cuadrícula, día por día. Si tienes sesiones
            pasadas sin marcar, verás un aviso destacado arriba para no olvidarte.
          </p>
          <p className="mt-2">
            Al hacer clic en una sesión pasada sin marcar, se despliega un menú rápido para marcarla
            como Asistió, Cancelada (por ti o por la familia), o No asistió.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">2. Toma de datos en el PEI</h2>
          <p>
            Entra en la ficha del alumno → <strong>PEI</strong>, y elige el programa con el que vas
            a trabajar en la sesión. Ahí tienes la pantalla de toma de datos de ensayo discreto:
            presenta el estímulo, marca si la respuesta fue correcta, con ayuda, o incorrecta, y
            repite hasta completar el bloque.
          </p>
                    <p className="mt-2">
            Si el programa está en <strong>línea base</strong>, la toma de datos funciona igual pero
            no aplica ayudas ni criterio de dominio — es solo para ver el punto de partida antes de
            intervenir.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">3. Registros de conducta</h2>
          <p>
            Cuando el objetivo no es enseñar una habilidad sino medir una conducta concreta (una
            rabieta, el tiempo en tarea...), usa <strong>Registros de conducta</strong> en vez del
            PEI. Hay 4 formatos, según lo que mejor encaje con la conducta que quieres medir:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li><strong>Tasa</strong>: cuenta cuántas veces ocurre algo, con un cronómetro de fondo.</li>
            <li><strong>Duración</strong>: cronometra cuánto dura la conducta durante la sesión.</li>
            <li><strong>Intervalo</strong>: divide la sesión en trozos de tiempo iguales, y marca si hubo conducta en cada uno.</li>
            <li><strong>ABC</strong>: un registro narrativo de qué pasó antes, durante y después — útil para entender por qué ocurre una conducta.</li>
          </ul>
          <p className="mt-2">
            Al crear un registro nuevo, eliges si el objetivo es que la conducta{' '}
            <strong>aumente</strong> o <strong>disminuya</strong> — esto cambia cómo se interpreta
            el gráfico después.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">4. Evaluación de preferencias (MSWO/MSW)</h2>
          <p>
            En <strong>Preferencias</strong> puedes hacer una evaluación formal de qué le motiva más
            al alumno, con 2 procedimientos: MSWO (el alumno elige entre varios ítems, el elegido se
            retira, y se repite) o MSW (parecido, pero los ítems no se retiran, y se repite un
            número fijo de rondas). Al terminar, puedes añadir automáticamente los 3 más preferidos
            al registro general de preferencias del alumno.
          </p>
                </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">5. Consulta el progreso</h2>
          <p>
            En <strong>Progreso</strong>, dentro de la ficha del alumno, tienes una tabla con todos
            los programas (PEI y Registros de conducta) y su estado actual, con filtros por tipo y
            estado. Desde ahí puedes acceder al gráfico de evolución de cualquier programa concreto,
            con línea base diferenciada de la intervención y la línea de tendencia.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Resumen</h2>
          <p>
            Tu flujo típico de sesión: revisa la Agenda → entra en el alumno → toma datos en PEI o
            Registros de conducta según toque → marca la sesión como asistida al terminar. El
            Progreso y los gráficos se construyen solos a partir de los datos que vayas registrando.
          </p>
        </section>
      </div>
    </div>
  )
}