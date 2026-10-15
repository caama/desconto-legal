'use client'

import { useQueryClient } from '@tanstack/react-query'
import { StatusToggle } from '../../_components/status-toggle'
import { activeCategory } from '../_actions/active-category'
import { inactiveCategory } from '../_actions/inactive-category'

type ToggleCategoryProps = {
  category: {
    id: string
    name: string
    active: boolean
  }
}

export function ToggleCategory({ category }: ToggleCategoryProps) {
  const queryClient = useQueryClient()

  return (
    <StatusToggle
      isActive={category.active}
      name={category.name}
      entityLabel="categoria"
      inactivateDescription="A categoria sai dos filtros da listagem pública. As empresas dela continuam visíveis e vinculadas, e você pode reativar depois."
      activateDescription="A categoria volta a aparecer nos filtros da listagem pública."
      onToggle={() => (category.active ? inactiveCategory({ id: category.id }) : activeCategory({ id: category.id }))}
      onDone={() => queryClient.invalidateQueries({ queryKey: ['categories'] })}
    />
  )
}
