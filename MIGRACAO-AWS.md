# Migração WordPress → AWS

Guia de execução para subir posts e imagens do WordPress para o AWS Amplify (AppSync + S3).

---

## O que foi feito

### Scripts criados

| Arquivo | O que faz |
|---|---|
| `scripts/import-wp-posts-aws.ts` | Importa posts do JSON para o AppSync (DynamoDB) via GraphQL |
| `scripts/upload-wp-images.ts` | Baixa imagens do WP e sobe para o bucket S3 do Amplify |

### Como funcionam

**`upload-wp-images.ts`**
- Lê `json/posts_fitmass_completo.json` e coleta todas as URLs de imagem (`featureImage`, `imageLinks` e `<img>` embutidos no HTML)
- Encontrou **1.997 imagens únicas** no total
- Baixa cada uma do WordPress (5 em paralelo) e sobe para `uploads/{nome-do-arquivo}` no S3
- Salva o mapeamento `URL WordPress → URL S3` em `json/image-map.json`
- É **retomável**: se interrompido, pula o que já foi enviado (verifica no S3 via HEAD)

**`import-wp-posts-aws.ts`**
- Autentica como admin no **Cognito** (`ADMIN_USER_PASSWORD_AUTH`)
- Para cada post: verifica se já existe no AppSync (por slug) e cria só se não existir (**idempotente**)
- Limpa comentários WordPress (`<!-- wp:... -->`) e shortcodes (`[gallery]`, etc.)
- Gera `summary` automático (primeiros ~200 chars sem HTML)
- Usa o `sub` do Cognito como `authorId` e `given_name` como `authorName`

### Diferenças do script antigo (PostgreSQL)

| Antes | Agora |
|---|---|
| `PrismaClient` + `pg` | `fetch` direto na API GraphQL do AppSync |
| Admin buscado no banco (`findFirst`) | Admin autenticado no Cognito |
| `prisma.post.upsert` | Query por slug + `createPost` condicional |
| `authorId` = UUID do banco | `authorId` = Cognito `sub` |
| `publishedAt` = `Date` | `publishedAt` = ISO string (`AWSDateTime`) |

---

## O que ainda precisa ser feito

### Passo 1 — Credenciais no `.env.local`

Adicione as três variáveis abaixo ao `.env.local`:

```bash
# Chaves IAM com permissão de escrita no S3
# Console AWS → IAM → Users → Security credentials → Create access key
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# Usuário do grupo ADMIN no Cognito
# O mesmo login usado no /admin do site
ADMIN_EMAIL=seu@email.com
ADMIN_PASSWORD=sua-senha
```

> **Onde achar as chaves IAM:** [console.aws.amazon.com/iam](https://console.aws.amazon.com/iam/home#/users) → seu usuário → aba **Security credentials** → **Create access key** (escolha "Local code").

> **Permissão mínima necessária:** `AmazonS3FullAccess` + `AmazonCognitoPowerUser` (ou política customizada com `s3:PutObject`, `s3:HeadObject` e `cognito-idp:AdminInitiateAuth`).

---

### Passo 2 — Subir as imagens para o S3

```bash
npx tsx scripts/upload-wp-images.ts
```

- Faz download + upload das ~1.997 imagens (pode levar alguns minutos)
- Gera `json/image-map.json` com o mapeamento de URLs
- Pode ser interrompido e retomado sem reenviar o que já foi

---

### Passo 3 — Atualizar o script de importação para usar URLs do S3

> **Este passo ainda não foi implementado.**

Antes de rodar o import, o `import-wp-posts-aws.ts` precisa ser atualizado para substituir as URLs do WordPress pelas URLs do S3 usando o `image-map.json`. Sem isso, os posts serão criados ainda com links para `fitmass.com.br/wp-content/uploads/...`.

A mudança é simples: carregar o `image-map.json` e aplicar um replace nas strings de `content` e `coverUrl` antes de enviar para o AppSync.

---

### Passo 4 — Importar os posts para o AppSync

```bash
npx tsx scripts/import-wp-posts-aws.ts
```

- Autentica no Cognito com as credenciais do `.env.local`
- Cria cada post no AppSync (pula os que já existem por slug)

---

## Ordem de execução

```
1. Preencher .env.local
2. npx tsx scripts/upload-wp-images.ts   ← imagens no S3
3. [implementar replace de URLs no script de import]
4. npx tsx scripts/import-wp-posts-aws.ts ← posts no AppSync
```

---

## Referências

| Recurso | Valor |
|---|---|
| AppSync URL | `https://riblcdirkjh4di5ojnq3tagqz4.appsync-api.us-east-1.amazonaws.com/graphql` |
| S3 Bucket | `amplify-fitmass-brunoroch-fitmassuploadsbucket98cf-llbkzn9wap4f` |
| Cognito User Pool | `us-east-1_USskM9whS` |
| Região | `us-east-1` |
| Fonte dos dados | `amplify_outputs.json` (lido automaticamente pelos scripts) |
