'use client'

import { useQueryClient } from '@tanstack/react-query'
import { ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Category, City, Company } from '@/generated/prisma/client'
import { deleteImageCompany } from '../../../_actions/delete-image-company'
import { updateCompany } from '../../../_actions/update-company'
import { CompanyForm, type CompanyFormValues } from '../../../_components/company-form'
import { CompanyLogoField } from '../../../_components/company-logo-field'
import { useUpdateCompanyForm } from './update-company-form'

type UpdateCompanyContentProps = {
  company: Company
  cities: City[]
  categories: Category[]
}

export function UpdateCompanyContent({ company, cities, categories }: UpdateCompanyContentProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const [logoUrl, setLogoUrl] = useState(company.logoUrl || '')
  const [publicImageId, setPublicImageId] = useState(company.publicImageId || '')

  const form = useUpdateCompanyForm({
    id: company.id,
    name: company.name || '',
    document: company.cnpj || '',
    responsible: company.responsible || '',
    slug: company.slug || '',
    description: company.description || '',
    // Logo fica fora dos valores reativos: mudá-la recriaria os valores e apagaria as edições em andamento
    logoUrl: company.logoUrl || '',
    publicImageId: company.publicImageId || '',
    phone: company.phone || '',
    whatsapp: company.whatsapp || '',
    email: company.email || '',
    instagram: company.instagram || '',
    address: company.address || '',
    neighborhood: company.neighborhood || '',
    zipCode: company.zipCode || '',
    discount: company.discount || '',
    benefits: company.benefits || '',
    contractStart: company.contractStart ?? null,
    contractEnd: company.contractEnd ?? null,
    featured: company.featured || false,
    cityId: company.cityId || '',
    categoryId: company.categoryId || '',
  })

  const city = cities.find(item => item.id === company.cityId)

  async function handleUpdateCompany(data: CompanyFormValues) {
    if (!logoUrl || !publicImageId) {
      toast.error('Adicione a logo da empresa antes de salvar')
      return
    }

    const response = await updateCompany({
      ...data,
      id: company.id,
      contractStart: (data.contractStart as Date | null | undefined) ?? null,
      contractEnd: (data.contractEnd as Date | null | undefined) ?? null,
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
      mode="edit"
      // A edição usa o mesmo conjunto de campos da criação, mais o id (enviado à parte)
      form={form as unknown as UseFormReturn<CompanyFormValues>}
      cities={cities}
      categories={categories}
      title={company.name}
      description="Edite os dados do convênio ou troque a logo da empresa."
      onSubmit={handleUpdateCompany}
      headerAction={
        city && (
          <Button variant="outline" size="sm" asChild>
            <a href={`/city/${city.slug}/companies/${company.slug}/details`} target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5" />
              Ver página pública
            </a>
          </Button>
        )
      }
      logoField={
        <CompanyLogoField
          logoUrl={logoUrl}
          publicImageId={publicImageId}
          onChange={logo => {
            setLogoUrl(logo.logoUrl ?? '')
            setPublicImageId(logo.publicImageId ?? '')
          }}
          onRemoved={async removedId => {
            await deleteImageCompany({ publicImageId: removedId })
            await queryClient.invalidateQueries({ queryKey: ['companies'] })
          }}
        />
      }
    />
  )
}
