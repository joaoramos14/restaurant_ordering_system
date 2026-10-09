# Restaurant Ordering System

API REST de um sistema de pedidos para restaurante, desenvolvida na disciplina de **Desenvolvimento Back-End** (Engenharia de Software - 4P - Turma B). Por enquanto, gerencia **categorias** e **produtos** (CRUD completo).

## Tecnologias

- [Node.js](https://nodejs.org/) (ES Modules)
- [TypeScript](https://www.typescriptlang.org/)
- [Express 5](https://expressjs.com/)
- [Supabase](https://supabase.com/) (PostgreSQL) via `@supabase/supabase-js`
- [tsx](https://tsx.is/) para rodar TypeScript em desenvolvimento

## Pré-requisitos

- Node.js 22 ou superior (necessário para o `--env-file`)
- Um projeto no Supabase com as tabelas `categories` e `products` (veja [Banco de dados](#banco-de-dados))

## Como rodar

```bash
# 1. Instalar as dependências
npm install

# 2. Criar o arquivo .env na raiz (veja abaixo)

# 3. Subir o servidor em modo desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:3000`.

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SECRET_KEY=sua-chave-secreta
```

> O `.env` está no `.gitignore`. Nunca suba essas chaves para o repositório.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Roda com recarga automática (lê o `.env`) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Roda a versão compilada (`dist/server.js`). As variáveis do `.env` precisam estar definidas no ambiente |

## Estrutura do projeto

```
src/
├── config/
│   └── supabase.ts          # Cliente do Supabase
├── models/
│   ├── Category.ts          # Acesso ao banco (categorias)
│   └── Product.ts           # Acesso ao banco (produtos)
├── controller/
│   ├── CategoryController.ts
│   └── ProductController.ts
├── routes/
│   ├── categoryRoutes.ts
│   └── productRoutes.ts
├── app.ts                   # Configuração do Express e rotas
└── server.ts                # Inicialização do servidor
```

Fluxo de uma requisição: **routes → controller → model → Supabase**.

## Banco de dados

**categories**

| Coluna | Tipo |
|---|---|
| id | uuid (PK) |
| name | varchar |
| description | varchar |
| icon | varchar |
| display_order | int4 |
| active | bool |
| created_at / updated_at | timestamptz |

**products**

| Coluna | Tipo |
|---|---|
| id | uuid (PK) |
| category_id | uuid (FK → categories.id) |
| title | varchar |
| description | varchar |
| price | numeric |
| image | varchar |
| available | bool |
| active | bool |
| created_at / updated_at | timestamptz |

## Endpoints

### Geral

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Informações da API |

### Categorias

| Método | Rota | Descrição |
|---|---|---|
| GET | `/categories` | Lista todas as categorias |
| GET | `/categories/search/:keyword` | Busca por nome ou descrição |
| GET | `/categories/:id` | Busca uma categoria pelo id |
| POST | `/categories` | Cria uma categoria |
| PUT | `/categories/:id` | Atualiza uma categoria |
| DELETE | `/categories/:id` | Remove uma categoria |

Exemplo de corpo (POST/PUT):

```json
{
  "name": "Pizzas",
  "description": "Pizzas salgadas e especiais",
  "icon": "🍕",
  "display_order": 1,
  "active": true
}
```

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/products` | Lista todos os produtos |
| GET | `/products/search/:keyword` | Busca por título ou descrição |
| GET | `/products/category/:categoryId` | Lista os produtos de uma categoria |
| GET | `/products/:id` | Busca um produto pelo id |
| POST | `/products` | Cria um produto |
| PUT | `/products/:id` | Atualiza um produto (aceita campos parciais) |
| DELETE | `/products/:id` | Remove um produto |

Exemplo de corpo (POST):

```json
{
  "category_id": "uuid-de-uma-categoria-existente",
  "title": "Pizza Calabresa",
  "description": "Pizza com molho de tomate, mussarela e calabresa",
  "price": 39.9,
  "image": "pizza-calabresa.jpg",
  "available": true,
  "active": true
}
```

### Respostas

| Status | Quando |
|---|---|
| 200 | Sucesso |
| 400 | Parâmetro obrigatório não informado |
| 404 | Registro não encontrado (busca por id) |
| 500 | Erro ao acessar o banco ou dados inválidos |

## Testes com Postman

O arquivo `postman-collection.json` contém uma coleção com testes automáticos para todos os endpoints.

1. No Postman, clique em **Import** e selecione `postman-collection.json`.
2. Com o servidor rodando, abra a coleção, clique em **Run** e execute tudo em ordem.

A coleção cria uma categoria e um produto de teste e os remove no final (pasta `3 - Cleanup`). A URL base fica na variável `baseUrl` (`http://localhost:3000`).

## Autor

João Ramos
