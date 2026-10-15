## Why

As listagens do painel (empresas, usuários, cidades e categorias) tinham cada uma o seu filtro e a sua paginação, misturavam registros ativos e inativos e não deixavam claro o que acontece ao inativar. O formulário de empresa era longo e o slug gerado automaticamente ficava preso ao primeiro nome digitado. As ações de cidade e categoria não exigiam papel de administrador.

## What Changes

- Padroniza as quatro listagens no modelo do `web-fr` do Sala Livre: abas Ativos/Inativos com contagem, busca com atraso de 400ms sincronizada com a URL, tabela compacta e paginação com linhas por página.
- Componentes compartilhados em `dashboard/_components/`: `status-tabs`, `table-search`, `table-pagination` e `status-toggle` (botão com tooltip e diálogo de confirmação que explica o efeito de inativar e reativar).
- Empresas: filtro por cidade, colunas por breakpoint, selo e fundo de destaque. Cidades e categorias: coluna com a quantidade de empresas e data de criação. Usuários: avatar com iniciais, papel e bloqueio da autoinativação.
- Nomes de cidade exibidos sempre em maiúsculas (`formatCityName`), também na área pública.
- Sidebar dividida em Operação e Administrativo, com estado recolhido salvo em cookie (sem piscar no recarregamento). Perfil mais compacto.
- Formulário de empresa redesenhado em duas colunas com ações fixas. Slug gerado a partir do nome (`slugify`) na criação e na edição de empresa, cidade e categoria: acompanha o nome até ser editado à mão, apagar religa o automático e a edição avisa quando o endereço público vai mudar.
- APIs de listagem passam a aceitar `search`, `perPage` (máximo 50) e `status`, e devolvem `activeCount`/`inactiveCount`.
- **Segurança**: as oito actions de cidade e categoria e as actions de usuário passam a exigir papel `ADMIN`.

## Capabilities

### New Capabilities
- `painel-administrativo`: como as listagens, os formulários e as ações do painel se comportam.

### Modified Capabilities
<!-- nenhuma spec arquivada -->

## Impact

- **Código**: `src/app/(restrict)/private/dashboard/**`, rotas `src/app/api/{company,users,cities,categories}`, utilitários `src/utils/{avatar,slugify,format-city-name}.ts` e o card de cidade da home.
- **Arquivos removidos**: filtros e paginações próprias de cada listagem e os antigos campos de logo da empresa.
- **Schema do Prisma**: sem alteração e sem migration.
