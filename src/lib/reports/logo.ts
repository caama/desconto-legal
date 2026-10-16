import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Proporção de public/assets/logo-caama.png (3131 × 596)
export const LOGO_RATIO = 3131 / 596

let logoCache: Promise<Buffer> | null = null

// Na Vercel o arquivo entra no pacote da função pelo outputFileTracingIncludes do next.config.ts
export function getReportLogo() {
  logoCache ??= readFile(path.join(process.cwd(), 'public', 'assets', 'logo-caama.png')).catch(error => {
    // Falha não fica em cache: a próxima exportação tenta ler de novo
    logoCache = null
    throw error
  })

  return logoCache
}
