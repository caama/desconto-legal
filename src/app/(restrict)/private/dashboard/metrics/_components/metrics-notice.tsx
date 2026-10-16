import { InfoIcon } from 'lucide-react'

export function MetricsNotice() {
  return (
    <div className="hidden items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 p-4 sm:flex">
      <InfoIcon className="mt-0.5 size-4.5 shrink-0 text-amber-600 dark:text-amber-400" />

      <div className="flex flex-col gap-1.5 text-muted-foreground text-sm leading-relaxed">
        <p>
          <strong className="font-semibold text-foreground">Cadastros</strong> contam pela data em que a empresa entrou no painel.{' '}
          <strong className="font-semibold text-foreground">Contratos, subseções e categorias</strong> mostram a situação de hoje,
          independentemente do ano escolhido.
        </p>

        <p>
          <strong className="font-semibold text-foreground">Visitas</strong> são aberturas da página da empresa (uma por visitante
          a cada sessão) e <strong className="font-semibold text-foreground">contatos</strong> são cliques no WhatsApp. A coleta
          por período começou com esta tela; o total de contatos de cada empresa vem de antes.
        </p>
      </div>
    </div>
  )
}
