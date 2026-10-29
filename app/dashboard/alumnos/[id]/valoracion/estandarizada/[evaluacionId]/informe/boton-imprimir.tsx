'use client'

import { Button } from '../../../../../../../ui'

export default function BotonImprimir() {
  return (
    <Button variant="secondary" onClick={() => window.print()}>
      Imprimir / guardar PDF
    </Button>
  )
}
