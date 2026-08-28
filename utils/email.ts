import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const REMITENTE = 'Abacontext <noreply@mail.abacontext.com>'

export async function enviarEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const { error } = await resend.emails.send({
      from: REMITENTE,
      to,
      subject,
      html,
    })
    if (error) {
      console.error('Error enviando email:', error)
      return { error: error.message }
    }
    return { success: true }
  } catch (err: any) {
    console.error('Error enviando email:', err)
    return { error: err?.message ?? 'Error desconocido' }
  }
}