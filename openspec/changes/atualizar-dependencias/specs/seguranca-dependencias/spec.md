## ADDED Requirements

### Requirement: Dependências de runtime sem vulnerabilidades críticas ou altas
O projeto MUST manter as dependências que vão para o runtime sem vulnerabilidades conhecidas de severidade crítica ou alta no `pnpm audit`. Vulnerabilidades restantes MUST estar restritas a ferramentas de build e documentadas.

#### Scenario: Auditoria após atualização
- **WHEN** `pnpm audit` é executado na raiz do projeto
- **THEN** nenhuma vulnerabilidade crítica é reportada
- **AND** as vulnerabilidades altas restantes vêm apenas de ferramentas de build (CLI do Prisma)

### Requirement: Verificação de qualidade executável
O projeto MUST ter lint, typecheck e build executáveis que terminam com código 0 no código-fonte versionado, sem analisar artefatos gerados.

#### Scenario: Lint do projeto inteiro
- **WHEN** `pnpm lint` é executado
- **THEN** o Biome ignora `.next/`, `node_modules/`, `src/generated/`, `next-env.d.ts` e `*.svg`
- **AND** o comando termina com código 0

#### Scenario: Typecheck e build
- **WHEN** `pnpm exec tsc --noEmit` e `pnpm build` são executados
- **THEN** ambos terminam com código 0 e o build gera as mesmas rotas de antes

### Requirement: Comportamento da aplicação preservado
A atualização de dependências MUST NOT alterar o comportamento visível da aplicação.

#### Scenario: Rotas públicas e protegidas
- **WHEN** o servidor de produção é iniciado e as rotas são requisitadas
- **THEN** `/`, `/city/<slug>/companies`, a página de detalhes e `/private/sign-in` respondem 200
- **AND** `/private/dashboard` sem sessão redireciona (307) para `/private/sign-in`
- **AND** uma rota inexistente responde 404

#### Scenario: Login com Google
- **WHEN** o formulário de login envia o POST para `/api/auth/signin/google` com CSRF válido
- **THEN** a resposta redireciona (302) para `accounts.google.com`
