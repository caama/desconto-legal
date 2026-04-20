import { Hand, MapPin, MapPinOff } from 'lucide-react'
import { DraggableScroll } from '@/components/app/draggable-scroll'
import { BrandingBanner } from './_components/branding-banner'
import { CityCardLink } from './_components/companies/city-card-link'
import { Footer } from './_components/footer'
import { Hero } from './_components/hero'
import { getActiveCities } from './_dal/get-active-cities'

export default async function CompaniesPage() {
  const cities = await getActiveCities()

  return (
    <main className="flex min-h-screen w-full flex-col">
      <div>
        <Hero />

        <BrandingBanner />

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-20 space-y-1">
              <h1 className="flex items-center justify-center gap-2 font-bold text-2xl text-primary md:text-3xl">
                <MapPin className="md:size-7" />
                Selecione sua cidade
              </h1>
              <p className="text-center text-primary">Escolha a subseção ou sede para visualizar as empresas conveniadas</p>
            </div>

            <div className="mx-auto mb-16 max-w-7xl">
              {cities.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center gap-1 py-4 text-muted">
                  <MapPinOff className="size-7 animate-pulse opacity-80" />
                  <span className="font-medium text-sm">Nenhuma cidade ativa encontrada</span>
                </div>
              )}

              <DraggableScroll
                showArrows
                className="scroll-hidden snap-x snap-mandatory gap-4 pb-2 sm:snap-none lg:gap-6"
              >
                {cities.map(city => (
                  <CityCardLink key={city.id} city={city} />
                ))}
              </DraggableScroll>

              {cities.length > 0 && (
                <div className="mt-4 flex justify-center sm:justify-end">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-2 text-primary shadow-sm backdrop-blur-sm">
                    <span className="flex items-center gap-1.5">
                      <Hand className="size-4" />
                      <span className="font-medium text-xs sm:text-sm">Arraste para ver mais cidades</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
