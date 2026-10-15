'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { type PointerEvent, type ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'

// Deslocamento máximo do logo, em px, na direção do cursor
const LOGO_SHIFT = 6
const SPRING = { stiffness: 260, damping: 24, mass: 0.6 }

type InteractiveCardProps = {
  children: ReactNode
  className?: string
}

// Sobe com mola, acende uma luz que segue o cursor e desloca o logo (parallax) via --logo-x/--logo-y.
// Sem rotação 3D de propósito: girar o card faz o navegador reamostrar o texto e ele fica borrado.
// Só reage a mouse: no toque não há hover, e quem pede menos movimento ao sistema recebe o card parado.
export function InteractiveCard({ children, className }: InteractiveCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // Posição do cursor dentro do card, de 0 a 1 (0,5 é o centro)
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)

  const logoX = useSpring(useTransform(pointerX, [0, 1], [-LOGO_SHIFT, LOGO_SHIFT]), SPRING)
  const logoY = useSpring(useTransform(pointerY, [0, 1], [-LOGO_SHIFT, LOGO_SHIFT]), SPRING)

  // O logo fica em outro componente: a posição chega a ele por variáveis CSS escritas direto no elemento, sem re-render
  useMotionValueEvent(logoX, 'change', value => ref.current?.style.setProperty('--logo-x', `${value}px`))
  useMotionValueEvent(logoY, 'change', value => ref.current?.style.setProperty('--logo-y', `${value}px`))

  const lightX = useTransform(pointerX, value => `${value * 100}%`)
  const lightY = useTransform(pointerY, value => `${value * 100}%`)
  const light = useMotionTemplate`radial-gradient(320px circle at ${lightX} ${lightY}, color-mix(in oklch, var(--primary) 9%, transparent), transparent 65%)`

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || !ref.current) return

    const { left, top, width, height } = ref.current.getBoundingClientRect()
    pointerX.set((event.clientX - left) / width)
    pointerY.set((event.clientY - top) / height)
  }

  function handlePointerLeave() {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  if (prefersReducedMotion) {
    return <div className={cn('h-full', className)}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', ...SPRING }}
      className={cn('relative h-full', className)}
    >
      {children}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: light }}
      />
    </motion.div>
  )
}
