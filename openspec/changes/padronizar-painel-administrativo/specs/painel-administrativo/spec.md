## ADDED Requirements

### Requirement: Listagens separadas por situação
As listagens de empresas, usuários, cidades e categorias MUST separar registros ativos e inativos em abas com a quantidade de cada uma, e MUST manter aba, página, linhas por página e busca na URL.

#### Scenario: Trocar para inativos
- **WHEN** o administrador clica na aba de inativos
- **THEN** a tabela lista só os inativos, a URL recebe `status=inactive` e a página volta para 1

#### Scenario: Busca com atraso
- **WHEN** o administrador digita no campo de busca
- **THEN** a URL recebe `search=<termo>` depois de 400ms sem digitação e a listagem é filtrada

### Requirement: Inativar com confirmação
Inativar ou reativar um registro MUST pedir confirmação em um diálogo que explica o efeito, e o administrador MUST NOT conseguir inativar o próprio usuário.

#### Scenario: Próprio usuário
- **WHEN** o administrador passa o mouse no botão de inativar da própria linha
- **THEN** o botão está desabilitado e o tooltip explica o motivo

### Requirement: Slug gerado a partir do nome
Nos formulários de empresa, cidade e categoria o slug MUST acompanhar o nome enquanto não for editado à mão, e apagar o slug MUST religar o preenchimento automático. Na edição, o slug MUST acompanhar o nome apenas se o slug salvo for o gerado a partir do nome salvo, e o formulário MUST avisar quando o slug for diferente do salvo.

#### Scenario: Trocar o nome na criação
- **WHEN** o administrador digita "São José de Ribamar", apaga e digita "Paço do Lumiar"
- **THEN** o slug fica `paco-do-lumiar`

#### Scenario: Slug personalizado preservado
- **WHEN** a empresa "OAB" tem slug `oabma` e o nome é alterado
- **THEN** o slug continua `oabma`

### Requirement: Ações restritas a administradores
As actions de criar, editar, ativar e inativar cidades, categorias e usuários MUST recusar chamadas de quem não tem papel `ADMIN`.

#### Scenario: Membro chama a action
- **WHEN** um usuário `MEMBER` chama a action de criar cidade
- **THEN** a action devolve erro e nada é gravado
