'use client'

import { useEffect } from 'react'
import { registerCompanyView } from '@/app/(public)/_actions/register-company-view'

// Registra a visita no navegador: robôs de prévia de link não executam JS e o prefetch do Next não monta a página.
// Uma vez por empresa por sessão, para recarregar a página não inflar o número.
export function TrackCompanyView({ companyId }: { companyId: string }) {
  useEffect(() => {
    const key = `dl:view:${companyId}`

    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // Sem sessionStorage (navegação privada restrita): conta a cada abertura
    }

    registerCompanyView({ companyId }).catch(() => {})
  }, [companyId])

  return null
}
