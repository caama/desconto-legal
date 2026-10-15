## Context

Evolução do painel sobre a identidade existente (azul-marinho CAAMA, Geist, shadcn). A referência de listagem é a tela de funcionários do `web-fr` do Sala Livre. Não há testes automatizados; a verificação foi feita com typecheck, lint, prints em Chrome headless (desktop e mobile) e testes de digitação real via DevTools Protocol, com sessão temporária no banco local.

## Decisions

- **Estado da listagem na URL** (`status`, `page`, `perPage`, `search`, `city`): recarregar ou compartilhar o link mantém a visão. Mudar aba ou busca volta para a página 1.
- **Inativar com confirmação**: o diálogo diz o que acontece e que nada é apagado; não fecha durante a chamada para o toast não chegar sem contexto.
- **Slug automático com vínculo explícito** (`isSlugEditedManually`) em vez de efeito observando o nome: o bug antigo vinha do efeito comparar com o valor anterior. Na edição, o slug só acompanha o nome se ainda for o gerado a partir dele, para não trocar um endereço escolhido de propósito.
- **Constantes fora de arquivos `'use client'`** (`sidebar/constants.ts`): exportadas de um módulo cliente, chegam ao servidor como referência e não como valor.
- **React Compiler**: leituras de formulário por `useWatch`/`useFormState`, não por `form.watch`/`form.formState`.

## Risks / Trade-offs

- A busca usa `ILIKE` e diferencia acentos ("sao" não encontra "SÃO"). Resolver exigiria a extensão `unaccent` no Postgres.
- `/api/users/get-all-users` e as rotas de upload continuam sem autenticação (registrado em `atualizar-dependencias`).
