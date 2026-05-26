# Pipeline de Code Review Automatizado

## Visão Geral

Implementar, no projeto atual, uma pipeline multicamada de code review automatizado disparada em todo PR aberto contra branches protegidas. A pipeline avalia qualidade dos testes, calcula risco do PR, executa quality gates objetivos, gera score de impacto e toma ações automatizadas (bloquear, exigir reviewers específicos, ou liberar). Cobre as Fases 1, 2, 4, 5 e 6 do plano-mestre. A Fase 3 (AI code review com ferramenta terceira) fica documentada como ponto de extensão, mas **não é implementada agora** — será implementada pelo time depois.

## Contexto

- **Projeto:** genérico (Claude Code detecta no momento da execução)
- **Stack:** desconhecida — Claude Code faz discovery e adapta os scripts
- **Onde aparece:** GitHub Actions (`.github/workflows/`), branch protection rules, CODEOWNERS, e arquivos de configuração de ferramentas no root do repo
- **Layout:** não se aplica (feature de infraestrutura/CI, sem UI)

## Princípios Norteadores

1. **Discovery antes de escrever:** o Claude Code deve detectar a stack, o CI atual e o que já existe antes de propor qualquer arquivo novo. Nunca sobrescrever workflow existente sem confirmação.
2. **Confirmação por fase, mas em commits (não PRs):** todo o trabalho acontece em uma única branch (`feature/code-review-pipeline` ou nome equivalente). Cada fase termina com um commit isolado, com mensagem padronizada, e o Claude Code apresenta o diff acumulado e pede confirmação do usuário antes de iniciar o commit da próxima fase. Um único PR é aberto **somente ao final**, agrupando todos os commits.
3. **Obrigatório vs experimental — distinção explícita:** cada fase tem um conjunto **OBRIGATÓRIO** (gates consensuais, bem testados, que entram bloqueantes) e um conjunto **EXPERIMENTAL** (gates novos, com risco de falso positivo, que entram em modo relatório). O modo de cada gate é declarado explicitamente em `.github/code-review-pipeline.yml` e nunca é ambíguo. Não existe `continue-on-error` espalhado em jobs aleatórios — ou o gate é bloqueante (job falha = PR não merga), ou é informativo (job sempre passa, posta comentário/issue/label). Não há terceiro estado.
4. **Bloqueante com escape declarado:** gates **OBRIGATÓRIOS** bloqueiam o merge. O escape é a label `override-gate:<nome>` aplicada manualmente no PR, que faz o job correspondente reportar "skipped by override" como status check separado (não como sucesso falso). A presença do override é visível, registrada via comentário do bot no PR, e a contagem é exposta nas métricas da Fase 6 — sem commits automáticos a um log paralelo.
5. **Adaptar à maturidade real do projeto:** não existe threshold mínimo absoluto. Se o projeto tem coverage 22% (medido no merge ref), o threshold inicial é 19% (valor medido menos 3pp de margem) — não 60%. A regra de subida é gradual (ratchet via PR dedicado), proposta pelo Claude Code com base nos dados, nunca imposta por convenção genérica. Mesma lógica para mutation score. O verdadeiro freio contra regressão por PR é o `coverage_delta` (max_drop pequeno), não o `coverage_floor`.
6. **Sem reinvenção:** se o projeto já usa SonarQube/ESLint/etc., integrar com o que existe ao invés de adicionar uma segunda ferramenta concorrente.
7. **Permissões mínimas e explícitas:** todo workflow declara seu bloco `permissions:` no topo, com o mínimo necessário. Nenhum workflow herda permissões implicitamente do default do repo. Nenhuma operação que exija escopo além do `GITHUB_TOKEN` padrão é executada sem o usuário ter aprovado explicitamente o token/PAT correspondente no discovery.

## Estratégia de Branch e Commits

- **Branch única:** `feature/code-review-pipeline` (ou nome equivalente acordado no discovery), criada a partir da branch padrão do projeto.
- **Um commit por fase**, com mensagem no padrão Conventional Commits:
  - `chore(ci): fase 1 - fundação da pipeline de code review`
  - `chore(ci): fase 2 - quality gates objetivos (coverage, sast, secrets)`
  - `chore(ci): fase 3 - hooks de extensão para ai code review`
  - `chore(ci): fase 4 - risk scoring e roteamento automatizado`
  - `chore(ci): fase 5 - mutation testing e detecção de testes flaky`
  - `chore(ci): fase 6 - observabilidade e runbook`
- **Cada commit é autocontido**, mas todos vivem na mesma branch — não fazer push de cada commit como PR separado.
- **PR único ao final**, agrupando todos os commits, com descrição detalhada listando o que cada commit traz. Título: `[code-review-pipeline] implementação completa (fases 1-6)`.
- **Push pode ser feito após cada commit** para que o histórico fique salvo no remoto, mas sem abrir PR.
- **Se uma fase precisar ser revertida**, o `git revert` do commit específico já isola a mudança — esta é a razão de manter commits granulares e atômicos.

## Modos de Gate e Arquivo de Configuração

Todo gate criado por esta pipeline tem um **modo** declarado em um arquivo de configuração central — `.github/code-review-pipeline.yml`. Os modos possíveis são apenas dois:

- **`enforce`** — gate bloqueante. Se a condição falha, o job correspondente sai com exit code != 0, o status check fica vermelho, e a branch protection (configurada pelo usuário) impede o merge. Só pode ser contornado via label `override-gate:<nome>`, que faz o job reportar um status check específico chamado `<nome>/skipped-by-override` (não converte falha em sucesso silenciosamente).
- **`report`** — gate informativo. O job sempre termina com sucesso, mas posta um comentário no PR e/ou aplica uma label informativa (`info:<gate>:<resultado>`). Nenhum bloqueio ocorre. Útil para gates experimentais durante período de calibração.

**Semântica de `result=skipped` em gate `enforce`:** quando um job decide não avaliar (ex.: `coverage_delta` sem baseline no `base` para comparar, mutation testing sem testes para mutar), o resultado é `skipped` — não `failed`. O reporter precisa tratar isso explicitamente: `enforce + skipped → não bloqueia`. "Não avaliei" ≠ "encontrei regressão". Sem essa regra, gates legítimos que dependem de baseline travam o primeiro PR da pipeline.

Exemplo de configuração:

