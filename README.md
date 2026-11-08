# Future Solutions — website & admin dashboard

> Smart Solutions. Lasting Impact.

Official website and content dashboard for **Future Solutions**, a software company and IT training institute in Uttara, Dhaka.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, `src/`), TypeScript strict |
| Styling | Tailwind CSS v4 with brand tokens as CSS variables |
| Motion / 3D | GSAP + ScrollTrigger, Lenis, Motion, Three.js via React Three Fiber |
| Data | Supabase (Postgres, Auth, Storage, RLS) via `@supabase/ssr` |
| Dashboard UI | shadcn/ui primitives, TanStack Table, React Hook Form + Zod, Tiptap, dnd-kit |
| Email / Hosting | Resend / Vercel |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

The site renders with built-in defaults until Supabase is configured, so the design system can be reviewed without a database.

### Supabase setup

1. Create a project at supabase.com and copy the URL, anon key and service-role key into `.env.local`.
2. Apply the schema. Either paste the files in `supabase/migrations/` (in order) into the SQL editor, or link the CLI:

   ```bash
   npx supabase init          # creates supabase/config.toml (migrations are already here)
   npx supabase link --project-ref YOUR-PROJECT-REF
   npm run db:push            # applies supabase/migrations/*
   ```

3. Load sample content by running `supabase/seed.sql` in the SQL editor (it is idempotent; safe to re-run).
4. Create your admin account in **Authentication → Users** (or sign up through `/admin/login`). The **first** user automatically gets the `admin` role; later users are `editor` until an admin promotes them.
5. Optional: regenerate `src/types/database.ts` from the live schema with `npm run db:types`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run check` | Lint, typecheck and production build |
| `npm run db:push` | Apply migrations to the linked Supabase project |
| `npm run db:reset` | Reset a local Supabase stack and re-seed |
| `npm run db:types` | Regenerate database types |

## Project layout

```
src/
  app/              routes (public pages under (site), admin under /admin)
  components/
    ui/             design-system primitives (Button, GlassCard, Logo…)
    layout/         Header, Footer, WhatsApp button
    sections/       page sections (hero, services, stats…)
    three/          React Three Fiber scenes
    admin/          dashboard components
  lib/
    data/           typed, cached Supabase queries (one file per table)
    supabase/       browser / server / public / admin clients + middleware
    env.ts          Zod-validated environment variables
    site.ts         static site constants (navigation, contact fallbacks)
  types/            database + content types
supabase/
  migrations/       schema, RLS, storage bucket
  seed.sql          realistic sample content
public/brand/       logo assets (see README inside)
```

## Motion & 3D

| Piece | Where | Notes |
| --- | --- | --- |
| Smooth scroll | `components/motion/motion-provider.tsx` | Lenis synced to GSAP's ticker; disabled under `prefers-reduced-motion` |
| 3D hero | `components/three/` | Dynamic-imported R3F canvas, extruded FS monogram, particle shader, bloom. `dpr` capped at 1.5, pauses off-screen, static fallback on mobile / low-end / reduced motion |
| Pinned services | `components/sections/services-pinned.tsx` | GSAP ScrollTrigger pin on ≥1024px; plain grid elsewhere |
| Text reveal, counters, reveals | `components/motion/` | Word-mask reveal with gradient highlights, viewport-triggered counters and fades |
| Cards | `components/motion/tilt-card.tsx` | 3D tilt, cursor spotlight, rotating gradient border |
| Marquee | `components/motion/marquee.tsx` | rAF-driven, eases to 20% speed on hover |
| Cursor | `components/motion/custom-cursor.tsx` | Fine-pointer devices only; `data-cursor="Label"` on any element shows a label |
| Page transitions | `components/motion/page-transition.tsx` | Gradient wipe on internal navigation; add `data-no-transition` to opt a link out |
| Preloader | `components/motion/preloader.tsx` | First visit only (`localStorage` key `fs:visited`), FS stroke-draw |

The device tier is decided once on the client in `lib/motion/device.ts`; everything heavy keys off it.

## Access model

| Role | Can |
| --- | --- |
| Visitor (anon) | Read published content; submit leads and reviews (reviews land unapproved) |
| Editor | Everything above plus create / edit / publish all content and media |
| Admin | Everything, plus leads inbox, site settings, users and analytics |

Roles live in `public.profiles.role` and are enforced by Postgres RLS, not just by the UI.
