import { NextRequest, NextResponse } from 'next/server'
import { bufferView } from '@/lib/views-buffer'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  await bufferView(slug)
  return NextResponse.json({ ok: true })
}
