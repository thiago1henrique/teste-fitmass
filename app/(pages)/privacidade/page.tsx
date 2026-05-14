import type { Metadata } from 'next'
import Privacidade from './Privacidade'

export const metadata: Metadata = {
  title: 'Portal de Privacidade | Fitmass',
  description:
    'Consulte nossa Política de Privacidade, Aviso de Cookies e exerça seus direitos como titular de dados pessoais conforme a LGPD.',
  alternates: {
    canonical: 'https://fitmass.com.br/privacidade',
  },
  openGraph: {
    title: 'Portal de Privacidade | Fitmass',
    description:
      'Consulte nossa Política de Privacidade, Aviso de Cookies e exerça seus direitos como titular de dados pessoais conforme a LGPD.',
    url: 'https://fitmass.com.br/privacidade',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function PrivacidadePage() {
  return <Privacidade />
}
