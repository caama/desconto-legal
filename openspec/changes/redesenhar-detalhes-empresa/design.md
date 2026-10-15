## Context

Uma primeira versão redesenhada (faixa azul-marinho e desconto em formato de cupom) foi recusada pelo usuário. A direção escolhida foi "original refinado": manter a estrutura e a identidade da página e somar padrões reconhecíveis de outros produtos.

## Decisions

- **Mapa embutido sem chave de API** (`maps.google.com/maps?q=…&output=embed`, `loading="lazy"`). A precisão depende de endereço e CEP corretos no cadastro.
- **Folha nativa só com ponteiro grosso** (`pointer: coarse`): no desktop, o painel próprio é mais útil que a folha do sistema. Cancelar a folha nativa não abre o painel.
- **Barra fixa por `IntersectionObserver`** nas ações rápidas, para não duplicar o CTA enquanto ele está visível.
- **Hover sem rotação 3D**: girar o card fazia o navegador reamostrar o texto. O movimento do cursor vai para o logo via variáveis CSS (`--logo-x`, `--logo-y`) escritas com `useMotionValueEvent`, sem re-render.
- **Frase "Exclusivo para advogados associados e dependentes"** continua fora: estava comentada no código original.

## Risks / Trade-offs

- A folha nativa de compartilhamento não foi testada em aparelho real, só o painel do desktop.
- O componente `Header` da home, que também usa `Shared`, não é renderizado em nenhuma página.
- O projeto tem `motion` e `framer-motion` instalados; `AnimatedCard` ainda usa `framer-motion`.
