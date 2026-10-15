## 1. Componentes compartilhados

- [x] 1.1 `status-tabs`, `table-search`, `table-pagination` e `status-toggle`
- [x] 1.2 APIs com `search`, `perPage`, `status` e contagens por situação

## 2. Listagens

- [x] 2.1 Empresas com filtro por cidade, colunas por breakpoint e destaque
- [x] 2.2 Usuários com avatar, papel e bloqueio da autoinativação
- [x] 2.3 Cidades e categorias com quantidade de empresas e data de criação
- [x] 2.4 Nomes de cidade em maiúsculas no painel e na área pública

## 3. Navegação e formulários

- [x] 3.1 Sidebar em Operação e Administrativo, estado em cookie
- [x] 3.2 Perfil compacto
- [x] 3.3 Formulário de empresa em duas colunas com ações fixas
- [x] 3.4 Slug automático na criação e edição de empresa, cidade e categoria, com aviso de mudança de endereço

## 4. Segurança

- [x] 4.1 Papel `ADMIN` exigido nas actions de cidade, categoria e usuário

## 5. Verificação local

- [x] 5.1 `tsc --noEmit` e `biome check` com código 0
- [x] 5.2 Prints em 1920, 1366, 1024 e 390 de largura; digitação real nos formulários de slug

## 6. Deploy

- [ ] 6.1 Push para homologação (`homo dev` → `homo main`) e conferir o build na Vercel
- [ ] 6.2 Validar em https://descontolegal-dev.caama.org.br/ (abas, busca, inativar/reativar, slug, sidebar)
