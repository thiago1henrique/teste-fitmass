import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchAuthSession } from 'aws-amplify/auth/server'
import { runWithAmplifyServerContext } from '@/lib/amplify-server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const response = NextResponse.next({ request: { headers: requestHeaders } })

    const authenticated = await runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec)
          return !!session.tokens
        } catch {
          return false
        }
      },
    })

    if (!authenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
