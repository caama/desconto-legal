'use client'

import { useQueryClient } from '@tanstack/react-query'
import { formatCityName } from '@/utils/format-city-name'
import { StatusToggle } from '../../_components/status-toggle'
import { activeCity } from '../_actions/active-city'
import { inactiveCity } from '../_actions/inactive-city'

type ToggleCityProps = {
  city: {
    id: string
    name: string
    active: boolean
  }
}

export function ToggleCity({ city }: ToggleCityProps) {
  const queryClient = useQueryClient()

  return (
    <StatusToggle
      isActive={city.active}
      name={formatCityName(city.name)}
      entityLabel="cidade"
      inactivateDescription="A cidade sai do site e a página de empresas dela fica indisponível. Nada é apagado: as empresas continuam vinculadas e você pode reativar depois."
      activateDescription="A cidade volta a aparecer no site, com as empresas ativas vinculadas a ela."
      onToggle={() => (city.active ? inactiveCity({ id: city.id }) : activeCity({ id: city.id }))}
      onDone={() => queryClient.invalidateQueries({ queryKey: ['cities'] })}
    />
  )
}
