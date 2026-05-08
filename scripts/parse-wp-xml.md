# parse-wp-xml.ts

Script que lê o export WordPress (arquivo `.xml` no formato WXR) e gera o arquivo `json/posts_fitmass_completo.json` usado pelo script de migração para AWS.

Usa um parser SAX em modo streaming — o arquivo XML nunca é carregado inteiro na memória, tornando o processo seguro mesmo para exports de centenas de MB.

---

## Pipeline completo

```
xml/fitmass.WordPress.2026-05-08.xml
        ↓  parse-wp-xml.ts        ← este script
json/posts_fitmass_completo.json
        ↓  migrate-to-amplify.ts
DynamoDB (posts) + S3 (imagens)
```

---

## Pré-requisitos

Nenhuma credencial necessária nesta etapa. Apenas o arquivo XML na pasta `xml/`.

---

## Como executar

```bash
# Com o caminho padrão (xml/fitmass.WordPress.2026-05-08.xml)
npx tsx scripts/parse-wp-xml.ts

# Ou passando o caminho explicitamente
npx tsx scripts/parse-wp-xml.ts xml/fitmass.WordPress.2026-05-08.xml
```

Saída esperada:

```
→ Lendo xml/fitmass.WordPress.2026-05-08.xml…
  … 10 posts lidos
  … 20 posts lidos

✅ 47 posts exportados → json/posts_fitmass_completo.json
   Com imagem de capa : 41
   Sem imagem de capa : 6
   Autores encontrados: João Silva, Maria Costa

→ Próximo passo:
   npx tsx scripts/migrate-to-amplify.ts
```

---

## O que é extraído de cada post

| Campo | Fonte no XML | Observação |
|---|---|---|
| `title` | `<title>` | Apenas o primeiro `<title>` do item |
| `slug` | `<wp:post_name>` | URL amigável do post |
| `date` | `<wp:post_date>` | Ignorado se `0000-00-00` |
| `authorName` | `<dc:creator>` → resolvido via `<wp:author>` | Ver seção abaixo |
| `featureImage` | `_thumbnail_id` → resolvido via attachments | URL original do WordPress |
| `content` | `<content:encoded>` | HTML completo com todas as fotos inline |

### Filtros aplicados

Somente posts com **todos** os seguintes critérios são incluídos:

- `<wp:post_type>` = `post` (exclui pages, attachments, custom post types)
- `<wp:status>` = `publish` (exclui rascunhos, agendados, lixeira)
- Título, slug e conteúdo presentes e não-vazios

---

## Como o autor é resolvido

O WordPress armazena os autores em dois lugares no XML:

1. **No canal** (fora dos `<item>`): bloco `<wp:author>` com login e nome de exibição
2. **Em cada post**: `<dc:creator>` com o login do autor

O script lê o mapa de autores do canal e resolve o login para o nome de exibição:

```
<dc:creator>joao.silva</dc:creator>
      ↓
authorMap.get('joao.silva') → 'João Silva'
```

Se o login não tiver correspondência no mapa (raro), o próprio login é usado como nome. Se o post não tiver autor, o valor padrão é `'Fitmass'`.

---

## Como a imagem de capa é resolvida

WordPress não armazena a URL da imagem de capa diretamente no post — armazena um ID:

```xml
<wp:postmeta>
  <wp:meta_key>_thumbnail_id</wp:meta_key>
  <wp:meta_value>123</wp:meta_value>
</wp:postmeta>
```

O script acumula todos os attachments do XML em um mapa `id → URL`:

```xml
<item>
  <wp:post_type>attachment</wp:post_type>
  <wp:post_id>123</wp:post_id>
  <wp:attachment_url>https://fitmass.com.br/wp-content/uploads/foto.jpg</wp:attachment_url>
</item>
```

Após a leitura completa do XML, cada post tem seu `_thumbnail_id` resolvido para a URL real. Se o attachment não existir no XML, `featureImage` fica `null`.

---

## Fotos dentro do conteúdo

O campo `content` contém o HTML completo do post, incluindo todas as tags `<img>` com URLs do WordPress. Essas URLs **não são resolvidas nesta etapa** — o script `migrate-to-amplify.ts` varre o conteúdo com regex, faz download de cada imagem e substitui as URLs pelas URLs do S3 antes de salvar no DynamoDB.

---

## Categorias

O WordPress pode ou não ter categorias associadas aos posts. Caso existam, são extraídas das tags `<category>` de cada item.

Como os posts do Fitmass geralmente não têm categorias no XML, o `migrate-to-amplify.ts` infere a categoria automaticamente com base em palavras-chave encontradas no título, resumo e conteúdo:

| Categoria | Exemplos de palavras-chave |
|---|---|
| App | aplicativo, mobile, android, ios, download |
| Bioscan | bioscan, bioimpedância, composição corporal, massa muscular |
| Corporativo | empresa, parceria, franquia, white label, b2b |
| Estabelecimentos | academia, studio, clínica, gym, pilates |
| Pocket | pocket, portátil, atendimento domiciliar, mobilidade |
| Profissionais | personal trainer, nutricionista, educador físico, coach |
| Saúde | saúde, nutrição, bem-estar, exercício, qualidade de vida |
| Scanner | scanner, hardware, equipamento, sensor, calibração |
| System | sistema, plataforma, dashboard, relatório, integração |

A categoria com maior pontuação é escolhida. Se nenhuma atingir o limiar mínimo, o post recebe `['Saúde']` como padrão.

---

## Próximo passo: migrate-to-amplify.ts

Após gerar o JSON, execute a migração para AWS. Veja o guia completo em `scripts/migrate-to-amplify.md`.

```bash
npx tsx scripts/migrate-to-amplify.ts
```

O que acontece nessa etapa:

1. Autentica no Cognito com `ADMIN_EMAIL` + `ADMIN_PASSWORD`
2. Para cada post, verifica se o slug já existe no DynamoDB (idempotência)
3. Baixa a imagem de capa do WordPress e faz upload para o S3
4. Varre o HTML e migra todas as fotos inline para o S3, substituindo as URLs
5. Infere a categoria com base em palavras-chave
6. Cria o post no DynamoDB via AppSync com status `PUBLISHED`

Ambos os scripts são **idempotentes** — podem ser re-executados sem duplicar dados.
