## ADDED Requirements

### Requirement: Visita à página de detalhes
A abertura da página pública de detalhes de uma empresa ativa MUST registrar uma visita no agregado diário da empresa (`company_daily_stats.views`). A visita MUST ser registrada pelo navegador depois que a página carrega, uma única vez por empresa por sessão do navegador.

#### Scenario: Primeira abertura
- **WHEN** um advogado abre a página de detalhes de uma empresa
- **THEN** a contagem de visitas daquela empresa no dia aumenta em 1

#### Scenario: Recarregar a página
- **WHEN** o mesmo navegador recarrega a página da mesma empresa na mesma sessão
- **THEN** nenhuma nova visita é registrada

#### Scenario: Prévia de link no WhatsApp
- **WHEN** um robô de prévia de link baixa o HTML da página sem executar JavaScript
- **THEN** nenhuma visita é registrada

### Requirement: Contato pelo WhatsApp
Cada clique no botão de WhatsApp da página de detalhes MUST incrementar o contador acumulado `visitors` da empresa, como hoje, e também `company_daily_stats.whatsapp_clicks` do dia. A regra de destaque automático por `visitors` MUST continuar inalterada.

#### Scenario: Clique no WhatsApp
- **WHEN** um advogado clica em "Chamar no WhatsApp"
- **THEN** `visitors` e os contatos do dia daquela empresa aumentam em 1

### Requirement: Dia do registro
O dia de cada registro de procura MUST ser a data civil no fuso `America/Sao_Paulo`.

#### Scenario: Clique às 22h
- **WHEN** um contato acontece às 22h de 10/03 no horário de Brasília (01h de 11/03 em UTC)
- **THEN** ele é contado em 10/03

### Requirement: Registro não interfere na navegação
Falhas ao registrar visita ou contato MUST NOT impedir a abertura da página nem do WhatsApp, e empresas inexistentes ou inativas MUST NOT gerar registro.

#### Scenario: Empresa inativa
- **WHEN** o registro chega para uma empresa inativa
- **THEN** nada é gravado e a action responde sem erro para o usuário

### Requirement: Autor do cadastro
O cadastro de empresa pelo painel MUST gravar o usuário autenticado como autor (`createdById`). Empresas existentes antes da mudança MUST permanecer sem autor, e remover um usuário MUST NOT apagar as empresas que ele cadastrou.

#### Scenario: Nova empresa
- **WHEN** um usuário cadastra uma empresa
- **THEN** a empresa fica com `createdById` igual ao id desse usuário
