import Link from 'next/link'
import { login } from './actions'
import InviteHashHandler from './invite-hash-handler'
import AbacontextIcon from '../abacontext-icon'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <InviteHashHandler />
      <form
        action={login}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
                <div className="flex flex-col items-center gap-2 mb-2">
          <AbacontextIcon className="w-12 h-12" />
          <h1 className="text-xl font-bold text-slate-800">abacontext</h1>
        </div>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Contraseña</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500"
        >
          Entrar
        </button>

        <Link
          href="/recuperar-password"
          className="block text-center text-sm text-indigo-600 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </div>
  )
}