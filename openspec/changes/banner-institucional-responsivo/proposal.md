## Why

O banner institucional da home (logo do Desconto Legal + texto de apresentação) era uma única imagem PNG de 3042×1048 renderizada com largura total. Em monitores grandes ele ficava grande demais e, no celular, o texto embutido na imagem encolhia até ficar ilegível.

## What Changes

- O banner passa a ser montado em HTML/CSS: fundo azul `#22254c`, recortes em semicírculo no topo feitos com CSS, logo como imagem própria e texto como texto real.
- O logo foi recortado da arte original para `public/assets/logo-desconto-legal.png` (fundo transparente) e tem largura máxima de 300px no celular e 440px no desktop.
- O conteúdo fica limitado a `max-w-6xl`; no desktop logo e texto ficam lado a lado e no celular empilhados e centralizados.
- O visual, a cor e a animação de entrada continuam os mesmos.

## Capabilities

### New Capabilities
- `banner-institucional`: como o banner de apresentação da home se dimensiona em cada tamanho de tela.

## Impact

- **Código**: `src/app/(public)/_components/branding-banner/index.tsx`.
- **Assets**: novo `public/assets/logo-desconto-legal.png`; `public/assets/brainding.png` deixa de ser usado (mantido no repositório).
- **Schema do Prisma**: sem alteração e sem migration.
