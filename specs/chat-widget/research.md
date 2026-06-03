# Research: Chat Widget Flutuante

**Date**: 2026-06-02 | **Branch**: `feat/chat-widget`

---

## Decisão 1: Arquitetura do Widget (RSC + Client leaf)

**Decision**: Server Component (`ChatWidget.tsx`) faz o fetch e passa props para o Client Component (`ChatWidgetClient.tsx`).

**Rationale**: Segue o Princípio I da Constituição (Server Components First). O RSC faz o fetch com `unstable_cache` no servidor; o client component é um leaf node responsável apenas pela interação (estado open/close, animação, clique).

**Alternatives considered**:
- Fetch via `useEffect` no client: rejeitado — viola Princípio I e expõe chamadas ao banco ao browser.
- Route handler (`/api/chat-questions`): rejeitado — adiciona round-trip desnecessário; RSC resolve o problema de forma mais simples.

---

## Decisão 2: Caching do Widget

**Decision**: `unstable_cache` com tag `chat-questions` e TTL de 60 segundos.

**Rationale**: O widget é renderizado para todos os visitantes públicos. Sem cache, cada page request acionaria uma query ao AppSync. Com TTL 60s, mudanças feitas pelo admin refletem em até 1 minuto — aceitável pelo requisito SC-003. `revalidateTag('chat-questions')` nas server actions garante atualização imediata após mutação.

**Alternatives considered**:
- `revalidate: 60` no fetch do Amplify: rejeitado — o Amplify client não aceita opções de cache do Next.js diretamente; `unstable_cache` é o wrapper correto.
- Sem cache (`noStore()`): rejeitado — impacto em performance para páginas com alto tráfego.

---

## Decisão 3: Auth mode para leitura pública

**Decision**: `authMode: 'apiKey'` no `ChatWidget.tsx` (server component público).

**Rationale**: O modelo `ChatQuestion` tem `allow.publicApiKey().to(['read'])`. Visitantes não têm sessão Cognito. O padrão `authMode: 'apiKey'` já é usado nas páginas públicas do blog (`/blog`, `/blog/[slug]`). Segue Princípio II.

**Alternatives considered**:
- `allow.guest()` sem apiKey: rejeitado — a configuração do projeto usa apiKey como padrão para acesso público (ver `defineData` em `resource.ts`).

---

## Decisão 4: Limite de 5 perguntas

**Decision**: Enforced no server action (`createChatQuestion`) contando registros existentes + guard na UI (botão desabilitado).

**Rationale**: Defense-in-depth. A UI previne cliques acidentais; o server action previne race conditions e chamadas diretas à API.

**Alternatives considered**:
- Apenas UI guard: rejeitado — race condition possível se dois admins abrem a tela simultaneamente.
- Constraint no schema Amplify: rejeitado — Amplify Gen 2 não suporta constraints de count no schema.

---

## Decisão 5: Seed de perguntas padrão

**Decision**: Botão "Importar perguntas padrão" na página admin, executando `seedDefaultChatQuestions()`.

**Rationale**: Padrão já estabelecido no projeto (ver `seedDefaultLinks` no módulo de Links). Dá controle ao admin; não força dados sem conhecimento do usuário.

**Alternatives considered**:
- Auto-seed no primeiro deploy: rejeitado — não há mecanismo de "run once" no Amplify Gen 2; forçaria verificação em cada request.
- Hardcoded no widget: rejeitado — viola o requisito de configurabilidade.

---

## Decisão 6: Posicionamento do widget no layout

**Decision**: Adicionar `<ChatWidget>` em `app/(pages)/layout.tsx` (não no root layout).

**Rationale**: O layout `(pages)` só envolve rotas públicas. O widget automaticamente não aparece em `/admin/**` e `/links` sem necessidade de checar pathname. Princípio V — menos surface de verificação = menos chance de erro.

**Alternatives considered**:
- Root layout com verificação de pathname: rejeitado — sem `middleware.ts`, a verificação de pathname em server components do root layout é frágil (depende do header `x-pathname` que não é setado atualmente).

---

## Decisão 7: WhatsApp URL

**Decision**: `https://api.whatsapp.com/send/?phone=5541984810567&type=phone_number&app_absent=0&text=<encoded>`

**Rationale**: Exato mesmo formato já usado no Footer e PagesLayoutClient do projeto. Reutilizar garante consistência e evita divergência de número de telefone.

**Perguntas padrão do seed**:
| order | question | actionType | whatsappMsg |
|-------|----------|------------|-------------|
| 0 | "O que é a Fitmass?" | ANSWER | — |
| 1 | "Quais planos vocês oferecem?" | ANSWER | — |
| 2 | "Como funciona a avaliação física?" | ANSWER | — |
| 3 | "Quero agendar uma demo" | WHATSAPP | "Olá! Gostaria de agendar uma demonstração do Fitmass." |
| 4 | "Fale com um atendente" | WHATSAPP | null (mensagem padrão) |

Mensagem padrão: `"Olá, vim do site da Fitmass e gostaria de mais informações."`
