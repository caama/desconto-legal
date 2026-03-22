'use client'

import { Building2, Layers, LogOut, PlusCircle, User } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { CiMenuFries } from 'react-icons/ci'
import { LuMapPinHouse, LuPanelLeftOpen, LuPanelRightOpen } from 'react-icons/lu'
import { RiProfileLine } from 'react-icons/ri'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { SidebarLink } from './sidebar-link'

export function SidebarDashboard({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession()

  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  async function handleSignOut() {
    await signOut()
    await update(session?.user.image as string)

    router.push('/private/sign-in')
  }

  return (
    <main className="flex min-h-screen w-full">
      {/* Menu Sidebar Desktop */}
      <aside
        className={cn('flex h-full flex-col border-r bg-background p-4 z-50 transition-all duration-300', {
          'w-20': isCollapsed,
          'w-68': !isCollapsed,
          'hidden md:fixed md:flex md:items-center': true,
        })}
      >
        {isCollapsed ? (
          <Image src="/assets/caama-2025.png" alt="Logo CAAMA" width={50} height={50} quality={100} priority />
        ) : (
          <Image src="/assets/logo-caama.png" alt="Logo CAAMA" width={220} height={60} quality={100} priority />
        )}

        <Separator className="my-4" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn('self-end', {
                'self-center': isCollapsed,
              })}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <LuPanelLeftOpen className="size-4" strokeWidth={1.6} />
              ) : (
                <LuPanelRightOpen className="size-4" strokeWidth={1.6} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-linear-to-r from-primary to-sky-600 font-medium" side={isCollapsed ? 'right' : 'top'}>
            <p>{isCollapsed ? 'Expandir' : 'Minimizar'}</p>
          </TooltipContent>
        </Tooltip>

        {isCollapsed && <Separator className="mt-3 mb-2" />}

        {/* Quando collapsed exibirá somente os icones do menu */}
        {isCollapsed && (
          <>
            <nav className="flex flex-col gap-4 overflow-hidden">
              <SidebarLink
                href="/private/dashboard"
                icon={<Building2 className="size-4" />}
                label="Empresas"
                pathname={pathname}
                isCollapsed={isCollapsed}
                setIsSheetOpen={setIsSheetOpen}
              />

              <SidebarLink
                href="/private/dashboard/new-company"
                icon={<PlusCircle className="size-4" />}
                label="Nova empresa"
                pathname={pathname}
                isCollapsed={isCollapsed}
                setIsSheetOpen={setIsSheetOpen}
              />

              {session && session.user.role === 'ADMIN' && (
                <>
                  <SidebarLink
                    href="/private/dashboard/category"
                    icon={<Layers className="size-4" />}
                    label="Categorias"
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    setIsSheetOpen={setIsSheetOpen}
                  />
                  <SidebarLink
                    href="/private/dashboard/city"
                    icon={<LuMapPinHouse className="size-4" />}
                    label="Cidades"
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    setIsSheetOpen={setIsSheetOpen}
                  />
                  <SidebarLink
                    href="/private/dashboard/users"
                    icon={<User className="size-4" />}
                    label="Usuários"
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    setIsSheetOpen={setIsSheetOpen}
                  />
                </>
              )}

              {isCollapsed && <Separator />}

              <SidebarLink
                href="/private/dashboard/profile"
                icon={<RiProfileLine className="size-4" />}
                label="Perfil"
                pathname={pathname}
                isCollapsed={isCollapsed}
                setIsSheetOpen={setIsSheetOpen}
              />
            </nav>

            {isCollapsed && session && (
              <div className="mt-auto flex flex-col gap-3">
                <Image
                  src={session.user.image ?? ''}
                  alt={session.user.name ?? ''}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="w-full transition-all duration-300" size="icon" onClick={handleSignOut}>
                      <LogOut className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-linear-to-r from-primary to-sky-600 font-medium" side="right">
                    Sair
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </>
        )}

        <Collapsible open={!isCollapsed} className="mt-4 w-full self-start">
          <CollapsibleContent>
            <nav className="flex flex-col gap-2.5 overflow-hidden">
              <h3 className="font-semibold text-muted-foreground text-xs uppercase">Administrativo</h3>
              <SidebarLink
                href="/private/dashboard"
                icon={<Building2 className="size-4" />}
                label="Empresas"
                pathname={pathname}
                isCollapsed={isCollapsed}
                setIsSheetOpen={setIsSheetOpen}
              />

              <SidebarLink
                href="/private/dashboard/new-company"
                icon={<PlusCircle className="size-4" />}
                label="Nova Empresa"
                pathname={pathname}
                isCollapsed={isCollapsed}
                setIsSheetOpen={setIsSheetOpen}
              />
              {session && session.user.role === 'ADMIN' && (
                <>
                  <SidebarLink
                    href="/private/dashboard/category"
                    icon={<Layers className="size-4" />}
                    label="Categorias"
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    setIsSheetOpen={setIsSheetOpen}
                  />
                  <SidebarLink
                    href="/private/dashboard/city"
                    icon={<LuMapPinHouse className="size-4" />}
                    label="Cidades"
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    setIsSheetOpen={setIsSheetOpen}
                  />
                  <SidebarLink
                    href="/private/dashboard/users"
                    icon={<User className="size-4" />}
                    label="Usuários"
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    setIsSheetOpen={setIsSheetOpen}
                  />
                </>
              )}

              <Separator className="my-2" />

              <h3 className="font-semibold text-muted-foreground text-xs uppercase">Minha Conta</h3>
              <SidebarLink
                href="/private/dashboard/profile"
                icon={<RiProfileLine className="size-4" />}
                label="Perfil"
                pathname={pathname}
                isCollapsed={isCollapsed}
                setIsSheetOpen={setIsSheetOpen}
              />
            </nav>
          </CollapsibleContent>
        </Collapsible>

        {!isCollapsed && (
          <div className="mt-auto flex w-full flex-col space-y-2">
            <div className="flex items-center gap-3">
              {session?.user && (
                <Image
                  src={session.user.image ?? ''}
                  alt={session.user.name ?? ''}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="font-medium text-sm">{session?.user.name}</span>
                <span className="text-muted-foreground text-xs">{session?.user.email}</span>
              </div>
            </div>

            <Separator />

            <Button variant="outline" size="sm" className="w-full text-sm" onClick={handleSignOut}>
              <LogOut />
              Sair do sistema
            </Button>
          </div>
        )}
      </aside>

      {/* Menu Sidebar Mobile */}
      <div
        className={cn('flex flex-1 flex-col transition-all duration-300', {
          'md:ml-20': isCollapsed,
          'md:ml-64': !isCollapsed,
        })}
      >
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <div className="flex items-center justify-between px-4 py-2">
              <Image src="/assets/logo-caama.png" alt="Logo CAAMA" width={220} height={60} quality={100} priority />

              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsCollapsed(false)}>
                  <CiMenuFries className="size-4" />
                </Button>
              </SheetTrigger>
            </div>

            <SheetContent side="right">
              <SheetHeader className="border-b bg-card/80 p-2">
                <SheetTitle>
                  <Image src="/assets/logo-caama.png" alt="Logo CAAMA" width={220} height={60} quality={100} priority />
                </SheetTitle>
                <SheetDescription className="sr-only" />
              </SheetHeader>

              <nav className="mx-4 flex flex-col gap-2.5 overflow-hidden">
                <h3 className="ml-4 font-semibold text-muted-foreground text-xs uppercase">Administrativo</h3>
                <SidebarLink
                  href="/private/dashboard"
                  icon={<Building2 className="size-4" />}
                  label="Empresas"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  setIsSheetOpen={setIsSheetOpen}
                />

                <SidebarLink
                  href="/private/dashboard/new-company"
                  icon={<PlusCircle className="size-4" />}
                  label="Nova Empresa"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  setIsSheetOpen={setIsSheetOpen}
                />
                {session && session.user.role === 'ADMIN' && (
                  <>
                    <SidebarLink
                      href="/private/dashboard/category"
                      icon={<Layers className="size-4" />}
                      label="Categorias"
                      pathname={pathname}
                      isCollapsed={isCollapsed}
                      setIsSheetOpen={setIsSheetOpen}
                    />
                    <SidebarLink
                      href="/private/dashboard/city"
                      icon={<LuMapPinHouse className="size-4" />}
                      label="Cidades"
                      pathname={pathname}
                      isCollapsed={isCollapsed}
                      setIsSheetOpen={setIsSheetOpen}
                    />
                    <SidebarLink
                      href="/private/dashboard/users"
                      icon={<User className="size-4" />}
                      label="Usuários"
                      pathname={pathname}
                      isCollapsed={isCollapsed}
                      setIsSheetOpen={setIsSheetOpen}
                    />
                  </>
                )}

                <div className="mx-4">
                  <Separator className="my-2" />
                </div>

                <h3 className="ml-4 font-semibold text-muted-foreground text-xs uppercase">Minha Conta</h3>
                <SidebarLink
                  href="/private/dashboard/profile"
                  icon={<RiProfileLine className="size-4" />}
                  label="Perfil"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  setIsSheetOpen={setIsSheetOpen}
                />
              </nav>

              <SheetFooter className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  {session?.user && (
                    <Image
                      src={session.user.image ?? ''}
                      alt={session.user.name ?? ''}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{session?.user.name}</span>
                    <span className="text-muted-foreground text-xs">{session?.user.email}</span>
                  </div>
                </div>

                <Separator />

                <Button variant="outline" className="w-full" size="icon" onClick={handleSignOut}>
                  <LogOut />
                  Sair da sistema
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-1 px-6 py-2 md:p-6">{children}</div>
      </div>
    </main>
  )
}
