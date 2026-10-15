import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { Companies } from './_components/companies'

export default async function Dashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect('/private/sign-in')
  }

  if (session.user && session.user.inactive) {
    redirect('/private/sign-in/blocked')
  }

  return (
    <div className="mt-2 space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-primary text-xl tracking-tight">Empresas</h1>
          <p className="max-w-3xl text-muted-foreground text-sm leading-relaxed">
            Empresas conveniadas exibidas na listagem pública. Inativar uma empresa a tira do site sem apagar os dados.
          </p>
        </div>

        <Button asChild className="w-full sm:w-fit">
          <Link href="/private/dashboard/new-company">
            <Plus className="size-4" />
            Nova empresa
          </Link>
        </Button>
      </header>

      <Companies />
    </div>
  )
}
