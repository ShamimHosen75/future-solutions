# Deployment checklist

## 1. Supabase

- [ ] Create a project (region: Singapore `ap-southeast-1` is closest to Dhaka).
- [ ] Run the six files in `supabase/migrations/` in order (SQL editor), or `npx supabase link && npm run db:push`.
- [ ] Run `supabase/seed.sql`, then replace the sample content from the dashboard.
- [ ] Authentication → Providers: keep **Email** enabled; disable sign-ups you don't want (invites still work).
- [ ] Authentication → URL configuration: Site URL `https://futuresolution.online`; add `https://futuresolution.online/admin/reset-password` and `http://localhost:3000/admin/reset-password` to the redirect allow list.
- [ ] Storage: the `media` bucket is created by migration `0006` (public read, 10 MB limit). Adjust limits if needed.
- [ ] Copy the **Project URL**, **anon key** and **service_role key** for Vercel.

## 2. Cloudflare Turnstile

- [ ] Create a widget for `futuresolution.online` (Managed, invisible-friendly). Copy the site key and secret key.

## 3. Resend

- [ ] Verify the sending domain (`futuresolution.online`) and add the DNS records.
- [ ] Create an API key. Set `EMAIL_FROM="Future Solutions <hello@futuresolution.online>"` and `EMAIL_TO` to the inbox that should receive leads.

## 4. Vercel

- [ ] Import the GitHub repository; framework preset **Next.js**, Node 20+.
- [ ] Environment variables (Production + Preview), from `.env.example`:
  - `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only; enables invites, analytics and cross-instance rate limiting)
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
  - `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`
  - `IP_HASH_SALT` (any long random string)
- [ ] Add the domain `futuresolution.online` (+ `www` redirect) and point DNS at Vercel.
- [ ] Deploy. Visit `/admin/login`, create the first account (it becomes admin), then invite teammates from **Users**.

## 5. Launch checks

- [ ] Replace the placeholder logo files in `public/brand/` (same file names).
- [ ] Review Privacy and Terms copy under **Settings → Legal**.
- [ ] Submit a test lead from `/contact` and confirm it appears in the inbox and the notification email arrives.
- [ ] Run Lighthouse (mobile) on `/`, `/services/<slug>` and `/academy`; targets are 90+ across the board.
- [ ] Submit `https://futuresolution.online/sitemap.xml` in Google Search Console.
- [ ] Set up the Google Business Profile link and social URLs under **Settings → Socials**.

## Local development

```bash
cp .env.example .env.local   # fill in at least the Supabase keys
npm install
npm run dev
```

Forms work without Turnstile and Resend keys (verification and email are skipped with a console warning).
