## ADDED Requirements

### Requirement: Dimensionamento do banner institucional
O banner de apresentação da home MUST exibir o logo do Desconto Legal e o texto de apresentação como elementos separados, com o texto renderizado como texto (não embutido em imagem), e MUST limitar a largura do logo e do conteúdo para que não cresçam indefinidamente em telas largas.

#### Scenario: Celular
- **WHEN** a home é aberta numa tela de 390px de largura
- **THEN** o logo aparece com no máximo 300px de largura, o texto fica abaixo dele, centralizado, em tamanho de corpo legível

#### Scenario: Monitor grande
- **WHEN** a home é aberta numa tela de 2560px de largura
- **THEN** o logo não passa de 440px de largura, logo e texto ficam lado a lado dentro de uma área de no máximo `max-w-6xl`, e o fundo azul com os recortes no topo ocupa toda a largura
