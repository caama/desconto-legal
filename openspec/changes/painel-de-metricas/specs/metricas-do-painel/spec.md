## ADDED Requirements

### Requirement: Acesso restrito a administradores
A rota `/private/dashboard/metrics` MUST ser acessível apenas a usuários com papel `ADMIN` e ativos, e o item "Métricas" MUST aparecer na sidebar apenas para administradores.

#### Scenario: Membro tenta abrir a página
- **WHEN** um usuário `MEMBER` acessa `/private/dashboard/metrics`
- **THEN** é redirecionado para `/private/sign-in` e nenhuma consulta de métrica é executada

#### Scenario: Sidebar de membro
- **WHEN** um usuário `MEMBER` abre o painel
- **THEN** a sidebar não exibe o item "Métricas"

### Requirement: Filtros de ano e subseção na URL
A página MUST oferecer filtro de ano (padrão: ano corrente) e de subseção (padrão: todas), mantidos na URL como `ano` e `subsecao` (slug da cidade). Valores inválidos MUST cair no padrão. O ano corrente e "todas" MUST NOT aparecer na URL.

#### Scenario: Escolher subseção
- **WHEN** o administrador escolhe a subseção "Imperatriz"
- **THEN** a URL recebe `subsecao=imperatriz` e os painéis afetados pelo filtro são recalculados

#### Scenario: Parâmetro inválido
- **WHEN** a URL tem `ano=abc` ou `subsecao=inexistente`
- **THEN** a página usa o ano corrente e todas as subseções

#### Scenario: Escolha do ano
- **WHEN** o seletor de ano é aberto
- **THEN** lista do ano do primeiro cadastro de empresa até o ano corrente

### Requirement: Escopo de cada filtro
O filtro de subseção MUST se aplicar a todos os painéis, exceto "Empresas por subseção" e à matriz de cobertura, que comparam subseções entre si e MUST destacar a subseção selecionada. O filtro de ano MUST se aplicar apenas a: novas no ano, cadastros por mês, procura por mês, conversão, top 5 "no ano" e ranking de cadastradores. Os demais painéis MUST refletir a situação atual.

#### Scenario: Subseção filtrada no gráfico por subseção
- **WHEN** a subseção "Imperatriz" está selecionada
- **THEN** o gráfico "Empresas por subseção" continua mostrando todas as subseções, com Imperatriz destacada

#### Scenario: Ano anterior em painel de situação atual
- **WHEN** o ano selecionado é 2025
- **THEN** a contagem de empresas ativas e a tabela de contratos continuam refletindo a data de hoje

### Requirement: Indicadores principais
A página MUST exibir: empresas ativas; empresas inativas; empresas cadastradas no ano selecionado, com variação percentual em relação ao ano anterior; contratos de empresas ativas que vencem em até 30, 60 e 90 dias; e contratos vencidos de empresas ainda ativas.

#### Scenario: Ano anterior sem cadastros
- **WHEN** o ano anterior ao selecionado não teve cadastros
- **THEN** o indicador de novas empresas não exibe variação percentual

#### Scenario: Contrato vencido com empresa ativa
- **WHEN** uma empresa ativa tem `contractEnd` anterior a hoje
- **THEN** ela conta em "Vencidos e ainda ativos" e o indicador recebe destaque de alerta quando maior que zero

### Requirement: Cadastros ao longo do tempo
A página MUST exibir cadastros de empresas por ano (de todos os anos com cadastro) e por mês do ano selecionado, pela data de cadastro (`createdAt`) no fuso `America/Sao_Paulo`, destacando o maior valor. Meses ainda não chegados MUST exibir traço em vez de zero.

#### Scenario: Ano corrente em outubro
- **WHEN** o ano selecionado é o corrente e o mês atual é outubro
- **THEN** novembro e dezembro mostram "–" no gráfico mensal

### Requirement: Distribuição e cobertura
A página MUST exibir empresas ativas por subseção e por categoria, e uma matriz de cobertura subseção × categoria com a quantidade de empresas ativas em cada célula. Subseções ativas sem nenhuma empresa ativa MUST ser listadas como lacuna.

#### Scenario: Categoria ausente numa subseção
- **WHEN** Imperatriz não tem nenhuma empresa ativa de Saúde
- **THEN** a célula Imperatriz × Saúde aparece vazia e visualmente diferenciada das células com empresas

### Requirement: Contratos a vencer
A página MUST listar as empresas ativas com contrato vencido ou vencendo em até 90 dias, ordenadas pela data de fim, com subseção, data de fim, situação (vencido ou dias restantes), contatos desde o início e link para editar a empresa. A página MUST informar quantas empresas ativas não têm data de fim de contrato.

#### Scenario: Empresa sem data de fim
- **WHEN** uma empresa ativa não tem `contractEnd`
- **THEN** ela não aparece na tabela e entra na contagem "sem data de fim"

### Requirement: Empresas mais procuradas
A página MUST exibir as 5 empresas com mais contatos, alternando entre "No ano" (contatos registrados por dia no ano selecionado) e "Desde o início" (contador acumulado da empresa). Com subseção selecionada, o ranking MUST considerar só empresas daquela subseção.

#### Scenario: Ano sem coleta
- **WHEN** o ano selecionado não tem nenhum registro diário
- **THEN** a aba "No ano" informa que a coleta começou em uma data posterior e sugere a aba "Desde o início"

### Requirement: Procura por período e conversão
A página MUST exibir, por mês do ano selecionado, as visitas à página de detalhes e os contatos pelo WhatsApp, e a taxa de conversão do ano (contatos ÷ visitas). A página MUST informar a data do primeiro registro de procura.

#### Scenario: Ano sem visitas
- **WHEN** não há visitas no ano selecionado
- **THEN** a taxa de conversão mostra "–"

### Requirement: Empresas sem procura
A página MUST listar as empresas ativas cadastradas há mais de 30 dias que nunca receberam contato.

#### Scenario: Empresa recém-cadastrada
- **WHEN** uma empresa ativa sem contatos foi cadastrada há 10 dias
- **THEN** ela não aparece na lista de empresas sem procura

### Requirement: Ranking de cadastradores
A página MUST exibir os usuários que mais cadastraram empresas no ano selecionado. Empresas sem autor registrado MUST ser agrupadas como "Sem registro".

#### Scenario: Empresas antigas
- **WHEN** empresas cadastradas antes da coleta de autoria entram no ano selecionado
- **THEN** são contadas em "Sem registro", não atribuídas a nenhum usuário
