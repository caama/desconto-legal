'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function BrandingBanner() {
  return (
    <motion.section
      className="relative w-full bg-[#22254c] text-white"
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Recortes em semicírculo na borda superior */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-(--scallop-r) [--scallop-gap:calc(var(--scallop-r)*3)] [--scallop-r:clamp(0.75rem,1.8vw,1.75rem)]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0, var(--background) var(--scallop-r), transparent calc(var(--scallop-r) + 0.5px))',
          backgroundSize: 'var(--scallop-gap) var(--scallop-r)',
          backgroundPosition: 'center top',
          backgroundRepeat: 'repeat-x',
        }}
      />

      <div className="container mx-auto grid max-w-6xl items-center gap-8 px-6 pt-16 pb-12 sm:pt-20 md:grid-cols-2 md:gap-12 md:py-24 lg:px-8">
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
      </div>
    </motion.section>
  )
}
