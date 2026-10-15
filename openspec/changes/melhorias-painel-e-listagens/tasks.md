## 1. Pedido da diretoria e avisos do Next

- [x] 1.1 Ocultar o contador de visitantes no card com a flag `SHOW_VISITORS`
- [x] 1.2 Adicionar `data-scroll-behavior="smooth"` no `<html>`
- [x] 1.3 Corrigir proporções `width`/`height` das logos e da imagem do hero

## 2. Painel administrativo

- [x] 2.1 Sidebar aberta por padrão, fixa a partir de `lg`, rolagem interna e larguras consistentes
- [x] 2.2 `min-w-0` no conteúdo e filtros com quebra de linha
- [x] 2.3 Corrigir erro de hidratação do esqueleto de categorias
- [x] 2.4 Fotos do Google com `referrerPolicy="no-referrer"`

## 3. Listagens de empresas

- [x] 3.1 Refinar card, busca, filtros, contagem e estados da listagem pública
- [x] 3.2 Refinar a tabela admin (cabeçalhos, logos, colunas responsivas, status, vazio, paginação)
- [x] 3.3 Selo e fundo para empresas em destaque na tabela admin
- [x] 3.4 Ícones de editar e inativar/ativar com tooltip
- [x] 3.5 Padronizar o componente de tooltip

## 4. Verificação local

- [x] 4.1 `tsc --noEmit`, `pnpm lint` e `prisma validate` com código 0
- [x] 4.2 Prints e medições em 1920, 1440, 1366, 1280, 1024, 820 e 390 de largura

## 5. Deploy

- [ ] 5.1 Push para homologação (`homo dev` → `homo main`) e conferir o build na Vercel
- [ ] 5.2 Validar em https://descontolegal-dev.caama.org.br/ (listagem por cidade, painel em notebook e celular, ações e tooltips)
- [ ] 5.3 Após validação, push para produção (`origin dev` → `origin main`)
