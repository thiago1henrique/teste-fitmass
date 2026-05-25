import { Link2Off } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
        <Link2Off size={24} className="text-accent/60" />
      </div>
      <p className="font-body text-white/40 text-sm">
        Nenhum link foi adicionado ainda.
      </p>
    </div>
  )
}
