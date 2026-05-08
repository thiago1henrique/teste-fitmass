# migrate-to-amplify.ts

Script de migração única que importa os posts do WordPress (já exportados em JSON) para o backend AWS Amplify Gen 2 do Fitmass — criando os registros no DynamoDB via AppSync e fazendo upload das imagens no S3.

Substitui os três scripts legados que usavam Prisma/PostgreSQL:
- `import-wp-posts.ts` → limpeza de HTML e criação de posts
- `categorize-posts.ts` → inferência de categorias por keywords
- `fix-categories.ts` → correção de dados malformados

---

## Pré-requisitos

### 1. `amplify_outputs.json` presente na raiz

Gerado pelo sandbox ou por uma deploy real:
```bash
npx ampx sandbox
# ou
npx ampx generate outputs
```

### 2. `.env.local` com credenciais

```env
# Usuário ADMIN do Cognito para autenticar e criar os posts
ADMIN_EMAIL=admin@fitmass.com.br
ADMIN_PASSWORD=sua-senha

# Credenciais AWS para upload no S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

> As credenciais AWS podem ser omitidas se o AWS CLI já estiver configurado localmente (`aws configure`).

### 3. Auth flow `ADMIN_USER_PASSWORD_AUTH` habilitado no Cognito

O script autentica com `AdminInitiateAuth / ADMIN_USER_PASSWORD_AUTH` (call server-side que exige IAM). Esse flow precisa estar ativo no App Client do Cognito:

1. Acesse **AWS Console → Cognito → User Pools → fitmass → App clients**
2. Clique no client listado → **Edit**
3. Em **Authentication flows**, marque `ALLOW_ADMIN_USER_PASSWORD_AUTH`
4. Salve

Sem isso, o script retorna `InvalidParameterException` ao tentar autenticar.

As credenciais AWS do `.env.local` já cobrem a permissão `cognito-idp:AdminInitiateAuth` desde que o IAM user/role tenha acesso ao Cognito.

### 4. Arquivo JSON com os posts

```
json/posts_fitmass_completo.json
```

---

## Como executar

```bash
npx tsx scripts/migrate-to-amplify.ts
```

Saída esperada:

```
→ Autenticando no Cognito…
✔ Autenticado: admin@fitmass.com.br

→ 47 posts encontrados

  ✔ [capa] uploads/wp-foto-capa.png
  ✔ [imgs] 2 imagem(ns) migrada(s)
  ✔ [post] gestao-de-academias [Fitness]
  ⚠ [skip] massa-muscular — já existe
  ⚠ [capa falhou] http://fitmass.com.br/wp-content/uploads/...
  ✔ [post] fazer-jejum-intermitente [Saúde]

────────────────────────────────────────
✅ Migração concluída
   Criados  : 45
   Ignorados: 1
   Erros    : 1
```

---

## Como o script funciona

### 1. Autenticação Cognito

Chama `AdminInitiateAuth` com `ADMIN_USER_PASSWORD_AUTH` (API server-side, requer IAM) usando as credenciais do `.env.local`. O **ID Token** retornado é usado nas chamadas ao AppSync — é ele que carrega o claim `cognito:groups` necessário para a autorização por grupo no schema Amplify.

```
ADMIN_EMAIL + ADMIN_PASSWORD + credenciais AWS
      ↓
CognitoIdentityProviderClient.AdminInitiateAuth
      ↓
IdToken (JWT)  →  decode  →  { userId (sub), authorName (given_name) }
```

### 2. Para cada post no JSON

#### a) Idempotência — verificar slug

Consulta o DynamoDB via AppSync com a API key pública (sem precisar do token de usuário). Se o slug já existir, pula o post.

#### b) Upload da imagem de capa (`featureImage`)

A URL do WordPress (`http://fitmass.com.br/wp-content/uploads/...`) é mapeada para uma chave S3 com prefixo `wp-`:

```
http://fitmass.com.br/wp-content/uploads/2023/10/foto.png
                               ↓
site/uploads/wp-foto.png  →  S3 bucket (fitmass-public-imgs)
                               ↓
https://fitmass-public-imgs.s3.us-east-1.amazonaws.com/site/uploads/wp-foto.png
```

Se a chave já existir no S3 (`HeadObject` retorna 200), o download é pulado e a URL existente é reusada — garantindo idempotência sem duplicar arquivos.

Timeout de 15 segundos por imagem. Falhas de rede não abortam o post — `coverUrl` fica `undefined`.

#### c) Migração das imagens inline no `content`

Busca todas as URLs `fitmass.com.br/wp-content/uploads/...` no HTML usando regex, faz upload de cada uma para o S3 (mesma lógica do item b) e substitui as URLs antigas pelas novas no conteúdo.

#### d) Limpeza do HTML WordPress

Remove `<!-- wp:paragraph -->` e outros block comments, shortcodes como `[gallery ...]`, e linhas em branco excessivas.

#### e) Extração do summary

Tira as tags HTML do conteúdo limpo, pega os primeiros ~200 caracteres e corta na última palavra completa, adicionando `…`.

#### f) Inferência de categoria

Pontua cada categoria com base em keywords encontradas no título (peso 6), summary (peso 3) e conteúdo (peso 1). A categoria com maior pontuação acima do limiar (4 pontos) é escolhida. Empate ou pontuação zero → `['Saúde', 'Fitness']`.

Categorias: `Saúde`, `Bioimpedância`, `Fitness`, `Tecnologia`.

#### g) Criação do post no DynamoDB

Chama a mutation `createPost` no AppSync usando o `AccessToken` do Cognito como `Authorization`. O post é criado com `status: PUBLISHED` e `publishedAt` derivado do campo `date` do JSON original.

```
AccessToken (Bearer)
      ↓
AppSync GraphQL  →  createPost mutation
      ↓
DynamoDB
```

### 3. Relatório final

Ao terminar, exibe contadores de posts criados, ignorados (slug duplicado ou dados incompletos) e com erro.

---

## Idempotência

| Operação | Comportamento em re-execução |
|---|---|
| Slug já no DynamoDB | Post pulado sem alteração |
| Chave S3 já existente | `HeadObject` retorna 200 → URL reusada, download pulado |
| Imagem inacessível (404/timeout) | Post criado sem `coverUrl`; URLs inline permanecem como WP |

---

## Após a migração

1. Verificar posts em `/admin/posts`
2. Abrir alguns posts no blog e conferir se as imagens carregam do S3
3. Remover arquivos que não são mais necessários:

```bash
# Remover JSON de origem (após confirmar que tudo migrou)
rm json/posts_fitmass_completo.json

# Remover este script e a documentação
rm scripts/migrate-to-amplify.ts
rm scripts/migrate-to-amplify.md
rm scripts/MIGRATION.md
```
