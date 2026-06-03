# Feature Specification: Chat Widget Flutuante

**Feature Branch**: `feat/chat-widget`

**Created**: 2026-06-02

**Status**: Draft

**Input**: Chatbot widget flutuante no site Fitmass com perguntas configuráveis e integração WhatsApp.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitante interage com o chat (Priority: P1)

Um visitante do site Fitmass visualiza um botão de chat flutuante no canto inferior direito de qualquer página pública. Ao clicar, um painel exibe até 5 perguntas configuradas. O visitante clica em uma pergunta e vê a resposta diretamente no painel, ou é redirecionado ao WhatsApp para falar com um atendente.

**Why this priority**: É o fluxo principal da feature — sem o widget público funcionando, nada mais tem valor.

**Independent Test**: Pode ser testado acessando qualquer página pública do site, clicando no botão flutuante, e verificando que o painel abre com as perguntas e que cada uma responde corretamente.

**Acceptance Scenarios**:

1. **Given** um visitante está em qualquer página pública, **When** visualiza a página, **Then** vê um botão circular com ícone de chat no canto inferior direito.
2. **Given** o botão de chat está visível, **When** o visitante clica nele, **Then** um painel se abre acima do botão com título "Como podemos ajudar?" e lista as perguntas ativas.
3. **Given** o painel de chat está aberto, **When** o visitante clica em uma pergunta do tipo "Resposta", **Then** a resposta de texto aparece inline abaixo da pergunta com opção de voltar.
4. **Given** o painel de chat está aberto, **When** o visitante clica em uma pergunta do tipo "WhatsApp", **Then** uma nova aba abre no WhatsApp com a mensagem pré-configurada.
5. **Given** o painel está aberto, **When** o visitante clica no botão fechar, **Then** o painel fecha e o botão flutuante permanece visível.
6. **Given** o visitante está em qualquer página `/admin/**`, **When** visualiza a página, **Then** o botão flutuante de chat NÃO aparece.

---

### User Story 2 - Administrador gerencia perguntas do chat (Priority: P2)

Um administrador ou editor acessa o painel `/admin/chat`, visualiza as perguntas configuradas, e pode adicionar, editar, reordenar, ativar/desativar ou excluir perguntas. Pode também importar um conjunto de perguntas padrão com um clique.

**Why this priority**: Sem o painel admin, as perguntas seriam estáticas e não atenderiam ao requisito de personalização.

**Independent Test**: Pode ser testado fazendo login no admin, navegando para /admin/chat, e executando cada operação de CRUD independentemente.

**Acceptance Scenarios**:

1. **Given** o admin está autenticado, **When** acessa `/admin/chat`, **Then** vê a lista de perguntas configuradas (ou mensagem de lista vazia com botão de seed).
2. **Given** nenhuma pergunta existe, **When** o admin clica "Importar perguntas padrão", **Then** 5 perguntas padrão são criadas instantaneamente.
3. **Given** o admin está na página de chat, **When** clica "Nova pergunta", **Then** um formulário modal permite inserir texto da pergunta, tipo de ação (Resposta ou WhatsApp), e o conteúdo correspondente.
4. **Given** já existem 5 perguntas, **When** o admin tenta adicionar mais uma, **Then** o botão "Nova pergunta" está desabilitado com mensagem "Limite de 5 perguntas atingido".
5. **Given** o admin visualiza a lista de perguntas, **When** clica em editar uma pergunta, **Then** o formulário modal abre pré-preenchido com os dados atuais.
6. **Given** o admin visualiza a lista de perguntas, **When** clica nas setas ↑ ou ↓, **Then** a pergunta muda de posição e a nova ordem é persistida.
7. **Given** o admin visualiza a lista de perguntas, **When** alterna o toggle ativo/inativo, **Then** a mudança é salva e o widget público reflete a alteração em até 60 segundos.
8. **Given** o admin clica em excluir uma pergunta, **When** confirma a ação, **Then** a pergunta é removida permanentemente.

---

### User Story 3 - Atendente recebe contato via WhatsApp (Priority: P3)

Quando um visitante clica em uma pergunta do tipo WhatsApp (especialmente "Fale com um atendente"), o WhatsApp abre com o número da Fitmass e uma mensagem pré-formatada, facilitando o atendimento.

**Why this priority**: Melhora a conversão de leads, mas depende do P1 estar funcionando.

**Independent Test**: Clicar em qualquer pergunta do tipo WhatsApp no widget e verificar que o WhatsApp abre com o número e mensagem corretos.

**Acceptance Scenarios**:

