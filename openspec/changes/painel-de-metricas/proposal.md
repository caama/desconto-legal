## Why

O painel só lista empresas: para saber quantos convênios a CAAMA tem por subseção, quais contratos vão vencer ou quais empresas os advogados de fato procuram, é preciso contar à mão. Além disso, dois dados que a gestão quer acompanhar não existem hoje: quem cadastrou cada empresa e quando a procura aconteceu (o contador `visitors` é um total acumulado, sem data, e só sobe no clique do WhatsApp).

## What Changes

- Nova rota **`/private/dashboard/metrics`** ("Métricas" na sidebar, seção Administrativo), restrita a `ADMIN`, com gráficos do shadcn/ui (`chart`, sobre recharts) e filtros de **ano** e **subseção** na URL.
- **Indicadores**: empresas ativas e inativas, novas no ano comparadas ao ano anterior, contratos vencendo em 30/60/90 dias e **contratos vencidos com a empresa ainda ativa**.
- **Crescimento**: cadastros por ano e por mês do ano escolhido.
- **Distribuição e cobertura**: empresas ativas por subseção, por categoria e matriz subseção × categoria, evidenciando subseções sem empresa ativa e categorias ausentes.
- **Contratos**: tabela de contratos vencidos e a vencer em até 90 dias, com a procura de cada empresa ao lado, e contagem de empresas ativas sem data de fim de contrato.
- **Demanda**: top 5 empresas mais procuradas (geral ou da subseção filtrada), no ano e desde o início; procura por mês (visitas e contatos) e taxa de conversão; empresas ativas sem nenhum contato.
- **Equipe**: ranking de quem mais cadastrou empresas no ano.
- **Rastreamento**: a abertura da página de detalhes da empresa passa a contar como **visita** e o clique no WhatsApp como **contato**, agregados por dia. O contador `visitors` e a regra de destaque automático continuam como estão.
- **Autoria**: o cadastro de empresa passa a gravar o usuário que criou.

## Capabilities

### New Capabilities
- `metricas-do-painel`: o que a tela de Métricas mostra, como os filtros se aplicam e quem pode acessá-la.
- `rastreamento-de-procura`: como visitas, contatos e autoria do cadastro são registrados.

### Modified Capabilities
<!-- nenhuma spec arquivada em openspec/specs -->

## Impact

- **Código**: nova rota `src/app/(restrict)/private/dashboard/metrics/**`, sidebar do painel, action `create-company`, actions públicas de visita/contato e a página de detalhes da empresa.
- **Dependências**: `recharts` e o componente `src/components/ui/chart.tsx` (via `shadcn add chart`).
- **Schema do Prisma (migration `painel_de_metricas`)**:
  - `Company.createdById` (`created_by_id`), **opcional**, com relação para `User` e `onDelete: SetNull`. As empresas já existentes em produção ficam com `NULL` e aparecem no ranking como "Sem registro"; nenhum dado é alterado ou apagado.
  - Nova tabela `company_daily_stats` (`company_id`, `date`, `views`, `whatsapp_clicks`), chave única por empresa e dia, `onDelete: Cascade`. Começa vazia: a procura por período só passa a ter dados a partir do deploy, e a tela informa a data de início da coleta.
  - A migration só adiciona coluna nula e tabela nova, portanto é aplicada sem bloqueio relevante e sem backfill. O build da Vercel a aplica em cada ambiente; ela deve rodar primeiro em homologação.
