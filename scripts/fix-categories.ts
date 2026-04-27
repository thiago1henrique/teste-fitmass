import { config } from 'dotenv'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

config({ path: '.env.local' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const PREDEFINED = ['Saúde', 'Bioimpedância', 'Fitness', 'Tecnologia']

async function main() {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, categories: true },
  })

  const toFix = posts.filter(
    (p) => !p.categories.some((c) => PREDEFINED.includes(c)),
  )

  if (toFix.length === 0) {
    console.log('✅ Todos os posts já possuem categorias válidas.')
    return
  }

  console.log(`→ ${toFix.length} posts sem categoria válida encontrados`)

  await prisma.post.updateMany({
    where: { id: { in: toFix.map((p) => p.id) } },
    data: { categories: ['Saúde', 'Fitness'] },
  })

  console.log(`✅ Categorias [Saúde, Fitness] aplicadas em ${toFix.length} posts`)
}

main()
  .catch((err) => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