```yaml
# .github/code-review-pipeline.yml
gates:
  lint:             { mode: enforce }
  unit_tests:       { mode: enforce }
  coverage_floor:   { mode: enforce, threshold: 22 }   # valor real do projeto, não 60%
  coverage_delta:   { mode: enforce, max_drop: 2 }
  sast:             { mode: enforce, fail_on: high }
  secret_scan:      { mode: enforce }
  dependency_vuln:  { mode: enforce, fail_on: high }
  pr_size:          { mode: report }
  risk_score:       { mode: report }                   # experimental — começa report
  mutation_pr:      { mode: report }                   # experimental — começa report
  flaky_detector:   { mode: report }                   # nunca enforce nesta versão
overrides:
  allowed_labels: [override-gate:coverage_delta, override-gate:coverage_floor, override-gate:mutation_pr]
  forbidden:      [secret_scan, sast]                  # nunca podem ser overrided
```

Mudar o modo de um gate de `report` para `enforce` é uma **mudança de política** explícita, feita pelo time editando esse arquivo num PR dedicado, nunca automaticamente pela pipeline. Não existe transição temporal automática (ex.: "depois de 2 semanas vira enforce" como estava na versão anterior). A virada é manual e visível.

## Permissões dos Workflows

Todo arquivo `.yml` em `.github/workflows/` criado por esta pipeline declara explicitamente seu bloco `permissions:` no topo, com o mínimo necessário. Exemplos:

```yaml
# workflow que só lê código e roda testes
permissions:
  contents: read

# workflow que precisa comentar no PR e aplicar labels
permissions:
  contents: read
  pull-requests: write
  issues: write

# workflow que precisa publicar status checks customizados
permissions:
  contents: read
  pull-requests: write
  checks: write
  statuses: write
```

Regras:

- **Nunca** usar `permissions: write-all` ou omitir o bloco (omissão herda o default, que pode ser amplo demais).
- **Nunca** usar PATs (personal access tokens) sem o usuário confirmar no discovery. Se um gate precisa de escopo além do `GITHUB_TOKEN` padrão (ex.: alterar branch protection, escrever em outro repo), o gate é marcado como "requer configuração manual" e o Claude Code documenta o passo a passo em vez de tentar configurar sozinho.
- Workflows acionados por `pull_request_target` (que roda no contexto da branch base com acesso a secrets) **não são usados** por esta pipeline. Apenas `pull_request` (que roda no contexto do fork, sem secrets) é permitido, exatamente para reduzir superfície de ataque com PRs vindos de forks.
- Workflows que recebem entrada do PR (título, body, diff) tratam essa entrada como dado, nunca como código — sem interpolação direta em scripts shell. Usar variáveis de ambiente intermediárias.

## Padrões para scripts em `.github/scripts/`

Os scripts auxiliares da pipeline (reporter consolidado, risk score, metrics collector, etc) lidam com a GitHub API e dados externos. Cada um desses pontos é fonte de falha silenciosa que custa caro depurar. Padrões obrigatórios:

1. **Preferir `urllib.request` à `gh` CLI.** Erros viram exceções Python nativas com o body da resposta HTTP, não dependem de `gh` estar pré-instalado no runner, são reproduzíveis localmente com `GH_TOKEN` no env. `gh api` em subprocess engole stderr quando o consumer não trata, e cria divergência entre dev local (sem `gh`) e CI.
2. **Nunca usar `gh api --paginate` em endpoint que retorna objeto/array JSON.** O `--paginate` concatena os JSONs de cada página separados por newline, o que **quebra `json.loads()`** (`Extra data: line 2`). Usar `per_page=100` no querystring. Se algum endpoint passar de 100 itens em uso real, paginação manual percorrendo o header `Link: ...; rel="next"`.
3. **Logging defensivo com `flush=True`** em pontos-chave: início do script, antes de cada chamada externa, decisões importantes (gate X normalizado para Y), fim do script. GitHub Actions buffer-iza stdout em pipe; sem flush, prints podem ser perdidos quando o processo sai. Padronizar um `_log()` helper que escreve em `sys.stderr` com `flush=True`.
4. **Try/except no entry point** com `traceback.print_exc()` e exit code distinto para erro interno vs decisão de lógica:
   - exit 0 = sucesso, todos os gates passaram
   - exit 1 = lógica decidiu falhar (gates enforce falharam)
   - exit 2 = erro interno (exceção não-tratada — diagnóstico, não decisão)
5. **Retry com backoff em qualquer leitura da Checks API.** Quando o reporter consolida resultados de outros workflows, há **race condition** entre o `conclusion` final do check e a consulta — a API às vezes retorna `conclusion: null` para checks que acabaram de terminar. Default razoável: 3 tentativas, backoff `[10s, 20s]`, total 30s. Se esgotar tentativas, seguir com o que tiver (não travar o job).
6. **Respeitar a versão de Python declarada no discovery.** Se o projeto roda Python 3.10, não usar `datetime.UTC` (3.11+), `tomllib` (3.11+), `match`/`case` (3.10+), match statements, ou outras features novas. Validar com `python -m py_compile <script>.py` no Python alvo antes de commitar.

## Fluxo Principal

A execução do Claude Code segue 7 etapas obrigatórias, em ordem.

### Etapa 0 — Discovery do projeto

O Claude Code começa lendo o repositório e respondendo, antes de qualquer escrita, às seguintes perguntas (registrar a resposta em `.claude/code-review-pipeline/discovery.md`):

