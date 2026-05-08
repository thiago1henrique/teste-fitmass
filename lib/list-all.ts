export async function listAll<T>(
  listFn: (nextToken?: string) => Promise<{ data: T[]; nextToken?: string | null }>
): Promise<T[]> {
  const items: T[] = []
  let nextToken: string | undefined
  do {
    const result = await listFn(nextToken)
    items.push(...result.data)
    nextToken = result.nextToken ?? undefined
  } while (nextToken)
  return items
}
