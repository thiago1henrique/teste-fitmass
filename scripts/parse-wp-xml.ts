/**
 * parse-wp-xml.ts
 *
 * Converte o export WordPress (WXR .xml) em json/posts_fitmass_completo.json
 * no formato esperado por scripts/migrate-to-amplify.ts.
 *
 * Extrai por post: título, slug, data, autor (dc:creator → display name),
 * imagem de capa (featureImage) e conteúdo HTML com todas as fotos inline.
 * Usa SAX streaming — não carrega o arquivo inteiro na memória.
 *
 * Uso:
 *   npx tsx scripts/parse-wp-xml.ts [caminho-do-xml]
 *   npx tsx scripts/parse-wp-xml.ts xml/fitmass.WordPress.2026-05-08.xml
 */

import sax from 'sax'
import { createReadStream, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// ── Tipos ──────────────────────────────────────────────────────────────────

/** Formato consumido por migrate-to-amplify.ts */
export interface WpPost {
  title: string
  slug: string
  date: string
  authorName: string
  featureImage?: string | null
  content: string
  categories: string[]
}

interface RawItem {
  title: string
  slug: string
  date: string
  status: string
  postType: string
  postId: string
  attachmentUrl: string
  content: string
  thumbnailId: string
  authorLogin: string
  categories: string[]
  currentMetaKey: string
}

// ── Parser SAX ─────────────────────────────────────────────────────────────

async function parseXML(filePath: string): Promise<WpPost[]> {
  return new Promise((resolve, reject) => {
    // strict=true: case-sensitive, sem namespace expansion (nomes ficam "wp:post_name" etc.)
    const parser = sax.createStream(true)

    // Mapa attachment_id → URL (para resolver imagens de capa)
    const attachments = new Map<string, string>()

    // Mapa wp:author_login → wp:author_display_name (coletado fora dos <item>s)
    const authorMap = new Map<string, string>()

    const rawPosts: (Omit<WpPost, 'authorName'> & {
      _thumbnailId?: string
      _authorLogin?: string
    })[] = []

    let inItem = false
    let inWpAuthor = false
    let inPostMeta = false
    let currentText = ''
    let item: Partial<RawItem> = {}
    let channelAuthor: { login?: string; displayName?: string } = {}
    let processed = 0

    parser.on('opentag', (node) => {
      currentText = ''

      if (node.name === 'item') {
        inItem = true
        item = { categories: [] }
        return
      }

      if (!inItem) {
        // Tags no nível do canal (fora de <item>)
        if (node.name === 'wp:author') {
          inWpAuthor = true
          channelAuthor = {}
        }
        return
      }

      // Dentro de <item>
      if (node.name === 'wp:postmeta') {
        inPostMeta = true
        item.currentMetaKey = ''
      }
    })

    parser.on('text', (t) => { currentText += t })
    parser.on('cdata', (cd) => { currentText += cd })

    parser.on('closetag', (tagName) => {
      const text = currentText.trim()
      currentText = ''

      // ── Nível de canal: monta mapa de autores ─────────────────────────
      if (!inItem) {
        if (tagName === 'wp:author') {
          if (channelAuthor.login) {
            authorMap.set(channelAuthor.login, channelAuthor.displayName ?? channelAuthor.login)
          }
          inWpAuthor = false
          channelAuthor = {}
        } else if (inWpAuthor) {
          if (tagName === 'wp:author_login') channelAuthor.login = text
          else if (tagName === 'wp:author_display_name') channelAuthor.displayName = text
        }
        return
      }

      // ── Fechamento do item ────────────────────────────────────────────
      if (tagName === 'item') {
        inItem = false
        inPostMeta = false

        if (item.postType === 'attachment' && item.postId && item.attachmentUrl) {
          attachments.set(item.postId, item.attachmentUrl)
        } else if (
          item.postType === 'post' &&
          item.status === 'publish' &&
          item.title &&
          item.slug &&
          item.content
        ) {
          rawPosts.push({
            title: item.title,
            slug: item.slug,
            date: item.date ?? '',
            content: item.content,
            categories: item.categories ?? [],
            _thumbnailId: item.thumbnailId,
            _authorLogin: item.authorLogin,
          })
          processed++
          if (processed % 10 === 0) process.stdout.write(`  … ${processed} posts lidos\r`)
        }

        item = {}
        return
      }

      // ── Fim de bloco wp:postmeta ──────────────────────────────────────
      if (tagName === 'wp:postmeta') {
        inPostMeta = false
        return
      }

      // ── Campos do item ────────────────────────────────────────────────
      switch (tagName) {
        case 'title':
          if (!item.title) item.title = text
          break
        case 'wp:post_name':
          item.slug = text
          break
        case 'wp:post_date':
          // Ignora "0000-00-00 00:00:00" (posts sem data definida)
          if (text && !text.startsWith('0000')) item.date = text
          break
        case 'wp:status':
          item.status = text
          break
        case 'wp:post_type':
          item.postType = text
          break
        case 'wp:post_id':
          item.postId = text
          break
        case 'wp:attachment_url':
          item.attachmentUrl = text
          break
        case 'content:encoded':
          item.content = text
          break
        case 'dc:creator':
          item.authorLogin = text
          break
        case 'wp:meta_key':
          if (inPostMeta) item.currentMetaKey = text
          break
        case 'wp:meta_value':
          if (inPostMeta && item.currentMetaKey === '_thumbnail_id' && text) {
            item.thumbnailId = text
          }
          break
        case 'category':
          // <category domain="category" nicename="slug">Nome</category>
          if (text && item.categories && !item.categories.includes(text)) {
            item.categories.push(text)
          }
          break
      }
    })

    parser.on('error', (err) => reject(err))

    parser.on('end', () => {
      process.stdout.write('\n')

      // Resolve thumbnail IDs para URLs reais + autor login → display name
      const posts: WpPost[] = rawPosts.map(({ _thumbnailId, _authorLogin, ...rest }) => ({
        ...rest,
        featureImage: _thumbnailId
          ? (attachments.get(_thumbnailId) ?? null)
          : null,
        authorName: _authorLogin
          ? (authorMap.get(_authorLogin) ?? _authorLogin)
          : 'Fitmass',
      }))

      resolve(posts)
    })

    createReadStream(filePath).pipe(parser)
  })
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const xmlPath =
    process.argv[2] ??
    join(process.cwd(), 'xml', 'fitmass.WordPress.2026-05-08.xml')

  if (!existsSync(xmlPath)) {
    console.error(`❌ Arquivo não encontrado: ${xmlPath}`)
    process.exit(1)
  }

  console.log(`→ Lendo ${xmlPath}…`)
  const posts = await parseXML(xmlPath)

  const outDir = join(process.cwd(), 'json')
  if (!existsSync(outDir)) mkdirSync(outDir)

  const outPath = join(outDir, 'posts_fitmass_completo.json')
  writeFileSync(outPath, JSON.stringify(posts, null, 2), 'utf-8')

  const withCover = posts.filter((p) => p.featureImage).length
  const authors   = [...new Set(posts.map((p) => p.authorName))].join(', ')

  console.log(`\n✅ ${posts.length} posts exportados → ${outPath}`)
  console.log(`   Com imagem de capa : ${withCover}`)
  console.log(`   Sem imagem de capa : ${posts.length - withCover}`)
  console.log(`   Autores encontrados: ${authors || '(nenhum)'}`)
  console.log(`\n→ Próximo passo:`)
  console.log(`   npx tsx scripts/migrate-to-amplify.ts`)
}

main().catch((err) => {
  console.error('\n❌ Erro fatal:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
