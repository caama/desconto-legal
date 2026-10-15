'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { generateWhatsAppLink } from '@/utils/generate-whatsapp-link'
import { addVisitorInCompany } from '../../_actions/add-visitor-in-company'

type WhatsappCompanyProps = {
  companyId: string
  whatsapp: string
  label?: string
  className?: string
}

export function WhatsappCompany({ companyId, whatsapp, label = 'Chamar no WhatsApp', className }: WhatsappCompanyProps) {
  const whatsAppLink = generateWhatsAppLink({
    whatsapp: whatsapp,
  })

  // O clique conta como visita: é o que leva a empresa ao destaque
  async function handleAddVisitor() {
    await addVisitorInCompany({ companyId })
  }

  return (
    <Button asChild variant="whatsapp" className={cn('w-full', className)}>
      <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" onClick={handleAddVisitor}>
        <FaWhatsapp />
        {label}
      </a>
    </Button>
  )
}
