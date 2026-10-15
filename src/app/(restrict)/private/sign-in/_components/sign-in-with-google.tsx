'use client'

import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { handleRegister } from '../_actions/sign-in'
import { GoogleIcon } from './google-icon'

export function SignInWithGoogle() {
  const { status } = useSession()

  async function handleSignInWithGoogle() {
    await handleRegister({
      provider: 'google',
    })
  }

  return (
    <Card className="w-full max-w-lg bg-primary-foreground">
      <CardHeader>
        <CardTitle className="mx-auto">
          <Image src="/assets/logo-caama-2025.png" alt="Logo CAAMA" width={190} height={48} quality={100} />
        </CardTitle>
        <CardDescription className="mx-auto font-medium">Para entrar, faça login com sua conta Google</CardDescription>
      </CardHeader>

      <CardContent>
        {status === 'loading' ? (
          <Button className="w-full font-semibold text-primary-foreground" size="default">
            <Loader2 className="size-6 animate-spin" />
            Conectando...
          </Button>
        ) : (
          <Button type="button" className="w-full cursor-pointer font-semibold" size="default" onClick={handleSignInWithGoogle}>
            <GoogleIcon />
            Entrar com Google
          </Button>
        )}
      </CardContent>

      <CardFooter>
        <p className="mx-auto text-muted-foreground text-sm">Ao continuar, você concorda com os termos de uso e privacidade.</p>
      </CardFooter>
    </Card>
  )
}
