type CompanyAddress = {
  address: string
  neighborhood: string
  zipCode: string
  city: { name: string }
}

// Endereço em uma linha, no formato que o Google Maps entende melhor: rua, bairro, cidade - UF, CEP
export function getCompanyFullAddress({ address, neighborhood, zipCode, city }: CompanyAddress) {
  return [address, neighborhood, `${city.name} - MA`, zipCode].filter(Boolean).join(', ')
}
