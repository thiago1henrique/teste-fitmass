# Feature Specification: Sistema de Temas de Eventos

**Feature Branch**: `001-eventos-temas`

**Created**: 2026-06-03

**Status**: Draft

**Input**: Sistema de temas dinâmicos de eventos para o site Fitmass, adaptado do sistema Koralis com armazenamento via localStorage e integração com Tailwind v4.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitante vê tema de evento ativo (Priority: P1)

Um visitante acessa o site durante uma campanha sazonal (ex: Black Friday). A página carrega com as cores da campanha substituindo as cores padrão da marca, uma faixa promocional aparece no topo com texto, link e contador regressivo, e banners posicionados aparecem entre as seções da home.

**Why this priority**: É o valor central do feature. Sem isso, todo o restante não tem propósito.

**Independent Test**: Ativar um evento no admin e acessar a home — verificar faixa, cores e banners sem necessidade de qualquer outra funcionalidade.

**Acceptance Scenarios**:

1. **Given** um evento ativo com datas vigentes, **When** o visitante acessa a home, **Then** as cores da página refletem o tema do evento, a faixa promocional aparece no topo e os banners são exibidos nas posições configuradas.
2. **Given** um evento configurado mas fora do período de vigência, **When** o visitante acessa a home, **Then** as cores padrão da marca são exibidas e nenhuma faixa ou banner de evento aparece.
3. **Given** nenhum evento cadastrado, **When** o visitante acessa qualquer página, **Then** o site exibe o tema padrão normalmente, sem nenhum componente de evento.

---

### User Story 2 — Administrador cria e ativa um evento (Priority: P2)

O administrador acessa o painel de eventos, seleciona um template (ex: Natal), configura nome, datas de início e fim, texto da faixa promocional e cores personalizadas. Salva o evento, visualiza o preview ao vivo e o ativa.

**Why this priority**: Sem o admin, não é possível criar eventos. É a porta de entrada para toda a funcionalidade.

**Independent Test**: Criar um evento via admin, ativá-lo e verificar que a home passa a exibir o tema — testável sem banners ou countdown.

**Acceptance Scenarios**:

1. **Given** o admin logado em `/admin/eventos`, **When** clica em "Novo Evento" e preenche nome, template, datas e cores, **Then** o evento é salvo e listado no painel.
2. **Given** um evento salvo na lista, **When** o admin clica em "Ativar", **Then** o evento é marcado como ativo e o tema é imediatamente aplicado na home.
3. **Given** um evento ativo, **When** o admin clica em "Desativar", **Then** as cores e componentes do evento são removidos do site e o tema padrão é restaurado.
4. **Given** o formulário de criação, **When** o admin seleciona um template pré-configurado, **Then** os campos de cores são preenchidos automaticamente com os valores do template.

---

### User Story 3 — Visitante fecha a faixa promocional (Priority: P3)

O visitante vê a faixa promocional no topo e decide fechá-la clicando no botão X. A faixa desaparece. Ao navegar para outra página ou recarregar, a faixa não reaparece na mesma sessão de navegação.

**Why this priority**: Melhora a UX; a faixa sem dismiss seria invasiva. Não bloqueia o funcionamento do tema.

**Independent Test**: Fechar a faixa e recarregar — verificar que não reaparece na sessão.

**Acceptance Scenarios**:

1. **Given** a faixa promocional visível, **When** o visitante clica no botão fechar, **Then** a faixa desaparece imediatamente.
2. **Given** a faixa fechada na sessão atual, **When** o visitante recarrega a página ou navega para outra, **Then** a faixa não reaparece.
3. **Given** a faixa fechada em uma sessão, **When** o visitante abre uma nova sessão (nova aba ou após fechar o browser), **Then** a faixa reaparece normalmente.

---

### User Story 4 — Administrador configura banners por posição (Priority: P3)

O administrador adiciona banners a um evento, escolhendo a posição na página (ex: `after-hero`, `after-bioscan`), o tipo (horizontal com imagem ou faixa de texto) e o conteúdo. Os banners aparecem nas posições corretas quando o evento está ativo.

**Why this priority**: Enriquece a experiência da campanha, mas o tema de cores e a faixa já entregam valor sem banners.

**Independent Test**: Adicionar um banner `after-hero`, ativar o evento e verificar que o banner aparece logo após o hero na home.

**Acceptance Scenarios**:

1. **Given** um evento com banner `after-hero` do tipo horizontal, **When** o visitante acessa a home com o evento ativo, **Then** uma imagem full-width aparece logo após a seção hero.
2. **Given** um evento com banner `after-bioscan` do tipo divider, **When** o visitante rola até a seção bioscan, **Then** uma faixa colorida com texto aparece logo após ela.
3. **Given** um evento sem banners configurados para uma posição, **When** o visitante acessa a página, **Then** nenhum espaço em branco ou elemento vazio aparece nessa posição.

---

### Edge Cases

