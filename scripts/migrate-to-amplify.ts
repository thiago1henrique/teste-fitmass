/**
 * Migração WordPress → Amplify (DynamoDB + S3)
 *
 * Lê json/posts_fitmass_completo.json, sobe as imagens no S3 e cria
 * os posts no DynamoDB via AppSync. Idempotente: slugs e chaves S3
 * já existentes são pulados/sobrescritos sem duplicar dados.
 *
 * Pré-requisitos: veja scripts/migrate-to-amplify.md
 */

import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'
import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import outputs from '../amplify_outputs.json'

config({ path: '.env.local' })

// ── Types ──────────────────────────────────────────────────────────────────

interface WpPost {
  title: string
  slug: string
  date: string
  featureImage?: string | null
  imageLinks?: string[]
  content: string
  categories?: string[]
}

// ── WP HTML cleanup ────────────────────────────────────────────────────────

function stripWpMarkup(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[\/?\w[\w-]*(?:\s[^\]]*?)?\]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractSummary(html: string): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= 200) return text
  const cut = text.slice(0, 200)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

// ── Category inference ─────────────────────────────────────────────────────

const PREDEFINED = ['Saúde', 'Bioimpedância', 'Fitness', 'Tecnologia'] as const
type Category = (typeof PREDEFINED)[number]

const KEYWORDS: Record<Category, string[]> = {
  Saúde: [
    'saúde', 'saudável', 'saudavel', 'nutrição', 'nutricao', 'nutriente',
    'alimentação', 'alimentacao', 'dieta', 'vitamina', 'mineral', 'proteína',
    'proteina', 'carboidrato', 'hidratação', 'hidratacao', 'sono', 'descanso',
    'bem-estar', 'bem estar', 'mental', 'imunidade', 'imune', 'doença',
    'doenca', 'prevenção', 'prevencao', 'longevidade', 'envelhecimento',
    'colesterol', 'glicose', 'pressão arterial', 'pressao arterial',
    'inflamação', 'inflamacao', 'metabolismo', 'hormônio', 'hormonio',
    'obesidade', 'emagrecimento', 'emagrecer', 'perda de peso',
    'estilo de vida', 'qualidade de vida', 'hábito', 'habito',
    'criança', 'crianca', 'infantil', 'idoso', 'gestante',
  ],
  Bioimpedância: [
    'bioimpedância', 'bioimpedancia', 'composição corporal', 'composicao corporal',
    'gordura corporal', 'percentual de gordura', 'massa muscular', 'massa magra',
    'massa gorda', 'massa óssea', 'massa ossea', 'massa corporal',
    'avaliação física', 'avaliacao fisica', 'avaliação corporal',
    'imc', 'índice de massa', 'indice de massa',
    'água corporal', 'agua corporal', 'hidratação corporal',
    'balança', 'balanca', 'medição', 'medicao', 'mensuração',
    'circunferência', 'circunferencia', 'dobra cutânea', 'dobra cutanea',
    'anamnese', 'protocolo de avaliação',
    'fitmass', 'white label', 'software de avaliação',
  ],
  Fitness: [
    'treino', 'treinamento', 'exercício', 'exercicio', 'academia',
    'musculação', 'musculacao', 'hipertrofia', 'força', 'forca',
    'cardio', 'aeróbico', 'aerobico', 'anaeróbico', 'anaerobico',
    'resistência', 'resistencia', 'funcional', 'crossfit', 'calistenia',
    'corrida', 'ciclismo', 'natação', 'natacao', 'esporte', 'atleta',
    'personal', 'coach', 'aquecimento', 'alongamento',
    'agachamento', 'supino', 'deadlift', 'levantamento',
    'série', 'serie', 'repetição', 'repeticao', 'carga', 'intervalo',
    'peito', 'costas', 'bíceps', 'biceps', 'tríceps', 'triceps',
    'ombro', 'perna', 'glúteo', 'gluteo', 'abdômen', 'abdomen',
    'queima de gordura', 'condicionamento', 'performance',
    'pré-treino', 'pre-treino', 'pós-treino', 'pos-treino',
    'frequência cardíaca', 'frequencia cardiaca', 'zona de treino',
    'branding fitness', 'academia fitness',
  ],
  Tecnologia: [
    'tecnologia', 'software', 'sistema', 'plataforma', 'aplicativo',
    'app', 'digital', 'inovação', 'inovacao', 'inteligência artificial',
    'inteligencia artificial', 'ia', 'dados', 'gestão', 'gestao',
    'automação', 'automacao', 'dashboard', 'relatório', 'relatorio',
    'api', 'integração', 'integracao', 'cloud', 'nuvem',
    'wearable', 'smartwatch', 'sensor', 'monitor',
    'machine learning', 'algoritmo', 'análise de dados', 'analise de dados',
    'digitalização', 'digitalizacao', 'transformação digital',
    'aplicação', 'aplicacao', 'ferramenta digital',
  ],
}

