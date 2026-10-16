## ADDED Requirements

### Requirement: Ordem das cidades na home
A seção "Selecione sua cidade" MUST listar primeiro as cidades marcadas como sede e depois as subseções, e dentro de cada grupo MUST ordenar as cidades alfabeticamente pelo nome segundo as regras do português (acentos e cedilha não alteram a posição da letra base).

#### Scenario: Sede e subseções ativas
- **WHEN** estão ativas São Luís (sede), Imperatriz, Açailândia e Bacabal (subseções)
- **THEN** a home mostra São Luís, Açailândia, Bacabal e Imperatriz, nessa ordem
