## Why

A tela de Métricas responde perguntas na tela, mas a gestão da CAAMA precisa levar os números para reuniões, ofícios e planilhas de acompanhamento: a lista de convênios por subseção, os contratos a renovar, a procura de cada empresa. Hoje isso exige copiar a listagem à mão.

## What Changes

- Nova rota **`/private/dashboard/reports`** ("Relatórios" na sidebar, seção Administrativo), restrita a `ADMIN`, com prévia na tela e exportação em **PDF** e **Excel (.xlsx)**.
- Quatro relatórios, com os filtros na URL:
  - **Empresas conveniadas**: subseção, categoria, situação (ativas, inativas ou todas) e ano de cadastro opcional. Traz contato, desconto, vigência do contrato, contatos acumulados, data de cadastro e quem cadastrou.
  - **Contratos**: subseção e janela (vencidos, até 30/60/90/180 dias ou sem data de fim), só de empresas ativas, com a situação do contrato e a procura.
  - **Procura por empresa**: ano, mês opcional, subseção e categoria. Traz visitas, contatos, conversão no período e contatos acumulados.
  - **Resumo por subseção**: ano. Traz ativas, inativas, cadastradas no ano, contratos vencidos e a vencer, sem data de fim, procura do ano e, no Excel, empresas ativas por categoria.
- Os arquivos levam a **logo OAB/CAAMA**, título, filtros aplicados, data e autor da geração, resumo e paginação (PDF), além de cabeçalho congelado e autofiltro (Excel).
- Os arquivos são gerados no servidor por rotas `GET /api/reports/[report]/[format]`, que também exigem `ADMIN`.

## Capabilities

### New Capabilities
- `relatorios-do-painel`: quais relatórios existem, os filtros de cada um, a prévia e o conteúdo dos arquivos exportados.

### Modified Capabilities
<!-- nenhuma spec arquivada em openspec/specs -->

## Impact

- **Código**: rota `src/app/(restrict)/private/dashboard/reports/**`, rotas `src/app/api/reports/[report]/[format]`, módulo `src/lib/reports/` e item na sidebar.
- **Dependências**: `@react-pdf/renderer` (PDF) e `exceljs` (planilha), as mesmas usadas no painel da OAB/MA.
- **Configuração**: `outputFileTracingIncludes` no `next.config.ts` para a logo em `public/` entrar no pacote das funções de exportação na Vercel.
- **Dados**: depende de `companies.created_by_id` e `company_daily_stats` da mudança `painel-de-metricas`, que precisa ir ao ar antes ou junto. **Sem migration nova.**
