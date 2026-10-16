## ADDED Requirements

### Requirement: Acesso restrito a administradores
A página `/private/dashboard/reports` e as rotas `/api/reports/[report]/[format]` MUST ser acessíveis apenas a usuários `ADMIN` ativos. O item "Relatórios" MUST aparecer na sidebar apenas para administradores.

#### Scenario: Membro abre a página
- **WHEN** um usuário `MEMBER` acessa `/private/dashboard/reports`
- **THEN** é redirecionado para `/private/sign-in`

#### Scenario: Download sem permissão
- **WHEN** uma requisição sem sessão de `ADMIN` chama `/api/reports/empresas/pdf`
- **THEN** a resposta é `401` ou `403` em JSON e nenhum arquivo é gerado

### Requirement: Escolha do relatório e filtros na URL
A página MUST permitir escolher entre os relatórios Empresas conveniadas, Contratos, Procura por empresa e Resumo por subseção, mantendo o relatório (`relatorio`) e seus filtros na URL. Filtros inválidos MUST cair no padrão do relatório, e trocar de relatório MUST descartar os filtros que não se aplicam a ele.

#### Scenario: Link compartilhado
- **WHEN** o administrador abre `/private/dashboard/reports?relatorio=contratos&janela=30&subsecao=imperatriz`
- **THEN** a página mostra o relatório de contratos de Imperatriz vencidos ou vencendo em até 30 dias

#### Scenario: Relatório inexistente
- **WHEN** a URL tem `relatorio=xyz`
- **THEN** a página mostra o relatório Empresas conveniadas

### Requirement: Prévia antes de exportar
A página MUST mostrar o resumo do relatório e uma prévia da tabela com até 50 linhas, informando o total. Os botões de PDF e Excel MUST baixar o arquivo com exatamente os mesmos filtros da prévia.

#### Scenario: Relatório com muitas linhas
- **WHEN** o relatório tem 180 linhas
- **THEN** a prévia mostra 50 e informa que o arquivo traz as 180

#### Scenario: Relatório vazio
- **WHEN** os filtros não retornam nenhuma linha
- **THEN** a prévia explica que não há dados para o recorte e os botões de exportação ficam desabilitados

### Requirement: Relatório de empresas conveniadas
O relatório MUST listar as empresas filtradas por subseção, categoria, situação (padrão: ativas) e, opcionalmente, ano de cadastro, ordenadas por subseção e nome. Cada linha MUST trazer empresa, CNPJ, subseção, categoria, desconto, responsável, WhatsApp, e-mail, início e fim do contrato, situação do contrato, situação da empresa, contatos acumulados, data de cadastro e quem cadastrou.

#### Scenario: Empresa sem autor registrado
- **WHEN** a empresa foi cadastrada antes do registro de autoria
- **THEN** a coluna "Cadastrada por" mostra "Sem registro"

### Requirement: Relatório de contratos
O relatório MUST listar empresas ativas conforme a janela escolhida: vencidos, vencidos e a vencer em até 30, 60, 90 (padrão) ou 180 dias, ou sem data de fim. Para as janelas com data, MUST ordenar pela data de fim. Cada linha MUST trazer empresa, CNPJ, subseção, categoria, responsável, WhatsApp, início, fim, situação (vencido há N dias, vence hoje ou faltam N dias) e contatos acumulados.

#### Scenario: Janela de 30 dias
- **WHEN** a janela é 30 dias
- **THEN** entram os contratos vencidos e os que vencem em até 30 dias, e não entram empresas inativas nem sem data de fim

### Requirement: Relatório de procura por empresa
O relatório MUST somar, por empresa, as visitas e os contatos registrados no período (ano e, opcionalmente, mês), filtrados por subseção e categoria. MUST incluir as empresas ativas sem procura no período e ordenar por contatos e depois por visitas. A conversão MUST ser contatos ÷ visitas e ficar vazia quando não houver visitas.

#### Scenario: Período anterior à coleta
- **WHEN** o período é anterior ao primeiro registro diário
- **THEN** o resumo informa a data de início da coleta

### Requirement: Resumo por subseção
O relatório MUST trazer uma linha por subseção ativa com: empresas ativas, inativas, cadastradas no ano escolhido, contratos vencidos de empresas ativas, contratos que vencem em até 90 dias, empresas ativas sem data de fim, visitas e contatos do ano, e uma linha de total. No Excel, MUST incluir uma coluna por categoria ativa com as empresas ativas.

#### Scenario: Subseção sem empresas
- **WHEN** uma subseção ativa não tem empresas
- **THEN** ela aparece com zeros, para evidenciar a lacuna

### Requirement: Identidade e conteúdo dos arquivos
O PDF e o Excel MUST trazer a logo OAB/CAAMA, o título do relatório, os filtros aplicados, a data e hora da geração (horário de Brasília) e o nome de quem gerou. O PDF MUST repetir cabeçalho e cabeçalho da tabela em todas as páginas e numerar as páginas. O Excel MUST ter o cabeçalho da tabela congelado, autofiltro, datas como datas, números como números e conversão como percentual. O nome do arquivo MUST identificar o relatório e a data de geração.

#### Scenario: PDF de várias páginas
- **WHEN** o relatório ocupa 3 páginas
- **THEN** cada página mostra logo, título, cabeçalho da tabela e "Página N de 3"

#### Scenario: Ordenar no Excel
- **WHEN** o administrador ordena a coluna "Fim do contrato" pelo autofiltro
- **THEN** a ordenação é cronológica, porque a célula é data e não texto
