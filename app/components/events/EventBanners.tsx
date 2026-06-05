'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useActiveEvent } from './ActiveEventContext'
import type { BannerPosition, BannerSection } from '@/app/types/events'

interface Props {
  position: BannerPosition
}

function HorizontalBanner({ banner }: { banner: BannerSection }) {
  if (!banner.imageUrl) return null
  const img = (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/1' }}>
      <Image
        src={banner.imageUrl}
        alt={banner.altText ?? 'Banner promocional'}
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>
  )
  if (banner.link) {
    return (
      <Link href={banner.link} className="block w-full hover:opacity-95 transition-opacity">
        {img}
      </Link>
    )
  }
  return <div className="w-full">{img}</div>
}

function DividerBanner({ banner }: { banner: BannerSection }) {
  return (
    <div
      className="w-full py-3 text-center text-sm font-semibold"
      style={{
        backgroundColor: banner.bgColor ?? '#333333',
        color: banner.textColor ?? '#FFFFFF',
      }}
    >
      {banner.text}
    </div>
  )
}

export default function EventBanners({ position }: Props) {
  const event = useActiveEvent()
  if (!event) return null

  const banners = event.banners.filter((b) => b.position === position)
  if (banners.length === 0) return null

  return (
    <div className="w-full">
      {banners.map((banner) => {
        if (banner.type === 'horizontal') return <HorizontalBanner key={banner.id} banner={banner} />
        if (banner.type === 'divider') return <DividerBanner key={banner.id} banner={banner} />
        return null
      })}
    </div>
  )
}
