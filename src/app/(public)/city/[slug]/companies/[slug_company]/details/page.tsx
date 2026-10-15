import { ArrowLeft, ArrowRight, ArrowUpRight, Building2, Gift, Mail, MapPin, Navigation, Phone, Star } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache, type ReactNode } from 'react'
import { FaInstagram } from 'react-icons/fa'
import { CompanyCard } from '@/app/(public)/_components/companies-by-city/company-card'
import { CompanyMaps } from '@/app/(public)/_components/company-maps'
import { Shared } from '@/app/(public)/_components/header/shared'
import { Squares } from '@/app/(public)/_components/hero/squares'
import { WhatsappCompany } from '@/app/(public)/_components/whatsapp-company'
import { getCompanyBySlug } from '@/app/(public)/_dal/get-company-by-slug'
import { getRelatedCompanies } from '@/app/(public)/_dal/get-related-companies'
import { formatCep } from '@/utils/format-cep'
import { formatCityName } from '@/utils/format-city-name'
import { formatPhone } from '@/utils/format-phone'
import { getCompanyFullAddress } from '@/utils/get-company-full-address'
import { CopyAddress } from './_components/copy-address'
import { MobileCtaBar } from './_components/mobile-cta-bar'
import { QuickActions } from './_components/quick-actions'

type CompanyDetailsPageProps = {
  params: Promise<{
    slug: string
    slug_company: string
  }>
}

// generateMetadata e a página pedem a mesma empresa: o cache faz uma única consulta por requisição
const getActiveCompany = cache(async (citySlug: string, slug: string) => {
  const company = await getCompanyBySlug({ slug, citySlug })
  return company?.active ? company : null
})

export async function generateMetadata({ params }: CompanyDetailsPageProps): Promise<Metadata> {
  const { slug_company, slug: citySlug } = await params
  const company = await getActiveCompany(citySlug, slug_company)

  if (!company) {
    return { title: 'Empresa não encontrada | Desconto Legal' }
  }

  // Título e descrição próprios: é o que aparece no card quando o link é compartilhado no WhatsApp
  const title = `${company.name}: ${company.discount} | Desconto Legal`
  const description =
    `${company.discount} para advogados da OAB-MA em ${formatCityName(company.city.name)}. ${company.description}`.slice(0, 200)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      ...(company.logoUrl && { images: [{ url: company.logoUrl, alt: `Logo de ${company.name}` }] }),
    },
  }
}

