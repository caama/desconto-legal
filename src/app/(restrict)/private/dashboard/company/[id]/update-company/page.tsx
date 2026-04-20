import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getAllCategories } from '../../../new-company/_dal/get-all-categories'
import { getAllCities } from '../../../new-company/_dal/get-all-cities'
import { getCompanyById } from '../../_dal/get-company-by-slug'
import { UpdateCompanyContent } from './_components/update-company'

type UpdateCompanyPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function UpdateCompany({ params }: UpdateCompanyPageProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user) {
    redirect('/private/sign-in')
  }

  if (session.user && session.user.inactive) {
    redirect('/private/sign-in/blocked')
  }

  const company = await getCompanyById({ id })

  if (!company) {
    notFound()
  }

  const cities = await getAllCities()
  const categories = await getAllCategories()

  return <UpdateCompanyContent company={company} cities={cities} categories={categories} />
}
