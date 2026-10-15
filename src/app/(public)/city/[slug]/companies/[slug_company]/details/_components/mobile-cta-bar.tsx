'use client'

import { useEffect, useState } from 'react'
import { WhatsappCompany } from '@/app/(public)/_components/whatsapp-company'
import { cn } from '@/lib/utils'
import { QUICK_ACTIONS_ID } from './quick-actions'

type MobileCtaBarProps = {
  companyId: string
  companyName: string
  whatsapp: string
  discount: string
}

// Como a barra de reserva do Airbnb: só aparece quando as ações rápidas saem da tela por cima
export function MobileCtaBar({ companyId, companyName, whatsapp, discount }: MobileCtaBarProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById(QUICK_ACTIONS_ID)
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-14px_rgb(15_23_42/0.3)] transition-transform duration-300 ease-out lg:hidden',
        isVisible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      )}
      aria-hidden={!isVisible}
      inert={!isVisible}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-emerald-700 text-sm">{discount}</p>
          <p className="truncate text-muted-foreground text-xs">{companyName}</p>
        </div>
        <WhatsappCompany companyId={companyId} whatsapp={whatsapp} label="WhatsApp" className="h-10 w-auto shrink-0 px-5" />
      </div>
    </div>
  )
}
