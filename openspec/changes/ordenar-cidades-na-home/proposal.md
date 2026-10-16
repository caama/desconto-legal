## Why

Na seção "Selecione sua cidade" da home, a consulta só ordenava por `isThirst` (sedes primeiro). Sem critério de desempate, as subseções apareciam na ordem em que o banco devolvia, o que dificulta achar a própria cidade.

## What Changes

- As cidades ativas passam a vir com as sedes primeiro e, dentro de cada grupo (sedes e subseções), em ordem alfabética pelo nome.
- A ordenação por nome é feita na aplicação com `Intl.Collator('pt-BR')`, para que nomes com acento ou cedilha (ex.: "Açailândia") fiquem no lugar certo independentemente da collation do PostgreSQL de cada ambiente.

## Capabilities

### New Capabilities
- `selecao-de-cidade`: a ordem em que as cidades aparecem na home.

## Impact

- **Código**: `src/app/(public)/_dal/get-active-cities.ts`.
- **Schema do Prisma**: sem alteração e sem migration.
