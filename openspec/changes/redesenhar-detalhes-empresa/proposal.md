## Why

A página pública de detalhes da empresa é onde o advogado decide usar o convênio, mas os contatos não eram clicáveis, o botão do WhatsApp era um botão dentro de um link, o mapa abria por `window.open` e todo link compartilhado aparecia apenas como "Detalhes". O botão de compartilhar só oferecia WhatsApp e destoava do resto da interface.

## What Changes

- Mantém a estrutura original da página (logo sobreposto, faixa verde do desconto, coluna de contato) e acrescenta padrões de apps conhecidos:
  - ações rápidas abaixo do nome (WhatsApp, Localização, Instagram), como no perfil de um local no Google Maps;
  - "Como usar o desconto" em três passos dentro da faixa verde, no lugar do aviso "Importante";
  - mapa embutido (carregado sob demanda) e botão "Copiar endereço" no cartão de localização;
  - barra fixa com desconto e WhatsApp no mobile, que aparece quando as ações rápidas saem da tela;
  - "Mais descontos em <cidade>" com três empresas da mesma cidade, priorizando a mesma categoria.
- Contatos como links (`tel:`, `mailto:`, perfil do Instagram com @). Selo de destaque no canto do logo a partir de `sm`.
- Metadados por empresa (título, descrição e Open Graph com a logo) e dados estruturados `LocalBusiness`, com uma única consulta por requisição (`cache`).
- WhatsApp e mapas como links de verdade; a contagem de visitas para o destaque continua no clique do WhatsApp.
- Botão Compartilhar redesenhado: folha nativa do sistema no celular e painel com WhatsApp, LinkedIn, Facebook, e-mail e copiar link no desktop, com texto próprio por página. Remove a dependência `react-share`.
- Card de empresa com efeito no hover feito com `motion`: sobe com mola, luz que segue o cursor e logo com parallax, sem rotação 3D (que borrava o texto) e desligado com "reduzir movimento".

## Capabilities

### New Capabilities
- `pagina-detalhes-empresa`: o que a página pública de uma empresa mostra e permite fazer.

### Modified Capabilities
- `listagem-publica-empresas`: compartilhamento e interação do card (spec ainda não arquivada; registrada como requisitos adicionados).

## Impact

- **Código**: `src/app/(public)/city/[slug]/companies/[slug_company]/details/**`, `src/app/(public)/_components/{header/shared,whatsapp-company,company-maps,companies-by-city}`, `src/app/(public)/_dal/get-related-companies.ts`, `src/utils/get-company-full-address.ts`.
- **Dependências**: remove `react-share`.
- **Schema do Prisma**: sem alteração e sem migration.
