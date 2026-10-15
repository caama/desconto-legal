import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type SocialTooltipProps = {
  children: React.ReactNode
  link: string
  label: string
}

export function SocialTooltip({ children, link, label }: SocialTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <Button size="icon-sm" variant="ghost" className="hover:bg-transparent">
            <Link href={link} target="_blank" className="text-primary">
              {children}
            </Link>
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
