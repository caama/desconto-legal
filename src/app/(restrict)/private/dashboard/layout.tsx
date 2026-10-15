import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { SidebarDashboard } from './_components/sidebar'
import { SIDEBAR_COLLAPSED_COOKIE } from './_components/sidebar/constants'

export const metadata: Metadata = {
  title: 'Empresas | Desconto Legal',
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Lê a preferência no servidor para a sidebar já chegar no estado certo, sem piscar
  const cookieStore = await cookies()
  const defaultCollapsed = cookieStore.get(SIDEBAR_COLLAPSED_COOKIE)?.value === 'true'

  return <SidebarDashboard defaultCollapsed={defaultCollapsed}>{children}</SidebarDashboard>
}
