# Sistema de Temas — Koralis (Eventos)

## Visão Geral

O sistema de temas do Koralis combina **Tailwind CSS** com **CSS Custom Properties** (variáveis CSS) para suportar dois modos de operação simultâneos:

1. **Tema padrão** — paleta navy/azul escuro, aplicada sempre que nenhum evento está ativo.
2. **Tema de evento** — paleta dinâmica injetada em tempo de execução, que sobrescreve o tema padrão durante a vigência de um evento.

A troca entre os dois temas acontece **sem recarregar a página** e respeita o modo claro/escuro do sistema ou da preferência do usuário.

---

## Stack de Estilização

| Tecnologia | Papel |
|---|---|
| **Tailwind CSS 3.4** | Classes utilitárias — principal forma de estilizar |
| **CSS Custom Properties** | Tokens de cor dinâmicos (base do sistema de temas) |
| **PostCSS + Autoprefixer** | Pipeline de processamento de CSS |
| **next-themes** | Alternância claro / escuro com detecção do sistema |
| **class-variance-authority (CVA)** | Variantes de componentes (botões, badges, etc.) |
| **tailwind-merge + clsx** | Composição segura de classes via `cn()` |
| **Framer Motion** | Animações de UI |
| **Sonner** | Notificações toast com suporte a tema |

**Fontes (Google Fonts):**
- `DM Sans` — fonte sans-serif para corpo de texto (`font-sans`)
- `Exo 2` — fonte display para títulos (`font-display`)

---

## Arquivos Relevantes

```
koralis-frontend/
├── styles/globals.css                         # Variáveis CSS e estilos base
├── tailwind.config.ts                         # Extensão do tema Tailwind
├── lib/events.ts                              # Utilitário normalizeEventTheme
├── types/events.ts                            # Tipos TypeScript do sistema de eventos
├── store/eventsStore.ts                       # Templates pré-configurados de eventos
├── services/settings.ts                       # Busca do evento ativo (server e client)
├── components/events/
│   ├── EventThemeProvider.tsx                 # Injeta o CSS do tema de evento
│   ├── ActiveEventContext.tsx                 # Context + hook useActiveEvent()
│   ├── EventPromoStrip.tsx                    # Faixa promocional no topo da página
│   ├── EventBanners.tsx                       # Banners posicionados na home
│   └── EventCountdown.tsx                     # Contador regressivo em tempo real
```

---

## Parte 1 — Tema Padrão

### 1.1 Tokens de Cor (CSS Custom Properties)

Todos os tokens são definidos como **canais RGB separados por espaço** (ex.: `10 27 46`). Esse formato permite usar o modificador de opacidade do Tailwind sem precisar de variáveis extras.

**Exemplo de uso:**
```html
<!-- 100% opaco -->
<div class="bg-primary">

<!-- 50% de opacidade -->
<div class="bg-primary/50">
```

**Tokens disponíveis:**

| Token CSS | Modo Claro | Modo Escuro | Descrição |
|---|---|---|---|
| `--color-primary` | `10 27 46` (navy) | `21 101 192` (azul vivo) | Cor principal da marca |
| `--color-primary-light` | `26 58 92` | `42 135 210` | Variante clara do primary |
| `--color-background` | `242 242 247` (cinza suave) | `17 17 19` (quase preto) | Fundo da página |
| `--color-foreground` | `17 24 39` (quase preto) | `245 245 247` (off-white) | Cor do texto principal |
| `--color-card` | `255 255 255` (branco) | `28 28 30` (cinza escuro) | Fundo de cards |
| `--color-card-foreground` | `17 24 39` | `245 245 247` | Texto dentro de cards |
| `--color-muted` | `107 114 128` | `152 152 158` | Texto secundário / ícones |
| `--color-border` | `229 231 235` | `56 56 58` | Bordas e divisores |
| `--color-price` | `26 58 92` | `21 101 192` | Destaque de preços |
| `--color-success` | `16 185 129` | `52 211 153` | Feedback positivo |
| `--color-warning` | `245 158 11` | `251 191 36` | Avisos |
| `--color-error` | `239 68 68` | `248 113 113` | Erros |

Definição em [styles/globals.css](koralis-frontend/styles/globals.css):

```css
:root {
  --color-primary: 10 27 46;
  /* ... */
}

.dark {
  --color-primary: 21 101 192;
  /* ... */
}
```

### 1.2 Mapeamento no Tailwind

Os tokens CSS são mapeados para classes Tailwind em [tailwind.config.ts](koralis-frontend/tailwind.config.ts):