1. **Linguagem(ns) principal(is)?** — inspecionar `package.json`, `pyproject.toml`, `pom.xml`, `go.mod`, `pubspec.yaml`, `Cargo.toml`, `Gemfile`, `.csproj`, etc. Capturar **versão exata** do runtime (ex.: Python 3.10 vs 3.11) — os scripts auxiliares da pipeline só podem usar features dessa versão. Não usar `datetime.UTC` em Python 3.10, etc.
2. **Framework e ferramentas de teste?** — Jest/Vitest/Mocha, pytest, JUnit/Maven, go test, flutter test, etc.
3. **CI atual?** — listar todos os workflows em `.github/workflows/`. Existe pipeline de testes? Coverage? Lint?
4. **Branches protegidas existem?** — perguntar ao usuário quais são (default: `main`, `master`, `develop`, `release/*`).
5. **CODEOWNERS existe?** — se sim, ler e listar paths cobertos.
6. **Coverage atual exato?** — esta é uma entrada **crítica**, não opcional. Se o projeto tem report no CI: ler o último valor. Se não tem mas tem testes: rodar localmente uma vez e capturar o valor real. Se não tem testes: marcar como "sem testes" — coverage gate fica desabilitado nessa rodada. **Nunca chutar.** O número descoberto aqui será o `coverage_floor.threshold` inicial em `code-review-pipeline.yml`. **Importante:** medir contra o **merge ref** (simulando localmente com `git merge --no-commit origin/<base>` ou esperando o primeiro CI rodar no PR-piloto da Etapa 7) — não na branch isolada. Coverage muda quando `develop` ganha código novo entre o início da entrega e o merge. Usar margem mínima de **3pp abaixo** do valor medido para o threshold (não 0pp) — pequenas variações entre runs não devem bloquear merge.
7. **Tipo de projeto:** backend, frontend web, mobile, biblioteca, infra-as-code, monorepo? — inferir por estrutura de pastas.
8. **Tamanho:** linhas de código, número de arquivos — `cloc` ou equivalente, se disponível. **Estimar volume de código legado nunca-lintado** (rodar ruff/eslint/etc em modo dry-run no repo todo e contar erros). Se passar de algumas centenas, o lint da Fase 1 deve ser limitado a `tests/` e `.github/scripts/` (código que esta entrega introduz), com TODO de cleanup separado — aplicar lint a milhares de erros legados num único PR é inviável.
9. **Tokens e permissões disponíveis?** — perguntar ao usuário: o `GITHUB_TOKEN` padrão é suficiente, ou existe um PAT/app token configurado como secret para operações que exigem mais escopo (ex.: branch protection, cross-repo)? Sem essa resposta, Claude Code assume **apenas `GITHUB_TOKEN` padrão** e marca como "configuração manual" tudo que exigir mais.
10. **Dependências indiretas de teste?** — grep nos arquivos de teste existentes por imports que **não resolvem via `requirements.txt`/`package.json`** (Lambda Layers, pacotes locais via `pip install -e`, conda envs, monorepo workspaces). Documentar cada um e decidir: empacotar como dev-dep, mockar via `conftest.py` raiz, ou excluir do CI com TODO. Sem isso, testes legados que rodavam local quebram silenciosamente no CI.
11. **Side effects no import-time?** — grep por chamadas que disparam I/O ou validação no nível de módulo (fora de função): `boto3.client(...)`, `google.cloud.*Client()`, `psycopg2.connect`, `requests.Session()`, etc. Decidir env vars dummy para o job test/coverage (ex.: `AWS_DEFAULT_REGION=us-east-1` + credenciais fake para satisfazer validators sem conectar).
12. **Runtimes secundários exigidos?** — Node.js (jsii para AWS CDK, esbuild), JDK (Bazel/Maven), Cargo (deps nativos via PyO3), .NET. Listar o que cada job (test/coverage/build) precisa instalar via `actions/setup-*` além do runtime principal.
13. **PRs ativos na branch base?** — `gh pr list --base <base> --state open` para estimar drift esperado durante a entrega. Se houver vários PRs prestes a mergear, recomendar rebase frequente da branch da pipeline para minimizar surpresas no coverage do PR-piloto.

Apresentar o discovery completo ao usuário antes de qualquer outra ação. **Aguardar confirmação.**

### Etapa 0.5 — Auditoria histórica de segredos (sem commit)

Antes de qualquer commit da pipeline, rodar `gitleaks detect` contra **todo o histórico** do repo. Esse passo é de descobrimento, não de enforcement.

Saída esperada em `.claude/code-review-pipeline/gitleaks-history-report.md`:

- Total de findings, agrupados por categoria:
  - **Falsos positivos comuns** — Cognito Client IDs, S3 bucket names, ARNs públicos em arquivos de config (esses NÃO são segredos por design).
  - **Tokens potencialmente reais em arquivos vivos** — JWT, API keys, chaves privadas que ainda estão no working tree.
  - **Tokens potencialmente reais em arquivos já removidos** — só existem no histórico; precisam de rotação + `git filter-repo`/BFG.
- Para cada finding "real": SHA, autor, data, status (vivo/removido).

Geração simultânea de:

- **`.gitleaks.toml`** com `extend.useDefault = true` + `allowlist.paths` para os caminhos que carregam falsos positivos confirmados (ex.: `config/app_config.yaml`, `lambdas/*/config.yaml`, `template.yaml`). Esse arquivo entra no commit da Fase 2.
- **Issue rascunho** em `.claude/code-review-pipeline/issue-gitleaks-cleanup.md` com plano de remediação para os tokens reais: lista de tokens a rotacionar, comando `git filter-repo` proposto, plano de comunicação ao time, ordem de execução (rotacionar **antes** de reescrever histórico).

A pipeline em si (gate `secret_scan` na Fase 2) **só escaneia o diff do PR** (`--log-opts="origin/<base>..HEAD"`). Histórico fica como responsabilidade dessa Etapa 0.5 + cleanup humano. Documentar isso explicitamente no comentário do gate.

### Etapa 1 — Fase 1: Fundação (Commit #1)

Objetivo: estabelecer o esqueleto da pipeline sem bloquear nada novo ainda.

O Claude Code deve criar/ajustar:

- **`.github/workflows/ci.yml`** (ou consolidar workflow existente) com jobs separados: `lint`, `build`, `test`. Cada job em runner adequado à stack detectada.
- **`.github/workflows/pr-validation.yml`** — valida título do PR (conventional commits), tamanho do diff (warning se > 500 LOC alteradas), e label automation (label `size/XS|S|M|L|XL` baseado no diff).
- **Linter e formatter configurados:**
  - JS/TS: ESLint + Prettier
  - Python: Ruff + Black
  - Java: Spotless + Checkstyle
  - Go: golangci-lint + gofmt
  - Dart/Flutter: dart analyze + dart format
  - …seguir o padrão da stack detectada
- **`.github/CODEOWNERS`** — se não existe, criar template comentado pedindo ao usuário preencher.
- **`.github/pull_request_template.md`** — checklist mínimo: descrição, tipo de mudança, testes incluídos, breaking change, screenshots se UI.
- **Pre-commit hooks** (husky/pre-commit framework conforme stack) rodando linter e formatter no que mudou. **Usar repositórios oficiais do framework `pre-commit`** (ex.: `astral-sh/ruff-pre-commit`, `psf/black-pre-commit-mirror`, `pre-commit/mirrors-prettier`) — eles isolam as ferramentas em venvs/node_modules próprios. **NÃO** usar `language: system` com `entry: ruff check` etc., porque exige a ferramenta no PATH global de cada dev, criando setup obrigatório fora do `pre-commit install`. Hooks pré-existentes do projeto (ex.: `cdk synth`) ficam preservados — só estender, não substituir.
- **Branch protection rules** documentadas em `.claude/code-review-pipeline/branch-protection.md` (Claude Code não tem permissão para alterar regras via API por padrão; gerar o documento + comandos `gh api` prontos para o usuário aplicar).

