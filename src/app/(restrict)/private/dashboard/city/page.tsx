import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { CitiesContent } from './_components/cities'
import { NewCity } from './_components/new-city'

export const metadata: Metadata = {
  title: 'Cidades | Desconto Legal',
}

export default async function City() {
  const session = await auth()

  if (!session?.user || session?.user.role !== 'ADMIN') {
    redirect('/private/sign-in')
  }

  if (session.user && session.user.inactive) {
    redirect('/private/sign-in/blocked')
  }

  return (
    <div className="mt-2 space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-primary text-xl tracking-tight">Cidades</h1>
          <p className="max-w-3xl text-muted-foreground text-sm leading-relaxed">
            Cidades onde há convênios. Inativar uma cidade a tira do site sem apagar as empresas vinculadas.
          </p>
        </div>

        <NewCity />
      </header>

      <CitiesContent />
    </div>
  )
}
