'use client'

export default function PostError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-title text-4xl uppercase text-contrast tracking-wide mb-4">
          Algo deu errado
        </h1>
        <p className="font-body text-contrast/50 mb-6">
          Não foi possível carregar este artigo. Tente novamente.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
          >
            Tentar novamente
          </button>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 border-2 border-accent/50 text-accent font-body font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-xl hover:border-accent transition-colors"
          >
            Ver todos os artigos
          </a>
        </div>
      </div>
    </div>
  )
}