```ts
colors: {
  primary: {
    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
    light:   'rgb(var(--color-primary-light) / <alpha-value>)',
  },
  background: 'rgb(var(--color-background) / <alpha-value>)',
  foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
  // ...
}
```

O placeholder `<alpha-value>` é substituído automaticamente pelo Tailwind ao usar o modificador `/` (ex.: `bg-primary/80`).

### 1.3 Alternância Claro / Escuro

Configurada em `app/providers.tsx` via **next-themes**:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
```

- O elemento `<html>` recebe a classe `.dark` no modo escuro.
- Todos os tokens CSS do seletor `.dark` entram em vigor automaticamente.
- O toggle fica no menu mobile e permite escolher: claro → escuro → sistema.

---

## Parte 2 — Sistema de Temas de Eventos

### 2.1 Estrutura de Dados

Definida em [types/events.ts](koralis-frontend/types/events.ts):

```ts
interface EventThemeColors {
  primary:      string  // "R G B" — cor principal
  primaryLight: string  // variante hover/light
  background:   string  // fundo da página
  foreground:   string  // cor do texto
  card:         string  // fundo de cards
}

interface EventTheme {
  light: EventThemeColors  // sobreposições para modo claro
  dark:  EventThemeColors  // sobreposições para modo escuro
}

interface EventData {
  id:         string
  name:       string
  template:   EventTemplate  // 'black-friday' | 'natal' | 'ano-novo' | 'festival' | 'copa-mundo' | 'custom'
  active:     boolean
  startDate:  string  // ISO 8601
  endDate:    string  // ISO 8601
  theme:      EventTheme
  promoStrip: PromoSection
  banners:    BannerSection[]
  createdAt:  string
}
```

### 2.2 EventThemeProvider — O Núcleo do Sistema

Arquivo: [components/events/EventThemeProvider.tsx](koralis-frontend/components/events/EventThemeProvider.tsx)

Este componente é o responsável por **injetar dinamicamente** o CSS do tema de evento no `<head>` da página. Ele funciona em três etapas:

**Etapa 1 — Busca do evento ativo**

Usa TanStack Query para manter os dados do evento sincronizados:

```ts
const { data: clientEvent } = useQuery<EventData | null>({
  queryKey: ['active-event'],
  queryFn: getActiveEventClient,
  staleTime: 5_000,             // revalida após 5s
  refetchInterval: 30_000,      // polling a cada 30s em background
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: true,
  initialData: initialEvent,    // dado do SSR (sem flash no carregamento)
})
```

**Etapa 2 — Verificação de vigência**

Só aplica o tema se a data atual estiver dentro do intervalo do evento:

```ts
function isWithinRange(event: EventData): boolean {
  const now = new Date()
  const start = new Date(event.startDate)
  const end = new Date(event.endDate)
  end.setHours(23, 59, 59, 999)  // inclui o dia inteiro do endDate
  return now >= start && now <= end
}
```

**Etapa 3 — Geração e injeção do CSS**

A função `makeThemeCss` gera o CSS inline com as sobreposições dos tokens:

```ts
function makeThemeCss(colors: EventThemeColors, selector: string): string {
  const dark = brightness(colors.background) < 128

  // Auto-corringe o foreground se o contraste for insuficiente
  const foreground = (dark && fgBright < 128)  ? '245 245 247'
    : (!dark && fgBright >= 128)               ? '17 24 39'
    : colors.foreground

  return `${selector}{
    --color-primary:${colors.primary};
    --color-primary-light:${colors.primaryLight};
    --color-background:${colors.background};
    --color-foreground:${foreground};
    --color-card:${colors.card};
    --color-card-foreground:${foreground};
    --color-muted:${dark ? '152 152 158' : '107 114 128'};
    --color-border:${dark ? '56 56 58' : '229 231 235'};
  }`
}
```

O CSS gerado é injetado em uma tag `<style id="event-theme">` no `<head>`:

```ts
useEffect(() => {
  if (activeEvent) {
    const normalized = normalizeEventTheme(activeEvent.theme)
    const css = makeThemeCss(normalized.light, ':root')
              + makeThemeCss(normalized.dark, '.dark')

    let el = document.getElementById('event-theme') as HTMLStyleElement
    if (!el) {
      el = document.createElement('style')
      el.id = 'event-theme'
      document.head.appendChild(el)
    }
    el.textContent = css
  } else {
    document.getElementById('event-theme')?.remove()  // limpa ao sair do período
  }
}, [activeEvent])
```

**O resultado no navegador:**

```html
<style id="event-theme">
  :root {
    --color-primary:234 88 12;
    --color-primary-light:249 115 22;
    --color-background:255 250 245;
    --color-foreground:30 10 0;
    --color-card:255 240 230;
    --color-muted:107 114 128;
    --color-border:229 231 235;
  }
  .dark {
    --color-primary:249 115 22;
    --color-primary-light:251 146 60;
    --color-background:8 8 8;
    --color-foreground:255 255 255;
    --color-card:22 22 22;
    --color-muted:152 152 158;
    --color-border:56 56 58;
  }
