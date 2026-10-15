## 1. Página de detalhes

- [x] 1.1 Ações rápidas (WhatsApp, Localização, Instagram) com contagem de visita no WhatsApp
- [x] 1.2 "Como usar o desconto" em três passos
- [x] 1.3 Mapa embutido, copiar endereço e botões de mapa como links
- [x] 1.4 Contatos clicáveis e selo de destaque no logo
- [x] 1.5 Barra fixa no mobile e empresas relacionadas
- [x] 1.6 Metadados por empresa e JSON-LD `LocalBusiness`

## 2. Compartilhar e card

- [x] 2.1 Novo `Shared` (folha nativa no celular, painel no desktop) e remoção do `react-share`
- [x] 2.2 Efeito de hover do card com `motion`, sem desfoque de texto

## 3. Verificação local

- [x] 3.1 `tsc --noEmit` e `biome check` com código 0
- [x] 3.2 Prints em 1440, 1024, 768 e 390; hover com mouse real; barra fixa ao rolar

## 4. Deploy

- [ ] 4.1 Push para homologação (`homo dev` → `homo main`) e conferir o build na Vercel
- [ ] 4.2 Validar em https://descontolegal-dev.caama.org.br/ (detalhes da empresa, compartilhar no celular, mapa com endereço real, hover)