const FIELD_WEIGHT = { title: 6, summary: 3, content: 1 } as const
const SCORE_THRESHOLD = 4

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function inferCategories(title: string, summary: string, content: string): string[] {
  const fields = {
    title: normalize(title),
    summary: normalize(summary),
    content: normalize(stripHtml(content)),
  }

  const scores = PREDEFINED.map((cat) => {
    let total = 0
    for (const kw of KEYWORDS[cat]) {
      const nkw = normalize(kw)
      for (const [field, text] of Object.entries(fields) as [keyof typeof fields, string][]) {
        if (text.includes(nkw)) total += FIELD_WEIGHT[field]
      }
    }
    return { cat, total }
  })

  const best = scores.reduce((a, b) => (a.total >= b.total ? a : b))
  return best.total >= SCORE_THRESHOLD ? [best.cat] : ['Saúde', 'Fitness']
}

// ── Cognito auth ───────────────────────────────────────────────────────────

async function authenticate(): Promise<{ token: string; userId: string; authorName: string }> {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env.local')
  }

  const cognito = new CognitoIdentityProviderClient({ region: outputs.auth.aws_region })
  const result = await cognito.send(
    new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      UserPoolId: outputs.auth.user_pool_id,
      ClientId: outputs.auth.user_pool_client_id,
      AuthParameters: { USERNAME: email, PASSWORD: password },
    }),
  )

  // AppSync with Cognito User Pools auth requires the ID Token (contains cognito:groups)
  const idToken = result.AuthenticationResult?.IdToken
  if (!idToken) throw new Error('Token não retornado pelo Cognito')

  const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64url').toString()) as {
    sub: string
    given_name?: string
    email?: string
  }

  return {
    token: idToken,
    userId: payload.sub,
    authorName: payload.given_name ?? payload.email ?? email,
  }
}

// ── AppSync GraphQL ────────────────────────────────────────────────────────

async function gql<T>(
  headers: Record<string, string>,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(outputs.data.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ query, variables }),
  })
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] }
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '))
  return json.data as T
}

async function slugExists(slug: string): Promise<boolean> {
  const data = await gql<{ listPosts: { items: { id: string }[] } }>(
    { 'x-api-key': outputs.data.api_key },
    `query($slug: String!) {
      listPosts(filter: { slug: { eq: $slug } }) { items { id } }
    }`,
    { slug },
  )
  return data.listPosts.items.length > 0
}

async function createPost(
  token: string,
  input: {
    title: string
    slug: string
    summary: string
    content: string
    coverUrl?: string
    status: string
    publishedAt: string
    views: number
    categories: string[]
    authorId: string
    authorName: string
  },
): Promise<void> {
  await gql(
    { Authorization: token },
    `mutation($input: CreatePostInput!) { createPost(input: $input) { id } }`,
    { input },
  )
}

// ── S3 image upload ────────────────────────────────────────────────────────

const s3 = new S3Client({ region: outputs.storage.aws_region })
const BUCKET = outputs.storage.bucket_name
const WP_URL_RE = /https?:\/\/fitmass\.com\.br\/wp-content\/uploads\/[^"'\s)>]+/g

const MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml',
}

