'use client'

import {
  Building2,
  ChartColumn,
  CirclePlus,
  CircleUser,
  FileText,
  Layers,
  LogOut,
  MapPinHouse,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import type { Session } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { SIDEBAR_COLLAPSED_COOKIE } from './constants'
import { SidebarLink } from './sidebar-link'

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
  adminOnly?: boolean
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Operação',
    items: [
      { href: '/private/dashboard', label: 'Empresas', icon: <Building2 /> },
      { href: '/private/dashboard/new-company', label: 'Nova Empresa', icon: <CirclePlus /> },
    ],
  },
  {
    title: 'Administrativo',
    items: [
      { href: '/private/dashboard/metrics', label: 'Métricas', icon: <ChartColumn />, adminOnly: true },
      { href: '/private/dashboard/reports', label: 'Relatórios', icon: <FileText />, adminOnly: true },
      { href: '/private/dashboard/category', label: 'Categorias', icon: <Layers />, adminOnly: true },
      { href: '/private/dashboard/city', label: 'Cidades', icon: <MapPinHouse />, adminOnly: true },
      { href: '/private/dashboard/users', label: 'Usuários', icon: <Users />, adminOnly: true },
    ],
  },
  {
    title: 'Minha Conta',
    items: [{ href: '/private/dashboard/profile', label: 'Perfil', icon: <CircleUser /> }],
  },
]

// "Empresas" também fica ativo na edição de empresa (/private/dashboard/company/[id]/...)
function isActivePath(pathname: string, href: string) {
  if (href === '/private/dashboard') {
    return pathname === href || pathname.startsWith('/private/dashboard/company/')
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SidebarDashboard({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode
  defaultCollapsed?: boolean
}) {
  const { data: session, update } = useSession()

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  function handleToggleCollapsed() {
    const next = !isCollapsed
    setIsCollapsed(next)

    // Cookie lido no layout do painel (servidor) para manter a preferência entre recargas
    // biome-ignore lint/suspicious/noDocumentCookie: preferência simples de UI, sem dado sensível
    document.cookie = `${SIDEBAR_COLLAPSED_COOKIE}=${next}; path=/private/dashboard; max-age=31536000; samesite=lax`
  }

  async function handleSignOut() {
    await signOut()
    await update(session?.user.image as string)

    router.push('/private/sign-in')
  }

  const isAdmin = session?.user.role === 'ADMIN'

  return (
    <main className="flex min-h-screen w-full">
      {/* Menu Sidebar Desktop (a partir de lg; abaixo disso usa o menu mobile) */}
      <aside
        className={cn(
          'z-40 hidden h-dvh flex-col border-sidebar-border border-r bg-sidebar lg:fixed lg:inset-y-0 lg:left-0 lg:flex',
          'transition-[width] duration-300 ease-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div
          className={cn(
            'flex shrink-0 border-sidebar-border border-b',
            isCollapsed ? 'flex-col items-center gap-3 px-2 py-4' : 'h-16 items-center justify-between gap-2 pr-3 pl-4'
          )}
        >
          {isCollapsed ? (
            <Image src="/assets/caama-2025.png" alt="Logo CAAMA" width={50} height={25} quality={100} priority />
          ) : (
            <Image src="/assets/logo-caama.png" alt="Logo CAAMA" width={172} height={33} quality={100} priority />
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleToggleCollapsed}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? 'Expandir menu' : 'Minimizar menu'}
                className="shrink-0 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              >
                {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {isCollapsed ? 'Expandir menu' : 'Minimizar menu'}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <SidebarNav pathname={pathname} isAdmin={isAdmin} isCollapsed={isCollapsed} />
        </div>

        <div className="shrink-0 border-sidebar-border border-t p-3">
          <UserFooter session={session} isCollapsed={isCollapsed} onSignOut={handleSignOut} />
        </div>
      </aside>

      {/* Menu Sidebar Mobile (abaixo de lg) */}
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          'transition-[margin] duration-300 ease-out',
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <div className="flex items-center justify-between gap-4 px-4 py-2">
              <Image
                src="/assets/logo-caama.png"
                alt="Logo CAAMA"
                width={220}
                height={42}
                quality={100}
                priority
                className="h-auto w-44 sm:w-55"
              />

              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Abrir menu">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
            </div>

            <SheetContent side="right" className="flex w-72 flex-col gap-0 bg-sidebar p-0 sm:max-w-72">
              <SheetHeader className="h-16 shrink-0 justify-center border-sidebar-border border-b px-4">
                <SheetTitle>
                  <Image src="/assets/logo-caama.png" alt="Logo CAAMA" width={172} height={33} quality={100} />
                </SheetTitle>
                <SheetDescription className="sr-only">Menu de navegação do painel</SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-3 py-5">
                <SidebarNav pathname={pathname} isAdmin={isAdmin} isCollapsed={false} onNavigate={() => setIsSheetOpen(false)} />
              </div>

              <div className="shrink-0 border-sidebar-border border-t p-3">
                <UserFooter session={session} isCollapsed={false} onSignOut={handleSignOut} />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-1 px-6 py-2 md:p-6">{children}</div>
      </div>
    </main>
  )
}

type SidebarNavProps = {
  pathname: string
  isAdmin: boolean
  isCollapsed: boolean
  onNavigate?: () => void
}

function SidebarNav({ pathname, isAdmin, isCollapsed, onNavigate }: SidebarNavProps) {
  return (
    <nav aria-label="Menu do painel" className="flex flex-col gap-5">
      {NAV_SECTIONS.map((section, index) => {
        const items = section.items.filter(item => !item.adminOnly || isAdmin)

        if (items.length === 0) return null

        return (
          <div key={section.title} className={cn('flex flex-col gap-1', isCollapsed && 'items-center')}>
            {isCollapsed ? (
              index > 0 && <Separator className="mb-3 w-8! bg-sidebar-border" />
            ) : (
              <p className="mb-1 px-3 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">{section.title}</p>
            )}

            {items.map(item => (
              <SidebarLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActivePath(pathname, item.href)}
                isCollapsed={isCollapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )
      })}
    </nav>
  )
}

function UserAvatar({ name, image, size = 32 }: { name?: string | null; image?: string | null; size?: number }) {
  if (image) {
    return (
      <Image
        src={image}
        referrerPolicy="no-referrer"
        alt={name ?? ''}
        width={size}
        height={size}
        className="shrink-0 rounded-full ring-1 ring-border"
      />
    )
  }

  const initials = (name ?? '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

type UserFooterProps = {
  session: Session | null
  isCollapsed: boolean
  onSignOut: () => void
}

function UserFooter({ session, isCollapsed, onSignOut }: UserFooterProps) {
  const user = session?.user

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        {user && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex">
                <UserAvatar name={user.name} image={user.image} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {user.name}
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onSignOut}
              aria-label="Sair do sistema"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Sair do sistema
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg px-1 py-1">
      {user && <UserAvatar name={user.name} image={user.image} />}

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground text-sm leading-tight" title={user?.name ?? undefined}>
          {user?.name}
        </p>
        <p className="truncate text-muted-foreground text-xs leading-tight" title={user?.email ?? undefined}>
          {user?.email}
        </p>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onSignOut}
            aria-label="Sair do sistema"
            className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Sair do sistema</TooltipContent>
      </Tooltip>
    </div>
  )
}
