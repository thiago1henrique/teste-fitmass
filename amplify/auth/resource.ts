import { defineAuth } from '@aws-amplify/backend'

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['ADMIN', 'EDITOR'],
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false,
    },
    givenName: {
      mutable: true,
      required: true,
    },
  },
})
