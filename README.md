# Future Solutions website

Fresh rebuild of the Future Solutions agency site. The homepage follows the section order and layout patterns of the reference site (focotik.agency), restyled in the colours of the Future Solutions logo. All copy, names, numbers and testimonials are **placeholders** to be replaced with real company content.

Planning notes: [`docs/focotik-reference-plan.md`](docs/focotik-reference-plan.md).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis smooth scroll · Geist font

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Where things live

```
src/
  app/
    page.tsx              homepage: ordered list of sections (add / remove / reorder here)
    layout.tsx            header, footer, motion provider, SEO metadata
    globals.css           brand colour tokens and keyframes
    api/contact/route.ts  "Send a brief" form endpoint (delivery not wired yet, see TODO)
  content/
    site.ts               company name, contact details, navigation, offices
    home.ts               all homepage copy and data (placeholders)
  components/
    sections/             one file per homepage section
    layout/               header (mega menu, mobile menu) and footer
    motion/               motion provider, marquee, counter
    ui/                   buttons, headings, icons, placeholder artwork
public/brand/             logo files (original, transparent, mark, hero)
```

## Brand colours (from the logo)

| Token | Hex | Use |
| --- | --- | --- |
| `orange-300 / 500 / 600` | `#FFB547` `#FE6B01` `#FD4D00` | primary buttons, accents, eyebrows |
| `blue-400 / 600 / 800` | `#00D4FF` `#006BC8` `#003A80` | secondary accents, AI section, glows |
| `ink` | `#04070D` | dark sections |
| `paper` | `#F6F7F9` | light sections |

## Homepage sections (in order)

1. Hero: rating badges, headline, CTA, four counting stats, floating logo with pointer tilt
2. Showreel card with lightbox player (set `showreel.videoSrc` in `content/home.ts`)
3. Partner logos: three marquee rows in alternating directions
4. Featured work: 2-column case-study grid with hover zoom
5. Redesign callout with animated growth curve
6. Services carousel (auto-scrolling cards, pauses on hover)
7. Client proof: logo tabs switch a video testimonial and quote, auto-advancing
8. How we use AI (brand-blue panel)
9. How we work: 3 steps and a CTA banner
10. Daily working model with a chat mock-up
11. Why us: six "from / to" comparison points
12. By the numbers: colour tiles with counters
13. Recognition badges
14. FAQ accordion (with FAQPage structured data)
15. Contact: team leads, next steps, booking card and the brief form

### Adding a new section

1. Create `src/components/sections/my-section.tsx` (wrap it in `<Section tone="light|dark">` and use `<SectionHeading>` for a consistent heading).
2. Put its copy in `src/content/home.ts`.
3. Add it to the `sections` array in `src/app/page.tsx` at the position you want.

## Motion

- Headings built with `SplitText` / `SectionHeading` slide up word by word when they enter the viewport.
- Any element with `data-reveal` fades and rises in, staggered with its neighbours.
- Lenis smooth scroll runs on mouse/trackpad devices only.
- Everything is turned off under `prefers-reduced-motion`.

## Still to do

- Replace placeholder content, client logos, project images and testimonials.
- Add the showreel video and a booking link (`site.bookingUrl`).
- Connect the contact form to email or a CRM (`src/app/api/contact/route.ts`).
- Build the inner pages (services, work, case study, pricing, about, blog, contact) from the plan.
