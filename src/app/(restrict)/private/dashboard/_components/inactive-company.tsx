'use client'

import { useQueryClient } from '@tanstack/react-query'
import { activeCompany } from '../_actions/active-company'
import { inactiveCompany } from '../_actions/inactive-company'
import { StatusToggle } from './status-toggle'

type InactiveCompanyProps = {
  company: {
    id: string
    name: string
    active: boolean
  }
}

export function InactiveCompany({ company }: InactiveCompanyProps) {
  const queryClient = useQueryClient()

  return (
    <StatusToggle
      isActive={company.active}
      name={company.name}
      entityLabel="empresa"
      inactivateDescription="A empresa sai da listagem pública e a página dela fica indisponível. Nada é apagado: você pode reativar depois pela aba Inativas."
      activateDescription="A empresa volta a aparecer na listagem pública da cidade, com a página e os benefícios."
      onToggle={() => (company.active ? inactiveCompany({ id: company.id }) : activeCompany({ id: company.id }))}
      onDone={() => queryClient.invalidateQueries({ queryKey: ['companies'] })}
    />
  )
}
