## 1. Base

- [x] 1.1 Instalar `@react-pdf/renderer` e `exceljs`; `outputFileTracingIncludes` da logo no `next.config.ts`
- [x] 1.2 `src/lib/reports/`: tipos, filtros com `zod`, formatação de células e leitura da logo

## 2. Relatórios

- [x] 2.1 Empresas conveniadas
- [x] 2.2 Contratos
- [x] 2.3 Procura por empresa
- [x] 2.4 Resumo por subseção

## 3. Exportação

- [x] 3.1 Renderizador PDF genérico (logo, cabeçalho e tabela repetidos, rodapé paginado)
- [x] 3.2 Renderizador XLSX genérico (logo, bloco de título, tabela tipada, painel congelado, autofiltro)
- [x] 3.3 Rota `GET /api/reports/[report]/[format]` com checagem de `ADMIN` e nome de arquivo

## 4. Tela

- [x] 4.1 Página `/private/dashboard/reports` com checagem de `ADMIN`, seletor de relatório e filtros na URL
- [x] 4.2 Resumo, prévia de até 50 linhas e botões de PDF e Excel
- [x] 4.3 Item "Relatórios" na sidebar (Administrativo, só `ADMIN`)

## 5. Verificação local

- [x] 5.1 `tsc --noEmit` e `biome check` com código 0, e `pnpm build`
- [x] 5.2 Baixar PDF e Excel de cada relatório e conferir logo, filtros, paginação, tipos e acesso de `MEMBER`

## 6. Deploy

- [ ] 6.1 Push para homologação (`homo dev` → `homo main`), junto ou depois de `painel-de-metricas`
- [ ] 6.2 Validar os downloads em https://descontolegal-dev.caama.org.br/ (inclusive a logo, que depende do `outputFileTracingIncludes`) antes de qualquer push para produção
