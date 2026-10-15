import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type SidebarLinkProps = {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  isCollapsed: boolean
  onNavigate?: () => void
}

export function SidebarLink({ href, icon, label, isActive, isCollapsed, onNavigate }: SidebarLinkProps) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex h-9 items-center rounded-md font-medium text-sm outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary/40',
        isCollapsed ? 'w-9 justify-center' : 'gap-3 px-3',
        isActive
          ? 'bg-primary text-primary-foreground shadow-xs'
          : 'text-foreground/70 hover:bg-sidebar-accent hover:text-foreground'
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4" aria-hidden="true">
        {icon}
      </span>
      {isCollapsed ? <span className="sr-only">{label}</span> : <span className="truncate">{label}</span>}
    </Link>
  )

  if (!isCollapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
