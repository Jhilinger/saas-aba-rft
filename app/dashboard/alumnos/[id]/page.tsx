import { redirect } from 'next/navigation'

// La ficha del alumno no tiene página de inicio propia: se entra al PEI, que
// es donde se trabaja a diario (el acceso lo comprueba el layout)
export default async function AlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/dashboard/alumnos/${id}/pei`)
}
