## Why

A diretoria da CAAMA pediu para ocultar, por enquanto, a quantidade de visitantes exibida nas empresas. Além disso, o painel administrativo não funcionava bem em notebooks e telas pequenas: a sidebar sobrepunha o conteúdo, a tabela empurrava a página para os lados e as fotos do Google não carregavam no ambiente local. As listagens de empresas (pública e admin) também precisavam de um acabamento mais profissional, e o Next 16 emitia avisos de rolagem e de proporção de imagens.

## What Changes

- Oculta o contador de visitantes no card da listagem pública (flag `SHOW_VISITORS`). A contagem e o destaque automático com 20+ visitantes continuam ativos.
- Adiciona `data-scroll-behavior="smooth"` no `<html>` e corrige as proporções `width`/`height` das logos e da imagem do hero.
- Sidebar do painel aberta por padrão, fixa a partir de `lg` (1024px) e menu lateral (Sheet) abaixo disso; corrige a sobreposição de 16px, a rolagem horizontal do conteúdo e trunca nome/e-mail longos.
- Filtros do painel (empresas, categorias, cidades, usuários) passam a quebrar linha; corrige o erro de hidratação do esqueleto de categorias.
- Fotos do Google com `referrerPolicy="no-referrer"` (o Google responde 429 quando o referer é `localhost`).
- Refina a listagem pública: card com desconto como faixa (sem botão falso animado), foco de teclado, contagem de resultados, limpar filtros, busca que mantém o termo da URL e estado vazio com tokens.
- Refina a tabela de empresas do admin: cabeçalhos consistentes, logos sem corte, colunas responsivas por breakpoint, status com indicador, estado vazio contextual, paginação leve, selo e fundo para empresas em destaque, e novos ícones de ação (editar, inativar/ativar) com tooltip.
- Padroniza o tooltip do sistema (balão da marca, seta SVG, atraso de 200ms e distância de 6px) e remove as sobrescritas espalhadas.

## Capabilities

### New Capabilities
- `listagem-publica-empresas`: como a listagem pública por cidade apresenta, filtra e busca as empresas conveniadas.
- `painel-empresas`: como o painel administrativo apresenta a navegação e a tabela de empresas.

### Modified Capabilities
<!-- nenhuma spec existente -->

## Impact

- **Código**: componentes de `src/app/(public)/_components/companies-by-city/`, `src/app/(restrict)/private/dashboard/` (sidebar, tabela, filtros, paginações), `src/components/ui/tooltip.tsx`, `src/app/layout.tsx` e imagens do hero/header/login.
- **Schema do Prisma**: sem alteração e sem migration.
- **Dados**: nenhum. O campo `visitors` continua sendo incrementado.
- **Arquivo novo**: `AGENTS.md`, gerado pelo `next dev` do Next 16.4.
