## ADDED Requirements

### Requirement: Ações rápidas
A página de detalhes MUST exibir ações rápidas para WhatsApp, localização no Google Maps e Instagram (quando houver), e o clique no WhatsApp MUST contar uma visita para o destaque automático.

#### Scenario: Abrir a localização
- **WHEN** o visitante toca em "Localização"
- **THEN** o Google Maps abre com a busca pelo endereço completo da empresa

### Requirement: Contatos clicáveis
Telefone, e-mail e Instagram MUST ser links (`tel:`, `mailto:` e o perfil), e o Instagram MUST ser exibido como `@<perfil>`.

#### Scenario: Ligar pelo cartão de informações
- **WHEN** o visitante toca no telefone
- **THEN** o aparelho inicia uma ligação para o número sem formatação

### Requirement: Barra de contato no mobile
Abaixo de 1024px a página MUST mostrar uma barra fixa com o desconto e o WhatsApp somente depois que as ações rápidas saírem da tela por cima.

#### Scenario: Rolar a página no celular
- **WHEN** o visitante rola até as ações rápidas sumirem
- **THEN** a barra sobe na base da tela, e some ao voltar ao topo

### Requirement: Metadados por empresa
Cada página MUST ter título, descrição e Open Graph próprios com nome e desconto da empresa, e MUST publicar dados estruturados `LocalBusiness`.

#### Scenario: Compartilhar o link
- **WHEN** o link de uma empresa é colado no WhatsApp
- **THEN** a prévia mostra "<nome>: <desconto> | Desconto Legal" e a logo da empresa

### Requirement: Empresas relacionadas
A página MUST listar até três outras empresas ativas da mesma cidade, priorizando a mesma categoria, e MUST NOT incluir a própria empresa.

#### Scenario: Cidade com outras empresas
- **WHEN** a cidade tem outras empresas ativas
- **THEN** a seção "Mais descontos em <cidade>" mostra até três cards e o link "Ver todas"
