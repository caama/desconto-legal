'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Ban, CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { activeCompany } from '../_actions/active-company'
import { inactiveCompany } from '../_actions/inactive-company'

type InactiveCompanyProps = {
  company: {
    id: string
    active: boolean
  }
}

export function InactiveCompany({ company }: InactiveCompanyProps) {
  const [isLoading, setIsLoading] = useState(false)

  const queryClient = useQueryClient()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function handleInactiveCompany(id: string) {
    setIsLoading(true)

    const response = await inactiveCompany({ id })

    if (response.error) {
      toast.error(response.error)
      setIsLoading(false)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['companies'] })

    toast.success(response.message)
    setIsDialogOpen(false)
    setIsLoading(false)
  }

  async function handleActiveCompany(id: string) {
    setIsLoading(true)

    const response = await activeCompany({ id })

    if (response.error) {
      toast.error(response.error)
      setIsLoading(false)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['companies'] })

    toast.success(response.message)
    setIsDialogOpen(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn(
                'size-7 rounded-md text-muted-foreground',
                company.active
                  ? 'hover:bg-destructive/10 hover:text-destructive'
                  : 'hover:bg-emerald-500/10 hover:text-emerald-700'
              )}
            >
              {company.active ? <Ban className="size-4" /> : <CircleCheck className="size-4" />}
              <span className="sr-only">{company.active ? 'Inativar empresa' : 'Ativar empresa'}</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{company.active ? 'Inativar empresa' : 'Ativar empresa'}</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          {company.active ? (
            <>
              <DialogTitle>Inativar empresa</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja inativar esta empresa? Ela deixará de aparecer na listagem pública até ser ativada
                novamente.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Ativar empresa</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja ativar esta empresa? Ela voltará a aparecer na listagem pública.
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm" type="button" className="rounded-sm md:w-[50%]">
              Cancelar
            </Button>
          </DialogClose>

          {company.active ? (
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              size="sm"
              className="rounded-sm md:w-[50%]"
              onClick={() => handleInactiveCompany(company.id)}
            >
              {isLoading ? (
                <>
                  <ImSpinner2 className="animate-spin" />
                  Inativando...
                </>
              ) : (
                <>
                  <Ban className="size-4" />
                  Inativar
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isLoading}
              variant="whatsapp"
              size="sm"
              className="rounded-sm md:w-[50%]"
              onClick={() => handleActiveCompany(company.id)}
            >
              {isLoading ? (
                <>
                  <ImSpinner2 className="animate-spin" />
                  Ativando...
                </>
              ) : (
                <>
                  <CircleCheck className="size-4" />
                  Ativar
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
