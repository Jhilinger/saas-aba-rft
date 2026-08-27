export function descargarCSV(nombreArchivo: string, filas: Record<string, any>[]) {
  if (filas.length === 0) return

  const cabeceras = Object.keys(filas[0])

  const escapar = (valor: any) => {
    const str = String(valor ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const lineas = [
    cabeceras.join(','),
    ...filas.map((fila) => cabeceras.map((c) => escapar(fila[c])).join(',')),
  ]

  // El \uFEFF (BOM) al principio es para que Excel abra bien los acentos,
  // que si no se ven mal en Windows
  const csv = '\uFEFF' + lineas.join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  a.click()
  URL.revokeObjectURL(url)
}