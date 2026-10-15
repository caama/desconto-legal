'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Category, City } from '@/generated/prisma/client'
import { CompanyForm, type CompanyFormValues } from '../../company/_components/company-form'
import { CompanyLogoField } from '../../company/_components/company-logo-field'
import { createCompany } from '../_actions/create-company'
import { useNewCompanyForm } from './new-company-form'

interface NewCompanyProps {
  cities: City[]
  categories: Category[]
}

export function NewCompany({ cities, categories }: NewCompanyProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined)
  const [publicImageId, setPublicImageId] = useState<string | undefined>(undefined)

  const form = useNewCompanyForm({
    name: '',
    document: '',
    responsible: '',
    slug: '',
    description: '',
    logoUrl,
    publicImageId,
    phone: '',
    whatsapp: '',
    email: '',
    instagram: '',
    address: '',
    neighborhood: '',
    zipCode: '',
    discount: '',
    contractStart: null,
    contractEnd: null,
    featured: false,
    benefits: '',
    cityId: '',
    categoryId: '',
  })

  async function handleNewCompany(data: CompanyFormValues) {
    if (!logoUrl || !publicImageId) {
      toast.error('Adicione a logo da empresa antes de criar')
      return
    }

    const response = await createCompany({
      ...data,
      logoUrl,
      publicImageId,
    })

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success(response.message)

    await queryClient.invalidateQueries({ queryKey: ['companies'] })

    router.push('/private/dashboard')
  }

  return (
    <CompanyForm
      mode="create"
      form={form}
      cities={cities}
      categories={categories}
      title="Nova empresa conveniada"
      description="Preencha os dados do convênio e envie a logo da empresa."
      onSubmit={handleNewCompany}
      logoField={
        <CompanyLogoField
          logoUrl={logoUrl}
          publicImageId={publicImageId}
          onChange={logo => {
            setLogoUrl(logo.logoUrl)
            setPublicImageId(logo.publicImageId)
          }}
        />
      }
    />
  )
}
