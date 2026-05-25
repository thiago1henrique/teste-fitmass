export interface Link {
  id: string
  title: string
  url: string
  description?: string
  categoryId?: string
  order: number
}

export interface Category {
  id: string
  name: string
  order: number
}

export interface Profile {
  title: string
  subtitle: string
  avatarUrl?: string
}

export const profile: Profile = {
  title: 'Fitmass',
  subtitle: 'Transformando dados em bem-estar: Sua saúde, nossa tecnologia!',
}

export const categories: Category[] = [
  { id: 'cat-redes-sociais', name: 'Redes Sociais', order: 0 },
  { id: 'cat-aplicativos', name: 'Aplicativos', order: 1 },
]

export const links: Link[] = [
  {
    id: 'link-site',
    title: 'Site Fitmass',
    url: 'https://fitmass.com.br/',
    description: 'Conheça a Fitmass',
    categoryId: 'cat-redes-sociais',
    order: 0,
  },
  {
    id: 'link-instagram',
    title: 'Instagram',
    url: 'https://www.instagram.com/fitmass.tech/',
    description: 'Siga a Fitmass no Instagram',
    categoryId: 'cat-redes-sociais',
    order: 1,
  },
  {
    id: 'link-youtube',
    title: 'YouTube',
    url: 'https://www.youtube.com/@fitmass791/videos',
    description: 'Assista nossos vídeos no YouTube',
    categoryId: 'cat-redes-sociais',
    order: 2,
  },
  {
    id: 'link-whatsapp-comercial',
    title: 'Whatsapp Comercial',
    url: 'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+Instagram+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+o+Fitmass&type=phone_number&app_absent=0',
    description: 'Fale com nosso time comercial',
    categoryId: 'cat-redes-sociais',
    order: 3,
  },
  {
    id: 'link-whatsapp-suporte',
    title: 'Whatsapp Suporte',
    url: 'https://api.whatsapp.com/send/?phone=5541991197018&text=Ol%C3%A1%2C+vim+do+Instagram+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+o+Fitmass&type=phone_number&app_absent=0',
    description: 'Fale com nosso suporte',
    categoryId: 'cat-redes-sociais',
    order: 4,
  },
  {
    id: 'link-facebook',
    title: 'Facebook',
    url: 'https://www.facebook.com/fitmass.tech/',
    description: 'Curta a página da Fitmass no Facebook',
    categoryId: 'cat-redes-sociais',
    order: 5,
  },
  {
    id: 'link-playstore',
    title: 'Baixe pela Play Store',
    url: 'https://play.google.com/store/apps/details?id=br.com.fitmass&pcampaignid=web_share&pli=1',
    description: 'Disponível para Android',
    categoryId: 'cat-aplicativos',
    order: 0,
  },
  {
    id: 'link-appstore',
    title: 'Baixe pela App Store',
    url: 'https://apps.apple.com/br/app/fitmass-app/id1528425505',
    description: 'Disponível para iPhone',
    categoryId: 'cat-aplicativos',
    order: 1,
  },
]
