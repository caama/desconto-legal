import { ExternalLink } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/components/ui/button'
import { getCompanyFullAddress } from '@/utils/get-company-full-address'

type CompanyMapsProps = {
  company: {
    address: string
    neighborhood: string
    zipCode: string
    city: { name: string }
  }
}

// Links de verdade (e não window.open): abrem em nova aba, aceitam clique do meio e funcionam no teclado
export function CompanyMaps({ company }: CompanyMapsProps) {
  const encodedAddress = encodeURIComponent(getCompanyFullAddress(company))

  return (
    <>
      <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink />
          Como Chegar
        </a>
      </Button>

      <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`} target="_blank" rel="noopener noreferrer">
          <FcGoogle />
          Ver no Google Maps
        </a>
      </Button>
    </>
  )
}
