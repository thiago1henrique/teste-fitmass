import { type NextRequest, NextResponse } from 'next/server'

// Proxy external images through the server so the canvas doesn't get tainted by CORS.
// Only fetches actual image content-types; rejects anything else.
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url')
  if (!raw) {
    return new NextResponse('Missing url', { status: 400 })
  }

  let target: URL
  try {
    target = new URL(raw)
  } catch {
    return new NextResponse('Invalid URL', { status: 400 })
  }

  if (target.protocol !== 'https:' && target.protocol !== 'http:') {
    return new NextResponse('Only HTTP/HTTPS allowed', { status: 400 })
  }

  let response: Response
  try {
    response = await fetch(target.toString(), {
      headers: { 'User-Agent': 'Fitmass-ImageProxy/1.0' },
      // Abort after 10 s
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return new NextResponse('Failed to fetch remote image', { status: 502 })
  }

  if (!response.ok) {
    return new NextResponse(`Remote returned ${response.status}`, { status: 502 })
  }

  const ct = response.headers.get('content-type') ?? ''
  if (!ct.startsWith('image/') && !ct.startsWith('application/octet-stream')) {
    return new NextResponse('Not an image', { status: 400 })
  }

  const buffer = await response.arrayBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': ct || 'image/jpeg',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
