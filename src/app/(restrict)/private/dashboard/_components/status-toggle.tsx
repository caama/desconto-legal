'use client'

import { Ban, CircleCheck, Loader2, RotateCcw, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
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
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type ActionResponse = { error?: string; message?: string }

type StatusToggleProps = {
  isActive: boolean
  name: string
  // Ex.: "cidade" -> "Inativar cidade", "Reativar cidade"
  entityLabel: string
  // O que acontece ao inativar e ao reativar (mostrado no diálogo)
  inactivateDescription: string
  activateDescription: string
  onToggle: () => Promise<ActionResponse>
  onDone?: () => unknown
  // Impede a ação e explica o motivo no tooltip (ex.: o próprio usuário)
  blockedReason?: string
}

export function StatusToggle({
  isActive,
  name,
  entityLabel,
  inactivateDescription,
  activateDescription,
  onToggle,
  onDone,
  blockedReason,
}: StatusToggleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isBlocked = isActive && !!blockedReason
  const verb = isActive ? 'Inativar' : 'Reativar'
  const tooltip = isBlocked ? blockedReason : `${verb} ${entityLabel}`

  // Fechar no meio da chamada esconderia o contexto: o toast chegaria sem o nome na tela
  function handleOpenChange(open: boolean) {
    if (!open && isSubmitting) return
    setIsDialogOpen(open)
  }

  async function handleConfirm() {
    setIsSubmitting(true)

    try {
      const response = await onToggle()

      if (response.error) {
        toast.error(response.error)
        return
      }

      await onDone?.()
      setIsDialogOpen(false)

      toast.success(isActive ? `${name} inativado(a).` : `${name} reativado(a).`, {
        description: isActive ? 'Aparece na aba de inativos e pode ser reativado a qualquer momento.' : undefined,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            aria-disabled={isBlocked}
            aria-label={`${verb} ${name}`}
            onClick={() => !isBlocked && setIsDialogOpen(true)}
            className={cn(
              'text-muted-foreground aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
              !isBlocked &&
                (isActive ? 'hover:bg-destructive/10 hover:text-destructive' : 'hover:bg-emerald-500/10 hover:text-emerald-700')
            )}
          >
            {isActive ? <Ban className="size-4" /> : <CircleCheck className="size-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center sm:items-start sm:text-left">
            <span
              className={cn(
                'mb-2 flex size-10 items-center justify-center rounded-full',
                isActive ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-700'
              )}
              aria-hidden="true"
            >
              {isActive ? <TriangleAlert className="size-5" /> : <RotateCcw className="size-5" />}
            </span>

            <DialogTitle>
              {verb} {name}?
            </DialogTitle>

            <DialogDescription className="leading-relaxed">
              {isActive ? inactivateDescription : activateDescription}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancelar
              </Button>
            </DialogClose>

            <Button
              type="button"
              variant={isActive ? 'destructive' : 'default'}
              disabled={isSubmitting}
              onClick={handleConfirm}
              className={cn(!isActive && 'bg-emerald-600 hover:bg-emerald-600/90')}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isActive ? 'Inativando...' : 'Reativando...'}
                </>
              ) : (
                `${verb} ${entityLabel}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
