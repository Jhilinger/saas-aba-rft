import Link from 'next/link'

export default function RegistroCompletadoPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md text-center space-y-4 rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-4xl">✅</p>
        <h1 className="text-xl font-bold text-slate-800">¡Pago completado!</h1>
        <p className="text-slate-600">
          Te hemos enviado un email de invitación para que crees tu contraseña y accedas a tu
          clínica. Revisa tu bandeja de entrada (y la carpeta de spam, por si acaso).
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    </div>
  )
}