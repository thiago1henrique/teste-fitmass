import type { Metadata } from 'next'
import { Encode_Sans } from 'next/font/google'
import { headers } from 'next/headers'
import Footer from './components/footer/Footer'
import CookieConsent from './components/CookieConsent'
import './globals.css'

const encodeSans = Encode_Sans({
  subsets: ['latin'],
  variable: '--font-encode-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Fitmass | Bioimpedância Profissional',
  description: 'Sistema de bioimpedância profissional para academias e profissionais de saúde.',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="pt-BR" className={encodeSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="flex min-h-screen flex-col font-body antialiased">
        <div className="flex-1">
          {children}
        </div>
        {!isAdmin && <Footer />}
        <CookieConsent />
      </body>
    </html>
  )
}