- O que acontece se o usuário alterar manualmente o localStorage com dados inválidos? → O sistema ignora o dado inválido e renderiza o tema padrão.
- O que acontece se dois eventos estiverem marcados como ativos simultaneamente? → O sistema considera apenas o primeiro encontrado na lista; o admin deve garantir apenas um ativo por vez.
- O que acontece se a data de início for posterior à data de fim? → O formulário impede o salvamento com mensagem de erro.
- O que acontece com a faixa se o countdown atingir zero durante a navegação? → O countdown some; a faixa permanece até o fim do evento.
- O que acontece ao abrir o site em outra aba após ativar um evento? → A segunda aba reflete o tema atualizado via evento `storage` do browser.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE injetar CSS dinâmico que sobreponha os tokens de cor da marca (`--event-accent`, `--event-secondary`, `--event-surface`) quando um evento estiver ativo e dentro do período de vigência.
- **FR-002**: O sistema DEVE exibir uma faixa promocional horizontal no topo de todas as páginas públicas quando um evento estiver ativo e dentro do período.
- **FR-003**: A faixa promocional DEVE conter texto configurável, link com texto configurável e um contador regressivo até a data de encerramento configurada.
- **FR-004**: O visitante DEVE poder fechar a faixa promocional; a dispensa DEVE persistir durante a sessão de navegação (não entre sessões).
- **FR-005**: O sistema DEVE suportar banners posicionados em locais específicos das páginas home e `/planos`, renderizando apenas os banners configurados para aquela posição.
- **FR-006**: O administrador DEVE poder criar, editar, ativar, desativar e excluir eventos via painel em `/admin/eventos`.
- **FR-007**: O formulário de evento DEVE oferecer 6 templates pré-configurados com paletas de cores otimizadas (black-friday, natal, ano-novo, verao, lancamento, custom).
- **FR-008**: O painel admin DEVE exibir preview ao vivo do tema de cores enquanto o administrador configura o evento.
- **FR-009**: O sistema DEVE armazenar todos os dados de eventos no localStorage do browser (temporário — será migrado para Amplify).
- **FR-010**: O sistema DEVE sincronizar o estado do evento entre abas abertas no mesmo browser via evento `storage`.
- **FR-011**: O sistema DEVE verificar o período de vigência do evento (startDate ↔ endDate) a cada renderização do cliente, desativando o tema automaticamente ao fim do período.
- **FR-012**: O sistema DEVE restaurar o tema padrão da marca imediatamente quando um evento é desativado ou expira, sem necessidade de recarregar a página.

### Key Entities

- **FitmassEventData**: Representa um evento sazonal. Atributos: id, name, template, active (boolean), startDate (ISO 8601), endDate (ISO 8601), theme (cores), promoStrip (configuração da faixa), banners (lista de banners), createdAt.
- **FitmassEventThemeColors**: Cores de sobreposição do evento. Atributos: accent ("R G B"), secondary ("R G B"), surface ("R G B").
- **PromoSection**: Configuração da faixa promocional. Atributos: text, linkText, link, bgColor (hex), textColor (hex), countdownEnd (ISO 8601).
- **BannerSection**: Banner posicionado. Atributos: id, position (BannerPosition), type (horizontal | divider), imageUrl (opcional), link (opcional), text (divider), bgColor (divider), textColor (divider).
- **EventTemplate**: Enum dos templates disponíveis: `black-friday | natal | ano-novo | verao | lancamento | custom`.
- **BannerPosition**: Enum das posições de banner: `after-hero | after-bioscan | after-how-it-works | after-testimonials | before-cta | after-plans-hero | after-plan-cards`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A mudança de tema (ativação/desativação de evento) é percebida pelo visitante em menos de 500ms após o carregamento da página, sem flash de conteúdo sem estilo.
- **SC-002**: O administrador consegue criar e ativar um evento completo (com tema, faixa e ao menos um banner) em menos de 5 minutos.
- **SC-003**: Ao desativar um evento, as cores e componentes do evento somem imediatamente (sem recarregar a página), e o tema padrão é restaurado em 100% dos componentes afetados.
- **SC-004**: A sincronização entre abas ocorre em menos de 1 segundo após a ativação/desativação de um evento em outra aba.
- **SC-005**: 100% das posições de banner configuradas exibem corretamente o banner quando o evento está ativo e não exibem nenhum espaço residual quando inativo.
- **SC-006**: O sistema não exibe o tema de evento para visitantes quando a data atual está fora do intervalo startDate–endDate, mesmo que o evento esteja marcado como ativo.

---

## Assumptions

- O site Fitmass não possui modo escuro (dark mode), portanto o sistema de temas precisa de apenas uma paleta por evento (sem variante dark/light como no Koralis).
- O administrador tem acesso à rota `/admin` autenticado via Cognito — o painel de eventos é acessível apenas para usuários autenticados.
- O localStorage é suficiente para o volume inicial de dados (poucos eventos, poucas centenas de KB) até a migração para Amplify.
- A migração para Amplify será feita por fora deste feature, substituindo apenas a camada de persistência (`app/lib/events.ts`) sem alterar os componentes de UI.
- Não há suporte a múltiplos eventos simultâneos — apenas um evento pode estar ativo por vez.
- Os banners de imagem horizontal assumem que as imagens são hospedadas externamente ou no S3 da Fitmass; upload de imagens não é parte deste feature.
- O feature se integra ao layout de páginas públicas (`app/(pages)/layout.tsx`) sem afetar o layout admin.
- Tailwind v4 é usado; tokens dinâmicos são implementados com CSS Custom Properties padrão no `:root`, fora do bloco `@theme` (que é estático).
