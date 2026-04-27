# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server on localhost:3000
npm run build    # production build
npm run lint     # ESLint across the project
npx eslint app/path/to/file.tsx  # lint a single file

# Database
docker compose up -d              # start PostgreSQL on port 5432
npx prisma migrate dev            # apply migrations + regenerate client
npx prisma db seed                # seed default admin (admin@fitmass.com.br / fitmass123)
npx prisma studio                 # visual DB browser

# WordPress migration (run seed first)
npx tsx scripts/import-wp-posts.ts   # bulk-import from json/posts_fitmass_completo.json (idempotent)
npx tsx scripts/categorize-posts.ts  # assign categories after import
npx tsx scripts/fix-categories.ts    # repair malformed category data
```

There is no test suite.

## Environment

Create `.env.local` at the repo root. Prisma CLI reads it via `prisma.config.ts`:

```
DATABASE_URL=postgresql://fitmass:fitmass@localhost:5432/fitmass
AUTH_SECRET=<random-secret>      # defaults to dev placeholder if omitted
```

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · Prisma 7 · PostgreSQL 16

### Route structure

| Path | Source |
|---|---|
| `/` | `app/(pages)/home/Home.tsx` |
| `/planos` | `app/(pages)/planos/Planos.tsx` |
| `/blog` | `app/(pages)/blog/Blog.tsx` |
| `/blog/[slug]` | `app/(pages)/blog/[slug]/PostBody.tsx` |
| `/admin` | `app/admin/page.tsx` (dashboard) |
| `/admin/posts` | Post CRUD |
| `/admin/team` | User management (ADMIN role only) |
| `/admin/login` | Unauthenticated entry point |

`app/(pages)/` is invisible in URLs. Each `page.tsx` is a thin Server Component for `metadata` + layout; content lives in sibling files.

### Authentication & middleware

`middleware.ts` protects every `/admin/*` route except `/admin/login`. It validates the `fitmass_session` JWT cookie (via `jose`, HS256, 7-day TTL) and redirects to login on failure. It also forwards an `x-pathname` header — `app/layout.tsx` reads this to suppress `<Footer>` on admin pages without a separate layout wrapper.

Session helpers live in `lib/session.ts`. Auth mutations are server actions in `app/actions/auth.ts`.

`app/admin/layout.tsx` adds a second auth layer: it re-checks the session and redirects to login if absent, then renders the sidebar + children. The cookie's `secure` flag is set only in production (`NODE_ENV === 'production'`).

### Header / Footer split

`<Footer>` is in `app/layout.tsx` but suppressed on `/admin/*` via the `x-pathname` middleware header. `<Header>` is **not** in the root layout — each page-level file renders it directly with its own `navLinks` and `cta` props.

### Server actions

All actions in `app/actions/` follow the same pattern:
- Accept `FormData`, return `{ error?: string }` for client-side form state via `useActionState()`
- Guard with `requireSession()` (any logged-in user) or `requireAdmin()` (ADMIN role only) — both call `redirect()` on failure
- Call `revalidatePath()` after every DB mutation to bust ISR caches
- Use `redirect()` for post-success navigation (not a return value)

Role distinctions: post CRUD (`posts.ts`) requires only a valid session (EDITOR+); user management (`users.ts`) requires ADMIN. `createPost` auto-sets `publishedAt` only when transitioning to `PUBLISHED` status.

`redirect()` **throws** internally — do not wrap it in try/catch. The `{ error }` return is only reached on validation failures, never on success.

### CMS / Blog

- **Models:** `User` (ADMIN | EDITOR roles) and `Post` (DRAFT | PUBLISHED, slug-routed).
- **Slug generation:** `lib/slug.ts` normalises the title (NFD, strips diacritics, lowercase); if a slug collides it appends `Date.now()`. Uniqueness is enforced in app logic, not as a DB constraint.
- **Rich editor:** Tiptap v3 (StarterKit + Image + Link). HTML is stored as `Text` in the DB and rendered with `dangerouslySetInnerHTML` — only admin/editor users can write content.
- **Image uploads:** `POST /api/upload` validates auth, MIME type (images + SVG), and 5 MB size limit, then writes to `/public/uploads/` with a randomised filename (`{timestamp}-{random}.{ext}`). Storage is filesystem-only — no cloud abstraction. The relative path `/uploads/{name}` is returned and inserted into the editor.
- **Server actions** (`app/actions/posts.ts`, `users.ts`, `auth.ts`) handle all mutations; they call `revalidatePath()` to bust ISR caches after every write.

### Rendering strategy

| Route | Strategy |
|---|---|
| `/blog` | ISR — `revalidate: 60` |
| `/blog/[slug]` | Static params pre-built + ISR `revalidate: 3600` |
| Admin pages | Dynamic (session-gated) |

### Prisma singleton

`lib/prisma.ts` caches the client in `global` during dev to prevent connection leaks across HMR reloads. Use the exported `prisma` instance everywhere — never instantiate `PrismaClient` directly.

`prisma.config.ts` manually loads `.env.local` because the Prisma CLI does not auto-load Next.js `.env` conventions. It also configures the `PrismaPg` adapter with an explicit connection pool.

### View tracking

`lib/views-buffer.ts` debounces `Post.views` increments: it batches up to 50 slugs and flushes after 5 s (or immediately when the buffer is full). `POST /api/posts/[slug]/view` just calls `bufferView()` — no direct DB write per request.

### Shared components

`app/components/personalization/PersonalizationSection.tsx` is a `'use client'` white-label demo (color picker, logo selector, domain input) reused on `/` and `/planos`.

`app/components/blog/BlogPreviewSection.tsx` shows the 3 latest posts on the homepage.

### Design tokens (Tailwind v4)

Tailwind v4 has no `tailwind.config.js`. All tokens are declared in `app/globals.css`:

| Token | Value |
|---|---|
| `--color-accent` | `#88BD23` (brand green) |
| `--color-contrast` | `#333333` (dark backgrounds) |
| `--color-surface` | `#F8F8F8` (light sections) |
| `font-title` | AeroMatics (local TTF via `@font-face`) |
| `font-body` | Encode Sans (via `next/font`, injected as `--font-encode-sans`) |

`globals.css` also defines `.prose` styles for blog post HTML content.

### Path alias

`@/*` resolves to the repository root (e.g. `@/app/components/...`).

### Images

External images from `fitmass.com.br/wp-content/uploads/**` are whitelisted in `next.config.ts`. The WordPress logo SVG is loaded via `<img>` (not `next/image`) with an `eslint-disable` comment — intentional.
