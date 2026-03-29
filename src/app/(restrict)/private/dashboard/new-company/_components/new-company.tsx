'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Building2, CalendarClock, FileText, Hash, LocateFixed, Mail, MapPin, Save, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaInstagram, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/datapicker'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Category, City } from '@/generated/prisma/client'
import { formatCompanyDocument } from '@/utils/company-document'
import { formatCep } from '@/utils/format-cep'
import { formatPhone } from '@/utils/format-phone'
import { formatWhatsapp } from '@/utils/format-whatsapp'
import { onlyNumbers } from '@/utils/only-numbers'
import { createCompany } from '../_actions/create-company'
import { AvatarCompany } from './avatar-company'
import { type NewCompanyFormType, useNewCompanyForm } from './new-company-form'

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
    contractStart: undefined,
    contractEnd: undefined,
    featured: false,
    benefits: '',
    cityId: '',
    categoryId: '',
  })

  async function handleNewCompany(data: NewCompanyFormType) {
    if (!logoUrl || !publicImageId) {
      toast.error('Adicione uma imagem da empresa antes de criar')
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

    queryClient.invalidateQueries({ queryKey: ['companies'] })

    setLogoUrl(undefined)
    setPublicImageId(undefined)
    form.reset()
    router.push('/private/dashboard')
  }

  return (
    <main className="mx-auto flex min-h-screen flex-col p-4">
      <Card className="pt-0">
        <CardHeader className="flex flex-col rounded-t-xl bg-linear-to-r from-primary to-sky-600 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="font-bold text-lg text-muted md:text-2xl">Nova Empresa Conveniada</CardTitle>
            <CardDescription className="text-muted text-sm md:text-base">
              Preencha os dados e adicione a logo da empresa
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(handleNewCompany)}>
              {/* Avatar Company */}
              <AvatarCompany
                logoUrl={logoUrl}
                setLogoUrl={setLogoUrl}
                publicImageId={publicImageId}
                setPublicImageId={setPublicImageId}
              />

              {/* Informações Básicas */}
              <div className="space-y-4 border-border border-t pt-8">
                <h2 className="font-bold text-foreground text-lg">Informações Básicas</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nome da Empresa <span className="mt-0.5 text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <Input
                              placeholder="Clínica Vida Plena"
                              {...field}
                              className="rounded-sm pl-9 placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                            />
                          </div>
                        </FormControl>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CPF ou CNPJ <span className="mt-0.5 text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FileText className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <Input
                              placeholder="Digite o CPF ou CNPJ"
                              className="rounded-sm pl-9 placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                              {...field}
                              value={formatCompanyDocument(field.value ?? '')}
                              onChange={e => {
                                const rawValue = onlyNumbers(e.target.value)
                                field.onChange(rawValue)
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responsible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <Input
                              placeholder="Nome do responsável"
                              className="rounded-sm pl-9 placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                              {...field}
                            />
                          </div>
                        </FormControl>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug (URL) <span className="mt-0.5 text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Hash className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <Input
                              placeholder="clinica-vida-plena"
                              {...field}
                              className="rounded-sm pl-9 placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                            />
                          </div>
                        </FormControl>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Descrição <span className="mt-0.5 text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Breve descrição da empresa"
                          {...field}
                          className="h-28 rounded-sm placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                        />
                      </FormControl>

                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Cidade <span className="mt-0.5 text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full rounded-sm focus-visible:ring-1 focus-visible:ring-primary">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent className="rounded-sm" defaultValue={field.value}>
                            {cities.map(city => (
                              <SelectItem key={city.id} value={city.id}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Categoria <span className="mt-0.5 text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full rounded-sm focus-visible:ring-1 focus-visible:ring-primary">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent className="rounded-sm" defaultValue={field.value}>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                <>
                                  <span>{category.icon}</span>
                                  <p>{category.name}</p>
                                </>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contato */}
              <div className="space-y-4 border-border border-t pt-8">
                <h2 className="font-bold text-foreground text-lg">Contato</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field, formState: { errors } }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FaPhoneAlt className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <Input
                              placeholder="(98) 2152-3456"
                              className="rounded-sm pl-9 placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                              {...field}
                              value={formatPhone(field.value ?? '')}
                              onChange={e => {
                                const rawValue = onlyNumbers(e.target.value)
                                field.onChange(rawValue)
                              }}
                            />
                          </div>
                        </FormControl>

                        {errors.phone ? (
                          <FormMessage className="text-destructive text-xs" />
                        ) : (
                          <FormDescription className="text-muted-foreground text-xs">
                            Formato: DDD + número (somente números)
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field, formState: { errors } }) => (
                      <FormItem>
                        <FormLabel>
                          WhatsApp <span className="mt-0.5 text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FaWhatsapp className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <Input
                              placeholder="(98) 98329-1170"
                              className="rounded-sm pl-9 placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                              {...field}
                              value={formatWhatsapp(field.value ?? '')}
                              onChange={e => {
                                const rawValue = onlyNumbers(e.target.value)
                                field.onChange(rawValue)
                              }}
                            />
                          </div>
                        </FormControl>

                        {errors.whatsapp ? (
                          <FormMessage className="text-destructive text-xs" />
                        ) : (
                          <FormDescription className="text-muted-foreground text-xs">
                            Formato: DDD + número (somente números)
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="mt-0.5 text-destructive">*</span>
                        </FormLabel>

                        <FormControl>
                          <div className="relative">
                            <Mail className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <Input
                              placeholder="contato@empresa.com.br"
                              {...field}
                              className="rounded-sm pl-9 placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                            />
                          </div>
                        </FormControl>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Instagram <span className="mt-0.5 text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FaInstagram className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <Input
                              placeholder="vida-plena"
                              {...field}
                              className="rounded-sm pl-9 placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                            />
                          </div>
                        </FormControl>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4 border-border border-t pt-8">
                <h2 className="font-bold text-foreground text-lg">Endereço</h2>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Logradouro <span className="mt-0.5 text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                          <Input
                            placeholder="Rua, Avenida, etc."
                            {...field}
                            className="rounded-sm pl-9 placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                          />
                        </div>
                      </FormControl>

                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Bairro <span className="mt-0.5 text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Centro"
                            {...field}
                            className="rounded-sm placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                          />
                        </FormControl>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CEP <span className="mt-0.5 text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LocateFixed className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <Input
                              placeholder="65010-000"
                              className="rounded-sm pl-9 placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                              {...field}
                              value={formatCep(field.value ?? '')}
                              onChange={e => {
                                const rawValue = onlyNumbers(e.target.value)
                                field.onChange(rawValue)
                              }}
                            />
                          </div>
                        </FormControl>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Data de contrato */}
              <div className="space-y-4 border-border border-t pt-8">
                <h2 className="font-bold text-foreground text-lg">Informações do Contrato</h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="contractStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de início do contrato</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CalendarClock className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <DatePicker date={field.value as Date} setDate={field.onChange} label="start" className="pl-9" />
                          </div>
                        </FormControl>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contractEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de término do contrato</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CalendarClock className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                            <DatePicker date={field.value as Date} setDate={field.onChange} label="end" className="pl-9" />
                          </div>
                        </FormControl>

                        <FormMessage className="text-destructive text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-4 border-border border-t pt-8">
                <h2 className="font-bold text-foreground text-lg">Benefícios</h2>

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Desconto<span className="mt-0.5 text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="w-1/2 rounded-sm placeholder:text-sm focus-visible:ring-1 focus-visible:ring-primary"
                          />
                        </div>
                      </FormControl>

                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Descrição Detalhada dos Benefícios <span className="mt-0.5 text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <RichTextEditor value={field.value} onChange={field.onChange} />
                      </FormControl>

                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>

                      <FormLabel className="text-sm">Empresa em destaque</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 border-border border-t pt-8">
                {form.formState.isSubmitting ? (
                  <Button type="submit" className="flex-1 select-none disabled:opacity-100" disabled>
                    <ImSpinner2 className="animate-spin" />
                    Criando Empresa...
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1">
                    <Save />
                    Criar Empresa
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
