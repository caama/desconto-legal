const CPF_LENGTH = 11
const CNPJ_LENGTH = 14

export type CompanyDocumentType = 'cpf' | 'cnpj' | 'unknown'

export function normalizeCompanyDocument(value: string) {
  return value.replace(/\D/g, '').slice(0, CNPJ_LENGTH)
}

export function getCompanyDocumentType(value: string): CompanyDocumentType {
  const cleaned = normalizeCompanyDocument(value)

  if (!cleaned) return 'unknown'

  return cleaned.length <= CPF_LENGTH ? 'cpf' : 'cnpj'
}

export function formatCompanyDocument(value: string) {
  const cleaned = normalizeCompanyDocument(value)

  if (cleaned.length <= CPF_LENGTH) {
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return cleaned.replace(/^(\d{3})(\d+)/, '$1.$2')
    if (cleaned.length <= 9) return cleaned.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3')

    return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  }

  if (cleaned.length <= 2) return cleaned
  if (cleaned.length <= 5) return cleaned.replace(/^(\d{2})(\d+)/, '$1.$2')
  if (cleaned.length <= 8) return cleaned.replace(/^(\d{2})(\d{3})(\d+)/, '$1.$2.$3')
  if (cleaned.length <= 12) return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4')

  return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export function isValidCPF(cpf: string): boolean {
  const cleaned = normalizeCompanyDocument(cpf)

  if (cleaned.length !== CPF_LENGTH) return false
  if (/^(\d)\1+$/.test(cleaned)) return false

  let sum = 0

  for (let i = 0; i < 9; i++) {
    sum += Number(cleaned[i]) * (10 - i)
  }

  let digit = (sum * 10) % 11

  if (digit === 10) digit = 0
  if (digit !== Number(cleaned[9])) return false

  sum = 0

  for (let i = 0; i < 10; i++) {
    sum += Number(cleaned[i]) * (11 - i)
  }

  digit = (sum * 10) % 11

  if (digit === 10) digit = 0

  return digit === Number(cleaned[10])
}

export function isValidCNPJ(cnpj: string): boolean {
  const cleaned = normalizeCompanyDocument(cnpj)

  if (cleaned.length !== CNPJ_LENGTH) return false
  if (/^(\d)\1+$/.test(cleaned)) return false

  let length = cleaned.length - 2
  let numbers = cleaned.substring(0, length)
  const digits = cleaned.substring(length)

  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number(digits.charAt(0))) return false

  length += 1
  numbers = cleaned.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  return result === Number(digits.charAt(1))
}

export function isValidCompanyDocument(value: string) {
  const cleaned = normalizeCompanyDocument(value)

  if (cleaned.length === CPF_LENGTH) return isValidCPF(cleaned)
  if (cleaned.length === CNPJ_LENGTH) return isValidCNPJ(cleaned)

  return false
}
