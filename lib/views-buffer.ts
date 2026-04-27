import { prisma } from './prisma'

const buffer = new Map<string, number>()
let flushTimer: ReturnType<typeof setTimeout> | null = null

const DEBOUNCE_MS = 5_000
const MAX_SLUGS = 50

export function bufferView(slug: string): void {
  buffer.set(slug, (buffer.get(slug) ?? 0) + 1)

  if (buffer.size >= MAX_SLUGS) {
    if (flushTimer) clearTimeout(flushTimer)
    flushTimer = setTimeout(flush, 0)
  } else {
    if (flushTimer) clearTimeout(flushTimer)
    flushTimer = setTimeout(flush, DEBOUNCE_MS)
  }
}

async function flush(): Promise<void> {
  if (buffer.size === 0) return
  flushTimer = null

  const snapshot = new Map(buffer)
  buffer.clear()

  try {
    await Promise.all(
      Array.from(snapshot.entries()).map(([slug, count]) =>
        prisma.post.updateMany({
          where: { slug, status: 'PUBLISHED' },
          data: { views: { increment: count } },
        }),
      ),
    )
  } catch (err) {
    console.error('[views-buffer] flush failed:', err)
  }
}
