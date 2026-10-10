# Sarwad Hasan Siddiqui — Portfolio

A space-themed portfolio with a built-in admin dashboard. Visitors see the public
site; you edit every section from `/admin` without touching code.

**Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript ·
Tailwind CSS 4 · React Three Fiber (WebGL galaxy) · Motion · Lenis ·
Drizzle ORM · Neon Postgres · Vercel Blob

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run db:push              # create tables
npm run db:seed              # load the content from src/content/seed.ts
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the dashboard.

### Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon connection string. For local work without an account use `pglite:./.data/portfolio` (embedded Postgres). Leave empty and the site renders straight from `src/content/seed.ts` (admin disabled). |
| `ADMIN_PASSWORD` | Passphrase for `/admin`. |
| `ADMIN_SESSION_SECRET` | 32+ random characters used to sign the admin session cookie. |
| `BLOB_READ_WRITE_TOKEN` | Enables image and PDF uploads in the dashboard. Without it, paste URLs instead. |
| `GITHUB_TOKEN` | Enables **GitHub import** (public, private and organisation repos). `gh auth token` prints one. |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used in metadata. |

With PGlite, `drizzle-kit push` prints "Changes applied" and then keeps the
process open; press Ctrl+C. Stop `npm run dev` before pushing or seeding,
because PGlite allows one process at a time.

## Deploy (Vercel + Neon)

1. Create a Neon project and copy its pooled connection string.
2. Import this repo in Vercel. Add a Blob store from the Storage tab (it sets
   `BLOB_READ_WRITE_TOKEN`), then add the other variables above.
3. Point `DATABASE_URL` in `.env.local` at Neon and run `npm run db:push` and
   `npm run db:seed` once from your machine.
4. Deploy. The home page is prerendered; saving in the dashboard invalidates it
   immediately via `updateTag`.

## What the dashboard edits

Profile (hero, about, socials, stats, CV), research vectors, publications,
projects (covers, featured flag, private-source flag), experience, education,
honors and skills. Lists support drag-to-reorder and show/hide. Contact-form
messages land in **Messages**. **GitHub import** turns repositories into hidden
project drafts.

## Where things live

- `src/content/seed.ts` — initial content compiled from the CV, GitHub and LinkedIn
- `src/lib/admin/collections.ts` — field definitions; the admin list, form and save action are generated from these
- `src/components/site/*` — public sections; `src/components/space/*` — galaxy, starfield, planets
- `src/app/admin/*` — dashboard; `src/proxy.ts` redirects unauthenticated `/admin` requests
