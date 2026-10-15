## ADDED Requirements

### Requirement: Sidebar aberta e responsiva
A sidebar do painel MUST iniciar aberta, MUST ficar fixa a partir de 1024px de largura e MUST ser substituída por um menu lateral (Sheet) abaixo disso. O conteúdo MUST NOT ficar sob a sidebar.

#### Scenario: Notebook 1366x768
- **WHEN** o painel é aberto em 1366x768
- **THEN** a sidebar aparece aberta com 256px, sem sobreposição com o conteúdo e sem rolagem horizontal da página

#### Scenario: Tela baixa
- **WHEN** a altura da janela é menor que o conteúdo da sidebar
- **THEN** a sidebar rola internamente

#### Scenario: Tablet e celular
- **WHEN** a largura é menor que 1024px
- **THEN** a sidebar fixa é oculta e o menu abre pelo botão do cabeçalho

### Requirement: Tabela de empresas sem rolagem horizontal em desktop
A tabela de empresas MUST caber na largura disponível de 1024px a 1920px, exibindo Cidade e Categoria como colunas a partir de 1280px (e dentro da célula da empresa abaixo disso) e WhatsApp a partir de 1536px.

#### Scenario: 1024x768 com sidebar aberta
- **WHEN** a tabela é exibida em 1024x768
- **THEN** as colunas Empresa, Contrato, Status e Ações aparecem sem rolagem horizontal e cidade e categoria aparecem na célula da empresa

### Requirement: Empresa em destaque identificada na tabela
Empresas em destaque MUST exibir o selo "Destaque" ao lado do nome e um fundo de linha diferenciado.

#### Scenario: Linha de empresa em destaque
- **WHEN** a tabela lista uma empresa com `featured = true`
- **THEN** a linha mostra o selo "Destaque" e o fundo âmbar suave

### Requirement: Ações com ícones e rótulos
As ações de editar e inativar/ativar MUST ter ícones distintos e rótulos acessíveis, exibidos em tooltip ao passar o mouse.

#### Scenario: Hover nas ações
- **WHEN** o usuário passa o mouse sobre a ação de inativar de uma empresa ativa
- **THEN** o tooltip "Inativar empresa" aparece e o diálogo de confirmação explica que a empresa deixará de aparecer na listagem pública
