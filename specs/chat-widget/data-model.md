# Data Model: Chat Widget Flutuante

**Date**: 2026-06-02 | **Branch**: `feat/chat-widget`

---

## Entidade: ChatQuestion

Representa uma pergunta configurável do chatbot flutuante.

### Campos

| Campo | Tipo Amplify | Obrigatório | Padrão | Descrição |
|-------|-------------|-------------|--------|-----------|
| `id` | auto (string) | sim | auto-gerado | Identificador único (UUID) |
| `question` | `a.string()` | sim | — | Texto exibido no widget (max 120 chars) |
| `answer` | `a.string()` | não | null | Texto de resposta (tipo ANSWER, max 500 chars) |
| `actionType` | `a.enum(['ANSWER', 'WHATSAPP'])` | não | null | Tipo de ação ao clicar |
| `whatsappMsg` | `a.string()` | não | null | Mensagem pre-preenchida no WhatsApp; null = usa padrão |
| `order` | `a.integer()` | sim | — | Ordem de exibição (0-indexed) |
| `active` | `a.boolean()` | não | true | Se false, não aparece no widget público |
| `createdAt` | auto | sim | auto | Timestamp de criação (gerado pelo Amplify) |
| `updatedAt` | auto | sim | auto | Timestamp de atualização (gerado pelo Amplify) |

### Regras de validação (server action)

- `question`: obrigatório, max 120 caracteres
- `answer`: obrigatório quando `actionType === 'ANSWER'`, max 500 caracteres; limpo pelo server quando `actionType === 'WHATSAPP'`
- `whatsappMsg`: opcional, max 300 caracteres
- `order`: inteiro ≥ 0
- Máximo de 5 registros no total (enforced por count check antes de create)

### Regras de autorização Amplify

```typescript
.authorization((allow) => [
  allow.groups(['ADMIN', 'EDITOR']),   // CRUD completo
  allow.guest().to(['read']),           // leitura para visitantes
  allow.publicApiKey().to(['read']),    // leitura via apiKey (widget público)
])
```

### Estados válidos do campo `actionType`

```
ANSWER  → `answer` preenchido, `whatsappMsg` ignorado
WHATSAPP → `answer` null, `whatsappMsg` opcional (null = mensagem padrão do site)
```

### Definição no schema Amplify (`amplify/data/resource.ts`)

```typescript
ChatQuestion: a
  .model({
    question:    a.string().required(),
    answer:      a.string(),
    actionType:  a.enum(['ANSWER', 'WHATSAPP']),
    whatsappMsg: a.string(),
    order:       a.integer().required(),
    active:      a.boolean().default(true),
  })
  .authorization((allow) => [
    allow.groups(['ADMIN', 'EDITOR']),
    allow.guest().to(['read']),
    allow.publicApiKey().to(['read']),
  ]),
```

---

## Tipo TypeScript (compartilhado)

```typescript
// Tipo derivado do schema Amplify (via Schema type)
export interface ChatQuestionData {
  id: string
  question: string
  answer: string | null
  actionType: 'ANSWER' | 'WHATSAPP' | null
  whatsappMsg: string | null
  order: number
  active: boolean | null
}
```

---

## Relacionamentos

Nenhum. `ChatQuestion` é uma entidade standalone sem foreign keys ou relacionamentos com outros modelos (`Post`, `LinkCategory`, `LinkItem`).

---

## Notas de deploy

Após adicionar o modelo a `amplify/data/resource.ts`:
1. Executar `npx ampx sandbox` para re-criar o schema GraphQL no DynamoDB
2. Aguardar conclusão do sandbox (pode levar 2-5 minutos)
3. O código que acessa `client.models.ChatQuestion` só funciona após o deploy do schema
