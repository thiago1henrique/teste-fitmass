import fs from 'fs'
import path from 'path'
import BrazilMapClient from './BrazilMapClient'

export default function BrazilMapSection() {
  const filePath = path.join(process.cwd(), 'public', 'pages', 'landingpage', 'br.svg')
  const raw = fs.readFileSync(filePath, 'utf-8')

  const svgHtml = raw
    .replace(/<\?xml[^?]*\?>\s*/g, '')           // remove XML declaration
    .replace(/\bfill="#6f9c76"/, 'fill="#e5e7eb"') // neutral default fill on <svg>
    .replace(/\bviewbox\b/g, 'viewBox')             // fix case for HTML5
    .replace(/\bwidth="1000"\s*/, '')               // remove fixed width
    .replace(/\bheight="912"\s*/, '')               // remove fixed height

  return (
    <section
      id="academias-parceiras"
      className="py-20 px-4 bg-white"
      aria-labelledby="academias-heading"
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Presença Nacional
          </span>
          <h2
            id="academias-heading"
            className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide leading-tight"
          >
            SÃO MAIS DE{' '}
            <span className="text-accent">150 ACADEMIAS</span>
            <br />PARCEIRAS
          </h2>
          <p className="font-body text-contrast/60 text-base mt-4 max-w-xl mx-auto">
            A Fitmass está presente em todo o Brasil. Explore o mapa e veja as academias parceiras no seu estado.
          </p>
        </div>

        <BrazilMapClient svgHtml={svgHtml} />
      </div>
    </section>
  )
}
