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
      allow.publicApiKey().to(['read', 'update']),
    ]),
})

export type Schema = typeof schema

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
})
