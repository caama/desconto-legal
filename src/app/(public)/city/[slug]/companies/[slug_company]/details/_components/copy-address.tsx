'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function CopyAddress({ address }: { address: string }) {
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    if (!hasCopied) return
    const timeout = setTimeout(() => setHasCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [hasCopied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address)
      setHasCopied(true)
      toast.success('Endereço copiado')
    } catch {
      toast.error('Não foi possível copiar. Selecione o endereço e copie manualmente.')
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="w-full sm:w-auto">
      {hasCopied ? <Check className="text-emerald-600" /> : <Copy />}
      {hasCopied ? 'Copiado' : 'Copiar endereço'}
    </Button>
  )
}
