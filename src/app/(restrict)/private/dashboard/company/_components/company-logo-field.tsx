'use client'

import { ImageUp, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { type ChangeEvent, useId, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg']
const MAX_SIZE_IN_BYTES = 5 * 1024 * 1024

type UploadResult = {
  url: string
  public_id: string
}

type CompanyLogoFieldProps = {
  logoUrl?: string
  publicImageId?: string
  onChange: (logo: { logoUrl?: string; publicImageId?: string }) => void
  // Executado depois de apagar o arquivo do storage (ex.: limpar a referência no banco na edição)
  onRemoved?: (publicImageId: string) => Promise<void>
}

export function CompanyLogoField({ logoUrl, publicImageId, onChange, onRemoved }: CompanyLogoFieldProps) {
  const inputId = useId()
  const [isUploading, setIsUploading] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  async function handleChangeImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Permite escolher o mesmo arquivo de novo depois de remover
    event.target.value = ''

    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Formato inválido', { description: 'Envie uma imagem PNG ou JPG.' })
      return
    }

    if (file.size > MAX_SIZE_IN_BYTES) {
      toast.error('Imagem muito grande', { description: 'O tamanho máximo é 5 MB.' })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', new File([file], `${Date.now()}-${file.name}`, { type: file.type }))

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        toast.error('Não foi possível enviar a imagem')
        return
      }

      const data: UploadResult = await response.json()

      onChange({ logoUrl: data.url, publicImageId: data.public_id })
      toast.success('Logo carregada')
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível enviar a imagem')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleRemoveImage() {
    setIsRemoving(true)

    try {
      if (publicImageId) {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/upload/delete`, {
          method: 'DELETE',
          body: JSON.stringify({ publicId: publicImageId }),
        })

        await onRemoved?.(publicImageId)
      }

      onChange({ logoUrl: undefined, publicImageId: undefined })
      toast.success('Logo removida', { description: 'Envie uma nova logo antes de salvar.' })
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível remover a imagem')
    } finally {
      setIsRemoving(false)
    }
  }

  const input = (
    <input
      id={inputId}
      type="file"
      accept={ACCEPTED_TYPES.join(',')}
      className="sr-only"
      onChange={handleChangeImage}
      disabled={isUploading || isRemoving}
    />
  )

  if (logoUrl) {
    return (
      <div className="space-y-3">
        <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
          <Image src={logoUrl} alt="Logo da empresa" fill sizes="320px" className="object-contain p-5" />

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <Loader2 className="size-5 animate-spin text-primary" aria-label="Enviando imagem" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label
            htmlFor={inputId}
            className={cn(
              'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 font-medium text-sm shadow-xs transition-colors hover:bg-muted has-focus-visible:ring-2 has-focus-visible:ring-primary/30',
              (isUploading || isRemoving) && 'pointer-events-none opacity-50'
            )}
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Trocar
            {input}
          </label>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            disabled={isUploading || isRemoving}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {isRemoving ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
            Remover
          </Button>
        </div>
      </div>
    )
  }

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'flex aspect-16/10 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-border border-dashed bg-muted/30 px-4 text-center transition-colors hover:border-primary/50 hover:bg-primary/4 has-focus-visible:ring-2 has-focus-visible:ring-primary/30',
        isUploading && 'pointer-events-none'
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-primary/8 text-primary">
        {isUploading ? <Loader2 className="size-5 animate-spin" /> : <ImageUp className="size-5" />}
      </span>
      <span>
        <span className="block font-medium text-foreground text-sm">{isUploading ? 'Enviando logo...' : 'Enviar logo'}</span>
        <span className="mt-0.5 block text-muted-foreground text-xs">PNG ou JPG, até 5 MB</span>
      </span>
      {input}
    </label>
  )
}
