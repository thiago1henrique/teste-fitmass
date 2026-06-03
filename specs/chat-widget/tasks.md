---
description: "Tasks para implementação do Chat Widget Flutuante"
---

# Tasks: Chat Widget Flutuante

**Input**: Design documents from `specs/chat-widget/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | quickstart.md ✅

**Tests**: Não solicitados — validação manual via golden path (quickstart.md).

**Organization**: Tasks organizadas por user story para entrega incremental e testável.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de task incompleta)
- **[Story]**: User story correspondente (US1, US2, US3)

---

## Phase 1: Setup (Infraestrutura Compartilhada)

**Purpose**: Schema Amplify e fundação do modelo de dados. DEVE ser concluída antes de qualquer implementação de código que acesse `client.models.ChatQuestion`.

- [x] T001 Adicionar modelo `ChatQuestion` em `amplify/data/resource.ts` (inserir após `LinkItem`, antes do fechamento do `a.schema`)
- [ ] T002 Reiniciar/executar `npx ampx sandbox` e aguardar conclusão para gerar schema GraphQL no DynamoDB (verificar que `amplify_outputs.json` foi atualizado)

**Checkpoint**: `client.models.ChatQuestion` disponível no TypeScript — prosseguir com Phase 2.

---

## Phase 2: Foundational (Prerequisito Bloqueante)

**Purpose**: Server actions CRUD que todas as outras phases dependem. DEVE estar completo antes de implementar widget ou página admin.

**⚠️ CRÍTICO**: Nenhuma work de user story pode começar antes desta phase estar completa.

- [x] T003 Criar `app/actions/chat.ts` com todas as server actions: `getChatQuestions` (apiKey), `createChatQuestion`, `updateChatQuestion`, `deleteChatQuestion`, `toggleChatQuestionActive`, `reorderChatQuestions`, `seedDefaultChatQuestions` — seguir exatamente o padrão de `app/actions/posts.ts`

**Checkpoint**: Server actions compilam sem erro TypeScript — prosseguir com US1 e US2 em paralelo.

---

## Phase 3: User Story 1 - Widget Público (Priority: P1) 🎯 MVP

**Goal**: Visitante vê botão flutuante em todas as páginas públicas, abre painel com perguntas, recebe resposta inline ou é redirecionado ao WhatsApp.

**Independent Test**: Acessar `/` (ou qualquer página pública), verificar botão no canto inferior direito, clicar e interagir com as perguntas. Widget não aparece em `/admin`.

### Implementation

- [x] T004 [US1] Criar `app/components/chat/ChatWidget.tsx` — RSC wrapper com `unstable_cache` (tag `chat-questions`, revalidate 60), `authMode: 'apiKey'`, fallback silencioso em catch, retorna null se lista vazia
- [x] T005 [US1] Criar `app/components/chat/ChatWidgetClient.tsx` — componente `'use client'` com estado `open`/`selectedId`, botão circular 56px `var(--color-accent)` fixo `bottom-6 right-4 md:right-6 z-50`, painel `fixed bottom-[76px]` com lista de perguntas, resposta inline para ANSWER, `window.open` para WHATSAPP
- [x] T006 [US1] Atualizar `app/(pages)/layout.tsx` — adicionar `<Suspense fallback={null}><ChatWidget /></Suspense>` (importar de `@/app/components/chat/ChatWidget`)

**Checkpoint**: Widget visível em `/`, painel abre com perguntas, ANSWER expande inline, WHATSAPP abre no WhatsApp, widget ausente em `/admin`.

---

## Phase 4: User Story 2 - Admin CRUD (Priority: P2)

**Goal**: Admin/Editor acessa `/admin/chat`, visualiza perguntas, cria/edita/exclui/reordena/desativa, importa padrão quando lista vazia.

**Independent Test**: Login no admin → `/admin/chat` → executar cada operação CRUD → verificar que mudanças refletem no widget público em até 60 segundos.

### Implementation

- [x] T007 [US2] Criar `app/admin/chat/page.tsx` — server component com `requireSession()`, fetch via `generateServerClientUsingCookies` + `listAll`, try/catch para modelo não deployado, renderiza `<ChatAdmin questions={...} userRole={session.role} />`
- [x] T008 [US2] Criar `app/admin/chat/ChatAdmin.tsx` — componente `'use client'` com: lista de cards por pergunta (badge ANSWER verde / WHATSAPP azul, toggle ativo, botões editar/excluir, setas ↑↓ para reorder), banner de seed quando `questions.length === 0`, modal de formulário (campos: `question` max 120, toggle `actionType`, `answer` textarea condicional max 500, `whatsappMsg` input condicional), botão "Nova pergunta" desabilitado quando `questions.length >= 5` — seguir padrão visual de `app/admin/links/LinksAdmin.tsx` (mesmas classes Tailwind, mesma estrutura de modal)
- [x] T009 [P] [US2] Atualizar `app/admin/_components/AdminSidebar.tsx` — inserir item `{ label: 'Chat', href: '/admin/chat', adminOnly: false, icon: <svg>...</svg> }` entre "Links" e "Vendas" no array `navItems`

**Checkpoint**: `/admin/chat` funcional com CRUD completo, seed importa 5 perguntas padrão, reorder persiste, widget reflete mudanças.

---

## Phase 5: User Story 3 - Integração WhatsApp (Priority: P3)

**Goal**: Perguntas do tipo WHATSAPP abrem o app com número correto e mensagem configurada ou padrão.

**Independent Test**: Clicar em qualquer pergunta WHATSAPP no widget → verificar que abre `https://api.whatsapp.com/send/?phone=5541984810567` com mensagem correta (personalizada ou padrão).

