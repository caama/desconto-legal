'use client'

import { Check, Copy, Mail, Share2 } from 'lucide-react'
import { type ReactNode, useEffect, useState } from 'react'
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const DEFAULT_TITLE = 'Desconto Legal: descontos e benefícios exclusivos para advogados da OAB-MA'

type SharedProps = {
  url: string
  // Texto que acompanha o link na mensagem compartilhada
  title?: string
}

export function Shared({ url, title = DEFAULT_TITLE }: SharedProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    if (!hasCopied) return
    const timeout = setTimeout(() => setHasCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [hasCopied])

  // No celular, a folha nativa do sistema já traz todos os apps instalados; o painel fica para o desktop
  async function handleOpenChange(open: boolean) {
    const prefersNativeShare = open && typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches

    if (!prefersNativeShare) {
      setIsOpen(open)
      return
    }

    try {
      await navigator.share({ title, text: title, url })
    } catch (error) {
      // Fechar a folha nativa sem escolher nada não é erro; qualquer outra falha cai no painel
      if (error instanceof DOMException && error.name === 'AbortError') return
      setIsOpen(true)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setHasCopied(true)
      toast.success('Link copiado')
    } catch {
      toast.error('Não foi possível copiar. Selecione o link e copie manualmente.')
    }
  }

  const encodedUrl = encodeURIComponent(url)
  const message = `${title}\n${url}`

  const targets: ShareTargetProps[] = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(message)}`,
      icon: <FaWhatsapp className="size-5" />,
      className: 'bg-[#25D366] text-white',
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <FaLinkedinIn className="size-4.5" />,
      className: 'bg-[#0A66C2] text-white',
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebookF className="size-4.5" />,
      className: 'bg-[#1877F2] text-white',
    },
    {
      label: 'E-mail',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`,
      icon: <Mail className="size-5" />,
      className: 'bg-muted text-foreground ring-1 ring-border',
    },
  ]

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {/* No celular só o ícone, para não apertar o cabeçalho; o rótulo continua para leitores de tela */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full px-4 shadow-xs has-[>svg]:px-3.5 max-sm:w-9 max-sm:has-[>svg]:px-0"
        >
          <Share2 className="size-4" />
          <span className="max-sm:sr-only">Compartilhar</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-80 rounded-xl p-0 shadow-[0_16px_40px_-16px_rgb(15_23_42/0.35)]">
        <div className="px-4 pt-4">
          <p className="font-semibold text-foreground text-sm">Compartilhar</p>
          <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-relaxed">{title}</p>
        </div>

        <ul className="grid grid-cols-4 gap-1 px-3 pt-4 pb-3">
          {targets.map(target => (
            <ShareTarget key={target.label} {...target} onSelect={() => setIsOpen(false)} />
          ))}
        </ul>

        <div className="border-t p-3">
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 py-1 pr-1 pl-3">
            <span className="min-w-0 flex-1 truncate text-muted-foreground text-xs" title={url}>
              {url.replace(/^https?:\/\//, '')}
            </span>
            <Button type="button" size="sm" onClick={handleCopy} className="h-7 shrink-0 gap-1.5 px-2.5 text-xs">
              {hasCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {hasCopied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

type ShareTargetProps = {
  label: string
  href: string
  icon: ReactNode
  className: string
  onSelect?: () => void
}

function ShareTarget({ label, href, icon, className, onSelect }: ShareTargetProps) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onSelect}
        className="group flex flex-col items-center gap-1.5 rounded-lg py-1.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span
          className={cn(
            'flex size-11 items-center justify-center rounded-full transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-active:scale-95',
            className
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="font-medium text-[11px] text-foreground/80">{label}</span>
      </a>
    </li>
  )
}
