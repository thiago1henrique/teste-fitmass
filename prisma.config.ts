import path from 'node:path'
import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Prisma CLI does not auto-load .env.local (Next.js convention); load it manually.
config({ path: '.env.local' })

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    seed: 'tsx ./prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