**Saída desta fase:** commit `chore(ci): fase 1 - fundação da pipeline de code review` na branch `feature/code-review-pipeline`. Claude Code apresenta o `git diff` da fase ao usuário e aguarda confirmação explícita para seguir.

### Etapa 2 — Fase 2: Quality Gates Objetivos (Commit #2)

Objetivo: ativar os gates consensuais. Cada item indica seu modo (`enforce` ou `report`) — é o modo **inicial** registrado em `code-review-pipeline.yml`. O time pode promover de `report` para `enforce` depois, editando o arquivo.

**OBRIGATÓRIO — entram como `enforce` no commit:**

- **Coverage floor** (`enforce`): threshold inicial = **valor medido no merge ref**, **menos 3 pontos percentuais de margem**, sem arredondamento para cima. Por exemplo: se o `pull/<n>/merge` mede 86.95%, threshold = 83 (`floor(86.95) - 3`). Se mede 22%, threshold = 19. A intenção é "não regredir significativamente", não "atingir padrão da indústria". A margem de 3pp absorve variações entre runs (denominador muda quando outros PRs entram em `develop`, runners diferentes, ordem de coleta dos testes). **O verdadeiro freio contra regressão por PR é o `coverage_delta`, não o `coverage_floor`.** Threshold sobe (ratchet) à medida que a suite cresce, via PR dedicado ao `code-review-pipeline.yml`. Medir o coverage **localmente contra o merge ref** (não na branch isolada) — usar `git merge --no-commit origin/<base>` num worktree temporário, rodar pytest --cov, depois reverter. Tool por stack:
  - JS/TS: Vitest/Jest com `--coverage` + `nyc check-coverage` ou config no `vitest.config.ts`
  - Python: `coverage.py` com `coverage report --fail-under=X`
  - Java: JaCoCo com `<minimum>` na config Maven/Gradle
  - Go: `go test -coverprofile` + script de check
  - Dart/Flutter: `flutter test --coverage` + `lcov` check
  - Se o projeto **não tem testes**: gate fica desabilitado (`mode: disabled` na config) e Claude Code abre issue "implementar suite de testes mínima antes de habilitar coverage gate".
- **Coverage delta no PR** (`enforce`): comparar coverage da branch com a base. Falha se cair mais que 2 pontos percentuais. Usar action que faz comparação local (não exigir serviço externo no setup inicial). Codecov/Coveralls podem ser adicionados pelo time depois se quiserem dashboard. **Resultado `skipped` quando a base não consegue ser medida** (ex.: base não tem `requirements-dev.txt` nem `pyproject.toml` ainda) — esse skipped **não bloqueia** (regra geral de "enforce + skipped = não-bloqueante" da seção Modos de Gate).
- **SAST** (`enforce`): Semgrep com ruleset `p/ci` (universal) ou CodeQL se o repo tiver GitHub Advanced Security disponível. Rodar contra o diff. Falha em finding `high`+.
- **Secret scanning** (`enforce`, **sem override permitido**): Gitleaks CLI rodando **somente contra o diff do PR** (`gitleaks detect --log-opts="origin/<base>..HEAD"`) + push protection nativa do GitHub se disponível. **Importante**: o gate consome o `.gitleaks.toml` gerado na Etapa 0.5, que tem `allowlist.paths` para os arquivos de config conhecidos como portadores de falsos positivos (Client IDs, ARNs públicos). O gate **NÃO** detecta tokens já no histórico — esses são tratados pela Etapa 0.5 + cleanup humano (issue rascunho `issue-gitleaks-cleanup.md`). Usar `gitleaks` CLI baixado direto do release (versão pinada) — a `gitleaks-action@v2` exige licença em repos privados; o CLI é gratuito.
- **Dependency vulnerability check** (`enforce`): Dependabot habilitado + workflow que falha em CVE `high`+. Tool por stack: `npm audit`, `pip-audit`/`safety`, `dependency-check-maven`, `govulncheck`.
- **Comentário automático no PR** (`enforce` de presença, não de conteúdo): ao final do CI, postar **um único** comentário resumindo todos os gates (atualizado via marcador HTML para evitar poluição de comentários repetidos), com links para os detalhes de cada job.

**EXPERIMENTAL — entram como `report` no commit:**

- **License compliance** (`report`): lista licenças encontradas vs lista de aprovadas, mas não bloqueia. Quando o time tiver definido a política de licenças aceitáveis, promover para `enforce`.
- **PR size warning** (`report`): aplica label `size/XS|S|M|L|XL` e comenta se > 500 LOC, mas não bloqueia.

**Sobre o override (substitui a versão anterior, que era ruim):**

- Override é uma **label aplicada no PR**: `override-gate:<nome>`.
- Quando presente, o job correspondente lê a label, sai com sucesso, mas reporta um status check **separado** chamado `<nome>/skipped-by-override` — visível na UI do PR como "skipped" (não como "passed").
- O bot posta **um único comentário** no PR mencionando o override: "⚠️ Gate `<nome>` foi pulado via override por @usuario em \<timestamp\>". Esse comentário fica no histórico do PR, que é o registro de auditoria — **não é feito commit automático em log paralelo, em branch separada, ou em arquivo do repo**. O histórico do PR já é fonte de auditoria suficiente, sem efeitos colaterais no repositório.
- A lista de gates que aceitam override e a lista de gates que **nunca** aceitam (default: `secret_scan`, `sast`) ficam em `.github/code-review-pipeline.yml`, editáveis pelo time.
- A contagem de overrides usados, por gate e por usuário, é exposta nas métricas da Fase 6 (consultando GitHub API, não logs internos).

**Saída desta fase:** commit `chore(ci): fase 2 - quality gates objetivos (coverage, sast, secrets)`. Claude Code apresenta o diff acumulado da fase e aguarda confirmação para seguir.

### Etapa 3 — Fase 3: AI Code Review (Commit #3 — apenas hooks)

Documentar como ponto de extensão futuro:

- Criar `.claude/code-review-pipeline/phase-3-ai-review-hooks.md` explicando:
  - Onde a ferramenta de AI review deve plugar (job paralelo no workflow principal)
  - Como integrar com o sistema de risk scoring (a Fase 4 cria)
  - Interface esperada: a ferramenta deve postar comentário no PR e expor um status check chamado `ai-review/passed`
