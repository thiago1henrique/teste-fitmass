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

  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext    = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const name   = `${randomUUID()}.${ext}`

  if (s3) {
    const key = `uploads/${name}`
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    return NextResponse.json({ url })
  }

  // fallback: filesystem local (desenvolvimento)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, name), buffer)
  return NextResponse.json({ url: `/uploads/${name}` })
}
