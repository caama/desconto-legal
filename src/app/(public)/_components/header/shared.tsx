'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { WhatsappShareButton } from 'react-share'

export function Shared({ url }: { url: string }) {
  return (
    <WhatsappShareButton url={url}>
      <div className="flex h-8 min-w-36 items-center justify-center gap-1.5 rounded-sm border bg-primary px-4 text-muted hover:opacity-90">
        <FaWhatsapp className="size-3.5" />
        <h2 className="font-semibold text-xs">Compartilhe</h2>
        <span className="animate-wave">👋🏻</span>
      </div>
    </WhatsappShareButton>
  )
}
