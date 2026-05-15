import type { Metadata } from 'next'
import { Encode_Sans } from 'next/font/google'
import { headers } from 'next/headers'
import Script from 'next/script'
import Footer from './components/footer/Footer'
import CookieConsent from './components/CookieConsent'
import ConfigureAmplify from './components/ConfigureAmplify'
import { GoogleTagManager } from '@next/third-parties/google'
import './globals.css'

const encodeSans = Encode_Sans({
  subsets: ['latin'],
  variable: '--font-encode-sans',
  display: 'swap',
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="pt-BR" className={encodeSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="flex min-h-screen flex-col font-body antialiased">
        {!isAdmin && process.env.NEXT_PUBLIC_GTM_ID && (
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
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
          </>
        )}
        {!isAdmin && (
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
        )}
        <ConfigureAmplify />
        <div className="flex-1">
          {children}
        </div>
        {!isAdmin && <Footer />}
        <CookieConsent />
      </body>
    </html>
  )
}
