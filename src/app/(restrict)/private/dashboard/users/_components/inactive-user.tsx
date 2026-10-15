'use client'

import { useQueryClient } from '@tanstack/react-query'
import { StatusToggle } from '../../_components/status-toggle'
import { activeUser } from '../_actions/active-user'
import { inactiveUser } from '../_actions/inactive-user'

type InactiveUserProps = {
  user: {
    id: string
    name: string | null
    email: string
    inactive: Date | null
  }
  isCurrentUser: boolean
}

export function InactiveUser({ user, isCurrentUser }: InactiveUserProps) {
  const queryClient = useQueryClient()
  const isActive = !user.inactive

  return (
    <StatusToggle
      isActive={isActive}
      name={user.name || user.email}
      entityLabel="usuário"
      inactivateDescription="Ele deixa de conseguir entrar no painel a partir do próximo acesso. Nada é apagado: você pode reativar depois pela aba Inativos."
      activateDescription="Ele volta a conseguir entrar no painel com a conta Google. O papel e os dados continuam como estavam."
      // O servidor também recusa; aqui o botão fica desabilitado e o tooltip explica o motivo
      blockedReason={isCurrentUser ? 'Você não pode inativar o seu próprio cadastro' : undefined}
      onToggle={() => (isActive ? inactiveUser({ id: user.id }) : activeUser({ id: user.id }))}
      onDone={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
    />
  )
}