</style>
```

Como essa `<style>` vem **depois** dos estilos do Tailwind na cascata CSS, ela sobrescreve os valores padrão sem precisar de `!important`.

### 2.3 Cálculo de Brilho e Auto-contraste

A função `brightness` usa a fórmula de luminância perceptual (W3C):

```ts
function brightness(rgb: string): number {
  const [r, g, b] = rgb.trim().split(/\s+/).map(Number)
  return (r * 299 + g * 587 + b * 114) / 1000
}
// resultado: 0 (preto) → 255 (branco)
// limiar escuro: < 128
```

Com base nesse valor, o sistema:
- Decide se o background é escuro (`< 128`) ou claro
- Corrige automaticamente o `foreground` se o contraste for insuficiente
- Ajusta os tokens de `muted` e `border` para manter legibilidade

### 2.4 Normalização de Tema Legado

[lib/events.ts](koralis-frontend/lib/events.ts) contém um utilitário para compatibilidade com eventos salvos antes da versão 4 do store, que usavam um formato plano:

```ts
export function normalizeEventTheme(theme: EventTheme | EventThemeColors): EventTheme {
  if ('light' in theme && 'dark' in theme) return theme as EventTheme
  const flat = theme as EventThemeColors
  return { light: flat, dark: flat }  // replica para ambos os modos
}
```

### 2.5 ActiveEventContext — Acesso Global

[components/events/ActiveEventContext.tsx](koralis-frontend/components/events/ActiveEventContext.tsx) expõe o evento ativo para qualquer componente da árvore:

```ts
export const ActiveEventContext = createContext<EventData | null>(null)

export function useActiveEvent(): EventData | null {
  return useContext(ActiveEventContext)
}
```

**Uso em qualquer componente:**
```ts
const activeEvent = useActiveEvent()
if (activeEvent) {
  // exibir conteúdo específico do evento
}
```

---

## Parte 3 — Templates de Evento

Arquivo: [store/eventsStore.ts](koralis-frontend/store/eventsStore.ts)

São 6 templates pré-configurados com paletas otimizadas para cada ocasião:

| Template | Primary (light) | Background (light) | Clima |
|---|---|---|---|
| `black-friday` | `234 88 12` (laranja) | `255 250 245` (creme) | Urgência, escassez |
| `natal` | `185 28 28` (vermelho) | `255 250 250` (rosa-branco) | Festivo, caloroso |
| `ano-novo` | `202 138 4` (ouro) | `250 250 240` (creme-amarelo) | Celebração, esperança |
| `festival` | `190 24 93` (pink) | `242 242 247` (padrão) | Energia, festa |
| `copa-mundo` | `0 80 160` (azul-rey) | `240 245 252` (azul-claro) | Esportivo, institucional |
| `custom` | `10 27 46` (navy) | `242 242 247` (padrão) | Neutro, personalizável |

Cada template também inclui uma `promoStrip` pré-configurada com texto, cores e data de countdown.

---

## Parte 4 — Componentes de Evento

### 4.1 EventPromoStrip

[components/events/EventPromoStrip.tsx](koralis-frontend/components/events/EventPromoStrip.tsx)

Faixa horizontal exibida no **topo da página**, acima do Header.

**Características:**
- Cores definidas por `promoStrip.bgColor` e `promoStrip.textColor` (inline style — independente do tema CSS)
- Botão de fechar que persiste a dispensa via `sessionStorage` (chave única por evento)
- Exibe countdown integrado via `<EventCountdown>`
- Link com texto configurável

```tsx
<div style={{ backgroundColor: strip.bgColor, color: strip.textColor }}>
  <span>{strip.text}</span>
  <Link href={strip.link}>{strip.linkText} →</Link>
  <EventCountdown endDate={strip.countdownEnd} />
