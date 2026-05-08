import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSession } from '@/lib/session'
import { checkRateLimit } from '@/lib/rate-limit'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

const s3Configured = !!(process.env.AWS_S3_BUCKET && process.env.AWS_REGION)
const s3 = s3Configured
  ? new S3Client({ region: process.env.AWS_REGION })
  : null

async function toWebP(buffer: Buffer, mimeType: string): Promise<{ data: Buffer; mime: string }> {
  // SVG and GIF are kept as-is
  if (mimeType === 'image/svg+xml' || mimeType === 'image/gif') {
    return { data: buffer, mime: mimeType }
  }
  try {
    // Dynamic import so a missing/incompatible binary never crashes the module at load time
    const sharp = (await import('sharp')).default
    const data = await sharp(buffer).webp({ quality: 85 }).toBuffer()
    return { data, mime: 'image/webp' }
  } catch {
    // sharp unavailable (e.g. binary mismatch on Lambda) — keep original format
    return { data: buffer, mime: mimeType }
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  if (!checkRateLimit(`upload:${session.userId}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Muitos uploads. Aguarde um momento.' }, { status: 429 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })

  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: 'Arquivo muito grande (máx. 5 MB)' }, { status: 400 })

  const rawBuffer = Buffer.from(await file.arrayBuffer())
  const { data: buffer, mime } = await toWebP(rawBuffer, file.type)

  const ext  = mime === 'image/webp' ? 'webp' : (file.name.split('.').pop()?.toLowerCase() ?? 'bin')
  const name = `${randomUUID()}.${ext}`

  if (s3) {
    const key = `site/uploads/${name}`
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: mime,
    }))
    const url = process.env.AWS_S3_PUBLIC_URL
      ? `${process.env.AWS_S3_PUBLIC_URL.replace(/\/$/, '')}/${key}`
      : `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    return NextResponse.json({ url })
  }

  // fallback: filesystem local (desenvolvimento)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, name), buffer)
  return NextResponse.json({ url: `/uploads/${name}` })
}
