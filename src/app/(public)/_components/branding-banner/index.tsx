'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { CSSProperties } from 'react'

// Recortes em semicírculo na borda superior, feitos como máscara (furos reais, sem pintar por cima do fundo).
// O raio (--scallop-r) é um valor inteiro em px por breakpoint e os ladrilhos partem da esquerda, para tudo cair em
// pixel inteiro. A seção mascarada fica parada: só o conteúdo anima, senão a máscara é redesenhada a cada quadro.
const scallopMask = {
  maskImage:
    'radial-gradient(circle at 50% 0, transparent var(--scallop-r), #000 calc(var(--scallop-r) + 0.5px)), linear-gradient(#000, #000)',
  maskSize: 'calc(var(--scallop-r) * 3) var(--scallop-r), 100% 100%',
  maskPosition: 'left top, left calc(var(--scallop-r) - 1px)',
  maskRepeat: 'repeat-x, no-repeat',
} satisfies CSSProperties

export function BrandingBanner() {
  return (
    <section
      className="relative w-full bg-[#22254c] text-white [--scallop-r:12px] sm:[--scallop-r:16px] md:[--scallop-r:20px] lg:[--scallop-r:24px] xl:[--scallop-r:28px]"
      style={{
        ...scallopMask,
        WebkitMaskImage: scallopMask.maskImage,
        WebkitMaskSize: scallopMask.maskSize,
        WebkitMaskPosition: scallopMask.maskPosition,
        WebkitMaskRepeat: scallopMask.maskRepeat,
      }}
    >
      <motion.div
        className="container mx-auto grid max-w-6xl items-center gap-8 px-6 pt-16 pb-12 sm:pt-20 md:grid-cols-2 md:gap-12 md:py-24 lg:px-8"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex justify-center md:justify-start">
          <Image
            src="/assets/logo-desconto-legal.png"
            alt="Desconto Legal — Programa de Vantagem CAAMA"
            width={998}
            height={494}
            sizes="(min-width: 768px) 440px, 300px"
            className="h-auto w-full max-w-75 md:max-w-110"
            quality={100}
            priority
          />
        </div>

        <div className="space-y-5 text-center text-base text-white/90 leading-relaxed md:text-left lg:text-lg">
          <p>
            O Desconto Legal é um programa de benefícios que oferece aos advogados associados acesso a descontos exclusivos em
            empresas conveniadas em todo o Maranhão, facilitando o dia a dia e gerando economia com produtos e serviços.
          </p>
          <p>
            Ao selecionar sua cidade, o profissional pode explorar diversas vantagens disponíveis, aproveitando condições
            especiais pensadas para valorizar a advocacia dentro e fora do ambiente profissional.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