- Adicionar no workflow um job placeholder `ai-review` que sempre passa, mas com comentário explicando que será substituído quando a ferramenta for adotada.
- **NÃO instalar nenhuma ferramenta de terceira parte nesta fase.**

**Saída desta fase:** commit `chore(ci): fase 3 - hooks de extensão para ai code review`. Mesmo sendo só documentação + placeholder, mantém o commit isolado para facilitar revisão e eventual revert. Aguardar confirmação para seguir.

### Etapa 4 — Fase 4: Risk Scoring e Roteamento (Commit #4)

Objetivo: classificar cada PR por risco e atribuir reviewers de forma orientativa. **Nesta versão, todo este gate entra como `report` em `code-review-pipeline.yml` — o score é informativo, jamais bloqueante.** A promoção para `enforce` é uma decisão futura do time, após semanas de calibração com dados reais.

- **Script de risk scoring** em `.github/scripts/risk-score.{js,py}` (escolher linguagem coerente com a stack do projeto — JS se monorepo de JS/TS, Python caso contrário) que recebe o PR diff e calcula score 0-100 baseado em:
  - **Tamanho do diff** (LOC adicionadas + removidas)
  - **Número de arquivos tocados**
  - **Cyclomatic complexity** dos arquivos alterados (usar `lizard` para multi-linguagem, ou ferramenta nativa)
  - **Arquivos críticos tocados** — comparar paths alterados contra lista em `.github/critical-paths.yml` (criar template comentado, **vazio**, com exemplos sugestivos: `**/auth/**`, `**/billing/**`, `**/migrations/**`, `.github/workflows/**`, `Dockerfile*`, schemas). O usuário preenche o que faz sentido para o projeto dele.
  - **Histórico do arquivo** — quantos bug fixes nos últimos 90 dias (git log + heurística por commit message contendo "fix"/"bug"/"hotfix"). Heurística é fraca e isso é declarado no comentário do bot, para o usuário saber.
  - **Mudança em contrato público** — diff em arquivos OpenAPI/GraphQL/Proto se existirem
- **Política em `.github/risk-policy.yml`** declarando os pesos e faixas (apenas valores iniciais sugeridos — o time pode ajustar):
  ```yaml
  weights:
    diff_size: 15
    files_count: 10
    complexity: 20
    critical_paths: 30
    file_history: 15
    public_contract: 10
  buckets:
    trivial:  { max: 15 }
    low:      { max: 35 }
    medium:   { max: 60 }
    high:     { max: 85 }
    critical: { max: 100 }
  ```
- **Workflow `pr-risk-assessment.yml`** roda o script e:
  - Posta **um único** comentário no PR (atualizado via marcador HTML) com o score detalhado, fator por fator, **e uma nota explícita** indicando que o score é heurístico e informativo.
  - Aplica labels (`risk:trivial|low|medium|high|critical`).
  - **Sugere** reviewers consultando `.github/senior-reviewers.yml`, mas a atribuição obrigatória é feita pelo CODEOWNERS (que continua sendo a única fonte de verdade para "quem precisa aprovar"). O workflow nunca **bloqueia** o merge baseado no score nesta versão.
- **Mapa de reviewers seniores** em `.github/senior-reviewers.yml` — Claude Code cria template **vazio** com exemplo comentado e pede o usuário preencher. Não chutar nomes.
- **Sem log de auditoria em arquivo do repo.** O histórico de scores fica visível nos comentários dos PRs e nos labels. Métricas agregadas são extraídas pela Fase 6 via GitHub API, sem commits automáticos.

**Saída desta fase:** commit `chore(ci): fase 4 - risk scoring e roteamento automatizado`. Como o workflow ainda não está rodando contra um PR real (estamos numa branch sem PR aberto), o Claude Code deve incluir nos artefatos um exemplo de output esperado em `.claude/code-review-pipeline/risk-scoring-example.md` para validação visual. Aguardar confirmação para seguir.

### Etapa 5 — Fase 5: Test Quality e Mutation Testing (Commit #5)

Objetivo: ir além do coverage. Medir se os testes realmente validam — mas **tudo nesta fase entra como `report` em `code-review-pipeline.yml`**, nada bloqueante nesta versão. A virada para `enforce` (parcial ou total) é decisão futura do time, manual.

Pré-condições: se o projeto não tem testes (detectado no discovery), pular esta fase inteira e adicionar nota no `state.md`.

- **Mutation testing incremental no PR** (`report`): só nos arquivos alterados. Tool por stack:
  - JS/TS: Stryker (`@stryker-mutator/core`) com `--mutate` apontando para arquivos do diff
  - Python: `mutmut` ou `cosmic-ray`
  - Java: PIT (`pitest-maven-plugin`)
  - Go: `go-mutesting`
  - Dart/Flutter: `mutation_test`
- **Job `mutation-testing-pr`** no workflow:
  - Roda somente nos arquivos extraídos via `git diff` contra a base.
  - Threshold inicial: **valor descoberto rodando uma vez localmente** (medido pelo Claude Code antes do commit) — não 50% arbitrário. Se nunca rodou antes, o threshold é o **primeiro valor medido**, e o gate registra esse valor como baseline em `code-review-pipeline.yml`.
  - Modo `report`: comenta no PR + aplica label `mutation-score:<valor>`. Nunca falha o job nesta versão. **Não há promoção temporal automática para `enforce`** — quando o time quiser tornar bloqueante, edita o arquivo de config em um PR dedicado.
- **Job `mutation-testing-nightly`** em `.github/workflows/nightly.yml`:
  - Roda mutation testing completo (não só diff) em horário noturno.
  - Publica relatório em **artifact** do GitHub Actions (não em commit ao repo). Para histórico de tendência, usa GitHub Pages, um bucket externo, ou simplesmente a aba de artifacts — Claude Code propõe a opção e o usuário escolhe no discovery.
  - Cria issue automática se score caiu mais que 5 pontos vs último run.
- **Detecção de testes flaky** (`report` apenas, **sem nenhuma ação automática sobre o código**):
  - Workflow lê histórico de runs via GitHub Actions API.
  - Marca como flaky qualquer teste que falhou e passou no mesmo SHA mais de 1x nas últimas 4 semanas.
  - **Saída exclusiva:** um relatório markdown publicado como issue semanal automatizada com o título `Flaky tests report — semana de YYYY-MM-DD`, listando os testes suspeitos, frequência de oscilação, e link para os runs onde isso ocorreu. **Nenhum PR automático.** **Nenhuma modificação automática em arquivos de teste.** A quarentena fica como decisão humana, com o relatório dando os dados pra decidir.
