import { getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth/server'
import { runWithAmplifyServerContext } from './amplify-server'
import { cookies } from 'next/headers'

export type SessionPayload = {
  userId: string
  email: string
  role: string
  name: string
}

export async function getSession(): Promise<SessionPayload | null> {
  return runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const [user, attributes, session] = await Promise.all([
          getCurrentUser(contextSpec),
          fetchUserAttributes(contextSpec),
          fetchAuthSession(contextSpec),
        ])

        if (!session.tokens) return null

        const groups =
          (session.tokens.accessToken.payload['cognito:groups'] as string[]) ?? []

        return {
          userId: user.userId,
          email: attributes.email ?? user.username,
          role: groups[0] ?? 'EDITOR',
          name: attributes.given_name ?? attributes.email ?? user.username,
        }
      } catch {
        return null
      }
    },
  })
}
