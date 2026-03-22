'use client'

import { ProgressProvider } from '@bprogress/next/app'

export function ProgressProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider height="6px" delay={2} options={{ showSpinner: false }} color="#1959A1" shallowRouting>
      {children}
    </ProgressProvider>
  )
}