</div>
```

### 4.2 EventCountdown

[components/events/EventCountdown.tsx](koralis-frontend/components/events/EventCountdown.tsx)

Contador regressivo atualizado a cada segundo via `setInterval`.

- Formato: `DDd:HHh:MMm:SSs`
- Remove-se automaticamente quando o tempo zera
- Recebe `textColor` para manter consistência com a PromoStrip

### 4.3 EventBanners

[components/events/EventBanners.tsx](koralis-frontend/components/events/EventBanners.tsx)

Componente de posicionamento que lê o evento ativo via `useActiveEvent()` e renderiza os banners configurados para uma posição específica da página.

**Uso na home:**
```tsx
<EventBanners position="after-hero-carousel" />
<HeroSection />
<EventBanners position="after-bestsellers" />
```

**Posições disponíveis:**

| Posição | Local na página |
|---|---|
| `after-hero-carousel` | Após o carrossel principal |
| `after-hero-section` | Após a seção hero |
| `after-trust` | Após os selos de confiança |
| `after-bestsellers` | Após os mais vendidos |
| `after-coupons` | Após a seção de cupons |
| `after-eletronicos` | Após eletrônicos |
| `after-moda` | Após moda |
| `after-casa-jardim` | Após casa & jardim |
| `after-esportes` | Após esportes |
| `after-beleza` | Após beleza |
| `after-brinquedos` | Após brinquedos |
| `before-searches` | Antes das buscas recentes |

**Tipos de banner:**

1. **`horizontal`** — imagem full-width com link opcional
2. **`horizontal-with-cards`** — imagem + grid de mini-cards de produtos buscados por categoria via TanStack Query
3. **`divider`** — faixa de texto com cor de fundo e texto configuráveis (inline style)

---

## Parte 5 — Fluxo Completo

```
1. Next.js SSR (layout.tsx)
   └─ getActiveEventServer()          ← busca evento ativo do FastAPI com ISR
      └─ EventThemeProvider recebe initialEvent (sem flash)

2. Hidratação no browser
   └─ TanStack Query assume o polling
      ├─ staleTime: 5s
      └─ refetchInterval: 30s

3. isWithinRange() verifica se a data atual está dentro do evento

4. Se ativo:
   └─ normalizeEventTheme() — garante formato light/dark
   └─ makeThemeCss() — gera CSS com os tokens sobrescritos
   └─ <style id="event-theme"> é injetado no <head>
   └─ Toda classe Tailwind que usa os tokens (bg-primary, text-foreground, etc.)
      passa a usar as cores do evento automaticamente

5. ActiveEventContext disponibiliza EventData para:
   └─ EventPromoStrip (faixa no topo)
   └─ EventBanners (em cada posição da home)
   └─ Qualquer componente via useActiveEvent()

6. Quando o evento termina (ou é desativado):
   └─ isWithinRange() retorna false
   └─ <style id="event-theme"> é removido
   └─ Tema padrão é restaurado automaticamente
```

---

## Parte 6 — Como Adicionar um Novo Evento

### Via Admin (interface gráfica)
Acesse `/(admin)/admin/events` — há uma interface para criar, editar e ativar eventos, incluindo preview dos banners.

### Via Código (novo template)

1. Adicionar o tipo em [types/events.ts](koralis-frontend/types/events.ts):
```ts
export type EventTemplate = '...' | 'meu-evento'
```

2. Criar o preset em [store/eventsStore.ts](koralis-frontend/store/eventsStore.ts):
```ts
'meu-evento': {
  name: 'Meu Evento',
  template: 'meu-evento',
  theme: {
    light: { primary: 'R G B', primaryLight: 'R G B', background: 'R G B', foreground: 'R G B', card: 'R G B' },
    dark:  { primary: 'R G B', primaryLight: 'R G B', background: 'R G B', foreground: 'R G B', card: 'R G B' },
  },
  promoStrip: promo('Texto da faixa', 'Ver ofertas', '/search/x', '#HEXCOR', '#FFFFFF', 'ISO_DATE'),
  banners: [],
}
```

3. Adicionar as datas padrão no mapa `defaultDates`:
```ts
'meu-evento': [new Date(y, mes, dia), new Date(y, mes, diaFim)],
```

---

## Parte 7 — Regras e Convenções

- **Sempre usar `cn()` de `lib/utils.ts`** para compor classes Tailwind — evita conflitos com `tailwind-merge`.
- **Nunca hardcodar cores** nos componentes — usar sempre as classes semânticas (`bg-primary`, `text-foreground`, `border-border`, etc.) para que o tema de evento funcione automaticamente.
- **Exceções permitidas para inline style:** `EventPromoStrip` e `DividerBanner` usam `style={{ backgroundColor, color }}` porque suas cores são configuráveis livremente pelo admin e não fazem parte do sistema de tokens.
- **Formato das cores de evento:** sempre `"R G B"` (canais separados por espaço, sem vírgulas, sem `rgb()`).
- **Texto da UI:** sempre em português (pt_BR). Moeda: BRL formatado via `formatPrice()`.
