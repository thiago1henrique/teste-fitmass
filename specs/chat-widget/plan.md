# Implementation Plan: Chat Widget Flutuante

**Branch**: `feat/chat-widget` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/chat-widget/spec.md`

---

## Summary

Adicionar um chatbot flutuante no canto inferior direito de todas as páginas públicas do site Fitmass. O widget exibe até 5 perguntas configuráveis pelo admin — cada uma pode exibir uma resposta de texto inline ou abrir o WhatsApp com mensagem pré-definida. As perguntas são gerenciadas via `/admin/chat` e persistidas no DynamoDB via Amplify Gen 2.

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)

**Primary Dependencies**: Next.js 16 (App Router), React 19, AWS Amplify Gen 2 (`@aws-amplify/adapter-nextjs`), Tailwind v4

**Storage**: DynamoDB via AppSync — novo modelo `ChatQuestion` em `amplify/data/resource.ts`

**Testing**: Sem test suite; validação manual via `npm run dev` e golden-path manual

**Target Platform**: Web — SSR/RSC no servidor, interação no browser

**Project Type**: Web application (Next.js full-stack)

**Performance Goals**: Widget não deve impactar LCP/FCP das páginas — usa RSC + Suspense `fallback={null}`

**Constraints**: Cache 60s via `unstable_cache` + `revalidateTag('chat-questions')`. Schema Amplify deve ser deployado antes do código funcionar (`npx ampx sandbox`).

**Scale/Scope**: ≤5 perguntas; lidas por todos os visitantes públicos

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Observação |
|-----------|--------|------------|
| I. Server Components First | ✅ | `ChatWidget.tsx` é RSC puro; `ChatWidgetClient.tsx` é leaf node `'use client'` |
| II. Auth-Gated Server Actions | ✅ | `chat.ts` chama `requireSession()` como primeiro statement; `getChatQuestions` usa `authMode: 'apiKey'` |
| III. Amplify Data Layer | ✅ | Todo acesso via `generateServerClientUsingCookies<Schema>`; listas via `listAll()` de `lib/list-all.ts` |
| IV. Design Token Compliance | ✅ | Usa `var(--color-accent)`, `var(--color-secondary)`, `var(--color-contrast)` |
| V. Security by Default | ✅ | Respostas são texto puro; sem `dangerouslySetInnerHTML`; sem novos endpoints |
| VI. CI Pipeline Compliance | ✅ | Pipeline `docs/pipeline-code-review-automatizado.md` obrigatório antes do PR |

**Resultado**: ✅ Todos os gates passam.

---

## Project Structure

### Documentation (this feature)

```text
specs/chat-widget/
├── plan.md              ← este arquivo
├── research.md          ← Phase 0 findings
├── data-model.md        ← Phase 1: entidade ChatQuestion
├── quickstart.md        ← Phase 1: guia de implementação passo a passo
├── checklists/
│   └── requirements.md
└── tasks.md             ← Phase 2 (gerado por /speckit-tasks)
```

### Source Code (repository root)

```text
amplify/
└── data/
    └── resource.ts                         ← MODIFICAR: adicionar ChatQuestion

app/
├── actions/
│   └── chat.ts                             ← NOVO: server actions CRUD
├── components/
│   └── chat/
│       ├── ChatWidget.tsx                  ← NOVO: RSC wrapper (fetch + cache)
│       └── ChatWidgetClient.tsx            ← NOVO: 'use client' UI interativa
├── (pages)/
│   └── layout.tsx                          ← MODIFICAR: <ChatWidget> em Suspense
└── admin/
    ├── chat/
    │   ├── page.tsx                        ← NOVO: server page admin
    │   └── ChatAdmin.tsx                   ← NOVO: 'use client' CRUD UI
    └── _components/
        └── AdminSidebar.tsx                ← MODIFICAR: add item "Chat"
```

**Structure Decision**: Segue o padrão monorepo existente — sem novos diretórios raiz. Componentes em `app/components/[feature]/`, ações em `app/actions/`, páginas admin em `app/admin/[feature]/`.
