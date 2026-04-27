import { config } from 'dotenv'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, PostStatus } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

config({ path: '.env.local' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

interface WpPost {
  title: string
  slug: string
  date: string
  featureImage?: string | null
  imageLinks?: string[]
  content: string
  categories?: string[]
}

// Strip WordPress block comments and shortcodes like [bc_random_banner], [gallery ...], etc.
function stripWpComments(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[\/?\w[\w-]*(?:\s[^\]]*?)?\]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Extract plain-text summary from HTML (first ~200 chars)
function extractSummary(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= 200) return text
  const cut = text.slice(0, 200)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

// Fix existing posts in the DB without re-reading the JSON:
// 1. Strip leftover WordPress shortcodes from content
// 2. Assign default categories to posts that have none (or only the old lowercase values)
async function cleanExistingPosts() {
  const posts = await prisma.post.findMany({
    select: { id: true, content: true, categories: true },
  })

  let contentFixed = 0
  let catFixed = 0

  for (const post of posts) {
    const updates: { content?: string; categories?: string[] } = {}

    const cleaned = stripWpComments(post.content)
    if (cleaned !== post.content) {
      updates.content = cleaned
      contentFixed++
    }

    const needsCat =
      post.categories.length === 0 ||
      post.categories.every((c) => c === c.toLowerCase())
    if (needsCat) {
      updates.categories = ['Saúde', 'Fitness']
      catFixed++
    }

    if (Object.keys(updates).length > 0) {
      await prisma.post.update({ where: { id: post.id }, data: updates })
    }
  }

  if (contentFixed > 0) console.log(`   Shortcodes removidos: ${contentFixed} posts`)
  if (catFixed > 0)    console.log(`   Categorias corrigidas: ${catFixed} posts`)
}

async function main() {
  const filePath = join(process.cwd(), 'json', 'posts_fitmass_completo.json')
  const posts: WpPost[] = JSON.parse(readFileSync(filePath, 'utf-8'))

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (!admin) {
    throw new Error('Nenhum usuário ADMIN encontrado. Execute: npx prisma db seed')
  }

  console.log(`✔ Admin: ${admin.email}`)
  console.log(`→ ${posts.length} posts encontrados\n`)

  let created = 0
  let skipped = 0
  let errors = 0

  for (const post of posts) {
    if (!post.title || !post.slug || !post.content) {
      console.warn(`  ⚠ Ignorado (dados incompletos): ${post.slug ?? '(sem slug)'}`)
      skipped++
      continue
    }

    const content = stripWpComments(post.content)
    const summary = extractSummary(content)
    const publishedAt = post.date ? new Date(post.date) : new Date()

    try {
      const result = await prisma.post.upsert({
        where: { slug: post.slug },
        update: {},
        create: {
          title: post.title,
          slug: post.slug,
          summary,
          content,
          coverUrl: post.featureImage ?? null,
          status: PostStatus.PUBLISHED,
          publishedAt,
          createdAt: publishedAt,
          categories: post.categories?.length ? post.categories : ['Saúde', 'Fitness'],
          authorId: admin.id,
        },
      })
      console.log(`  ✔ [${result.id.slice(-6)}] ${post.slug}`)
      created++
    } catch (err) {
      console.error(`  ✗ ${post.slug}: ${String(err).split('\n')[0]}`)
      errors++
    }
  }

  await cleanExistingPosts()

  console.log(`\n✅ Importação concluída`)
  console.log(`   Criados  : ${created}`)
  console.log(`   Ignorados: ${skipped}`)
  console.log(`   Erros    : ${errors}`)
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
