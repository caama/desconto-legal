import { ArrowLeft, Building2, CheckCircle2, ExternalLink, Gift, Mail, MapPin, Navigation, Phone, Star } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaInstagram } from 'react-icons/fa'
import { CompanyMaps } from '@/app/(public)/_components/company-maps'
import { Shared } from '@/app/(public)/_components/header/shared'
import { Squares } from '@/app/(public)/_components/hero/squares'
import { WhatsappCompany } from '@/app/(public)/_components/whatsapp-company'
import { getCompanyBySlug } from '@/app/(public)/_dal/get-company-by-slug'
import { Badge } from '@/components/ui/badge'
import { formatCep } from '@/utils/format-cep'
import { formatPhone } from '@/utils/format-phone'

export const metadata: Metadata = {
  title: `Detalhes | Desconto Legal`,
}

type CompanyDetailsPageProps = {
  params: Promise<{
    slug: string
    slug_company: string
  }>
}

export default async function CompanyDetailsPage({ params }: CompanyDetailsPageProps) {
  const { slug_company, slug: citySlug } = await params

  const company = await getCompanyBySlug({
    slug: slug_company,
    citySlug,
  })

  if (!company || !company.active) {
    notFound()
  }

  const sharedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/city/${company.city.slug}/companies/${company.slug}/details`

  return (
    <div className="min-h-screen bg-primary/5">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 py-2">
          <Link
            href={`/city/${company.city.slug}/companies`}
            className="group flex items-center gap-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            <ArrowLeft className="group-hover:-translate-x-1 mr-2 size-4 text-foreground/80 transition-transform duration-200" />
            <span className="hidden sm:inline">Voltar para {company.city.name}</span>
            <span className="sm:hidden">Voltar</span>
          </Link>

          <Shared url={sharedUrl} />
        </div>
      </header>

      {/* Content Image */}
      <main className="pt-16">
        <section className="relative">
          <div className="relative aspect-19/9 w-full overflow-hidden bg-muted sm:aspect-8/1 lg:aspect-9/1">
            <Squares />
            {/* <Image src="/assets/acordo.png" alt={`Imagem de ${company.name}`} fill className="object-cover" /> */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="-mt-28 sm:-mt-24">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                {/* Logo Company */}
                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-xl sm:h-48 sm:w-78">
                  {company.logoUrl ? (
                    <Image src={company.logoUrl} alt={`Logo de ${company.name}`} fill className="object-contain" sizes="144px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
                      <Building2 className="h-10 w-10 text-muted-foreground/40 sm:h-14 sm:w-14" />
                    </div>
                  )}
                </div>

                {/* Company Information */}
                <div className="flex-1 md:pb-10">
                  <div className="flex flex-wrap items-center gap-2 pb-2">
                    <h1 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl lg:text-4xl">{company.name}</h1>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {company.city.name}
                    </span>
                    {company.category && (
                      <span className="flex items-center gap-1.5">
                        <span>{company.category.icon}</span>
                        <span>{company.category.name}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Main Column */}
            <div className="space-y-8 lg:col-span-2">
              {/* Discount Banner */}
              {company.discount && (
                <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-emerald-50 p-6 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 p-3 shadow-lg">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-600/70 text-sm">Exclusivo para Advogados Associados e Dependentes</p>
                      <p className="mt-1 font-bold text-emerald-600 text-xl">{company.discount}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* About */}
              {company.description && (
                <div>
                  <h2 className="font-semibold text-foreground text-lg">Sobre</h2>
                  <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">{company.description}</p>
                </div>
              )}

              {/* Benefits */}
              {company.benefits && (
                <div>
                  <h2 className="font-semibold text-foreground text-lg">Benefícios</h2>
                  <div className="mt-3 flex items-start gap-3 rounded-xl border bg-card/80 p-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                    <div
                      className="prose prose-sm sm:prose-base max-w-none text-pretty prose-a:text-primary prose-headings:text-foreground prose-li:text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-p:leading-relaxed hover:prose-a:text-primary/80"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is generated via TipTap
                      dangerouslySetInnerHTML={{ __html: company.benefits }}
                    />
                  </div>
                </div>
              )}

              {/* Address */}
              {company.address && (
                <div>
                  <h2 className="flex items-center gap-2 font-semibold text-foreground text-lg">📍 Localização</h2>

                  <div className="mt-3 rounded-lg border bg-card p-4">
                    {/* Conteúdo */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Navigation className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <p className="text-foreground text-sm">{company.address}</p>
                        <p className="text-muted-foreground text-sm">{company.neighborhood}</p>
                        <p className="text-muted-foreground text-sm">CEP: {formatCep(company.zipCode)}</p>
                        <p className="mt-1 font-medium text-primary/70 text-sm">{company.city.name} - MA</p>
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <CompanyMaps company={company} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Primary CTA */}
              <div className="relative rounded-2xl border bg-card p-6">
                <h3 className="font-semibold text-foreground">Entre em contato</h3>
                <p className="mt-1 mb-3 text-muted-foreground text-sm">Fale diretamente com a empresa</p>
                <WhatsappCompany companyId={company.id} whatsapp={company.whatsapp} />

                {company.featured && (
                  <Badge variant="secondary" className="absolute top-2 right-2 shrink-0">
                    <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                    Destaque
                  </Badge>
                )}
              </div>

              {/* Contact Info */}
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold text-foreground">Informações</h3>
                <div className="mt-4 space-y-4">
                  {company.phone && (
                    <div className="flex items-center gap-3 text-muted-foreground text-sm transition-colors hover:text-primary/80">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Telefone</p>
                        <p className="font-medium text-foreground">{formatPhone(company.phone)}</p>
                      </div>
                    </div>
                  )}

                  {company.email && (
                    <div className="flex items-center gap-3 text-muted-foreground text-sm transition-colors hover:text-primary/80">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">E-mail</p>
                        <p className="font-medium text-foreground">{company.email}</p>
                      </div>
                    </div>
                  )}

                  {company.instagram && (
                    <Link
                      href={`https://instagram.com/${company.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground text-sm transition-colors hover:text-primary/80"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                        <FaInstagram className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Instagram</p>
                        <p className="flex items-center gap-1 font-medium text-foreground transition-all duration-300 hover:text-primary/80">
                          Visitar perfil
                          <ExternalLink className="h-3.5 w-3.5" />
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              {/* Important Notice */}
              <div className="rounded-lg border-primary border-l-4 bg-primary/5 p-4">
                <p className="text-foreground text-sm">
                  <strong>Importante:</strong> Apresente sua carteira da OAB para garantir os descontos e benefícios exclusivos
                  desta empresa conveniada.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
