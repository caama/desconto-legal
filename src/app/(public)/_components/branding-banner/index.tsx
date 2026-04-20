'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function BrandingBanner() {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src="/assets/brainding.png"
        alt="Foto de conexão entre advogados e empresas"
        width={1920}
        height={1080}
        sizes="100vw"
        className="block h-auto w-full object-contain"
        quality={100}
        priority
      />
    </motion.div>
  )
}
