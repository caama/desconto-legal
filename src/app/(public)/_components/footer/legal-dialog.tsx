'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type FooterLegalDialogProps = {
  title: string
  description: string
  children: React.ReactNode
}

export function FooterLegalDialog({ title, description, children }: FooterLegalDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-left text-inherit transition hover:text-blue-300 focus:outline-hidden focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-primary"
        >
          <span>•</span>
          <span>{title}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="text-primary text-xl">{title}</DialogTitle>
          <DialogDescription className="leading-relaxed">{description}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(85vh-112px)] overflow-y-auto px-6 py-5">
          <div className="space-y-5 text-left text-muted-foreground text-sm leading-7">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
