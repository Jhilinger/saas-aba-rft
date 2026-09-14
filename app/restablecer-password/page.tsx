import { actualizarPassword } from './actions'

export default async function RestablecerPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-amber-100/80 blur-3xl" />
      <form
        action={actualizarPassword}
        className="relative w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(30,41,59,0.10)] sm:p-8"
      >
        <h1 className="text-xl font-bold text-slate-800">Establece tu nueva contraseña</h1>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Nueva contraseña</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Confirmar contraseña</label>
          <input
            name="confirmar"
            type="password"
            required
            minLength={8}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500"
        >
          Guardar contraseña
        </button>
      </form>
    </div>
  )
}