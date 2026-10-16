## Context

O painel tem listagens (empresas, cidades, categorias, usuários) e nenhuma visão consolidada. A referência visual e de comportamento é a tela de Métricas do `web-fr` do Sala Livre: KPIs no topo, barras por ano e por mês com o pico destacado, traço para mês futuro e filtros na URL.

Dados disponíveis hoje: `Company.createdAt`, `contractStart`/`contractEnd` (opcionais), `active`, `cityId` (cidade = subseção), `categoryId` e `visitors`, um total acumulado incrementado só no clique do WhatsApp da página de detalhes (o botão não existe em outro lugar do site). Não há autoria do cadastro nem procura com data.

O volume é pequeno: centenas de empresas, dezenas de cidades e categorias.

## Goals / Non-Goals

**Goals:**
- Responder às perguntas da gestão (crescimento, cobertura, contratos e demanda) numa única tela restrita a `ADMIN`.
- Passar a coletar procura por dia e autoria do cadastro, sem mudar o comportamento atual de `visitors` e do destaque automático.

**Non-Goals:**
- Exibir quem cadastrou cada empresa: o autor é gravado, mas o ranking de cadastradores saiu do escopo.
- Exportar as métricas (CSV/PDF).
- Reconstruir procura passada: o histórico diário começa no deploy.
- Métricas de visitas na home ou na listagem por cidade.
- Deduplicar contatos ou filtrar robôs além do que a coleta no navegador já evita.

## Decisions

- **Página como Server Component que lê `searchParams` e chama um DAL** (`metrics/_dal/get-metrics.ts`). Os componentes de gráfico são clientes, porque o recharts precisa de DOM, e recebem dados já agregados. Alternativa considerada: rota de API + TanStack Query, como nas listagens. Foi descartada porque não há interação além dos filtros, que já são navegação: o servidor entrega pronto e o `Suspense` com `key` nos filtros mostra o skeleton na troca.
- **Agregar em TypeScript, não em SQL**. O DAL faz poucas consultas enxutas (empresas com `select` mínimo, cidades, categorias e registros diários do ano) e um módulo puro `_data/metrics-view.ts` monta as séries. Com centenas de linhas, o custo é desprezível, o código fica tipado e testável à mão, e evita `$queryRaw` com `date_trunc`/fuso. Se o volume crescer muito, as séries mensais podem passar para `groupBy`/SQL sem mudar a interface.
- **Fuso `America/Sao_Paulo` explícito**. Datas de cadastro e o dia dos registros são convertidos com `Intl.DateTimeFormat` com `timeZone`. A Vercel roda em UTC, e sem isso uma empresa cadastrada às 22h de 31/12 cairia no ano seguinte.
- **Agregado diário (`CompanyDailyStat`) em vez de tabela de eventos.** Uma linha por empresa por dia com `views` e `whatsappClicks`, gravada com `upsert` + `increment` sobre a chave única `(companyId, date)`. `date` é `@db.Date`. Alternativa considerada: um evento por clique, com mais detalhe (hora, origem). Foi descartada porque cresce sem limite e nada na tela usa granularidade menor que o dia.
- **Visita registrada no navegador**: um componente cliente na página de detalhes chama a server action `registerCompanyView` uma vez por montagem e marca `sessionStorage` (`dl:view:<companyId>`). Robôs de prévia de link (WhatsApp, buscadores) não executam JS e não contam, recarregar não infla o número, e o prefetch do Next não dispara. O `try/catch` no `sessionStorage` cobre navegação privada: sem armazenamento, a visita conta a cada abertura, o que é aceitável.
- **Contato mantém `visitors`** e, na mesma action, faz o `upsert` diário. O nome `visitors` não muda: renomear exigiria migration de dados e mexeria na regra de destaque.
- **`createdById` opcional com `onDelete: SetNull`**. Empresas antigas ficam "Sem registro", e apagar um usuário não apaga empresas (hoje usuários são inativados, não apagados, mas a relação fica segura).
- **Ano no seletor** vai do ano do primeiro `createdAt` até o ano corrente. `ano` e `subsecao` (slug) moram na URL, e valores padrão não são escritos nela, como no Sala Livre.
- **Cores**: barras neutras (`muted-foreground/25`) com destaque em `chart-*` para o pico ou para a subseção selecionada; vermelho/âmbar só nos alertas de contrato. Os tokens `--chart-1..5` já existem no `globals.css`.

## Risks / Trade-offs

- [`createdAt` das empresas antigas pode estar concentrado na data de uma importação] → o gráfico por ano/mês mostraria um pico artificial. Mitigação: a nota da página explica que o gráfico usa a data de cadastro no sistema. Se a gestão preferir, trocar a fonte para `contractStart` é uma linha no DAL.
- [Procura "no ano" começa vazia] → a aba e o gráfico mensal informam a data do primeiro registro, e o top 5 tem a aba "Desde o início".
- [Contatos não são deduplicados] → um usuário que clica várias vezes conta várias vezes, igual a `visitors` hoje. É aceito para manter as duas fontes coerentes.
- [Server actions públicas podem ser chamadas diretamente] → alguém pode inflar números. As actions validam `cuid`, só gravam para empresa ativa e não expõem dados. Rate limit fica fora do escopo.
- [Concorrência no `upsert`] → dois primeiros registros simultâneos do mesmo dia podem colidir na chave única. A action captura o erro `P2002` e repete como `update`.

## Migration Plan

1. `prisma migrate dev --name painel_de_metricas` localmente: coluna `companies.created_by_id` (nula, FK `SET NULL`, índice) e tabela `company_daily_stats` (FK `CASCADE`, único `(company_id, date)`, índice em `date`).
2. Deploy em homologação: o build aplica a migration no banco de homologação. Validar a página, uma visita, um contato e um cadastro novo.
3. Deploy em produção após validação. A migration é aditiva e não toca linhas existentes.
4. Rollback: reverter o código basta, porque a coluna e a tabela ficam sem uso. Remover o schema exige uma migration nova de `DROP`.

## Open Questions

- Fonte do gráfico de cadastros: `createdAt` (padrão adotado) ou `contractStart`, a confirmar com a gestão depois de ver os dados de produção.