- **Critical paths com threshold diferenciado** (`report`): se `.github/critical-paths.yml` está preenchido, mutation score em arquivos críticos é reportado separadamente no comentário do PR (mas continua sendo report, não enforce).

**Saída desta fase:** commit `chore(ci): fase 5 - mutation testing e detecção de testes flaky`. Claude Code deve rodar o mutation testing localmente em um arquivo de amostra para medir tempo estimado e reportar ao usuário, antes de pedir confirmação para seguir.

### Etapa 6 — Fase 6: Observabilidade (Commit #6)

Objetivo: dar visibilidade ao funcionamento da pipeline para o time decidir o que promover, ajustar ou remover.

- **Workflow `metrics-collector.yml`** rodando semanalmente (não diariamente — reduz ruído) coleta via GitHub API:
  - Lead time médio de PR (abertura → merge)
  - Tempo médio em review
  - % de PRs por bucket de risco (vindo dos labels aplicados pela Fase 4)
  - % de PRs onde cada gate `enforce` falhou
  - Volume de overrides usados (por gate, por usuário) — consulta os comentários do bot via API, **não lê arquivo de log**
  - Mutation score médio dos PRs (vindo dos labels aplicados pela Fase 5)
  - Coverage trend (vindo dos status checks)
- **Output como issue semanal automatizada** com sumário das métricas + 3 ações sugeridas baseadas em outliers (ex.: "gate X foi sobrescrito 12x esta semana — considerar revisar threshold ou converter para report"). **Nenhum arquivo é commitado ao repo pela pipeline.** Se o time quiser histórico persistente, pode arquivar as issues — que já é um histórico nativo do GitHub.
- **Para dashboards visuais externos** (Grafana, Datadog, etc.): o workflow publica também um JSON estruturado como artifact do run, e o runbook documenta como conectar ferramentas externas a ele. Mas isso é opcional e não faz parte do que a pipeline configura automaticamente.
- **Documento `.claude/code-review-pipeline/runbook.md`** com:
  - Como cada gate funciona e como ajustá-lo (referenciando `code-review-pipeline.yml`)
  - Como promover um gate de `report` para `enforce`
  - Como adicionar critical paths
  - Como reverter para estado anterior se algo der errado (mapeamento commit ↔ fase para `git revert`)
  - Mapa de todos os workflows criados e suas permissões
  - Quais gates **nunca** devem ter override (e por quê)

**Saída desta fase:** commit `chore(ci): fase 6 - observabilidade e runbook`. Claude Code apresenta o resumo executivo da branch inteira (todos os 6 commits) ao usuário e aguarda confirmação para abrir o PR único final.

### Etapa 7 — Encerramento, PR-piloto e validação real

Ao final de tudo, o Claude Code deve:

- Atualizar `.claude/code-review-pipeline/state.md` com:
  - Lista de tudo que foi implementado, commit por commit (SHA + descrição)
  - Próximos passos sugeridos (incluindo Fase 3 quando o time decidir)
  - Lista de TODOs/decisões pendentes do usuário (ex.: preencher CODEOWNERS, definir senior reviewers)
- **Abrir o PR único final** contra a branch padrão, com:
  - **Título no formato Conventional Commits** (ex.: `chore(ci): pipeline de code review automatizado (fases 1-6)`) — o próprio PR de instalação da pipeline precisa passar nos próprios gates, inclusive `pr-validation`.
  - **Descrição estruturada** listando cada commit, seu propósito, e os arquivos criados/alterados em cada fase
  - **Checklist de revisão** apontando o que verificar em cada fase
  - **Aviso destacado** de que o PR contém mudanças apenas em CI/configuração, nenhuma alteração em código de aplicação

#### Validação real antes de declarar conclusão

Abrir o PR é o início do PR-piloto, não o fim. O Claude Code deve:

1. **Aguardar todos os workflows terminarem** no PR-piloto e **ler os logs** de cada job (não apenas o status check verde). Confirmar:
   - Todos os jobs com `conclusion: success` (ou `skipped` quando esperado).
   - O comentário consolidado do `gate-summary` aparece com **0 blocking failures** e lista cada gate corretamente.
   - Nenhum warning crítico no log que indique problema futuro (ex.: Node EOL, tools deprecadas, secrets ignorados por engano).
2. **Não declarar conclusão até observar pelo menos 2 runs consecutivos verdes** (segundo run via `git commit --allow-empty` ou push trivial). O primeiro pode ter mascarado race condition; o segundo confirma estabilidade.
3. Se algum gate falhar:
   - Ler o log completo do job que falhou (não inferir pelo status).
   - Reproduzir local quando possível.
   - **Corrigir e iterar** até estabilizar — **antes** de finalizar o `state.md` ou postar a mensagem final no chat.
4. Só então:
   - Atualizar `state.md` com SHAs reais (incluindo eventuais commits de fix do PR-piloto).
   - Postar mensagem final no chat consolidando o que foi entregue e referenciando o número do PR.

**O Claude Code não deve afirmar "pronto" baseado em validação local + 1 run verde no CI.** Local não exercita race conditions, merge refs, runtime do runner e várias outras superfícies. Sempre o ciclo completo de observação real.

## Fluxos Alternativos

- **Se o projeto já tem alguns workflows:** o Claude Code lê todos, não duplica funcionalidade, e propõe consolidação no discovery — nunca cria workflow paralelo concorrente sem confirmação explícita.
- **Se a stack tem múltiplas linguagens (monorepo):** detectar via path e criar jobs específicos por pacote/módulo, usando `paths:` no workflow para rodar só o necessário. Considerar `Nx affected` / `Turbo` / `Bazel` se já em uso.
- **Se o projeto não tem testes:** pular o gate de coverage delta (ele dividiria por zero), mas avisar no diff do commit e abrir issue "implementar suite de testes mínima antes de habilitar coverage gate". Mutation testing fica condicionado à existência de testes.
- **Se o projeto não tem branches protegidas configuradas:** Claude Code gera o documento com os comandos `gh api` mas **não aplica diretamente** — pede ao usuário confirmar e rodar manualmente. Mudança de branch protection é destrutiva e exige permissão admin.
- **Se um teste de validação local falhar durante implementação no próprio repo:** o Claude Code para, reporta o que falhou e por quê, e pergunta se deve ajustar o threshold ou se há um problema real a corrigir antes — sem commitar nada quebrado.
- **Se o tempo total estimado do CI passar de 20 minutos:** Claude Code reporta e sugere paralelização adicional ou matriz de jobs antes de seguir.
- **Override de gate usado em PR de produção:** registrar em log + comentar no PR mencionando os admins (lista em `.github/senior-reviewers.yml`).
- **Se uma fase precisar ser refeita após confirmação:** usar `git reset --soft HEAD~1` para desfazer o commit mantendo as alterações em stage, ajustar, e recomitar — nunca usar `--hard` que perde trabalho.
- **Se o usuário pedir para parar no meio:** a branch fica em estado válido com os commits já confirmados. O state.md registra onde parou. Na próxima execução, Claude Code retoma da fase seguinte.

