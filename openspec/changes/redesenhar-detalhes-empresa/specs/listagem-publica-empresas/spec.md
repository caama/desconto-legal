## ADDED Requirements

### Requirement: Compartilhar
O botão Compartilhar MUST abrir a folha nativa do sistema em dispositivos de toque e, nos demais, um painel com WhatsApp, LinkedIn, Facebook, e-mail e copiar link, usando um texto próprio da página.

#### Scenario: Copiar o link no desktop
- **WHEN** o visitante abre o painel e clica em "Copiar"
- **THEN** o link vai para a área de transferência, o botão mostra "Copiado" e um aviso confirma

### Requirement: Card com retorno ao passar o mouse
O card de empresa MUST subir e destacar a sombra ao receber o mouse, MUST manter o texto nítido (sem rotação 3D) e MUST ficar parado quando o sistema pede menos movimento.

#### Scenario: Mouse sobre o card
- **WHEN** o mouse entra no card
- **THEN** o card sobe 6px, a luz acompanha o cursor e, ao sair, volta a não ter transformação
