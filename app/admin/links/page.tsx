import { redirect } from 'next/navigation'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { getSession } from '@/lib/session'
import { listAll } from '@/lib/list-all'
import LinksAdmin from './LinksAdmin'

export const metadata = { title: 'Links | Admin Fitmass' }

export default async function LinksAdminPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const client = generateServerClientUsingCookies<Schema>({ config: outputs, cookies })

  let rawCategories: Awaited<ReturnType<typeof client.models.LinkCategory.list>>['data'] = []
  let rawLinks: Awaited<ReturnType<typeof client.models.LinkItem.list>>['data'] = []

  try {
    ;[rawCategories, rawLinks] = await Promise.all([
      listAll((t) => client.models.LinkCategory.list({ nextToken: t, limit: 500 })),
      listAll((t) => client.models.LinkItem.list({ nextToken: t, limit: 500 })),
    ])
  } catch {
    // Models not yet deployed — show empty admin with seed button
  }

  const categories = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    order: c.order ?? 0,
    parentId: c.parentId ?? null,
    disabled: c.disabled ?? false,
    disabledLabel: c.disabledLabel ?? null,
  }))

  const links = rawLinks.map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    description: l.description ?? null,
    icon: l.icon ?? null,
    categoryId: l.categoryId,
    order: l.order ?? 0,
  }))

  return <LinksAdmin categories={categories} links={links} />
}