export default async function CompanyDetailsPage({ params }: CompanyDetailsPageProps) {
  const { slug_company, slug: citySlug } = await params
  const company = await getActiveCompany(citySlug, slug_company)

  if (!company) {
    notFound()
  }

  const cityName = formatCityName(company.city.name)
  const instagram = company.instagram.replace(/^@+/, '').trim()
  const sharedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/city/${company.city.slug}/companies/${company.slug}/details`
  const fullAddress = getCompanyFullAddress(company)
  // Abre o local no Google Maps (no celular, direto no app), com a opção de traçar a rota de lá
  const locationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  const relatedCompanies = await getRelatedCompanies({
    cityId: company.cityId,
    categoryId: company.categoryId,
    excludeId: company.id,
  })

  // Dados estruturados para os buscadores entenderem a página como um estabelecimento local
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.name,
    description: company.description,
    url: sharedUrl,
    ...(company.logoUrl && { image: company.logoUrl }),
    ...(company.phone && { telephone: company.phone }),
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
      addressLocality: company.city.name,
      addressRegion: 'MA',
      postalCode: company.zipCode,
      addressCountry: 'BR',
    },
  }

  const contactCta = (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="font-semibold text-foreground">Entre em contato</h2>
      <p className="mt-1 mb-4 text-muted-foreground text-sm">Fale diretamente com a empresa</p>
      <WhatsappCompany companyId={company.id} whatsapp={company.whatsapp} className="h-10" />
    </div>
  )

  return (
    <div className="min-h-screen bg-primary/5 pb-24 selection:bg-primary selection:text-primary-foreground lg:pb-0">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD precisa ir como texto puro; o "<" é escapado
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />

      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <Link
            href={`/city/${company.city.slug}/companies`}
            className="group -ml-2 flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 font-medium text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <ArrowLeft className="size-4 shrink-0 text-foreground/80 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="hidden truncate sm:inline">Voltar para {cityName}</span>
            <span className="sm:hidden">Voltar</span>
          </Link>

          <Shared url={sharedUrl} title={`${company.name}: ${company.discount} para advogados da OAB-MA no Desconto Legal`} />
        </div>
      </header>

      <main className="pt-16">
        <section className="relative">
          <div className="relative aspect-19/9 w-full overflow-hidden bg-muted sm:aspect-8/1 lg:aspect-9/1">
            <Squares />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="-mt-28 sm:-mt-12 lg:-mt-24">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6">
                {/* Logo */}
                <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-[0_12px_32px_-12px_rgb(15_23_42/0.25)] sm:h-48 sm:w-78">
                  {company.logoUrl ? (
                    <Image
                      src={company.logoUrl}
                      alt={`Logo de ${company.name}`}
                      fill
                      priority
                      className="object-contain p-4"
                      sizes="(min-width: 640px) 312px, 100vw"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
                      <Building2 className="size-12 text-muted-foreground/40 sm:size-14" />
                    </div>
                  )}

                  {/* A partir do sm o selo fica no canto do logo, no mesmo lugar dos cards da listagem */}
                  {company.featured && (
                    <span className="absolute top-3 right-3 hidden items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-800 text-xs ring-1 ring-amber-200 sm:inline-flex">
                      <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                      Destaque
                    </span>
                  )}
                </div>

                {/* Identificação */}
                <div className="min-w-0 flex-1 md:pb-6">
                  {company.featured && (
                    <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-800 text-xs ring-1 ring-amber-200 sm:hidden">
                      <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                      Destaque
                    </span>
                  )}

                  <h1 className="text-balance font-bold text-3xl text-foreground tracking-tight lg:text-4xl">{company.name}</h1>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4" aria-hidden="true" />
                      {cityName}
                    </span>
                    {company.category && (
                      <span className="flex items-center gap-1.5">
                        {company.category.icon && <span aria-hidden="true">{company.category.icon}</span>}
                        <span>{company.category.name}</span>
                      </span>
                    )}
                  </div>

                  <QuickActions
                    companyId={company.id}
                    whatsapp={company.whatsapp}
                    instagram={instagram}
                    locationUrl={locationUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            {/* Coluna principal */}
            <div className="space-y-8 lg:col-span-2">
              {company.discount && (
                <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">
                  <div className="flex items-center gap-4 p-5 sm:p-6">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-[0_6px_16px_-6px_rgb(5_150_105/0.6)]">
                      <Gift className="size-6" aria-hidden="true" />
                    </div>
                    <p className="min-w-0 font-bold text-emerald-700 text-xl leading-tight sm:text-2xl">{company.discount}</p>
                  </div>

                  {/* Como usar, no formato dos apps de cupom: a ordem dos passos é a informação */}
                  <div className="border-emerald-200 border-t bg-white/60 px-5 py-5 sm:px-6">
                    <h2 className="font-semibold text-emerald-900 text-sm">Como usar o desconto</h2>
                    <ol className="mt-3 grid gap-4 sm:grid-cols-3 sm:gap-6">
                      {HOW_TO_USE.map((step, index) => (
                        <li key={step.title} className="flex gap-3">
                          <span
                            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white text-xs tabular-nums"
                            aria-hidden="true"
                          >
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm leading-snug">{step.title}</p>
                            <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">{step.description}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {company.description && (
                <div>
                  <h2 className="font-semibold text-foreground text-lg">Sobre</h2>
                  <p className="mt-3 max-w-[70ch] text-pretty text-muted-foreground leading-relaxed">{company.description}</p>
                </div>
              )}

              {company.benefits && (
                <div>
                  <h2 className="font-semibold text-foreground text-lg">Benefícios</h2>
                  <div className="mt-3 rounded-2xl border bg-card p-5 sm:p-6">
                    <div
                      className="prose prose-sm sm:prose-base prose-li:my-1 prose-ul:my-2 prose-headings:mt-0 prose-headings:mb-3 max-w-none text-pretty prose-headings:font-semibold prose-a:text-primary prose-h3:text-base prose-headings:text-foreground prose-li:text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-p:leading-relaxed prose-a:underline-offset-2 prose-li:marker:text-emerald-500 hover:prose-a:text-primary/80 sm:prose-h3:text-lg"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: conteúdo gerado pelo editor TipTap do painel
                      dangerouslySetInnerHTML={{ __html: company.benefits }}
                    />
                  </div>
                </div>
              )}

              {company.address && (
                <div>
                  <h2 className="font-semibold text-foreground text-lg">Localização</h2>

                  <div className="mt-3 rounded-2xl border bg-card p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Navigation className="size-5" aria-hidden="true" />
                      </div>

                      <address className="min-w-0 flex-1 not-italic">
                        <p className="font-medium text-foreground text-sm">{company.address}</p>
                        {company.neighborhood && <p className="text-muted-foreground text-sm">{company.neighborhood}</p>}
                        {company.zipCode && (
                          <p className="text-muted-foreground text-sm tabular-nums">CEP: {formatCep(company.zipCode)}</p>
                        )}
                        <p className="mt-1 font-medium text-primary/70 text-sm">{cityName} - MA</p>
                      </address>
                    </div>

                    {/* Mapa carregado só quando chega perto da tela; a busca pelo endereço dispensa chave de API */}
                    <div className="relative mt-5 aspect-video overflow-hidden rounded-xl border bg-muted lg:aspect-21/9">
                      <iframe
                        title={`Mapa com a localização de ${company.name}`}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=16&output=embed`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0 size-full border-0"
                      />
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <CopyAddress address={fullAddress} />
                      <CompanyMaps company={company} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lateral: acompanha a rolagem no desktop */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="hidden lg:block">{contactCta}</div>

              <div className="rounded-2xl border bg-card p-6">
                <h2 className="font-semibold text-foreground">Informações</h2>
                <ul className="mt-3 space-y-1">
                  {company.phone && (
                    <InfoRow
                      href={`tel:${company.phone.replace(/\D/g, '')}`}
                      icon={<Phone className="size-4" />}
                      label="Telefone"
                      value={formatPhone(company.phone)}
                    />
                  )}

                  {company.email && (
                    <InfoRow
                      href={`mailto:${company.email}`}
                      icon={<Mail className="size-4" />}
                      label="E-mail"
                      value={company.email}
                    />
                  )}

                  {instagram && (
                    <InfoRow
                      href={`https://instagram.com/${instagram}`}
                      icon={<FaInstagram className="size-4" />}
                      label="Instagram"
                      value={`@${instagram}`}
                      external
                    />
                  )}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {relatedCompanies.length > 0 && (
          <section aria-labelledby="relacionadas" className="mx-auto max-w-6xl px-4 pb-12 sm:pb-16">
            <div className="flex items-end justify-between gap-4">
              <h2 id="relacionadas" className="font-semibold text-foreground text-lg">
                Mais descontos em {cityName}
              </h2>
              <Link
                href={`/city/${company.city.slug}/companies`}
                className="group flex shrink-0 items-center gap-1 rounded-md font-medium text-primary text-sm outline-none hover:underline hover:underline-offset-4 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                Ver todas
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* No mobile vira um carrossel com rolagem lateral; no desktop, três colunas */}
            <ul className="-mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
              {relatedCompanies.map(related => (
                <li key={related.id} className="w-[80%] max-w-80 shrink-0 snap-start sm:w-auto sm:max-w-none">
                  <CompanyCard company={related} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <MobileCtaBar companyId={company.id} companyName={company.name} whatsapp={company.whatsapp} discount={company.discount} />
    </div>
  )
}

const HOW_TO_USE = [
  { title: 'Fale com a empresa', description: 'Pelo WhatsApp, por telefone ou indo até o local.' },
  { title: 'Apresente sua carteira da OAB', description: 'No momento do atendimento.' },
  { title: 'Aproveite o benefício', description: 'Desconto e vantagens desta empresa conveniada.' },
]

type InfoRowProps = {
  href: string
  icon: ReactNode
  label: string
  value: string
  external?: boolean
}

// Cada contato é um link de verdade: telefone liga, e-mail abre o app de e-mail, Instagram abre o perfil
function InfoRow({ href, icon, label, value, external }: InfoRowProps) {
  return (
    <li>
      <a
        href={href}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-muted-foreground text-xs">{label}</span>
          <span className="truncate font-medium text-foreground text-sm">{value}</span>
        </span>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground/50 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
          aria-hidden="true"
        />
      </a>
    </li>
  )
}
