## Context

O componente `BrandingBanner` aparece só na home (`src/app/(public)/page.tsx`), entre a hero e a seção "Selecione sua cidade". A arte original era um PNG com fundo, recortes, logo e texto juntos.

## Decisions

- **Recortar só o logo da arte original**: não havia o logo isolado em `public/assets`. O recorte foi feito com Pillow a partir de `brainding.png`, com o fundo azul externo ao contorno branco tornado transparente.
- **Texto como HTML**: fica legível em qualquer largura e acessível a leitores de tela e buscadores. Usa a fonte do site (Geist), não a fonte da arte.
- **Recortes do topo como máscara CSS**: `mask-image` na própria seção, com um `radial-gradient` repetido no topo (furos reais) e um `linear-gradient` cobrindo o resto. A primeira versão pintava semicírculos na cor do fundo por cima do azul, com raio fluido (`clamp(…, 1.8vw, …)`); os ladrilhos ficavam com largura fracionada e, durante a animação com `scale`, apareciam fios/listras nas emendas. Agora o raio é inteiro por breakpoint (12/16/20/24/28px), o espaçamento é 3× o raio, os ladrilhos partem da esquerda (centralizados caíam em meio pixel com largura ímpar) e a seção mascarada fica parada: só o conteúdo interno (logo e texto) anima com `opacity` e `y`, porque mover a seção fazia a máscara ser redesenhada em posições fracionadas a cada quadro.
- **Limites de tamanho**: logo com `max-w-75`/`md:max-w-110` e conteúdo em `max-w-6xl`, para não crescer indefinidamente em telas largas.

## Risks / Trade-offs

- A fonte do texto difere levemente da arte original. Se for necessário igualar, basta carregar a fonte da arte e aplicá-la aos parágrafos.
- `mask-image` exige Safari 15.4+ (o componente também define os prefixos `-webkit-mask-*`).
