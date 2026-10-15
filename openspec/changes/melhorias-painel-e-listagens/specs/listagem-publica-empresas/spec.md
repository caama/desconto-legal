## ADDED Requirements

### Requirement: Contador de visitantes oculto
A listagem pública MUST NOT exibir a quantidade de visitantes das empresas enquanto a flag `SHOW_VISITORS` estiver desligada. O incremento de visitantes e o destaque automático com 20 ou mais visitantes MUST continuar funcionando.

#### Scenario: Card sem contador
- **WHEN** a página `/city/<slug>/companies` é renderizada
- **THEN** nenhum card mostra o texto "visitante" ou "visitantes"

#### Scenario: Destaque automático mantido
- **WHEN** um visitante clica no botão do WhatsApp de uma empresa com 20 ou mais visitantes que não é destaque
- **THEN** a empresa passa a ser marcada como destaque

### Requirement: Busca e filtros com retorno de estado
A listagem pública MUST mostrar quantas empresas foram encontradas, MUST permitir limpar busca e categorias de uma vez e MUST manter no campo de busca o termo presente na URL.

#### Scenario: Recarregar com busca ativa
- **WHEN** a página é aberta com `?query=<termo>`
- **THEN** o campo de busca exibe `<termo>` e a lista está filtrada por ele

#### Scenario: Nenhum resultado com filtros
- **WHEN** a busca ou as categorias selecionadas não retornam empresas
- **THEN** a página mostra "Nenhuma empresa encontrada" com o botão "Limpar filtros"

### Requirement: Card acessível por teclado
Cada card de empresa MUST ser um link com indicador de foco visível ao navegar por teclado.

#### Scenario: Foco no card
- **WHEN** o usuário navega até um card com a tecla Tab
- **THEN** o card exibe um anel de foco na cor primária
