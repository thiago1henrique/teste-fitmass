import { config } from 'dotenv'
config({ path: '.env.local' })
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@fitmass.com.br'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'fitmass123'
  const name = 'Administrador'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin already exists: ${email}`)
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: 'ADMIN' },
  })
  console.log(`Admin created: ${user.email}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
