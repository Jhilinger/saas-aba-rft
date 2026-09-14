import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0.2,
  // No capturamos datos de sesión de pacientes/alumnos en los eventos:
  // Sentry solo debe ver stack traces y metadata técnica, nunca payloads.
  sendDefaultPii: false,
})
