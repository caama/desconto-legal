## Context

O componente `BrandingBanner` aparece só na home (`src/app/(public)/page.tsx`), entre a hero e a seção "Selecione sua cidade". A arte original era um PNG com fundo, recortes, logo e texto juntos.

## Decisions

- **Recortar só o logo da arte original**: não havia o logo isolado em `public/assets`. O recorte foi feito com Pillow a partir de `brainding.png`, com o fundo azul externo ao contorno branco tornado transparente.
- **Texto como HTML**: fica legível em qualquer largura e acessível a leitores de tela e buscadores. Usa a fonte do site (Geist), não a fonte da arte.
- **Recortes do topo com `radial-gradient`**: um `div` com semicírculos na cor `var(--background)`, que é o fundo da hero logo acima. O raio usa `clamp(0.75rem, 1.8vw, 1.75rem)` (mesma proporção da arte, ~1,8% da largura) e o espaçamento é 3× o raio.
- **Limites de tamanho**: logo com `max-w-75`/`md:max-w-110` e conteúdo em `max-w-6xl`, para não crescer indefinidamente em telas largas.

## Risks / Trade-offs

- A fonte do texto difere levemente da arte original. Se for necessário igualar, basta carregar a fonte da arte e aplicá-la aos parágrafos.
- Os semicírculos assumem que o fundo acima do banner é `--background`; se a hero mudar de cor, os recortes precisam acompanhar.
