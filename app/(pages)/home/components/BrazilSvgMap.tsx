'use client'

interface Props {
  activeState: string | null
  onStateEnter: (uf: string) => void
  onStateLeave: () => void
  onStateTap: (uf: string) => void
}

interface StatePath {
  uf: string
  name: string
  d: string
}

const STATES: StatePath[] = [
  {
    uf: 'RR', name: 'Roraima',
    d: 'M 188,8 L 278,8 L 294,56 L 273,100 L 228,112 L 191,85 Z',
  },
  {
    uf: 'AP', name: 'Amapá',
    d: 'M 432,46 L 490,38 L 500,92 L 486,150 L 447,144 Z',
  },
  {
    uf: 'AM', name: 'Amazonas',
    d: 'M 8,114 L 191,85 L 228,112 L 273,100 L 295,130 L 340,147 L 344,202 L 301,257 L 271,268 L 244,274 L 211,314 L 188,360 L 158,368 L 124,362 L 87,348 L 55,304 L 25,256 L 10,196 Z',
  },
  {
    uf: 'PA', name: 'Pará',
    d: 'M 278,8 L 342,10 L 432,46 L 490,38 L 500,92 L 486,150 L 447,144 L 433,165 L 477,187 L 491,224 L 469,265 L 447,278 L 419,280 L 391,262 L 361,256 L 341,230 L 344,202 L 340,147 L 295,130 L 273,100 Z',
  },
  {
    uf: 'AC', name: 'Acre',
    d: 'M 8,285 L 55,304 L 87,348 L 124,362 L 158,368 L 188,360 L 162,378 L 100,392 L 52,382 L 25,345 Z',
  },
  {
    uf: 'RO', name: 'Rondônia',
    d: 'M 188,360 L 217,368 L 239,394 L 261,424 L 299,449 L 309,468 L 261,448 L 219,444 L 171,430 L 152,392 L 162,378 Z',
  },
  {
    uf: 'TO', name: 'Tocantins',
    d: 'M 419,280 L 447,278 L 469,265 L 491,224 L 514,236 L 526,278 L 520,332 L 501,360 L 480,370 L 459,358 L 445,325 L 439,294 Z',
  },
  {
    uf: 'MT', name: 'Mato Grosso',
    d: 'M 188,360 L 211,314 L 244,274 L 271,268 L 301,257 L 344,202 L 341,230 L 361,256 L 391,262 L 419,280 L 439,294 L 445,325 L 439,372 L 418,423 L 392,438 L 351,452 L 304,442 L 299,449 L 261,424 L 239,394 L 217,368 Z',
  },
  {
    uf: 'MA', name: 'Maranhão',
    d: 'M 491,224 L 477,187 L 511,172 L 549,162 L 583,175 L 584,209 L 567,232 L 537,244 L 514,236 Z',
  },
  {
    uf: 'PI', name: 'Piauí',
    d: 'M 583,175 L 615,172 L 638,196 L 630,232 L 605,258 L 580,262 L 567,232 L 584,209 Z',
  },
  {
    uf: 'CE', name: 'Ceará',
    d: 'M 615,172 L 662,162 L 688,178 L 694,202 L 674,224 L 649,228 L 630,232 L 638,196 Z',
  },
  {
    uf: 'RN', name: 'Rio Grande do Norte',
    d: 'M 662,162 L 698,158 L 711,178 L 707,195 L 688,200 L 688,178 Z',
  },
  {
    uf: 'PB', name: 'Paraíba',
    d: 'M 663,188 L 688,200 L 707,195 L 715,215 L 692,225 L 662,220 L 656,203 Z',
  },
  {
    uf: 'PE', name: 'Pernambuco',
    d: 'M 605,228 L 630,232 L 649,228 L 674,224 L 662,220 L 692,225 L 715,215 L 719,235 L 689,246 L 642,252 L 608,255 L 598,242 Z',
  },
  {
    uf: 'AL', name: 'Alagoas',
    d: 'M 660,252 L 689,246 L 719,235 L 722,255 L 700,267 L 668,262 Z',
  },
  {
    uf: 'SE', name: 'Sergipe',
    d: 'M 645,265 L 668,262 L 700,267 L 700,282 L 675,290 L 650,280 Z',
  },
  {
    uf: 'BA', name: 'Bahia',
    d: 'M 487,358 L 501,360 L 520,332 L 537,244 L 567,232 L 580,262 L 605,258 L 608,255 L 598,242 L 645,265 L 650,280 L 675,290 L 700,282 L 705,314 L 689,342 L 662,372 L 637,402 L 603,422 L 575,442 L 545,452 L 515,448 L 495,428 L 476,408 L 471,372 L 481,342 Z',
  },
  {
    uf: 'GO', name: 'Goiás',
    d: 'M 445,325 L 459,358 L 480,370 L 487,358 L 481,342 L 471,372 L 476,408 L 495,428 L 491,454 L 471,468 L 450,462 L 430,447 L 418,423 L 439,372 Z',
  },
  {
    uf: 'DF', name: 'Distrito Federal',
    d: 'M 477,395 L 492,390 L 497,402 L 492,416 L 478,415 Z',
  },
  {
    uf: 'MS', name: 'Mato Grosso do Sul',
    d: 'M 304,442 L 351,452 L 392,438 L 418,423 L 430,447 L 450,462 L 441,489 L 434,517 L 424,550 L 399,554 L 373,544 L 349,520 L 329,495 L 309,468 L 299,449 Z',
  },
  {
    uf: 'MG', name: 'Minas Gerais',
    d: 'M 491,454 L 495,428 L 515,448 L 545,452 L 575,442 L 603,422 L 637,402 L 652,426 L 647,462 L 621,487 L 597,502 L 559,514 L 524,518 L 499,508 L 484,488 L 474,468 Z',
  },
  {
    uf: 'ES', name: 'Espírito Santo',
    d: 'M 637,402 L 662,372 L 683,384 L 679,422 L 662,442 L 652,462 L 647,462 L 652,426 Z',
  },
  {
    uf: 'RJ', name: 'Rio de Janeiro',
    d: 'M 559,514 L 597,502 L 621,487 L 647,462 L 659,446 L 664,469 L 644,490 L 614,500 L 581,519 L 559,519 Z',
  },
  {
    uf: 'SP', name: 'São Paulo',
    d: 'M 450,462 L 471,468 L 474,468 L 484,488 L 499,508 L 524,518 L 559,514 L 559,519 L 539,542 L 509,549 L 479,549 L 449,539 L 434,517 L 441,489 Z',
  },
  {
    uf: 'PR', name: 'Paraná',
    d: 'M 434,517 L 449,539 L 479,549 L 509,549 L 539,542 L 546,570 L 521,584 L 491,589 L 461,584 L 434,569 L 424,550 Z',
  },
  {
    uf: 'SC', name: 'Santa Catarina',
    d: 'M 434,569 L 461,584 L 491,589 L 521,584 L 531,614 L 506,629 L 476,631 L 450,624 L 432,605 Z',
  },
  {
    uf: 'RS', name: 'Rio Grande do Sul',
    d: 'M 432,605 L 450,624 L 476,631 L 506,629 L 521,659 L 511,690 L 491,715 L 461,724 L 431,719 L 406,699 L 401,669 L 416,639 Z',
  },
]

export default function BrazilSvgMap({ activeState, onStateEnter, onStateLeave, onStateTap }: Props) {
  return (
    <svg
      viewBox="0 0 740 740"
      aria-label="Mapa interativo do Brasil"
      role="img"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.10))' }}
    >
      {STATES.map(({ uf, name, d }) => {
        const isActive = activeState === uf
        return (
          <path
            key={uf}
            id={uf}
            d={d}
            aria-label={name}
            fill={isActive ? '#88BD23' : '#d1d5db'}
            stroke="#ffffff"
            strokeWidth={isActive ? 2 : 1.2}
            style={{
              transition: 'fill 0.18s ease, stroke-width 0.18s ease',
              cursor: 'pointer',
              filter: isActive ? 'drop-shadow(0 2px 8px rgba(136,189,35,0.45))' : 'none',
            }}
            onMouseEnter={() => onStateEnter(uf)}
            onMouseLeave={onStateLeave}
            onClick={() => onStateTap(uf)}
          />
        )
      })}
    </svg>
  )
}
