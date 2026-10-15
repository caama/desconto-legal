import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { UserContent } from './_components/users'

export const metadata: Metadata = {
  title: 'Usuários | Desconto Legal',
}

export default async function User() {
  const session = await auth()

  if (!session?.user || session?.user.role !== 'ADMIN') {
    redirect('/private/sign-in')
  }

  if (session.user && session.user.inactive) {
    redirect('/private/sign-in/blocked')
  }

  return (
    <div className="mt-2 space-y-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-semibold text-primary text-xl tracking-tight">Usuários</h1>
        <p className="max-w-3xl text-muted-foreground text-sm leading-relaxed">
          Gerencie quem acessa o painel e o papel de cada um. Novos usuários entram com a conta Google e aparecem aqui
          automaticamente.
        </p>
      </header>

      <UserContent />
    </div>
  )
}
