import type { Metadata } from 'next'
import { Encode_Sans } from 'next/font/google'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import Script from 'next/script'
import Footer from './components/footer/Footer'
import CookieConsent from './components/CookieConsent'
import ConfigureAmplify from './components/ConfigureAmplify'
import ConsoleArt from './components/ConsoleArt'
import { GoogleTagManager } from '@next/third-parties/google'
import './globals.css'

const encodeSans = Encode_Sans({
  subsets: ['latin'],
  variable: '--font-encode-sans',
  display: 'fallback',
  preload: false,
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Fitmass | Bioimpedância Profissional',
    template: '%s | Fitmass',
  },
  description: 'Sistema de bioimpedância profissional para academias e profissionais de saúde.',
  metadataBase: new URL('https://fitmass.com.br'),
  openGraph: {
    siteName: 'Fitmass',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@fitmass',
  },
  robots: { index: true, follow: true },
}

async function isAdminRoute() {
  const h = await headers()
  return (h.get('x-pathname') ?? '').startsWith('/admin')
}

async function PublicScripts() {
  if (await isAdminRoute()) return null
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  return (
    <>
      {gtmId && (
        <>
          {/* Consent Mode v2: define defaults before GTM loads.
              Reads existing cookie so returning users don't get re-denied. */}
          <Script id="gtm-consent-init" strategy="beforeInteractive">{`
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            var m=document.cookie.match(/(?:^|;\\s*)fitmass_consent=([^;]*)/);
            var granted=m&&decodeURIComponent(m[1])==='all'?'granted':'denied';
            gtag('consent','default',{analytics_storage:granted,ad_storage:granted,ad_user_data:granted,ad_personalization:granted});
          `}</Script>
          <GoogleTagManager gtmId={gtmId} />
        </>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Fitmass',
              url: 'https://fitmass.com.br',
              logo: 'https://fitmass.com.br/logo.png',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                availableLanguage: 'Portuguese',
              },
              sameAs: ['https://www.instagram.com/fitmass.app'],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Fitmass',
              url: 'https://fitmass.com.br',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://fitmass.com.br/blog?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            },
          ]),
        }}
      />
    </>
  )
}

async function ConditionalFooter() {
  const pathname = (await headers()).get('x-pathname') ?? ''
  if (pathname.startsWith('/admin') || pathname.startsWith('/links')) return null
  return <Footer />
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={encodeSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="flex min-h-screen flex-col font-body antialiased">
        <Suspense>
          <PublicScripts />
        </Suspense>
        <ConfigureAmplify />
        <ConsoleArt />
        <div className="flex-1">
          {children}
        </div>
        <Suspense>
          <ConditionalFooter />
        </Suspense>
        <CookieConsent />
      </body>
    </html>
  )
}
