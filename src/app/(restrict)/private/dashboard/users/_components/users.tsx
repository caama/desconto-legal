'use client'

import { useQuery } from '@tanstack/react-query'
import { format, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ShieldCheck, TriangleAlert, UserRound } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { API } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { getAvatarColor, getInitials } from '@/utils/avatar'
import { StatusTabs, useStatusParam } from '../../_components/status-tabs'
import { PAGE_SIZE_OPTIONS, TablePagination } from '../../_components/table-pagination'
import { TableSearch, useTableParams } from '../../_components/table-search'
import { InactiveUser } from './inactive-user'
import { UpdateUsers } from './update-users'
import { UsersTableSkeleton } from './users-skeleton'

interface UserProps {
  users: {
    id: string
    name: string | null
    email: string
    image: string | null
    inactive: Date | null
    role: 'ADMIN' | 'MEMBER'
    createdAt: string
  }[]
  total: number
  activeCount: number
  inactiveCount: number
}

function formatCreatedAt(value: string) {
  const date = parseISO(value)
  return isValid(date) ? format(date, 'dd MMM. yyyy', { locale: ptBR }) : '—'
}

export function UserContent() {
  const { data: session } = useSession()
  const { status, setStatus } = useStatusParam()

  const { page, perPage, search, setPage, setPerPage } = useTableParams(PAGE_SIZE_OPTIONS)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', status, page, perPage, search],
    queryFn: async () => {
      const response = await API.get<UserProps>('/api/users/get-all-users', {
        params: { page, perPage, search, status },
      })

      return response.data
    },
    staleTime: Number.POSITIVE_INFINITY,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatusTabs
          status={status}
          onChange={setStatus}
          activeCount={data?.activeCount}
          inactiveCount={data?.inactiveCount}
          labels={{ active: 'Ativos', inactive: 'Inativos' }}
          ariaLabel="Situação dos usuários"
        />

        <TableSearch placeholder="Busque por nome ou e-mail" ariaLabel="Buscar usuário por nome ou e-mail" />
      </div>

      {isError ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/6 px-4 py-3.5 text-destructive"
        >
          <TriangleAlert className="mt-px size-4 shrink-0" />
          <span className="text-sm leading-snug">
            Não foi possível carregar os usuários agora. Recarregue a página e, se continuar assim, verifique sua conexão.
          </span>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Usuário</TableHead>
                  <TableHead className="hidden sm:table-cell">Papel</TableHead>
                  <TableHead className="hidden lg:table-cell">Data da criação</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <UsersTableSkeleton />}

                {data && data.users.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-sm">
                      {search
                        ? 'Nenhum usuário encontrado para essa busca.'
                        : status === 'active'
                          ? 'Nenhum usuário ativo. Os usuários aparecem aqui depois do primeiro acesso com Google.'
                          : 'Nenhum usuário inativo.'}
                    </TableCell>
                  </TableRow>
                )}

                {data?.users.map(user => {
                  const isAdmin = user.role === 'ADMIN'
                  const isCurrentUser = session?.user.id === user.id

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image}
                              referrerPolicy="no-referrer"
                              alt=""
                              width={40}
                              height={40}
                              className="size-10 shrink-0 rounded-full object-cover ring-1 ring-border"
                            />
                          ) : (
                            <span
                              className={cn(
                                'flex size-10 shrink-0 items-center justify-center rounded-full font-medium text-sm',
                                getAvatarColor(user.id)
                              )}
                              aria-hidden="true"
                            >
                              {getInitials(user.name, user.email)}
                            </span>
                          )}

                          <div className="flex min-w-0 max-w-52 flex-col gap-0.5 sm:max-w-72">
                            <span className="flex items-center gap-1.5">
                              <span className="truncate font-medium">{user.name || 'Sem nome'}</span>
                              {isCurrentUser && (
                                <span className="shrink-0 rounded-full bg-muted px-1.5 font-medium text-[10px] text-muted-foreground leading-4">
                                  Você
                                </span>
                              )}
                            </span>
                            <span className="truncate text-muted-foreground text-xs">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 font-medium text-violet-700 text-xs">
                            <ShieldCheck className="size-3.5" aria-hidden="true" />
                            Administrador
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                            <UserRound className="size-3.5" aria-hidden="true" />
                            Membro
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
                        {formatCreatedAt(user.createdAt)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <UpdateUsers user={user} />
                          <InactiveUser user={user} isCurrentUser={isCurrentUser} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            itemLabel={['usuário', 'usuários']}
            page={page}
            perPage={perPage}
            totalCount={data?.total ?? 0}
            isLoading={isLoading}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}
    </div>
  )
}
