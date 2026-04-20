'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <main className="container relative z-10 mx-auto mb-12 flex flex-col items-center justify-center px-4 py-4 pt-10 md:flex-row">
        {/* Texto com fade + slide-up */}
        <motion.article
          className="max-w-3xl flex-2 flex-col space-y-6 md:space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Link href="/">
            <Image
              src="/assets/logo-caama.png"
              className="mb-10"
              alt="Logo CAAMA"
              width={400}
              height={100}
              quality={100}
              priority
            />
          </Link>

          <Badge
            variant="outline"
            className="mx-auto flex items-center gap-2 rounded-full bg-[#CACDD6] px-6 py-2 font-semibold text-sm text-white md:mx-0 md:justify-center"
          >
            Benefícios Exclusivos para Advogados
          </Badge>

          <h2 className="text-center font-calsans text-4xl text-[#1D2B58] tracking-tight md:text-left md:text-5xl md:tracking-wide lg:text-6xl">
            Acesse <span className="font-bold text-primary">empresas</span>{' '}
            <span className="font-bold text-red-800">conveniadas</span> em todo <span className="font-bold">Maranhão</span>
          </h2>

          <p className="max-w-2xl text-pretty text-center text-[#1D2B58] text-base md:text-left md:text-lg">
            Descontos e benefícios exclusivos para advogados associados à CAAMA. Selecione sua cidade e descubra todas as
            vantagens disponíveis.
          </p>
        </motion.article>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <Image
            src="/assets/hero.png"
            alt="Foto de conexão entre advogados e empresas"
            width={700}
            height={600}
            className="object-contain"
            quality={100}
            priority
          />
        </motion.div>
      </main>
    </div>
  )
}