1. **Given** uma pergunta com tipo "WhatsApp" e mensagem personalizada, **When** o visitante clica nela, **Then** o WhatsApp abre com a mensagem personalizada configurada.
2. **Given** uma pergunta com tipo "WhatsApp" sem mensagem personalizada, **When** o visitante clica nela, **Then** o WhatsApp abre com a mensagem padrão do site.
3. **Given** qualquer pergunta WhatsApp, **When** o link é gerado, **Then** usa o número +55 41 98481-0567 da Fitmass.

---

### Edge Cases

- O que acontece quando não há perguntas ativas no banco? → Widget não exibe perguntas; mostra estado vazio com "Em breve" ou simplesmente oculta o painel.
- O que acontece se o banco de dados estiver indisponível? → Widget não aparece (fallback silencioso); página continua funcionando normalmente.
- O que acontece se o admin tentar criar uma 6ª pergunta via requisição direta? → A action server retorna `{ error: 'Limite de 5 perguntas atingido.' }`.
- O que acontece com perguntas desativadas? → Não são exibidas no widget público, mas permanecem visíveis no painel admin.
- O que acontece no mobile com o painel de chat? → O painel se adapta a 320px de largura e é acessível por toque.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir um botão flutuante circular de chat no canto inferior direito de todas as páginas públicas (exceto `/admin/**`).
- **FR-002**: Ao clicar no botão, o sistema DEVE exibir um painel com as perguntas configuradas ativas, ordenadas pelo campo `order`.
- **FR-003**: Cada pergunta DEVE ter um tipo de ação: "Resposta" (exibe texto inline) ou "WhatsApp" (abre nova aba com link do WhatsApp).
- **FR-004**: O sistema DEVE suportar no máximo 5 perguntas configuradas simultaneamente.
- **FR-005**: As perguntas DEVEM ser editáveis via painel administrativo em `/admin/chat`.
- **FR-006**: O painel admin DEVE permitir: criar, editar, excluir, reordenar (↑↓) e ativar/desativar perguntas.
- **FR-007**: O painel admin DEVE oferecer um botão "Importar perguntas padrão" quando a lista estiver vazia, que cria 5 perguntas pré-definidas.
- **FR-008**: O link de WhatsApp DEVE usar o número +55 41 98481-0567 com a mensagem configurada na pergunta, ou a mensagem padrão do site quando não configurada.
- **FR-009**: Perguntas desativadas NÃO DEVEM aparecer no widget público.
- **FR-010**: Mudanças feitas pelo admin DEVEM refletir no widget público em no máximo 60 segundos.
- **FR-011**: O widget DEVE ser acessível via teclado e ter labels ARIA adequados.
- **FR-012**: O sistema DEVE ser acessível apenas por usuários autenticados (ADMIN ou EDITOR) para operações de escrita; leitura é pública.

### Key Entities

- **ChatQuestion**: Representa uma pergunta configurável do chatbot. Atributos: texto da pergunta, texto da resposta (opcional), tipo de ação (ANSWER ou WHATSAPP), mensagem WhatsApp personalizada (opcional), ordem de exibição, estado ativo/inativo.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitantes podem abrir o painel de chat e receber uma resposta ou iniciar contato via WhatsApp em menos de 3 cliques.
- **SC-002**: Administradores conseguem criar, editar e reordenar perguntas em menos de 2 minutos.
- **SC-003**: Mudanças feitas no admin refletem no widget público em no máximo 60 segundos.
- **SC-004**: O widget não causa nenhuma degradação visível no tempo de carregamento das páginas públicas.
- **SC-005**: 100% das perguntas do tipo WhatsApp abrem o aplicativo com o número e mensagem corretos.
- **SC-006**: O widget não aparece em nenhuma rota `/admin/**`.

---

## Assumptions

- O número de WhatsApp da Fitmass (+55 41 98481-0567) permanece o mesmo para todos os contatos via chat.
- A mensagem padrão do WhatsApp (quando não personalizada) é: "Olá, vim do site da Fitmass e gostaria de mais informações."
- Usuários com role EDITOR têm permissão para gerenciar perguntas do chat (mesma permissão que Posts e Links).
- O widget deve aparecer em todas as páginas da rota `/(pages)/` mas não em `/admin/**` e `/links`.
- Mobile é suportado no escopo desta feature (painel responsivo).
- O sistema de cache com TTL de 60 segundos é suficiente para a frequência de atualização esperada pelo admin.
- As 5 perguntas padrão do seed são suficientes como ponto de partida; o admin pode personalizá-las após o seed.
