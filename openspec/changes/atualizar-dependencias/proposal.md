## Why

O `pnpm audit` apontava **178 vulnerabilidades** (7 críticas, 75 altas), entre elas RCE não autenticada no Next.js (Image Optimization com AVIF) e falhas no Auth.js que podiam fazer checagens de autenticação "falharem abertas". As dependências estavam paradas desde a entrega da aplicação e o lint do projeto não rodava (varria `.next/`).

## What Changes

- Atualiza `next` 16.1.1 → 16.4.1 e `react`/`react-dom` 19.2.0 → 19.3.1 (corrige as RCEs críticas).
- Atualiza `next-auth` 5.0.0-beta.30 → 5.0.0-beta.32 (`@auth/core` 0.41.3) e `@auth/prisma-adapter` 2.11.3 (corrige as falhas críticas do Auth.js).
- Atualiza todas as demais dependências para a última versão **dentro do mesmo major**: Prisma 7.10, Radix, TipTap, TanStack Query, axios, zod, Tailwind 4.3, Supabase JS, etc.
- `@types/node` 20 → 24, alinhado ao Node 24 usado localmente e na Vercel.
- `@biomejs/biome` 2.2 → 2.5.15, com migração do `biome.json` e ajustes de formatação/ordem de classes aplicados pelo próprio Biome.
- **Remove** `next-pwa` e `@types/next-pwa`: o plugin nunca esteve ativo (o `next.config.ts` chamava `PWA()` sem envolver a config) e puxava um `next@13` vulnerável. O `public/manifest.json` continua.
- `biome.json` passa a ignorar `.next/`, `node_modules/`, `src/generated/`, `next-env.d.ts` e `*.svg`, então `pnpm lint` volta a ser utilizável.
- `pnpm-workspace.yaml`: libera os scripts de build de `prisma`, `@prisma/engines`, `esbuild` e `sharp` (o pnpm tinha deixado placeholders).

Majors **não** atualizados nesta mudança (exigem migração de código): lucide-react 1.x, motion/framer-motion 14, react-day-picker 10, react-share 6, react-intersection-observer 11, @supabase/ssr 0.12, dotenv 18, TypeScript 7 e Prisma 8 (ainda RC).

## Capabilities

### New Capabilities
- `seguranca-dependencias`: o projeto mantém dependências sem vulnerabilidades críticas conhecidas e com verificação de qualidade (lint, typecheck, build) executável.

### Modified Capabilities
<!-- nenhuma: não há mudança de comportamento funcional da aplicação -->

## Impact

- **Código**: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `biome.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` e 41 arquivos em `src/` com mudanças apenas de estilo (ordem de classes Tailwind, imports, formatação).
- **Schema do Prisma**: sem alteração e sem migration nova. O `prisma migrate deploy` do build não aplica nada.
- **Deploy**: o build da Vercel passa a usar Next 16.4.1 e Prisma 7.10 nos dois ambientes.
- **Riscos residuais**: 4 vulnerabilidades (2 altas, 2 moderadas) em ferramentas de build (`mysql2` e `deepmerge-ts` dentro do CLI do Prisma, `postcss-selector-parser` no `@tailwindcss/typography`), que não vão para o runtime.