## Dependências

Tudo abaixo deve estar disponível ou ser instalado pelo Claude Code conforme necessidade:

- **GitHub Actions** habilitado no repo (assumido como padrão)
- **Permissões:** o token padrão `GITHUB_TOKEN` precisa de escopo de `write` em PRs (para comentar) e `read` em conteúdo. Permissões adicionais (alterar branch protection) ficam sob responsabilidade do usuário.
- **Ferramentas de linguagem-específica** (linter, coverage tool, mutation testing tool) — Claude Code adiciona às devDependencies/requirements/etc. do projeto durante a execução
- **Gitleaks** (action oficial existe — `gitleaks/gitleaks-action`)
- **Semgrep** (action oficial — `returntocorp/semgrep-action`)
- **Codecov ou Coveralls token** (perguntar ao usuário; se não tiver, usar action que faz comparação local sem serviço externo)
- **Discovery:** `cloc`, `git`, `gh` CLI (todos disponíveis nos runners default)
- **Para risk scoring:** `lizard` (Python, instalado via pip no job)

## Riscos e Pontos de Atenção

- **Alert fatigue real:** se o número de gates `enforce` é alto desde o dia 1, devs vão reclamar. Esta versão mitiga isso de duas formas: (1) os gates **experimentais** (risk score, mutation, flaky) entram como `report`, sem fricção; (2) o override via label é descobrível — quando um gate `enforce` falha, o bot menciona explicitamente no comentário do PR como aplicar o `override-gate:<nome>`. **Não usar `continue-on-error: true` em job algum** — o modo do gate é declarado em `code-review-pipeline.yml`, e a distinção report/enforce é resolvida no script do gate (no exit code), não no YAML do workflow. Isso elimina a ambiguidade entre "rodou e passou" e "rodou e falhou mas foi ignorado".
- **CI lento:** mutation testing pode explodir tempo de build. A solução é rodar incremental no PR (só arquivos alterados) e completo no nightly. Claude Code deve medir e reportar o tempo total a cada fase.
- **False positives em risk scoring:** o algoritmo é heurístico; vai errar. Por isso entra como `report`. O comentário do bot **deve sempre** explicar **por que** o score foi alto, com os fatores listados e seus pesos, deixando claro que é orientação, não veredicto.
- **Discovery incompleto:** se a stack do projeto não está em nenhum dos padrões reconhecidos (ex: linguagem exótica), o Claude Code deve parar e perguntar ao usuário ao invés de chutar.
- **Override abusado:** se overrides forem usados descontroladamente, a métrica semanal da Fase 6 expõe isso (extraída da GitHub API, sem precisar de log próprio). Sugerir no runbook que o time defina sua política de uso aceitável.
- **Conflito com workflows existentes:** se o projeto já usa SonarQube/Coveralls/etc., não duplicar. Detectar e integrar.
- **Sequência de commits grande:** o PR final terá 6 commits e tocará vários arquivos de CI. Para facilitar a revisão, o Claude Code deve garantir que a descrição do PR liste claramente o que cada commit faz, e que cada commit seja autocontido (review por commit é uma estratégia válida).
- **Permissões de branch protection:** Claude Code não tem como aplicar automaticamente em todos os repos sem token admin. Gerar o script `gh api` para o usuário rodar é a solução pragmática.
- **Custos de mutation testing em projetos grandes:** pode ser caro em minutos de runner. Considerar matriz de testes e cache agressivo. Para projetos muito grandes, sugerir self-hosted runner.
- **Permissões dos workflows:** todo `.yml` declara `permissions:` explicitamente. Workflows acionados por `pull_request_target` não são usados (apenas `pull_request`). Dados vindos do PR (título, body) são tratados como dados via env vars, nunca interpolados em shell.
- **Sem commits automáticos do bot ao repo:** nenhum workflow desta pipeline faz commit em arquivo do repo. Auditoria é via comentários em PRs, labels, status checks e issues — todos consultáveis via API. Isso evita ruído no histórico do git, permissões de escrita desnecessárias, e race conditions entre runs concorrentes.
- **Estado entre execuções:** se o Claude Code rodar a implementação de novo (re-entrada), deve ler `.claude/code-review-pipeline/state.md` e retomar de onde parou — nunca recomeçar do zero.
- **Validação local não é prova de funcionamento no CI.** Vários problemas só aparecem com o paralelismo real do CI: race condition entre workflows ao consultar Checks API, diferença entre `pull/<n>/merge` (que o CI checkout faz) e a branch isolada do dev, runtimes que existem só no runner (ex.: `gh` CLI), tools que dependem de licença em repo privado (gitleaks-action@v2), módulos com side effect no import que dependem de env vars (boto3 sem `AWS_DEFAULT_REGION`). **O Claude Code não deve afirmar "vai funcionar" baseado em testes locais ou simulações parciais** — exige PR-piloto real conforme Etapa 7, com 2 runs verdes consecutivos antes de declarar conclusão.
- **Histórico legado com segredos:** repos antigos quase sempre têm tokens reais ou Client IDs públicos no histórico. Tentar resolver isso no mesmo PR de instalação da pipeline é receita pra travar tudo. Por isso a Etapa 0.5 (auditoria histórica) gera um plano de cleanup separado, e o gate `secret_scan` desta pipeline só olha o diff. **A pipeline não conserta histórico — só impede regressão a partir do agora.**
- **Race condition entre workflows:** quando o reporter consolida resultados via Checks API e outros workflows terminam em paralelo, o `conclusion` final pode ainda não estar gravado. O reporter precisa fazer retry com backoff (regra obrigatória na seção "Padrões para scripts").

## Critérios de Aceite

