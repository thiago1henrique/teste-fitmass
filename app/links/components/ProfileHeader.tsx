import Image from 'next/image'
import type { Profile } from '../data'

export function ProfileHeader({ profile }: { profile: Profile }) {
  const { title, subtitle, avatarUrl } = profile
  return (
    <header className="flex flex-col items-center text-center gap-4 py-10 px-4">
      <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden shrink-0">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={title} width={80} height={80} className="w-full h-full object-cover" />
        ) : (
          <Image src="/fitmass_icon.svg" alt="Fitmass" width={64} height={64} className="w-16 h-16 object-contain" />
        )}
      </div>
      {subtitle && (
        <p className="font-body text-base text-white/65 max-w-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  )
}
