## Context

`getActiveCities` alimenta só a home (`src/app/(public)/page.tsx`). São poucas cidades ativas (uma por subseção da OAB/MA), então ordenar em memória não tem custo relevante.

## Decisions

- **Ordenar na aplicação, não no `orderBy`**: o banco de cada ambiente roda no Supabase self-hosted e a collation padrão pode ser `C`/`C.UTF-8`, que jogaria "Açailândia" para depois de "Z". O `Intl.Collator('pt-BR', { sensitivity: 'base' })` ignora acento e caixa na comparação.
- **Sede antes de subseção** continua sendo o primeiro critério (`isThirst` desc).

## Risks / Trade-offs

- Se o número de cidades crescer muito, a ordenação em memória continua trivial; não há paginação nessa lista.