- [ ] Discovery completo apresentado e confirmado pelo usuário antes de qualquer escrita
- [ ] Todo o trabalho ocorre em uma única branch (`feature/code-review-pipeline` ou equivalente)
- [ ] Cada fase termina com um commit isolado, com mensagem padrão Conventional Commits, e confirmação explícita do usuário antes da próxima
- [ ] Commits são autocontidos — cada um pode ser revertido isoladamente sem quebrar os outros
- [ ] PR único final é aberto somente após Fase 6 completa, agrupando todos os commits
- [ ] Descrição do PR final lista commit por commit, com propósito de cada um
- [ ] Arquivo `.github/code-review-pipeline.yml` existe e declara o modo (`enforce`/`report`) de cada gate explicitamente
- [ ] Nenhum job usa `continue-on-error: true` — o modo é decidido pelo exit code do script do gate, refletindo o que está em `code-review-pipeline.yml`
- [ ] Gates da Fase 2 entram como `enforce`; gates das Fases 4 e 5 entram como `report` (com exceção explícita: `secret_scan` é sempre `enforce` e sem override permitido)
- [ ] Não há promoção automática temporal de `report` para `enforce` — todas as viradas são manuais via PR ao `code-review-pipeline.yml`
- [ ] Todos os gates `enforce` (exceto os listados como forbidden) aceitam `override-gate:<nome>` como label
- [ ] Override reporta status check `<nome>/skipped-by-override`, não converte falha em sucesso silenciosamente
- [ ] Nenhum workflow faz commit automático ao repositório — auditoria via comentários, labels, status checks e issues
- [ ] Todo workflow declara bloco `permissions:` no topo, com mínimo necessário
- [ ] Nenhum workflow usa `pull_request_target` — apenas `pull_request`
- [ ] Coverage threshold inicial = valor medido no merge ref menos 3pp de margem (não na branch isolada, não exatamente o valor medido)
- [ ] Mutation score threshold inicial é o valor medido na primeira execução, sem alvo arbitrário
- [ ] Detector de testes flaky publica apenas relatório (issue semanal) — nunca abre PR automático nem modifica testes
- [ ] Tempo total estimado do CI da pipeline final não excede 20 minutos no projeto-alvo (ou Claude Code reporta o real)
- [ ] Runbook escrito em `.claude/code-review-pipeline/runbook.md`, incluindo como promover gate de report para enforce
- [ ] Fase 3 (AI review) está documentada como hook, com placeholder no workflow
- [ ] Etapa 0.5 executada: `gitleaks-history-report.md` + `.gitleaks.toml` + `issue-gitleaks-cleanup.md` (rascunho) produzidos ANTES dos commits da pipeline
- [ ] Discovery captura: deps indiretas de teste, side effects no import-time, runtimes secundários, versão exata do runtime principal, PRs ativos na base
- [ ] Scripts em `.github/scripts/` seguem os 6 padrões obrigatórios (urllib, sem `--paginate`, logging com flush, try/except entry point, retry na Checks API, respeitar Python version)
- [ ] Pre-commit hooks usam repos oficiais do framework (`astral-sh/ruff-pre-commit`, etc), nunca `language: system`
- [ ] Lint da Fase 1 cobre apenas código novo (`tests/`, `.github/scripts/`) se o legado tem mais de algumas centenas de violações; cleanup do legado fica em issue separada
- [ ] Semântica explícita: `enforce + skipped → não bloqueia` (skipped = "job não avaliou", não "regressão detectada")
- [ ] Gate `secret_scan` escaneia apenas o diff (`--log-opts="origin/<base>..HEAD"`), nunca o histórico completo
- [ ] Etapa 7: PR-piloto aberto, logs lidos integralmente, **2 runs verdes consecutivos** observados antes de declarar conclusão; título do PR no formato Conventional Commits

## Fora de Escopo

- Implementação da Fase 3 (AI code review com ferramenta externa) — será feita pelo time depois
- Dashboard visual (Grafana, Datadog, etc.) — apenas geração de arquivos JSON/MD consumíveis
- Integração com Jira/Linear para validar scope do PR vs ticket
- Just-in-Time test generation (estilo Meta) — fica para uma evolução futura
- Visual regression testing — específico de frontend, não no escopo genérico
- Bundle size budget — específico de frontend, não no escopo genérico
- Cost estimation (Infracost) — específico de infra-as-code, não no escopo genérico
- Cross-repo analysis em monorepos — pode ser adicionado em fase futura
- Alteração de branch protection rules via API com token admin — Claude Code gera scripts mas não executa
- Mudanças em código de aplicação (refatorações, melhorias) — esta feature é só infraestrutura de CI

## Instruções Operacionais para o Claude Code

Quando o desenvolvedor referenciar este documento, o Claude Code deve:

1. **Ler este arquivo inteiro antes de começar.**
2. **Criar a branch `feature/code-review-pipeline`** (ou nome equivalente combinado) a partir da branch padrão. Não trabalhar direto na branch padrão.
3. **Executar a Etapa 0 (discovery) primeiro.** Apresentar resultado e aguardar.
4. **Seguir as etapas em ordem.** Não pular fases. Não combinar fases em um único commit sem autorização.
5. **A cada fase concluída, apresentar o diff acumulado do commit**, esperar confirmação humana, e só então fazer o commit + push da fase.
6. **Adaptar comandos e ferramentas à stack real**, não tentar usar tools que não fazem sentido para a linguagem.
7. **Quando em dúvida, perguntar.** Especialmente em decisões com impacto: thresholds, lista de critical paths, lista de senior reviewers.
8. **Documentar tudo que fizer** em `.claude/code-review-pipeline/`.
9. **Não inventar números.** Coverage threshold = valor medido no discovery, exato. Mutation threshold = valor medido na primeira execução. Sem fallback para "60%" ou "50%" arbitrários.
10. **Não usar `continue-on-error: true` em job nenhum.** O modo (`enforce` vs `report`) é decidido pelo script do gate, com base no `code-review-pipeline.yml`, e refletido no exit code. Ambiguidade entre "passou" e "falhou-mas-foi-ignorado" não existe nesta pipeline.
11. **Todo workflow declara `permissions:` explícito no topo.** Mínimo necessário. Nada de `write-all`, nada de omissão.
12. **Nenhum workflow faz commit automático ao repositório.** Auditoria é via API (comentários, labels, status checks, issues).
13. **Não usar `pull_request_target`.** Apenas `pull_request`. Dados do PR tratados como dados via env vars, nunca interpolados em shell.
14. **Não tocar em código de produto** — esta feature é estritamente CI/configuração.
15. **Abrir o PR único final** somente após a Fase 6 concluída e confirmada, agrupando todos os commits.
16. **Se o usuário pedir para parar no meio**, garantir que a branch está em estado consistente, registrar progresso em `state.md`, e listar a próxima fase pendente para retomada futura.