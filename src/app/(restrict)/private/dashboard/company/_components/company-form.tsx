'use client'

import { ArrowLeft, Loader2, Save, Star } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode, useState } from 'react'
import { type UseFormReturn, useFormState, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/datapicker'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Category, City } from '@/generated/prisma/client'
import { cn } from '@/lib/utils'
import { formatCompanyDocument } from '@/utils/company-document'
import { formatCep } from '@/utils/format-cep'
import { formatCityName } from '@/utils/format-city-name'
import { formatPhone } from '@/utils/format-phone'
import { formatWhatsapp } from '@/utils/format-whatsapp'
import { onlyNumbers } from '@/utils/only-numbers'
import { slugify } from '@/utils/slugify'
import type { NewCompanyFormType } from '../../new-company/_components/new-company-form'

// Campos comuns aos formulários de criação e edição (a edição acrescenta apenas o id)
export type CompanyFormValues = NewCompanyFormType

type CompanyFormProps = {
  mode: 'create' | 'edit'
  form: UseFormReturn<CompanyFormValues>
  cities: City[]
  categories: Category[]
  title: string
  description: string
  logoField: ReactNode
  headerAction?: ReactNode
  onSubmit: (data: CompanyFormValues) => Promise<void>
}

export function CompanyForm({
  mode,
  form,
  cities,
  categories,
  title,
  description,
  logoField,
  headerAction,
  onSubmit,
}: CompanyFormProps) {
  const [hasInvalidContractStart, setHasInvalidContractStart] = useState(false)
  const [hasInvalidContractEnd, setHasInvalidContractEnd] = useState(false)

  // Assinaturas explícitas do estado do form: o React Compiler memoriza este componente,
  // então leituras diretas de watch/formState não disparariam nova renderização
  const { isSubmitting, isSubmitted, errors } = useFormState({ control: form.control })
  const [slug, cityId] = useWatch({ control: form.control, name: ['slug', 'cityId'] })
  const hasInvalidDates = hasInvalidContractStart || hasInvalidContractEnd

  // O slug acompanha o nome até ser editado manualmente (apagar o slug reativa o automático).
  // Na edição, só acompanha se o slug salvo ainda for o gerado a partir do nome; um slug personalizado é preservado
  const [savedSlug] = useState(() => form.getValues('slug'))
  const [isSlugEditedManually, setIsSlugEditedManually] = useState(
    () => mode === 'edit' && form.getValues('slug') !== slugify(form.getValues('name'))
  )
  const isSlugChanged = mode === 'edit' && slug.trim() !== '' && slug !== savedSlug

  function handleNameChange(value: string) {
    form.setValue('name', value, { shouldDirty: true, shouldValidate: isSubmitted })

    if (!isSlugEditedManually) {
      form.setValue('slug', slugify(value), { shouldDirty: true, shouldValidate: isSubmitted })
    }
  }

  function handleSlugChange(value: string) {
    form.setValue('slug', value, { shouldDirty: true, shouldValidate: isSubmitted })
    setIsSlugEditedManually(value.trim() !== '')
  }

  const citySlug = cities.find(city => city.id === cityId)?.slug

  async function handleValidSubmit(data: CompanyFormValues) {
    if (hasInvalidDates) {
      toast.error('Corrija as datas do contrato antes de continuar')
      return
    }

    await onSubmit(data)
  }

  function handleInvalidSubmit() {
    toast.error('Revise os campos destacados', { description: 'Alguns dados obrigatórios estão faltando ou inválidos.' })
  }

  function handleDateInvalid(field: 'contractStart' | 'contractEnd', invalid: boolean) {
    if (field === 'contractStart') setHasInvalidContractStart(invalid)
    else setHasInvalidContractEnd(invalid)

    if (invalid) {
      form.setError(field, { type: 'manual', message: 'Insira uma data válida no formato dd/mm/aaaa' })
      return
    }

    if (errors[field]?.type === 'manual') {
      form.clearErrors(field)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleValidSubmit, handleInvalidSubmit)} className="mx-auto max-w-6xl" noValidate>
        {/* Cabeçalho da página */}
        <div className="mt-2 mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <Link
              href="/private/dashboard"
              className="group mb-2 inline-flex items-center gap-1.5 rounded-sm text-muted-foreground text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
              Empresas
            </Link>
            <h1 className="truncate font-bold text-foreground text-xl md:text-2xl">{title}</h1>
            <p className="mt-1 text-muted-foreground text-sm">{description}</p>
          </div>

          {headerAction}
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Coluna principal */}
          <div className="space-y-6">
            <Section title="Dados da empresa" description="Identificação e classificação exibidas na listagem.">
              <div className="grid items-start gap-x-4 gap-y-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da empresa</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Clínica Vida Plena"
                          autoComplete="off"
                          {...field}
                          onChange={event => handleNameChange(event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF ou CNPJ</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="00.000.000/0000-00"
                          autoComplete="off"
                          className="tabular-nums"
                          {...field}
                          value={formatCompanyDocument(field.value ?? '')}
                          onChange={event => field.onChange(onlyNumbers(event.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsible"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel optional>Responsável</FieldLabel>
                      <FormControl>
                        <Input placeholder="Nome do responsável" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="clinica-vida-plena"
                          autoComplete="off"
                          {...field}
                          onChange={event => handleSlugChange(event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                      {!errors.slug && (
                        <FormDescription className="truncate text-xs">
                          /city/{citySlug ?? 'cidade'}/companies/
                          <span className="font-medium text-foreground/80">{slug || 'slug'}</span>/details
                        </FormDescription>
                      )}
                      {!errors.slug && isSlugChanged && (
                        <FormDescription className="text-amber-700 text-xs">
                          O endereço da empresa muda e links antigos para ela deixam de funcionar.
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a cidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city.id} value={city.id}>
                              {formatCityName(city.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.icon && <span aria-hidden="true">{category.icon}</span>}
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Breve apresentação da empresa" className="min-h-24 resize-y" {...field} />
                      </FormControl>
                      <FormMessage />
                      {!errors.description && (
                        <FormDescription className="text-xs">Aparece no card da listagem (até duas linhas).</FormDescription>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </Section>

            <Section title="Contato" description="Canais exibidos na página da empresa.">
              <div className="grid items-start gap-x-4 gap-y-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="tel"
                          placeholder="(98) 98329-1170"
                          className="tabular-nums"
                          {...field}
                          value={formatWhatsapp(field.value ?? '')}
                          onChange={event => field.onChange(onlyNumbers(event.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel optional>Telefone</FieldLabel>
                      <FormControl>
                        <Input
                          inputMode="tel"
                          placeholder="(98) 2152-3456"
                          className="tabular-nums"
                          {...field}
                          value={formatPhone(field.value ?? '')}
                          onChange={event => field.onChange(onlyNumbers(event.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@empresa.com.br" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span
                            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground text-sm"
                            aria-hidden="true"
                          >
                            @
                          </span>
                          <Input
                            placeholder="vidaplena"
                            autoComplete="off"
                            className="pl-7"
                            {...field}
                            onChange={event => field.onChange(event.target.value.replace(/^@+/, '').trim())}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Section>

            <Section title="Endereço" description="Local de atendimento exibido no card e na página da empresa.">
              <div className="grid items-start gap-x-4 gap-y-5 sm:grid-cols-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-6">
                      <FormLabel>Logradouro</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, avenida, número e complemento" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-4">
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Centro" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="65010-000"
                          className="tabular-nums"
                          {...field}
                          value={formatCep(field.value ?? '')}
                          onChange={event => field.onChange(onlyNumbers(event.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Section>

            <Section title="Benefício" description="O que o advogado associado recebe ao apresentar a carteira.">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem className="sm:max-w-sm">
                      <FormLabel>Desconto</FormLabel>
                      <FormControl>
                        <Input placeholder="10% de desconto" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                      {!errors.discount && (
                        <FormDescription className="text-xs">Texto curto que aparece em destaque no card.</FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detalhes dos benefícios</FormLabel>
                      <FormControl>
                        <RichTextEditor value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Section>
          </div>

          {/* Coluna lateral */}
          <aside className="space-y-6">
            <Section title="Logo" description="Exibida no card e na página da empresa.">
              {logoField}
            </Section>

            <Section title="Contrato" description="Sem datas, o convênio fica sem expiração.">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="contractStart"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel optional>Início</FieldLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value as Date | null | undefined}
                          setDate={field.onChange}
                          label="start"
                          onInvalidChange={invalid => handleDateInvalid('contractStart', invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel optional>Término</FieldLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value as Date | null | undefined}
                          setDate={field.onChange}
                          label="end"
                          onInvalidChange={invalid => handleDateInvalid('contractEnd', invalid)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Section>

            <Section title="Visibilidade">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3 font-normal transition-colors',
                        field.value ? 'border-amber-300 bg-amber-50/60' : 'border-border hover:bg-muted/40'
                      )}
                    >
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                      </FormControl>
                      <span className="space-y-0.5">
                        <span className="flex items-center gap-1.5 font-medium text-foreground text-sm">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                          Empresa em destaque
                        </span>
                        <span className="block text-muted-foreground text-xs leading-relaxed">
                          Aparece primeiro na listagem, com o selo de destaque.
                        </span>
                      </span>
                    </FormLabel>
                  </FormItem>
                )}
              />
            </Section>
          </aside>
        </div>

        {/* Barra de ações fixa */}
        <div className="sticky bottom-0 z-30 -mx-6 mt-8 border-t bg-background/95 px-6 py-3 shadow-[0_-6px_16px_-12px_rgb(15_23_42/0.25)] backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-end gap-3">
            <p className="mr-auto hidden text-muted-foreground text-xs sm:block">
              {mode === 'create' ? 'A empresa fica ativa assim que for criada.' : 'As alterações valem assim que forem salvas.'}
            </p>

            <Button variant="outline" asChild>
              <Link href="/private/dashboard">Cancelar</Link>
            </Button>

            <Button type="submit" disabled={isSubmitting || hasInvalidDates} className="min-w-36">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {mode === 'create' ? 'Criando...' : 'Salvando...'}
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {mode === 'create' ? 'Criar empresa' : 'Salvar alterações'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-xs">
      <header className="border-border border-b px-5 py-4">
        <h2 className="font-semibold text-base text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-muted-foreground text-sm">{description}</p>}
      </header>
      <div className="px-5 py-5">{children}</div>
    </section>
  )
}

function FieldLabel({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <FormLabel>
      {children}
      {optional && <span className="font-normal text-muted-foreground text-xs">Opcional</span>}
    </FormLabel>
  )
}
