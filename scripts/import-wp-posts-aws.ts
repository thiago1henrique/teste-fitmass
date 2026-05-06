import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'
import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'

config({ path: '.env.local' })

const outputs = JSON.parse(
  readFileSync(join(process.cwd(), 'amplify_outputs.json'), 'utf-8')
)

const APPSYNC_URL: string = outputs.data.url
const USER_POOL_ID: string = outputs.auth.user_pool_id
const USER_POOL_CLIENT_ID: string = outputs.auth.user_pool_client_id
const AWS_REGION: string = outputs.auth.aws_region

interface WpPost {
  title: string
  slug: string
  date: string
  featureImage?: string | null
  content: string
  categories?: string[]
}

function stripWpComments(html: string): string {
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

function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split('.')[1]
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))
}

async function authenticate(
  email: string,
  password: string
): Promise<{ token: string; sub: string; name: string }> {
  const client = new CognitoIdentityProviderClient({ region: AWS_REGION })
  const command = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    UserPoolId: USER_POOL_ID,
    ClientId: USER_POOL_CLIENT_ID,
    AuthParameters: { USERNAME: email, PASSWORD: password },
  })

  const response = await client.send(command)
  if (!response.AuthenticationResult?.IdToken) {
    throw new Error('Autenticação falhou: token não retornado')
  }

  const token = response.AuthenticationResult.IdToken
  const payload = decodeJwtPayload(token)

  return {
    token,
    sub: payload.sub as string,
    name: ((payload.given_name ?? payload.email) as string) || 'Admin',
  }
}

async function graphql<T>(
  token: string,
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const response = await fetch(APPSYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ query, variables }),
  })

  const data = (await response.json()) as { data?: T; errors?: unknown[] }
  if (data.errors) throw new Error(JSON.stringify(data.errors))
  return data.data as T
}

async function findPostBySlug(token: string, slug: string): Promise<boolean> {
  const query = `
    query ListPosts($filter: ModelPostFilterInput) {
      listPosts(filter: $filter, limit: 1) {
        items { id }
      }
    }
  `
  const result = await graphql<{ listPosts: { items: { id: string }[] } }>(
    token,
    query,
    { filter: { slug: { eq: slug } } }
  )
  return result.listPosts.items.length > 0
}

async function createPost(token: string, input: Record<string, unknown>): Promise<string> {
  const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        id
        slug
      }
    }
  `
  const result = await graphql<{ createPost: { id: string; slug: string } }>(
    token,
    mutation,
    { input }
  )
  return result.createPost.id
}

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error(
      'Defina ADMIN_EMAIL e ADMIN_PASSWORD em .env.local\n' +
        'Estas devem ser credenciais de um usuário do grupo ADMIN no Cognito.'
    )
  }

  console.log('→ Autenticando no Cognito...')
  const { token, sub, name } = await authenticate(email, password)
  console.log(`✔ Autenticado como: ${email} (sub: ...${sub.slice(-8)})`)

  const filePath = join(process.cwd(), 'json', 'posts_fitmass_completo.json')
  const posts: WpPost[] = JSON.parse(readFileSync(filePath, 'utf-8'))
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

    const exists = await findPostBySlug(token, post.slug)
    if (exists) {
      console.log(`  → [já existe] ${post.slug}`)
      skipped++
      continue
    }

    const content = stripWpComments(post.content)
    const summary = extractSummary(content)
    const publishedAt = new Date(post.date || Date.now()).toISOString()

    try {
      const id = await createPost(token, {
        title: post.title,
        slug: post.slug,
        summary,
        content,
        coverUrl: post.featureImage ?? null,
        status: 'PUBLISHED',
        publishedAt,
        categories: post.categories?.length ? post.categories : ['Saúde', 'Fitness'],
        authorId: sub,
        authorName: name,
      })
      console.log(`  ✔ [${id.slice(-6)}] ${post.slug}`)
      created++
    } catch (err) {
      console.error(`  ✗ ${post.slug}: ${String(err).split('\n')[0]}`)
      errors++
    }
  }

  console.log(`\n✅ Importação concluída`)
  console.log(`   Criados  : ${created}`)
  console.log(`   Ignorados: ${skipped}`)
  console.log(`   Erros    : ${errors}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
