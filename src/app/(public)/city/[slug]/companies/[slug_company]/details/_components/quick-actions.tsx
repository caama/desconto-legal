'use client'

import { MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { addVisitorInCompany } from '@/app/(public)/_actions/add-visitor-in-company'
import { cn } from '@/lib/utils'
import { generateWhatsAppLink } from '@/utils/generate-whatsapp-link'

export const QUICK_ACTIONS_ID = 'acoes-rapidas'

type QuickActionsProps = {
  companyId: string
  whatsapp: string
  instagram: string
  locationUrl: string
}

// Fileira de ações no estilo do perfil de um local no Google Maps: o que dá para fazer, a um toque
export function QuickActions({ companyId, whatsapp, instagram, locationUrl }: QuickActionsProps) {
  return (
    <ul id={QUICK_ACTIONS_ID} className="mt-5 grid grid-cols-3 gap-2 sm:flex sm:gap-3" aria-label="Ações rápidas">
      <QuickAction
        href={generateWhatsAppLink({ whatsapp })}
        label="WhatsApp"
        icon={<FaWhatsapp className="size-5" />}
        primary
        external
        // O clique conta como visita: é o que leva a empresa ao destaque
        onClick={() => addVisitorInCompany({ companyId })}
      />
      <QuickAction href={locationUrl} label="Localização" icon={<MapPin className="size-5" />} external />
      {instagram && (
        <QuickAction
          href={`https://instagram.com/${instagram}`}
          label="Instagram"
          icon={<FaInstagram className="size-5" />}
          external
        />
      )}
    </ul>
  )
}

type QuickActionProps = {
  href: string
  label: string
  icon: ReactNode
  primary?: boolean
  external?: boolean
  onClick?: () => void
}

function QuickAction({ href, label, icon, primary, external, onClick }: QuickActionProps) {
  return (
    <li>
      <a
        href={href}
        onClick={onClick}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        className="group flex flex-col items-center gap-1.5 rounded-xl px-1 py-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-20"
      >
        <span
          className={cn(
            'flex size-12 items-center justify-center rounded-full transition-[transform,background-color,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-active:translate-y-0 group-active:scale-95',
            primary
              ? 'bg-emerald-600 text-white shadow-[0_8px_18px_-8px_rgb(5_150_105/0.7)] group-hover:bg-emerald-700'
              : 'border bg-card text-primary shadow-xs group-hover:border-primary/30 group-hover:bg-primary/5'
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className={cn('font-medium text-xs', primary ? 'text-emerald-700' : 'text-foreground/80')}>{label}</span>
      </a>
    </li>
  )
}
