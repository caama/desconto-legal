## 1. Linha de base

- [x] 1.1 Rodar `pnpm audit`, `tsc --noEmit`, lint e `pnpm build` no código atual (178 vulnerabilidades; tsc e build ok; lint com 56 erros pré-existentes)

## 2. Atualização de dependências

- [x] 2.1 Atualizar `next` 16.4.1, `react`/`react-dom` 19.3.1 e `next-auth` 5.0.0-beta.32 (versões exatas)
- [x] 2.2 Atualizar as demais dependências para a última versão dentro do mesmo major
- [x] 2.3 Atualizar `@types/node` para ^24
- [x] 2.4 Remover `next-pwa` e `@types/next-pwa` e limpar o `next.config.ts`
- [x] 2.5 Liberar scripts de build no `pnpm-workspace.yaml`

## 3. Biome

- [x] 3.1 Atualizar `@biomejs/biome` para 2.5.15 e rodar `biome migrate --write`
- [x] 3.2 Ligar `css.parser.tailwindDirectives` e ignorar `.next/`, `node_modules/`, `src/generated/`, `next-env.d.ts` e `*.svg`
- [x] 3.3 Aplicar `biome check --write` e corrigir os diagnósticos restantes (`==`, imports não usados, supressões)

## 4. Verificação local

- [x] 4.1 `pnpm audit`: 4 vulnerabilidades restantes, todas em ferramentas de build
- [x] 4.2 `tsc --noEmit`, `pnpm lint`, `prisma validate` e `pnpm build` com código 0
- [x] 4.3 Smoke test com `next start`: rotas públicas, detalhes, APIs públicas, 404, redirecionamento do dashboard e POST de login Google

## 5. Deploy

- [ ] 5.1 Push para homologação (`homo dev` → `homo main`) e conferir o build na Vercel
- [ ] 5.2 Validar manualmente em https://descontolegal-dev.caama.org.br/ (home, cidades, detalhes, login Google, cadastro/edição de empresa com upload de imagem)
- [ ] 5.3 Após validação, push para produção (`origin dev` → `origin main`)
