'use server'

import { revalidatePath } from 'next/cache'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { requireSession } from '@/lib/auth-utils'
import { listAll } from '@/lib/list-all'

function getClient() {
  return generateServerClientUsingCookies<Schema>({ config: outputs, cookies })
}

function invalidate() {
  revalidatePath('/links')
  revalidatePath('/admin/links')
}

const NOT_DEPLOYED = { error: 'Os modelos ainda não foram deployados. Execute "npx ampx sandbox" e aguarde a conclusão.' }

function checkModels(client: ReturnType<typeof getClient>) {
  if (!client.models.LinkCategory || !client.models.LinkItem) return NOT_DEPLOYED
  return null
}

// ── LinkCategory ──────────────────────────────────────────────────────────────

export async function createLinkCategory(formData: FormData) {
  await requireSession()
  const name          = (formData.get('name') as string)?.trim()
  const order         = parseInt(formData.get('order') as string) || 0
  const parentId      = (formData.get('parentId') as string)?.trim() || undefined
  const hasTabs       = formData.get('hasTabs') === 'true'
  const disabled      = formData.get('disabled') === 'true'
  const disabledLabel = (formData.get('disabledLabel') as string)?.trim() || undefined

  if (!name) return { error: 'Nome é obrigatório.' }

  const client = getClient()
  const guard = checkModels(client)
  if (guard) return guard

  await client.models.LinkCategory.create({
    name, order, parentId,
    hasTabs: hasTabs || undefined,
    disabled: disabled || undefined,
    disabledLabel,
  })
  invalidate()
}

export async function updateLinkCategory(id: string, formData: FormData) {
  await requireSession()
  const name          = (formData.get('name') as string)?.trim()
  const order         = parseInt(formData.get('order') as string) || 0
  const parentId      = (formData.get('parentId') as string)?.trim() || undefined
  const hasTabs       = formData.get('hasTabs') === 'true'
  const disabled      = formData.get('disabled') === 'true'
  const disabledLabel = (formData.get('disabledLabel') as string)?.trim() || undefined

  if (!name) return { error: 'Nome é obrigatório.' }

  const client = getClient()
  const guard = checkModels(client)
  if (guard) return guard

  await client.models.LinkCategory.update({ id, name, order, parentId, hasTabs, disabled, disabledLabel })
  invalidate()
}

export async function deleteLinkCategory(id: string) {
  await requireSession()
  const client = getClient()
  const guard = checkModels(client)
  if (guard) return guard

  // Cascade: sub-tabs → their links
  const subTabs = await listAll((t) =>
    client.models.LinkCategory.list({ filter: { parentId: { eq: id } }, nextToken: t })
  )
  for (const sub of subTabs) {
    const subLinks = await listAll((t) =>
      client.models.LinkItem.list({ filter: { categoryId: { eq: sub.id } }, nextToken: t })
    )
    await Promise.all(subLinks.map((l) => client.models.LinkItem.delete({ id: l.id })))
    await client.models.LinkCategory.delete({ id: sub.id })
  }

  // Cascade: direct links
  const directLinks = await listAll((t) =>
    client.models.LinkItem.list({ filter: { categoryId: { eq: id } }, nextToken: t })
  )
  await Promise.all(directLinks.map((l) => client.models.LinkItem.delete({ id: l.id })))

  await client.models.LinkCategory.delete({ id })
  invalidate()
}

// ── LinkItem ──────────────────────────────────────────────────────────────────

