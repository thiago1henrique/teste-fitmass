import type { ComponentType } from 'react'
import {
  FaInstagram, FaYoutube, FaWhatsapp, FaFacebook,
  FaTwitter, FaLinkedin, FaTiktok, FaTelegram, FaGlobe,
  FaGooglePlay, FaApple,
} from 'react-icons/fa'
import { Monitor, Smartphone } from 'lucide-react'
import Image from 'next/image'

type IconComponent = ComponentType<{ size?: number; className?: string }>

interface SocialMeta {
  icon: IconComponent
  color: string
}

function FitmassLogo({ size = 20 }: { size?: number; className?: string }) {
  return (
    <Image
      src="/fitmass_icon.svg"
      alt="Fitmass"
      width={size}
      height={size}
      style={{ filter: 'brightness(0) invert(1)' }}
      className="object-contain"
    />
  )
}

export const ICON_REGISTRY: Array<{ id: string; label: string; Icon: IconComponent }> = [
  { id: 'fitmass',    label: 'Fitmass',    Icon: FitmassLogo as IconComponent },
  { id: 'instagram',  label: 'Instagram',  Icon: FaInstagram },
  { id: 'youtube',    label: 'YouTube',    Icon: FaYoutube },
  { id: 'whatsapp',   label: 'WhatsApp',   Icon: FaWhatsapp },
  { id: 'facebook',   label: 'Facebook',   Icon: FaFacebook },
  { id: 'twitter',    label: 'Twitter/X',  Icon: FaTwitter },
  { id: 'linkedin',   label: 'LinkedIn',   Icon: FaLinkedin },
  { id: 'tiktok',     label: 'TikTok',     Icon: FaTiktok },
  { id: 'telegram',   label: 'Telegram',   Icon: FaTelegram },
  { id: 'playstore',  label: 'Play Store', Icon: FaGooglePlay },
  { id: 'appstore',   label: 'App Store',  Icon: FaApple },
  { id: 'globe',      label: 'Web',        Icon: FaGlobe },
  { id: 'monitor',    label: 'Monitor',    Icon: Monitor as IconComponent },
  { id: 'smartphone', label: 'Celular',    Icon: Smartphone as IconComponent },
]

const URL_PATTERNS: Array<{ pattern: RegExp; iconId: string }> = [
  { pattern: /fitmass\.com\.br/i,       iconId: 'fitmass' },
  { pattern: /instagram\.com/i,         iconId: 'instagram' },
  { pattern: /youtube\.com|youtu\.be/i, iconId: 'youtube' },
  { pattern: /whatsapp\.com|wa\.me/i,   iconId: 'whatsapp' },
  { pattern: /facebook\.com/i,          iconId: 'facebook' },
  { pattern: /twitter\.com|x\.com/i,    iconId: 'twitter' },
  { pattern: /linkedin\.com/i,          iconId: 'linkedin' },
  { pattern: /tiktok\.com/i,            iconId: 'tiktok' },
  { pattern: /t\.me|telegram/i,         iconId: 'telegram' },
  { pattern: /play\.google\.com/i,      iconId: 'playstore' },
  { pattern: /apps\.apple\.com/i,       iconId: 'appstore' },
]

export function getSocialMeta(url: string, iconId?: string | null): SocialMeta {
  const id = iconId || URL_PATTERNS.find(({ pattern }) => pattern.test(url))?.iconId
  const entry = ICON_REGISTRY.find((r) => r.id === id)
  return { icon: entry?.Icon ?? FaGlobe, color: '#ffffff' }
}
