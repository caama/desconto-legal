## 1. Schema e dependências

- [x] 1.1 `Company.createdById` (opcional, `SetNull`) e modelo `CompanyDailyStat` no `schema.prisma`
- [x] 1.2 Migration `painel_de_metricas` gerada e aplicada no banco local
- [x] 1.3 `shadcn add chart` (instala `recharts` e `src/components/ui/chart.tsx`)

## 2. Rastreamento de procura

- [x] 2.1 Utilitário de dia civil em `America/Sao_Paulo` e helper de `upsert` diário com repetição em `P2002`
- [x] 2.2 Action `registerCompanyView` e componente cliente na página de detalhes, com `sessionStorage` por empresa
- [x] 2.3 `addVisitorInCompany` passa a gravar também `whatsappClicks` do dia e ignora empresa inativa
- [x] 2.4 `create-company` grava `createdById` com o usuário da sessão

## 3. Dados das métricas

- [x] 3.1 DAL `get-metrics` com checagem de `ADMIN` e consultas enxutas
- [x] 3.2 `metrics-view.ts`: KPIs, séries por ano/mês, distribuição, cobertura, contratos, top 5, sem procura, procura mensal, conversão e ranking

## 4. Tela

- [x] 4.1 Página `/private/dashboard/metrics` com checagem de `ADMIN`, nota explicativa e `Suspense` com skeleton
- [x] 4.2 Filtros de ano e subseção na URL
- [x] 4.3 KPIs, cadastros por ano e por mês
- [x] 4.4 Empresas por subseção e por categoria, matriz de cobertura e subseções sem empresa
- [x] 4.5 Tabela de contratos a vencer e contagem sem data de fim
- [x] 4.6 Top 5 (no ano / desde o início), procura por mês com conversão e empresas sem procura
- [x] 4.7 Ranking de cadastradores
- [x] 4.8 Item "Métricas" na sidebar (Administrativo, só `ADMIN`)

## 5. Verificação local

- [x] 5.1 `tsc --noEmit` e `biome check` com código 0, e `pnpm build`
- [x] 5.2 Conferir a página com dados locais em desktop e mobile, filtros e acesso de `MEMBER`
- [x] 5.3 Conferir que abrir os detalhes registra visita uma vez por sessão e que o WhatsApp registra contato

## 6. Deploy

- [ ] 6.1 Push para homologação (`homo dev` → `homo main`) e conferir no build da Vercel que a migration foi aplicada
- [ ] 6.2 Validar em https://descontolegal-dev.caama.org.br/ (página de métricas, visita, contato, cadastro com autor) antes de qualquer push para produção
