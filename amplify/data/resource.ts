import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Post: a
    .model({
      title:      a.string().required(),
      slug:       a.string().required(),
      summary:    a.string().required(),
      content:    a.string().required(),
      coverUrl:   a.string(),
      status:     a.enum(['DRAFT', 'PUBLISHED']),
      publishedAt: a.datetime(),
      views:      a.integer().default(0),
      categories: a.string().array(),
      authorId:   a.string().required(),
      authorName: a.string().required(),
    })
    .authorization((allow) => [
      allow.groups(['ADMIN', 'EDITOR']),
      allow.guest().to(['read']),
      // update intentionally removed — view counting must use a backend-only resolver
      allow.publicApiKey().to(['read']),
    ]),

  LinkCategory: a
    .model({
      name:          a.string().required(),
      order:         a.integer().required(),
      parentId:      a.string(),
      hasTabs:       a.boolean(),
      disabled:      a.boolean(),
      disabledLabel: a.string(),
    })
    .authorization((allow) => [
      allow.groups(['ADMIN', 'EDITOR']),
      allow.guest().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  LinkItem: a
    .model({
      title:       a.string().required(),
      url:         a.string().required(),
      description: a.string(),
      icon:        a.string(),
      categoryId:  a.string().required(),
      order:       a.integer().required(),
      disabled:    a.boolean(),
    })
    .authorization((allow) => [
      allow.groups(['ADMIN', 'EDITOR']),
      allow.guest().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  ChatQuestion: a
    .model({
      question:    a.string().required(),
      answer:      a.string(),
      actionType:  a.enum(['ANSWER', 'WHATSAPP']),
      whatsappMsg: a.string(),
      order:       a.integer().required(),
      active:      a.boolean().default(true),
    })
    .authorization((allow) => [
      allow.groups(['ADMIN', 'EDITOR']),
      allow.guest().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: { expiresInDays: 7 },
  },
})
