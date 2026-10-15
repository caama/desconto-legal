import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { CategoriesContent } from './_components/categories'
import { NewCategory } from './_components/new-category'

export const metadata: Metadata = {
  title: 'Categorias | Desconto Legal',
}

export default async function Categories() {
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
          <h1 className="font-semibold text-primary text-xl tracking-tight">Categorias</h1>
          <p className="max-w-3xl text-muted-foreground text-sm leading-relaxed">
            Categorias usadas para filtrar os convênios na listagem pública.
          </p>
        </div>

        <NewCategory />
      </header>

      <CategoriesContent />
    </div>
  )
}
