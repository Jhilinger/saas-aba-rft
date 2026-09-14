import Link from 'next/link'
import { login } from './actions'
import InviteHashHandler from './invite-hash-handler'
import AbacontextIcon from '../abacontext-icon'
import PasswordInput from './password-input'
import { Button } from '../ui'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-amber-100/80 blur-3xl" />
      <InviteHashHandler />
      <form
        action={login}
        className="relative w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(30,41,59,0.10)] sm:p-8"
      >
                <Link href="/" className="flex flex-col items-center gap-2 mb-2">
          <AbacontextIcon className="w-12 h-12" />
          <h1 className="text-xl font-bold tracking-tight text-slate-800">abacontext</h1>
        </Link>

        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-600">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 transition-colors focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-600">Contraseña</label>
          <PasswordInput />
        </div>

        <Button
          type="submit"
          className="w-full py-2.5"
        >
          Entrar
        </Button>

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