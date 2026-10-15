## Context

Refinamento visual e de usabilidade sobre a identidade existente (azul-marinho CAAMA, Geist, cards shadcn). Não há suíte de testes automatizados; a verificação foi feita com typecheck, lint, prints em Chrome headless (desktop e mobile) e medições de layout via DevTools Protocol, usando uma sessão temporária no banco local para abrir o painel.

## Goals / Non-Goals

**Goals:**
- Atender o pedido da diretoria sem perder a lógica de destaque automático.
- Painel utilizável de 1024px a 1920px sem rolagem horizontal da página.
- Listagens com hierarquia clara e todos os estados (carregando, vazio, filtrado).

**Non-Goals:**
- Redesenho da identidade visual.
- Corrigir a regra de destaque, que hoje promove no 21º clique (lê o valor antes do incremento).
- Proteger as rotas de API sem autenticação (achado registrado em `atualizar-dependencias`).

## Decisions

- **Flag `SHOW_VISITORS`** em vez de apagar o JSX: o pedido é "por enquanto"; religar é uma linha.
- **Sidebar a partir de `lg`** em vez de `md`: com 256px de sidebar, telas de 768–1023px sobrariam com pouco espaço para a tabela; abaixo de `lg` o Sheet atende melhor.
- **`min-w-0` no container do conteúdo**: deixa a tabela rolar dentro do card em vez de alargar a página.
- **Colunas por breakpoint na tabela admin**: Cidade/Categoria a partir de `xl` (abaixo disso, numa linha dentro da célula da empresa) e WhatsApp a partir de `2xl`. Alternativa considerada: rolagem horizontal; descartada porque escondia as ações.
- **`referrerPolicy="no-referrer"`** nas fotos do Google: reproduzido com curl que o `lh3.googleusercontent.com` responde 429 HTML com referer `localhost` e o Chrome bloqueia (`ERR_BLOCKED_BY_ORB`).
- **Ícone `Ban`/`CircleCheck`** para inativar/ativar e **`SquarePen`** para editar, em grupo segmentado com tooltip.
- **Tooltip corrigido no componente**, não em cada uso: a seta era um quadrado girado com borda; agora é a seta SVG do Radix com a cor do balão.
- **Remoção do `ShinyButton` no card**: animação infinita decorativa em todos os cards; o componente continua no projeto, sem uso.

## Risks / Trade-offs

- [Admins acostumados com o WhatsApp na tabela em telas menores] → continua na tela de edição e aparece a partir de 1536px.
- [Mudança de aparência percebida pelos usuários] → refinamento mantém cores, fontes e conteúdo; validar em homologação antes da produção.
