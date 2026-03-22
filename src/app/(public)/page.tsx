import { MapPin, MapPinOff } from 'lucide-react'
import { CityCardLink } from './_components/companies/city-card-link'
import { Footer } from './_components/footer'
import { Header } from './_components/header'
import { Hero } from './_components/hero'
import { getActiveCities } from './_dal/get-active-cities'

export default async function CompaniesPage() {
  const cities = await getActiveCities()

  return (
    <main className="flex min-h-screen w-full flex-col">
      <Header />

      <div>
        <Hero />

        <section className="bg-linear-to-r from-primary to-sky-600 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 space-y-1">
              <h1 className="flex items-center justify-center gap-2 font-bold text-2xl text-muted md:text-3xl">
                <MapPin className="md:size-7" />
                Selecione sua cidade
              </h1>
              <p className="text-center text-muted">Escolha a subseção ou sede para visualizar as empresas conveniadas</p>
            </div>

            <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cities.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center gap-1 py-4 text-muted">
                  <MapPinOff className="size-7 animate-pulse opacity-80" />
                  <span className="font-medium text-sm">Nenhuma cidade ativa encontrada</span>
                </div>
              )}

              {cities.map(city => (
                <CityCardLink key={city.id} city={city} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
