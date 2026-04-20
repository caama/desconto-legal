'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Trash2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { type ChangeEvent, useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteImageCompany } from '../../../_actions/delete-image-company'

type AvatarCompanyUpdateProps = {
  logoUrl: string
  setLogoUrl: (logoUrl: string) => void
  publicImageId: string
  setPublicImageId: (publicImageId: string) => void
}

type UploadResultProps = {
  url: string
  public_id: string
}

export function AvatarCompanyUpdate({ logoUrl, publicImageId, setLogoUrl, setPublicImageId }: AvatarCompanyUpdateProps) {
  const queryClient = useQueryClient()

  const [loadingImage, setLoadingImage] = useState(false)
  const [loadingRemoveImage, setLoadingRemoveImage] = useState(false)

  async function handleChangeImage(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setLoadingImage(true)
      const image = event.target.files[0]

      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        toast.error('Formato de imagem inválido')
        setLoadingImage(false)
        return
      }

      const newImageName = `${Date.now()}-${image.name}`
      const newImage = new File([image], newImageName, { type: image.type })

      const response = await handleUploadImage(newImage)

      if (response) {
        setLogoUrl(response.url)
        setPublicImageId(response.public_id)
      }
    }
  }

  async function handleUploadImage(image: File): Promise<UploadResultProps | null> {
    try {
      toast.warning('Aguarde! Carregando imagem...')

      const formData = new FormData()
      formData.append('file', image)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        toast.error('Erro ao enviar imagem')
        return null
      }

      const data: UploadResultProps = await response.json()

      setLoadingImage(false)

      toast.success('Imagem carregada com sucesso')

      return data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async function handleRemoveImage(publicImageId: string) {
    setLoadingRemoveImage(true)

    // Deleta a imagem do Cloudinary
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/upload/delete`, {
      method: 'DELETE',
      body: JSON.stringify({ publicId: publicImageId }),
    })

    // Deleta a imagem do banco de dados
    await deleteImageCompany({ publicImageId })

    await queryClient.invalidateQueries({
      queryKey: ['companies'],
    })

    toast.info('Imagem removida com sucesso', {
      description: 'Adicione uma nova imagem para atualizar',
    })

    setLoadingRemoveImage(false)
    setLogoUrl('')
    setPublicImageId('')
  }

  return (
    <div className="mx-auto max-w-md px-8">
      {logoUrl ? (
        <div className="relative h-48 w-96 overflow-hidden rounded-xl border border-border">
          <Image
            src={logoUrl}
            alt="Preview da Imagem"
            fill
            priority
            quality={100}
            className="w-full rounded-xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <Button
            type="button"
            title="Remover"
            variant="destructive"
            size="icon-sm"
            className="absolute top-2 right-2 p-1"
            onClick={() => handleRemoveImage(publicImageId)}
          >
            {loadingRemoveImage ? (
              <ImSpinner2 className="size-5 animate-spin text-muted" />
            ) : (
              <Trash2 className="size-5 text-muted" />
            )}
          </Button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="relative block w-full cursor-pointer rounded-xl border-2 border-primary/40 border-dashed p-8 transition-all hover:border-primary hover:bg-primary/5"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              {loadingImage ? (
                <ImSpinner2 className="size-6 animate-spin text-primary" />
              ) : (
                <Upload className="size-6 text-primary" />
              )}
            </div>

            <div className="text-center">
              {loadingImage ? (
                <>
                  <p className="font-medium text-foreground text-sm">Realizando upload da imagem</p>
                  <p className="mt-1 text-muted-foreground text-xs">Aguarde uns instantes...</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-foreground text-sm">Clique para enviar a imagem</p>
                  <p className="mt-1 text-muted-foreground text-xs">PNG, JPG, JPEG até 5MB</p>
                </>
              )}
            </div>
          </div>

          <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleChangeImage} />
        </label>
      )}
    </div>
  )
}
