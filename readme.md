# Desconto Legal

Aplicação web para divulgação e gestão de empresas conveniadas, organizada por cidade e categoria. O projeto possui área pública para consulta dos benefícios e painel administrativo para gerenciamento de empresas, usuários, cidades, categorias e perfil.

## Stack

- Next.js 16 + React 19
- TypeScript
- Prisma ORM + PostgreSQL
- NextAuth/Auth.js com login Google
- Supabase Storage para upload de imagens
- Tailwind CSS v4 + Radix UI

## Principais funcionalidades

- Listagem pública de empresas conveniadas por cidade
- Página de detalhes da empresa com benefícios e contato
- Dashboard administrativo com controle de empresas, categorias, cidades e usuários
- Ativação e inativação de registros
- Upload e remoção de imagens das empresas

## Como rodar localmente

### 1. Instale as dependências

```bash
pnpm install
```

### 2. Suba o banco de dados

```bash
docker compose up -d
```

### 3. Configure o ambiente

Crie o arquivo `.env` com as variáveis abaixo:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
ADMIN_EMAIL=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 4. Execute as migrations e gere o client do Prisma

```bash
pnpm prisma:dev
```

### 5. Inicie o projeto

```bash
pnpm dev
```

Aplicação disponível em `http://localhost:3000`.

## Scripts

- `pnpm dev`: inicia o ambiente de desenvolvimento
- `pnpm build`: aplica migrations de produção e gera o build
- `pnpm start`: inicia a aplicação em produção
- `pnpm lint`: roda a validação com Biome
- `pnpm format`: formata o código
- `pnpm prisma:dev`: executa migrations locais e gera o client do Prisma

## Estrutura resumida

- `src/app`: rotas públicas, privadas e APIs
- `src/components`: componentes compartilhados e UI
- `src/lib`: integrações e utilitários de infraestrutura
- `prisma`: schema, migrations e seed

## Autor

Hilquias Ferreira Melo  
[github.com/hfmelodev](https://github.com/hfmelodev)
