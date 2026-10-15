## Context

A aplicação roda em dois ambientes na Vercel (homologação e produção), com banco PostgreSQL e CDN (Supabase self-hosted) no Coolify da CAAMA. O build executa `prisma migrate deploy` antes do `next build`. Não há suíte de testes automatizados: a verificação é feita com typecheck, lint, build e smoke test do servidor de produção.

## Goals / Non-Goals

**Goals:**
- Eliminar as vulnerabilidades críticas e altas que chegam ao runtime.
- Atualizar o que for compatível sem alterar comportamento.
- Deixar `pnpm lint` executável e passando.

**Non-Goals:**
- Atualizações de major que exigem migração de código (lucide-react 1.x, motion 14, etc.).
- Corrigir a falta de autenticação em rotas de API (ver Riscos).
- Ativar PWA/service worker.

## Decisions

- **Ficar dentro do mesmo major** em quase tudo. Alternativa considerada: `pnpm update --latest`. Descartada porque lucide-react 1.x renomeia/remove ícones usados em 47 arquivos e Prisma 8 ainda está em RC.
- **next-auth 5.0.0-beta.32** em vez de migrar para a v4 estável: o projeto já usa a API da v5 (`auth()`, `handlers`). A beta.32 é a primeira fora da faixa vulnerável (`<= beta.31`).
- **Remover `next-pwa`** em vez de atualizar: o plugin nunca foi aplicado (`PWA({ dest })` retorna um wrapper que não era usado) e o Next 16 builda com Turbopack, que ignora plugins de webpack. Remover não muda o comportamento e tira 2 críticas e várias altas (o `@types/next-pwa` dependia de `next@13`).
- **`@types/node` ^24** em vez de manter ^20: o runtime é Node 24 (local e Vercel) e o Node 20 entra em fim de vida em 2026.
- **Biome 2.5 com `biome migrate`** e correções `--write`: mantém as mesmas regras; as mudanças em `src/` são só de estilo. `css.parser.tailwindDirectives` foi ligado porque o Biome 2.5 passou a rejeitar `@apply`/`@plugin` sem essa opção.

## Risks / Trade-offs

- [Reordenação de classes Tailwind pelo Biome poderia mudar qual classe vence num `cn()`] → build e smoke test idênticos (mesmo tamanho de HTML/CSS por rota); validar visualmente em homologação.
- [React 19.3 / Next 16.4 com comportamento novo em runtime] → smoke test de todas as rotas públicas, login Google e redirecionamento do dashboard; validação manual em homologação antes da produção.
- [Vulnerabilidades residuais no CLI do Prisma] → só existem em build; acompanhar o Prisma 7.x/8 estável.
- **Achado fora do escopo**: `/api/users/get-all-users` responde sem login (expõe nome e e-mail dos usuários), e `/api/company/upload` e `/upload/delete` não checam sessão. Já existia antes desta mudança; precisa de uma change própria.
