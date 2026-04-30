/**
 * Baixa imagens do WordPress e sobe para o S3 do Amplify.
 * Salva mapeamento em json/image-map.json (idempotente: pula o que já foi enviado).
 *
 * Pré-requisitos em .env.local:
 *   AWS_ACCESS_KEY_ID=...
 *   AWS_SECRET_ACCESS_KEY=...
 */
import { config } from 'dotenv'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

config({ path: '.env.local' })

const outputs = JSON.parse(
  readFileSync(join(process.cwd(), 'amplify_outputs.json'), 'utf-8')
)

const BUCKET: string = outputs.storage.bucket_name
const REGION: string = outputs.storage.aws_region
const MAP_PATH = join(process.cwd(), 'json', 'image-map.json')
const CONCURRENCY = 5

const s3 = new S3Client({ region: REGION })

// ---- helpers ----------------------------------------------------------------

function loadMap(): Record<string, string> {
  return existsSync(MAP_PATH) ? JSON.parse(readFileSync(MAP_PATH, 'utf-8')) : {}
}

function saveMap(map: Record<string, string>) {
  writeFileSync(MAP_PATH, JSON.stringify(map, null, 2))
}

function s3Url(key: string): string {
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`
}

function keyFromUrl(url: string): string {
  const name = basename(new URL(url).pathname)
  return `uploads/${name}`
}

function mimeFromExt(url: string): string {
  const ext = extname(url).toLowerCase().replace('.', '')
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
    avif: 'image/avif',
  }
  return map[ext] ?? 'application/octet-stream'
}

async function alreadyInS3(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }))
    return true
  } catch {
    return false
  }
}

async function downloadAndUpload(url: string): Promise<string> {
  const key = keyFromUrl(url)

  if (await alreadyInS3(key)) return s3Url(key)

  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const body = Buffer.from(await res.arrayBuffer())
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: mimeFromExt(url),
    })
  )
  return s3Url(key)
}

async function runPool<T>(
  items: T[],
  fn: (item: T, index: number) => Promise<void>,
  concurrency: number
) {
  let i = 0
  const next = async (): Promise<void> => {
    if (i >= items.length) return
    const idx = i++
    await fn(items[idx], idx)
    await next()
  }
  await Promise.all(Array.from({ length: concurrency }, next))
}

// ---- main -------------------------------------------------------------------

async function main() {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error(
      'Adicione ao .env.local:\n  AWS_ACCESS_KEY_ID=...\n  AWS_SECRET_ACCESS_KEY=...'
    )
  }

  const posts = JSON.parse(
    readFileSync(join(process.cwd(), 'json', 'posts_fitmass_completo.json'), 'utf-8')
  ) as Array<{ featureImage?: string | null; imageLinks?: string[]; content: string }>

  // Coletar todas as URLs únicas do JSON
  const allUrls = new Set<string>()
  for (const post of posts) {
    if (post.featureImage) allUrls.add(post.featureImage)
    post.imageLinks?.forEach((u) => allUrls.add(u))

    // URLs embutidas no HTML do content
    const matches = post.content.matchAll(/https?:\/\/fitmass\.com\.br\/wp-content\/uploads\/[^"'\s>)]+/g)
    for (const m of matches) allUrls.add(m[0])
  }

  const urls = Array.from(allUrls)
  const map = loadMap()
  const pending = urls.filter((u) => !map[u])

  console.log(`→ Total de imagens únicas: ${urls.length}`)
  console.log(`→ Já enviadas (cache):     ${urls.length - pending.length}`)
  console.log(`→ Para enviar agora:       ${pending.length}\n`)

  if (pending.length === 0) {
    console.log('✅ Todas as imagens já estão no S3.')
    return
  }

  let done = 0
  let errors = 0

  await runPool(
    pending,
    async (url, i) => {
      try {
        const s3url = await downloadAndUpload(url)
        map[url] = s3url
        done++
        if (done % 10 === 0 || done === pending.length) {
          saveMap(map)
          process.stdout.write(`\r  ✔ ${done}/${pending.length} enviadas  `)
        }
      } catch (err) {
        errors++
        console.error(`\n  ✗ [${i + 1}] ${basename(url)}: ${String(err).split('\n')[0]}`)
      }
    },
    CONCURRENCY
  )

  saveMap(map)

  console.log(`\n\n✅ Concluído`)
  console.log(`   Enviadas: ${done}`)
  console.log(`   Erros   : ${errors}`)
  console.log(`   Mapa salvo em: json/image-map.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