function wpUrlToS3Key(url: string): string {
  const filename = url.split('/').pop()!.split('?')[0]
  return `uploads/wp-${filename}`
}

function s3PublicUrl(key: string): string {
  return `https://${BUCKET}.s3.${outputs.storage.aws_region}.amazonaws.com/${key}`
}

async function uploadImage(url: string): Promise<string | null> {
  const key = wpUrlToS3Key(url)

  // Idempotency check — skip upload if key already exists
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }))
    return s3PublicUrl(key)
  } catch { /* not found, proceed */ }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    const ext = key.split('.').pop()?.toLowerCase() ?? 'jpg'
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: MIME[ext] ?? 'image/jpeg',
    }))
    return s3PublicUrl(key)
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

async function migrateContentImages(content: string): Promise<{ content: string; count: number }> {
  const urls = [...new Set(content.match(WP_URL_RE) ?? [])]
  let result = content
  let count = 0
  for (const url of urls) {
    const newUrl = await uploadImage(url)
    if (newUrl) {
      result = result.replaceAll(url, newUrl)
      count++
    }
  }
  return { content: result, count }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const filePath = join(process.cwd(), 'json', 'posts_fitmass_completo.json')
  const posts: WpPost[] = JSON.parse(readFileSync(filePath, 'utf-8'))

  console.log('→ Autenticando no Cognito…')
  const { token, userId, authorName } = await authenticate()
  console.log(`✔ Autenticado: ${process.env.ADMIN_EMAIL}\n`)
  console.log(`→ ${posts.length} posts encontrados\n`)

  let created = 0
  let skipped = 0
  let errors  = 0

  for (const post of posts) {
    if (!post.title || !post.slug || !post.content) {
      console.warn(`  ⚠ [skip] ${post.slug ?? '(sem slug)'} — dados incompletos`)
      skipped++
      continue
    }

    // Idempotency: skip if slug already in DynamoDB
    try {
      if (await slugExists(post.slug)) {
        console.log(`  ⚠ [skip] ${post.slug} — já existe`)
        skipped++
        continue
      }
    } catch (err) {
      console.error(`  ✗ [erro ao checar slug] ${post.slug}: ${String(err).split('\n')[0]}`)
      errors++
      continue
    }

    try {
      // 1. Upload featureImage → S3
      let coverUrl: string | undefined
      if (post.featureImage) {
        const uploaded = await uploadImage(post.featureImage)
        if (uploaded) {
          coverUrl = uploaded
          console.log(`  ✔ [capa] ${wpUrlToS3Key(post.featureImage)}`)
        } else {
          console.warn(`  ⚠ [capa falhou] ${post.featureImage}`)
        }
      }

      // 2. Strip WP markup + migrate inline images
      const cleanContent = stripWpMarkup(post.content)
      const { content: migratedContent, count: imgCount } = await migrateContentImages(cleanContent)
      if (imgCount > 0) console.log(`  ✔ [imgs] ${imgCount} imagem(ns) migrada(s)`)

      // 3. Summary + category
      const summary    = extractSummary(cleanContent)
      const categories = inferCategories(post.title, summary, migratedContent)
      const publishedAt = post.date ? new Date(post.date).toISOString() : new Date().toISOString()

      // 4. Create post in DynamoDB
      await createPost(token, {
        title: post.title,
        slug: post.slug,
        summary,
        content: migratedContent,
        ...(coverUrl ? { coverUrl } : {}),
        status: 'PUBLISHED',
        publishedAt,
        views: 0,
        categories,
        authorId: userId,
        authorName,
      })

      console.log(`  ✔ [post] ${post.slug} [${categories.join(', ')}]`)
      created++
    } catch (err) {
      console.error(`  ✗ [erro] ${post.slug}: ${String(err).split('\n')[0]}`)
      errors++
    }
  }

  console.log(`\n${'─'.repeat(40)}`)
  console.log(`✅ Migração concluída`)
  console.log(`   Criados  : ${created}`)
  console.log(`   Ignorados: ${skipped}`)
  console.log(`   Erros    : ${errors}`)
}

main().catch((err) => {
  console.error('\n❌ Erro fatal:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
