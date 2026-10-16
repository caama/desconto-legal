## Context

A mudança `painel-de-metricas` criou a tela de Métricas, `company_daily_stats` (procura por dia) e `companies.created_by_id`. Os relatórios reaproveitam esses dados e as mesmas regras: dia civil em `America/Sao_Paulo`, situação do contrato pelo dia civil e subseção = cidade. A referência de implementação é o módulo de relatórios do painel da OAB/MA (`@react-pdf/renderer` + `exceljs` no servidor, rotas `GET` que devolvem o arquivo).

## Goals / Non-Goals

**Goals:**
- Quatro relatórios com prévia na tela e exportação em PDF e Excel, todos com a identidade da CAAMA.
- Uma definição única por relatório (colunas + linhas) consumida pela prévia, pelo PDF e pelo Excel, para os três nunca divergirem.

**Non-Goals:**
- Agendamento ou envio por e-mail.
- Gráficos dentro do PDF: a tela de Métricas já cumpre esse papel.
- Auditoria das exportações (o projeto não tem trilha de auditoria; os dados são de empresas, não pessoais sensíveis).
- CSV.

## Decisions

- **Relatório como dado, renderizadores genéricos.** Cada relatório é uma função `build(filters, ctx)` que devolve `{ title, description, filterLines, summary, columns, rows, orientation }`. As colunas declaram `type` (`text`, `number`, `date`, `percent`), largura no PDF e no Excel e se entram no PDF (`pdf: false` para colunas que só cabem na planilha). A prévia, o PDF e o XLSX só leem essa estrutura. Alternativa considerada: um componente PDF e uma planilha escritos à mão por relatório, como no painel da OAB. Foi descartada porque são quatro relatórios tabulares parecidos e a duplicação faria os formatos divergirem.
- **Geração no servidor** (rota `GET /api/reports/[report]/[format]`), com download por `<a href>` usando o cookie da sessão. Alternativa considerada: jsPDF no navegador, como no Sala Livre. Foi descartada porque a planilha com logo e tipos precisa do `exceljs` de qualquer jeito, e gerar no servidor mantém a checagem de `ADMIN` e os dados fora do bundle do cliente.
- **Datas normalizadas para o dia civil de São Paulo** (meia-noite UTC) antes de chegar aos renderizadores. O Excel grava datas como serial UTC, e um cadastro às 22h de Brasília apareceria no dia seguinte. A prévia e o PDF formatam essas datas em UTC.
- **Filtros com `zod`** num só lugar (`src/lib/reports/filters.ts`), lidos de `URLSearchParams` tanto pela página quanto pela rota da API. O que for inválido cai no padrão, e cada relatório só lê os filtros que declara.
- **Logo via `fs`** a partir de `public/assets/logo-caama.png`, lida uma vez por instância. Na Vercel, `public/` não entra no pacote das funções, por isso `outputFileTracingIncludes` para `/api/reports/**`.
- **Fonte Helvetica embutida do PDF**: cobre os acentos do português (WinAnsi) sem empacotar arquivos de fonte. Caracteres fora do WinAnsi (como o sinal de menos U+2212) não são usados nos relatórios.
- **PDF**: A4 paisagem em todos os relatórios (o resumo por subseção tem nove colunas numéricas); cabeçalho (logo, título, filtros, resumo) e cabeçalho da tabela `fixed`, repetidos por página; linhas `wrap={false}`; rodapé com "Página N de M". **Excel**: logo nas primeiras linhas, bloco de título e filtros, tabela com cabeçalho em azul CAAMA, painel congelado e autofiltro, larguras definidas e impressão em paisagem ajustada à largura.

## Risks / Trade-offs

- [`@react-pdf/renderer` no bundler do Next] → o `pnpm build` empacotou sem `serverExternalPackages`; se algum deploy falhar, a saída é adicioná-lo lá. O download em homologação confirma.
- [Hifenização automática do react-pdf] → quebrava cabeçalhos estreitos ("contra-to"); desligada com `Font.registerHyphenationCallback`.
- [Relatórios grandes geram em memória] → o volume é de centenas de empresas, o que dá poucos MB e cabe folgado no limite de 4,5 MB de resposta da Vercel. Se passar de milhares de linhas, o Excel pode usar o `WorkbookWriter` em streaming.
- [Procura começa vazia] → o resumo do relatório de procura informa a data do primeiro registro, como a tela de Métricas.

## Migration Plan

Sem migration. Deploy depois (ou junto) de `painel-de-metricas`: homologação primeiro, depois produção. Rollback: reverter o código.

## Open Questions

- Incluir no futuro um relatório de cadastros por usuário com detalhamento por mês, se a gestão pedir além da coluna "Cadastrada por".
