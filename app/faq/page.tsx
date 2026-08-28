import Link from 'next/link'
import AbacontextIcon from '../abacontext-icon'
import FaqAcordeon from './faq-acordeon'

export const metadata = {
  title: 'Preguntas frecuentes — Abacontext',
}

const PREGUNTAS = [
  {
    pregunta: '¿Qué es Abacontext?',
    respuesta:
      'Una plataforma de gestión clínica para centros que trabajan con Análisis Aplicado de Conducta (ABA), pensada además para acompañarte a incorporar la Teoría del Marco Relacional (RFT) — con toma de datos, agenda, portal de familia, documentos y facturación, todo en un solo sitio.',
  },
  {
    pregunta: '¿Necesito saber RFT para empezar a usarlo?',
    respuesta:
      'No. Puedes usar Abacontext desde el primer día solo con ABA, exactamente como ya trabajas. RFT está ahí para cuando quieras dar el paso, no es obligatorio.',
  },
  {
    pregunta: '¿Cuánto cuesta?',
    respuesta:
      '30€/mes de cuota fija, más 4€/mes por cada alumno activo. Sin permanencia: puedes cancelar cuando quieras desde tu propio panel.',
  },
  {
    pregunta: '¿Puedo migrar mis datos desde Excel u otra herramienta?',
    respuesta:
      'Ahora mismo cada clínica empieza desde cero dentro de Abacontext. No ofrecemos un proceso de migración automática desde otras herramientas todavía.',
  },
  {
    pregunta: '¿Mis datos están seguros?',
    respuesta:
      'Sí. Puedes leer el detalle completo en nuestra Política de Privacidad, incluyendo qué proveedores usamos y cómo protegemos los datos clínicos de los alumnos.',
  },
  {
    pregunta: '¿Hay límite de alumnos o terapeutas?',
    respuesta:
      'No hay límite artificial en el software. El coste simplemente crece con el número de alumnos activos, según el precio indicado arriba.',
  },
  {
    pregunta: '¿Funciona bien en el móvil?',
    respuesta:
      'Sí, toda la plataforma está pensada para usarse tanto en ordenador como desde el móvil — muy útil para tomar datos durante la propia sesión.',
  },
  {
    pregunta: '¿Qué pasa con mis datos si cancelo la suscripción?',
    respuesta:
      'Tus datos se conservan durante un periodo razonable por si decides reactivar el servicio. Puedes leer los detalles exactos en nuestros Términos de Uso y Política de Privacidad.',
  },
  {
    pregunta: '¿Ofrecéis soporte si tengo dudas o problemas?',
    respuesta: 'Sí, puedes escribirnos en cualquier momento a soporte@abacontext.com.',
  },
]

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-8">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Volver
      </Link>

      <div className="mt-4 flex items-center gap-2">
        <AbacontextIcon className="h-7 w-7" />
        <span className="text-lg font-bold text-slate-800">abacontext</span>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-slate-900">Preguntas frecuentes</h1>
      <p className="mt-1 text-sm text-slate-500">
        Si tienes alguna duda que no aparece aquí, escríbenos a{' '}
        <a href="mailto:soporte@abacontext.com" className="text-indigo-600 hover:underline">
          soporte@abacontext.com
        </a>.
      </p>

      <div className="mt-8">
        <FaqAcordeon preguntas={PREGUNTAS} />
      </div>
    </div>
  )
}