'use client'

import { useQuery } from '@tanstack/react-query'
import { Inbox } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import z from 'zod'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { API } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { FilterUsers } from './filter-users'
import { InactiveUser } from './inactive-user'
import { PaginationUsers } from './pagination-users'
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
  }[]
  total: number
}

export function UserContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = z.coerce.number().parse(searchParams.get('page') || '1')
  const name = searchParams.get('name') || ''
  const email = searchParams.get('email') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, name, email],
    queryFn: async () => {
      const response = await API.get<UserProps>('/api/users/get-all-users', {
        params: {
          page,
          name,
          email,
        },
      })

      return response.data
    },
    staleTime: Number.POSITIVE_INFINITY, // Significa que o cache nunca vai expirar
  })

  function handlePageChange(page: number) {
    // Cria uma instância de URLSearchParams baseada nos parâmetros de busca atuais
    const params = new URLSearchParams(searchParams.toString())

    // Atualiza o parâmetro "page" com o novo índice da página
    params.set('page', page.toString())

    // Atualiza a URL no navegador sem recarregar a página
    router.push(`?${params.toString()}`)
  }

  return (
    <main className="mx-auto">
      <Card className="mx-auto mt-8">
        <CardHeader>
          <CardTitle className="font-bold text-lg md:text-2xl">Gerenciamento de Usuários</CardTitle>
          <CardDescription className="text-sm md:text-base">Gerencie todos os usuários do sistema</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 overflow-x-auto">
          <FilterUsers />

          <div className="rounded-sm border p-2">
            <Table className="w-full overflow-x-auto text-sm">
              {data?.users.length === 0 && (
                <TableCaption className="pb-4 text-muted-foreground text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Inbox className="size-5" />
                    <p className="text-center text-sm">Nenhum usuário cadastrado</p>
                  </div>
                </TableCaption>
              )}

              <TableHeader>
                <TableRow>
                  <TableHead className="w-64">Usuário</TableHead>
                  <TableHead className="hidden md:table-cell">E-mail</TableHead>
                  <TableHead className="hidden md:table-cell">Função</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <UsersTableSkeleton />}

                {data &&
                  data.users.map(user => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      {/* User Info */}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10">
                            <Image
                              src={user.image || ''}
                              alt={user.name || ''}
                              fill
                              className="rounded-full object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-muted-foreground text-xs md:hidden">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="hidden text-foreground md:table-cell">{user.email}</TableCell>

                      {/* Role */}
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          className={cn('bg-primary/10 text-primary hover:bg-primary/20', {
                            'bg-destructive/10 text-destructive hover:bg-destructive/20': user.role === 'ADMIN',
                          })}
                        >
                          {user.role === 'ADMIN' ? 'Administrador' : 'Membro'}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <Badge
                          className={
                            user.inactive
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-green-500/10 text-emerald-600 dark:text-emerald-400'
                          }
                        >
                          {user.inactive ? 'Inativo' : 'Ativo'}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Componente de edição */}
                          <UpdateUsers user={user} />

                          {/* Componente de inativação */}
                          <InactiveUser user={user} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Componente de paginação */}
          <PaginationUsers page={page} onPageChange={handlePageChange} totalCount={data?.total ?? 0} />
        </CardContent>
      </Card>
    </main>
  )
}
