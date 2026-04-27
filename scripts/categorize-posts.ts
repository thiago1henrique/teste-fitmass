import { config } from 'dotenv'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

config({ path: '.env.local' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const PREDEFINED = ['Saúde', 'Bioimpedância', 'Fitness', 'Tecnologia'] as const

const KEYWORDS: Record<(typeof PREDEFINED)[number], string[]> = {
  Saúde: [
    'saúde', 'saudável', 'saudavel', 'nutrição', 'nutricao', 'nutriente',
    'alimentação', 'alimentacao', 'dieta', 'vitamina', 'mineral', 'proteína',
    'proteina', 'carboidrato', 'hidratação', 'hidratacao', 'sono', 'descanso',
    'bem-estar', 'bem estar', 'mental', 'imunidade', 'imune', 'doença',
    'doenca', 'prevenção', 'prevencao', 'longevidade', 'envelhecimento',
    'colesterol', 'glicose', 'pressão arterial', 'pressao arterial',
    'inflamação', 'inflamacao', 'metabolismo', 'hormônio', 'hormonio',
    'obesidade', 'emagrecimento', 'emagrecer', 'perda de peso',
    'estilo de vida', 'qualidade de vida', 'hábito', 'habito',
    'criança', 'crianca', 'infantil', 'idoso', 'gestante',
  ],
  Bioimpedância: [
    'bioimpedância', 'bioimpedancia', 'composição corporal', 'composicao corporal',
    'gordura corporal', 'percentual de gordura', 'massa muscular', 'massa magra',
    'massa gorda', 'massa óssea', 'massa ossea', 'massa corporal',
    'avaliação física', 'avaliacao fisica', 'avaliação corporal',
    'imc', 'índice de massa', 'indice de massa',
    'água corporal', 'agua corporal', 'hidratação corporal',
    'balança', 'balanca', 'medição', 'medicao', 'mensuração',
    'circunferência', 'circunferencia', 'dobra cutânea', 'dobra cutanea',
    'anamnese', 'protocolo de avaliação',
    'fitmass', 'white label', 'software de avaliação',
  ],
  Fitness: [
    'treino', 'treinamento', 'exercício', 'exercicio', 'academia',
    'musculação', 'musculacao', 'hipertrofia', 'força', 'forca',
    'cardio', 'aeróbico', 'aerobico', 'anaeróbico', 'anaerobico',
    'resistência', 'resistencia', 'funcional', 'crossfit', 'calistenia',
    'corrida', 'ciclismo', 'natação', 'natacao', 'esporte', 'atleta',
    'personal', 'coach', 'aquecimento', 'alongamento',
    'agachamento', 'supino', 'deadlift', 'levantamento',
    'série', 'serie', 'repetição', 'repeticao', 'carga', 'intervalo',
    'peito', 'costas', 'bíceps', 'biceps', 'tríceps', 'triceps',
    'ombro', 'perna', 'glúteo', 'gluteo', 'abdômen', 'abdomen',
    'queima de gordura', 'condicionamento', 'performance',
    'pré-treino', 'pre-treino', 'pós-treino', 'pos-treino',
    'frequência cardíaca', 'frequencia cardiaca', 'zona de treino',
    'branding fitness', 'academia fitness',
  ],
  Tecnologia: [
    'tecnologia', 'software', 'sistema', 'plataforma', 'aplicativo',
    'app', 'digital', 'inovação', 'inovacao', 'inteligência artificial',
    'inteligencia artificial', 'ia', 'dados', 'gestão', 'gestao',
    'automação', 'automacao', 'dashboard', 'relatório', 'relatorio',
    'api', 'integração', 'integracao', 'cloud', 'nuvem',
    'wearable', 'smartwatch', 'sensor', 'monitor',
    'machine learning', 'algoritmo', 'análise de dados', 'analise de dados',
    'digitalização', 'digitalizacao', 'transformação digital',
    'aplicação', 'aplicacao', 'ferramenta digital',
  ],
}

// Weights for each field in score calculation
const FIELD_WEIGHT = { title: 6, summary: 3, content: 1 } as const
const SCORE_THRESHOLD = 4

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function score(
  category: (typeof PREDEFINED)[number],
  title: string,
  summary: string,
  content: string,
): number {
  const fields = {
    title: normalize(title),
    summary: normalize(summary),
    content: normalize(stripHtml(content)),
  }

  let total = 0
  for (const kw of KEYWORDS[category]) {
    const nkw = normalize(kw)
    for (const [field, text] of Object.entries(fields) as [keyof typeof fields, string][]) {
      if (text.includes(nkw)) {
        total += FIELD_WEIGHT[field]
      }
    }
  }
  return total
}

function inferCategories(
  title: string,
  summary: string,
  content: string,
): string[] {
  const scores = PREDEFINED.map((cat) => ({
    cat,
    score: score(cat, title, summary, content),
  }))

  const best = scores.reduce((a, b) => (a.score >= b.score ? a : b))
  return [best.cat]
}

async function main() {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, summary: true, content: true, categories: true },
  })

  // Only posts with exactly one valid predefined category are considered correct
  const toFix = posts.filter(
    (p) =>
      p.categories.length !== 1 ||
      !PREDEFINED.includes(p.categories[0] as (typeof PREDEFINED)[number]),
  )

  if (toFix.length === 0) {
    console.log('✅ Todos os posts já possuem exatamente uma categoria válida.')
    return
  }

  console.log(`→ ${toFix.length} posts sem categoria válida\n`)

  let updated = 0

  for (const post of toFix) {
    const categories = inferCategories(post.title, post.summary, post.content)
    await prisma.post.update({
      where: { id: post.id },
      data: { categories },
    })
    console.log(`  ✔ [${categories.join(', ')}] ${post.title.slice(0, 60)}`)
    updated++
  }

  console.log(`\n✅ ${updated} posts categorizados`)
}

main()
  .catch((err) => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
