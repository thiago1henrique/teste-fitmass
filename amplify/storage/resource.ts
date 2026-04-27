import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
  name: 'fitmassUploads',
  access: (allow) => ({
    'uploads/*': [
      allow.guest.to(['read']),
      allow.groups(['ADMIN', 'EDITOR']).to(['read', 'write', 'delete']),
    ],
  }),
})