export async function createLinkItem(formData: FormData) {
  await requireSession()
  const title       = (formData.get('title') as string)?.trim()
  const url         = (formData.get('url') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || undefined
  const icon        = (formData.get('icon') as string)?.trim() || undefined
  const categoryId  = (formData.get('categoryId') as string)?.trim()
  const order       = parseInt(formData.get('order') as string) || 0

  if (!title || !url || !categoryId) return { error: 'Título, URL e categoria são obrigatórios.' }

  const client = getClient()
  const guard = checkModels(client)
  if (guard) return guard

  await client.models.LinkItem.create({ title, url, description, icon, categoryId, order })
  invalidate()
}

export async function updateLinkItem(id: string, formData: FormData) {
  await requireSession()
  const title       = (formData.get('title') as string)?.trim()
  const url         = (formData.get('url') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || undefined
  const icon        = (formData.get('icon') as string)?.trim() || undefined
  const categoryId  = (formData.get('categoryId') as string)?.trim()
  const order       = parseInt(formData.get('order') as string) || 0

  if (!title || !url || !categoryId) return { error: 'Título, URL e categoria são obrigatórios.' }

  const client = getClient()
  const guard = checkModels(client)
  if (guard) return guard

  await client.models.LinkItem.update({ id, title, url, description, icon, categoryId, order })
  invalidate()
}

export async function deleteLinkItem(id: string) {
  await requireSession()
  const client = getClient()
  const guard = checkModels(client)
  if (guard) return guard

  await client.models.LinkItem.delete({ id })
  invalidate()
}

export async function reorderLinkItems(categoryId: string, orderedIds: string[]) {
  await requireSession()
  const client = getClient()
  const guard = checkModels(client)
  if (guard) return guard

  await Promise.all(
    orderedIds.map((id, order) => client.models.LinkItem.update({ id, order }))
  )
  invalidate()
}

export async function toggleLinkItemDisabled(id: string, disabled: boolean) {
  await requireSession()
  const client = getClient()
  const guard = checkModels(client)
  if (guard) return guard

  await client.models.LinkItem.update({ id, disabled })
  invalidate()
}

export async function moveLinkItem(id: string, direction: 'up' | 'down') {
  await requireSession()
  const client = getClient()
  const guard = checkModels(client)
  if (guard) return guard

  const { data: item } = await client.models.LinkItem.get({ id })
  if (!item) return { error: 'Link não encontrado.' }

  const siblings = await listAll((t) =>
    client.models.LinkItem.list({ filter: { categoryId: { eq: item.categoryId } }, nextToken: t })
  )
  const sorted = siblings.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const idx = sorted.findIndex((l) => l.id === id)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= sorted.length) return

  const swap = sorted[swapIdx]
  await Promise.all([
    client.models.LinkItem.update({ id, order: swap.order ?? 0 }),
    client.models.LinkItem.update({ id: swap.id, order: item.order ?? 0 }),
  ])
  invalidate()
}

// ── Seed ──────────────────────────────────────────────────────────────────────

export async function seedDefaultLinks() {
  await requireSession()
  const client = getClient()

  if (!client.models.LinkCategory || !client.models.LinkItem) {
    return { error: 'Os modelos ainda não foram deployados. Execute "npx ampx sandbox" e aguarde a conclusão.' }
  }

  // Guard: skip if categories already exist
  const existing = await listAll((t) =>
    client.models.LinkCategory.list({ nextToken: t, limit: 10 })
  )
  if (existing.length > 0) return { error: 'Já existem categorias cadastradas.' }

  // 1. Top-level categories
  const [redes, apps] = await Promise.all([
    client.models.LinkCategory.create({ name: 'Redes Sociais', order: 0, hasTabs: false }),
    client.models.LinkCategory.create({ name: 'Aplicativos',   order: 1, hasTabs: true }),
  ])

  const redesId = redes.data!.id
  const appsId  = apps.data!.id

  // 2. Sub-tabs within Aplicativos
  const [fitmassApp, fitmassSystem] = await Promise.all([
    client.models.LinkCategory.create({ name: 'Fitmass App',    order: 0, parentId: appsId }),
    client.models.LinkCategory.create({ name: 'Fitmass System', order: 1, parentId: appsId, disabled: true, disabledLabel: 'Em breve' }),
  ])

  const fitmassAppId = fitmassApp.data!.id
  void fitmassSystem

  // 3. Links under Redes Sociais
  await Promise.all([
    client.models.LinkItem.create({ title: 'Site Fitmass',       url: 'https://fitmass.com.br/',                                                                                                                                                                                                                                                       description: 'Conheça a Fitmass',                    icon: 'fitmass',   categoryId: redesId,      order: 0 }),
    client.models.LinkItem.create({ title: 'Instagram',           url: 'https://www.instagram.com/fitmass.tech/',                                                                                                                                                                                                                                        description: 'Siga a Fitmass no Instagram',           icon: 'instagram', categoryId: redesId,      order: 1 }),
    client.models.LinkItem.create({ title: 'YouTube',             url: 'https://www.youtube.com/@fitmass791/videos',                                                                                                                                                                                                                                     description: 'Assista nossos vídeos no YouTube',      icon: 'youtube',   categoryId: redesId,      order: 2 }),
    client.models.LinkItem.create({ title: 'Whatsapp Comercial',  url: 'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+Instagram+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+o+Fitmass&type=phone_number&app_absent=0', description: 'Fale com nosso time comercial', icon: 'whatsapp',  categoryId: redesId,      order: 3 }),
    client.models.LinkItem.create({ title: 'Whatsapp Suporte',    url: 'https://api.whatsapp.com/send/?phone=5541991197018&text=Ol%C3%A1%2C+vim+do+Instagram+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+o+Fitmass&type=phone_number&app_absent=0', description: 'Fale com nosso suporte',         icon: 'whatsapp',  categoryId: redesId,      order: 4 }),
    client.models.LinkItem.create({ title: 'Facebook',            url: 'https://www.facebook.com/fitmass.tech/',                                                                                                                                                                                                                                        description: 'Curta a página da Fitmass no Facebook', icon: 'facebook',  categoryId: redesId,      order: 5 }),
  ])

  // 4. Links under Fitmass App tab
  await Promise.all([
    client.models.LinkItem.create({ title: 'Baixe pela Play Store', url: 'https://play.google.com/store/apps/details?id=br.com.fitmass&pcampaignid=web_share&pli=1', description: 'Disponível para Android', icon: 'playstore', categoryId: fitmassAppId, order: 0 }),
    client.models.LinkItem.create({ title: 'Baixe pela App Store',  url: 'https://apps.apple.com/br/app/fitmass-app/id1528425505',                                   description: 'Disponível para iPhone',  icon: 'appstore',  categoryId: fitmassAppId, order: 1 }),
  ])

  invalidate()
}