### Implementation

> **Nota**: US3 depende de US1 (widget) e US2 (admin seed) estarem funcionais. A lógica de WhatsApp já está embutida em T005 (`buildWhatsAppUrl`) e T003 (`seedDefaultChatQuestions` com pergunta "Fale com um atendente"). Esta phase valida e ajusta se necessário.

- [x] T010 [US3] Verificar função `buildWhatsAppUrl` em `app/components/chat/ChatWidgetClient.tsx` — confirmar URL base `https://api.whatsapp.com/send/?phone=5541984810567&type=phone_number&app_absent=0`, mensagem padrão `'Olá, vim do site da Fitmass e gostaria de mais informações.'`, `encodeURIComponent` correto
- [x] T011 [US3] Verificar dados do seed em `app/actions/chat.ts` — confirmar que `order: 4` tem `question: 'Fale com um atendente'`, `actionType: 'WHATSAPP'`, `whatsappMsg: null` (usa padrão)
- [ ] T012 [US3] Teste manual: criar pergunta WHATSAPP com mensagem personalizada via admin → clicar no widget → verificar mensagem personalizada no WhatsApp

**Checkpoint**: Toda pergunta WHATSAPP abre o WhatsApp com número `5541984810567` e mensagem correta.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Lint, build, acessibilidade e verificação do golden path completo.

- [x] T013 [P] Executar `npm run lint` e corrigir todos os erros ESLint em arquivos modificados/criados
- [x] T014 [P] Executar `npm run build` e garantir build sem erros
- [ ] T015 Verificação de acessibilidade: confirmar `aria-label` no botão flutuante (`"Abrir chat"` / `"Fechar chat"`), `role="dialog"` e `aria-label="Chat de suporte"` no painel, navegação por teclado funcional (Tab + Enter/Space)
- [ ] T016 Golden path completo conforme `specs/chat-widget/quickstart.md`: (1) admin seed, (2) editar pergunta, (3) widget na home, (4) resposta inline, (5) WhatsApp, (6) ausência em `/admin`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — iniciar imediatamente. **BLOQUEIA tudo.**
- **Foundational (Phase 2)**: Depende do Phase 1 (T002 concluído). **BLOQUEIA todas as user stories.**
- **US1 (Phase 3)**: Depende do Phase 2 (T003 concluído). Pode rodar em paralelo com US2.
- **US2 (Phase 4)**: Depende do Phase 2 (T003 concluído). Pode rodar em paralelo com US1.
- **US3 (Phase 5)**: Depende de US1 (T005) e US2 (T008) estarem completos.
- **Polish (Phase 6)**: Depende de todas as user stories desejadas estarem completas.

### User Story Dependencies

- **US1 (P1)**: Sem dependências entre stories — pode iniciar após Phase 2
- **US2 (P2)**: Sem dependências entre stories — pode iniciar após Phase 2
- **US3 (P3)**: Depende de US1 + US2 para teste completo (lógica já embarcada em T003 e T005)

### Within Each Phase

- T001 → T002 (ampx sandbox depende do schema atualizado)
- T002 → T003 (actions dependem do modelo deployado)
- T003 → T004, T005, T006 (widget depende das actions)
- T003 → T007, T008, T009 (admin depende das actions)
- T004, T005 → T006 (layout importa ChatWidget após criação)
- T007 → T008 (page.tsx renderiza ChatAdmin)
- T005, T008 → T010, T011, T012 (validação WhatsApp após widget e admin prontos)

---

## Parallel Opportunities

### Phase 3 e Phase 4 em paralelo (após T003)

```
T004 (ChatWidget.tsx RSC)           T007 (admin/chat/page.tsx)
T005 (ChatWidgetClient.tsx)    e    T008 (ChatAdmin.tsx)
T006 (layout.tsx)                   T009 (AdminSidebar.tsx)
```

### Phase 6 em paralelo

```
T013 (npm run lint)    T014 (npm run build)    T015 (acessibilidade)
```

---

## Implementation Strategy

### MVP First (User Story 1 — Widget Público)

1. Completar **Phase 1** (T001–T002): schema Amplify
2. Completar **Phase 2** (T003): server actions
3. Completar **Phase 3** (T004–T006): widget público
4. **PARAR E VALIDAR**: Widget funciona com perguntas hardcoded? → Sim → continuar
5. Deploy/demo do MVP

### Entrega Incremental

1. Phase 1 + 2 → Base pronta
2. Phase 3 → Widget público testável → **MVP demo**
3. Phase 4 → Admin CRUD funcional → **Configurável pelo time**
4. Phase 5 → WhatsApp verificado → **Feature completa**
5. Phase 6 → Lint + build + golden path → **Pronto para PR**

---

## Notes

- [P] = arquivos diferentes, sem dependências — podem rodar em paralelo
- [US#] = user story correspondente para rastreabilidade
- Após T002 (`npx ampx sandbox`), aguardar conclusão antes de prosseguir — pode levar 2-5 min
- Seguir padrão visual de `app/admin/links/LinksAdmin.tsx` para ChatAdmin (mesmas classes, mesmo modal)
- Seguir padrão de `app/actions/posts.ts` para `chat.ts` (requireSession, revalidate, error return)
- Não usar `dangerouslySetInnerHTML` em nenhum componente desta feature
- Commitar após cada phase ou grupo lógico
