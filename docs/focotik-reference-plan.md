# Future Solutions website: project plan and requirements analysis

**Reference site:** https://www.focotik.agency/ (analysed 23 Nov 2026)
**Target:** the Future Solutions agency website (this repository)
**Status:** planning only. No code changes yet. Company information will be supplied next.

---

## 0. Read this first

### 0.1 What "same to same" means in this plan

We will match Focotik's **structure, page types, section order, layout patterns, interaction quality and conversion flow**. We will **not** copy anything that belongs to Focotik:

| Allowed (we replicate) | Not allowed (must be your own) |
| --- | --- |
| Sitemap and page types | Copy / wording, headlines, taglines |
| Section order and layout patterns (hero + stats, logo marquee, case-study grid, pricing tabs, FAQ accordion, brief form) | Logos, brand name, colour palette as a brand identity, custom illustrations |
| Interaction types (marquee, reveals, counters, accordions, sliders, video testimonials) | Photos, showreel video, case-study images, team photos |
| Conversion mechanics (sticky CTA, "book a call", budget-range brief form) | Testimonials, client names, stats ("250+ products", "$647M raised"), awards |
| Information architecture for services / solutions / pricing | Prices and plan names copied verbatim |

Copying their copy, imagery or testimonials would be a copyright and trust problem (and Google penalises duplicate content). Everything in the "not allowed" column is listed in section 8 as content you must supply.

### 0.2 How the reference was analysed

- Pages read: Home, Works, one case study (Secure Jump), one service page (Website UI/UX), two solution pages (MVP Design, Team Extension), About, Pricing, Contact, Blog listing, one blog post, Careers. Plus the full-page home screenshot you shared.
- The site's HTML was read as text. Scripts were not visible, so animation details below are **inferred** from repeated markup (e.g. logos duplicated 3x = infinite marquee), from the screenshot, and from standard Webflow interaction patterns. Each inferred item is marked *(inferred)*. Before build we should do a 30-minute screen recording pass of the live site on desktop and mobile to confirm timings.
- **Platform:** Focotik is built on **Webflow** (assets on Webflow's CDN, Webflow default form messages and placeholder text, Webflow CMS pagination params). Videos are hosted on ImageKit and Vimeo.

### 0.3 Important: you already have most of this built

This repository already contains a production-grade Next.js 15 + Supabase site with an admin dashboard (branch `claude/kind-euler-atovtj`, 5 phases complete): services, portfolio, products, pricing, academy, blog, careers, clients, contact, about, legal pages, GSAP/Lenis motion system, marquee, counters, text reveals, 3D hero, lead forms with Turnstile + Resend, SEO/JSON-LD, and a CMS-style admin.

**Recommendation:** do not start a new project. Restyle and restructure the existing codebase to the Focotik layout model. That saves roughly 60% of the effort. Section 9 is the gap analysis; section 10's phases are written on that basis. (If you would rather start from scratch, the same plan applies but add ~3 weeks for Phase 1 foundation and the admin.)

---

## 1. Reference site overview

| Aspect | Focotik |
| --- | --- |
| Positioning | Global, senior-led UI/UX design studio on a subscription model |
| Primary conversion | "Schedule a meeting" / "Book a free 30-min call" (Google Calendar), "Send a brief" form, WhatsApp |
| Secondary conversion | Pricing page (subscription vs project plans) |
| Trust devices | Stats (products shipped, countries, funds raised, Clutch rating), partner logo marquee, video testimonials, Clutch/Behance/Dribbble/Google badges, awards |
| Visual style | Dark near-black hero and alternating dark/light sections, orange-red accent, one green feature section, large bold sans-serif headings, rounded cards (16-24px radius), lots of product mockups |
| Platform | Webflow CMS (works, blog, services) |
| Offices shown | USA, Dubai, Dhaka |

### Observed quality issues on Focotik (do better than them)

These are real defects on the reference site. We will avoid them:
- Lorem ipsum and "This is some text inside of a div block." placeholder text live on several pages.
- Inconsistent prices between Pricing and Contact FAQ; inconsistent response times (12h / 24h / one business day).
- Typos in headings and footer ("continious", "Revenew", "dirrectly", "Deisgn", "x.xom").
- "Let's Talk" header button and several CTAs link to `#` (dead links).
- Duplicate `/service` and `/services` paths; www and non-www links mixed.
- Brief form collects only budget and project type: no name/email field visible, so leads can be unusable.
- Title "5 steps" but body has 6 steps on a blog post; empty table of contents.

---

## 2. Sitemap

Focotik's structure, mapped to the Future Solutions equivalent. "Exists" refers to this repo today.

```
/                               Home
/works                          Work / case studies index        (repo: /portfolio, exists)
/works/[slug]                   Case study detail                (repo: /portfolio/[slug], exists)
/services                       Services hub                     (exists)
/services/[slug]                Service landing page (x13 on Focotik) (exists, needs long-form template)
/solutions/mvp-development      Solution page: MVP              (NEW)
/solutions/product-redesign     Solution page: Redesign          (NEW)
/solutions/team-extension       Solution page: Team extension    (NEW)
/pricing                        Pricing (subscription / project tabs, billing toggle) (exists, needs tabs)
/about                          About / studio / team / values   (exists, needs sections)
/careers                        Careers + perks + openings       (exists)
/blog                           Blog index with category filter + pagination (exists, needs filter)
/blog/[slug]                    Article with TOC, author box, related posts (exists, needs TOC/author)
/contact                        Contact: brief form, booking, offices, FAQ (exists, needs sections)
/locations/[city]               Location landing page (Focotik: /locations/dubai) (NEW, optional, good for local SEO e.g. Dhaka)
/refer                          Referral programme               (NEW, optional)
/privacy, /terms                Legal                            (exists)

Your extras to keep (not on Focotik): /products, /academy, /clients, /admin
```

Decision needed later: keep `/portfolio` or rename to `/works`. Recommend keeping `/portfolio` (already indexed, clearer for Bangladeshi clients) and adding a redirect from `/works`.

### Navigation model

- **Header:** Logo · Work · Services (mega menu, 3 columns: Design services / Services / Development services) · Solutions (mega menu, 3 cards with one-line description + "See details") · About · Blog · Contact · Pricing · primary button "Let's Talk".
- **Mobile:** full-screen overlay menu with accordion groups for Services and Solutions.
- **Footer:** CTA band ("Ready to ...?" + button + team avatar stack), contact strip (phone, email, "Responds same day"), trust badges row, 4 link columns (Design services, Development services, Company, Solutions), social links, offices row, legal links, copyright.
- **Floating:** WhatsApp button (you already have one).

---

## 3. Page-by-page section breakdown

Section names are ours. "Pattern" describes the layout and interaction to reproduce. Copy column shows what *you* need to write.

### 3.1 Home (16 sections)

| # | Section | Pattern | Your content |
| --- | --- | --- | --- |
| 1 | Header | Sticky, transparent over dark hero, gains solid/blurred background after scroll; mega menus | Nav labels |
| 2 | Hero | Dark background, centred H1 (2-3 lines, ~8-10 words), 1-2 line subhead, primary CTA "Schedule a meeting", 3D/abstract hero visual (Focotik: metallic sculpture image), 2-4 stat cards in hero corners | H1, subhead, hero visual, 2 headline stats |
| 3 | Showreel | Large rounded video card with play button; autoplay muted loop, click opens full video with sound in a lightbox *(inferred)* | 30-60s showreel video |
| 4 | Stats strip | 4 stats with count-up on enter (products shipped, countries, value delivered, rating) | 4 true stats |
| 5 | Partner logos | "Top partners we worked with", 2 rows infinite marquee, greyscale logos, opposite directions *(inferred from 3x duplicated markup)* | 15-30 client logos (with permission) |
| 6 | Featured work | Heading + "Check more projects" button; 2-column grid of 6 case-study cards: large thumbnail, tags, title, "See more"; image zooms on hover | 6 case studies |
| 7 | Redesign callout | Short block about redesigning existing products + post-launch support; abstract line graphic | ~40 words |
| 8 | Services overview | Icon cards (8) with short descriptions; then detailed service rows (8) each with 1-3 sentences and "View more" | Service names, descriptions, icons |
| 9 | Unlimited services slider | Dark section, "Unlimited design support in one flexible plan"; horizontally scrolling/auto-sliding offer cards with image + title + keyword tags *(inferred: markup repeated 3x = infinite carousel)* | 7 offer cards with images |
| 10 | Client proof | Client logos as tabs (4) controlling a testimonial panel: video testimonial + quote + service tags + name/role *(inferred tabbed slider)* | 3-4 video testimonials |
| 11 | How we use AI | Green full-width section, intro + 4 feature cards with icons, side visual | Your AI workflow story |
| 12 | How we work | 3 numbered step cards (Subscribe & onboard / Request anything / Ship), CTA to pricing | Your process |
| 13 | Daily working model | 4 feature cards (Slack, Figma, Loom, weekly sync) + chat mock UI visual + CTA | Your tools and cadence |
| 14 | Why us | "Us vs alternatives" cards: problem vs our answer pairs (hiring time, in-house cost, scope creep...), plus colourful metric tiles | Your comparison points and numbers |
| 15 | Recognition | Badge grid (Clutch, Google, Behance, Dribbble, Upwork, DesignRush) | Your real profiles/badges |
| 16 | Testimonials wall | Masonry of text testimonials with avatar, name, role, platform badge, plus a "Sound good?" CTA card | 6-10 written reviews |
| 17 | FAQ | Accordion, 6 questions, one open at a time, +/− icon rotates | 6 Q&As |
| 18 | Contact block | Dark: team leads with LinkedIn, 3 "next steps", email/WhatsApp/booking; right: brief form with budget-range chips and project-type chips | Contact details, booking link |
| 19 | Footer | See navigation model | |

### 3.2 Work index (`/works`)

1. Hero: H1 + intro paragraph.
2. Case-study grid: all projects (Focotik: 9). We should add **filter chips by category/industry** (Focotik lacks this; your admin already has tags).
3. Mid-page CTA card ("Let's craft your unique product" + button).
4. Dribbble/Behance shots slider with "Load more" pagination and link to profile.
5. Partner logo marquee.
6. Showreel video.
7. Testimonials ("Words from the founders"), 6-7 cards.
8. Contact strip + booking CTA.
9. Final CTA band + footer.

### 3.3 Case study detail (`/works/[slug]`)

1. Title block: project name, one-line summary, tags, meta grid (Category, Release year, Timeframe), "Check live" external link, full-width hero mockup.
2. Sticky left "Overview" index with numbered chapters 01-05 that highlight as you scroll *(inferred; recommend implementing)*.
3. 01 Introduction · 02 The client · 03 The challenge (Problem / Solution pairs) · 04 Features (image gallery) · 05 Impact (results + client quote).
4. "More projects": 2 related cards.
5. Final CTA + contact strip.

Data fields needed per case study: title, slug, summary, tags[], category, year, duration, live URL, hero image, intro, client, problems[{problem, solution}], gallery[], impact text, metrics[], testimonial (quote, name, role, avatar), related projects.

### 3.4 Service landing page (`/services/[slug]`, long-form template, 14 sections)

This is Focotik's strongest SEO and conversion page. One template, reused per service.

1. Hero: eyebrow, H1, intro, 2 CTAs (Book a call / See pricing), 5 check-mark highlights.
2. Partner logo marquee.
3. Problem section: big stat ("7s"), 3 numbered insights, second stat.
4. What we offer: 7 deliverable cards + CTA.
5. Proof: 3 big stats.
6. Selected works: 3 case cards with star rating and client quote.
7. Process timeline: 5 phases with week labels, horizontal timeline + 5 detailed phase cards, "Need it faster?" callout, CTA.
8. Industries served: 6 cards with tags.
9. How we work: 4 feature items + CTA.
10. Are we a fit: 8 bullets + CTA.
11. By the numbers: 4 stats.
12. Why us: 6 reason cards.
13. Testimonials: 2 video + 6 text.
14. FAQ accordion (service-specific, with FAQPage schema) + final CTA.

Focotik has 13 service pages. Suggested Future Solutions list (confirm with your info): Website design, Website development, E-commerce, Mobile app, Custom software / web app, UI/UX design, Branding, SaaS product design, AI automation, Digital marketing / SEO, Website redesign.

### 3.5 Solution pages (`/solutions/*`)

Same long-form template family as services, with these unique blocks:
- **MVP:** Problem/solution pairs, outcome metrics, case grid, 5 service cards with sub-item lists, 6-step process, "what you receive" icon grid, budget FAQ.
- **Product redesign:** before/after slider *(recommended addition)*, audit checklist, process.
- **Team extension:** 3-column comparison table (Us vs full-time hire vs agency, 8 rows with ticks/crosses), 12-service grid, 4-step "inside your team in a week" timeline, "Great fit / Not a fit" cards, day-to-day list, pricing tiers, FAQ.

### 3.6 Pricing

1. Hero: H1, scarcity badge ("3 spots available this month"), trust row (rating, clients, awards, company registration).
2. **Tabs:** Subscription based / Project based.
3. **Billing toggle:** Monthly / Quarterly with "Save 10%" pill; prices animate on change.
4. Plan cards (3): name, team size/hours, price, "pause or cancel anytime", feature list with ticks, CTA "Book a free call"; middle card highlighted. Third card "Custom / Let's talk".
5. Project packages (3-4 cards with delivery days).
6. "Everything included" checklist (~20 items).
7. Pricing FAQ + CTA.

Pricing must be in your currency choice (BDT and/or USD). Decide whether you sell subscriptions, fixed projects, or both.

### 3.7 About

1. Hero: H1 + intro + 3 stats.
2. "Why our name" / mission: 3 numbered principles + CTA.
3. Global footprint: region stats (clients per region) + country list over a background video or map.
4. Testimonials (video + text).
5. Partner marquee.
6. Team photo marquee ("Let's collaborate together").
7. Big kinetic headline ("Our expert design team is ready to help whenever needed") with scroll-driven word reveal *(inferred)*.
8. What differentiates us: 6 numbered items.
9. Story: years in business, deals, growth.
10. Founder block: photo, bio, 4 stats.
11. Values (4).
12. Selected work cards (6).
13. Culture cards ("Join our tribe", 6 photos).
14. Awards and recognition (6 badges).
15. Meet the team: grid of profile cards (photo, name, title), 3 principles.
16. Contact block + footer.

### 3.8 Careers

Hero + stats, open positions list (with empty state + "Book a call / send CV"), team testimonial slider, 6 perks, 3-phase process, team photo marquee, CTA. Your repo already has a career application form; keep it (Focotik has none).

### 3.9 Blog index and article

- **Index:** H1, 3 featured posts row, category filter chips (9 on Focotik), post grid (category, read time, title, excerpt, author, date), pagination (18 per page), CTA band, newsletter form.
- **Article:** back link, H1, cover image, author avatar + name + date + read time, copy-link share button with "Copied!" toast, **sticky table of contents** generated from H2/H3, inline CTA box, body, author bio box, 3 related posts, final CTA.

### 3.10 Contact

1. Team leads (photo, role, LinkedIn).
2. Next steps (3 numbered: reply within X hours, brief call, NDA on request).
3. Direct channels: email, WhatsApp, "Book a free 30-min call".
4. **Brief form:** name, email, company, phone/WhatsApp (we add these; Focotik's are missing), budget range as selectable chips, project type chips, message, file attachment (optional), Turnstile; success and error states.
5. Testimonial.
6. "Flexible timezone" / "Fast response" features.
7. Office cards with address, map link, WhatsApp, email.
8. Recognition badges.
9. FAQ (6) + footer.

---

## 4. Animation and interaction inventory

Priority: **P1** = needed for the "feels like Focotik" result, **P2** = polish, **P3** = optional.

| # | Interaction | Where | Behaviour | Tech | Pri | In repo? |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Smooth scroll | Global | Inertia scrolling, disabled on touch and reduced motion | Lenis | P1 | Yes |
| 2 | Sticky header state | Global | Transparent to solid/blurred after ~80px; hide on scroll down, show on scroll up | CSS + small hook | P1 | Partial |
| 3 | Mega menu | Header | Hover/click opens 3-column panel with fade + 8px slide; keyboard accessible | Radix NavigationMenu | P1 | No |
| 4 | Mobile menu | Header | Full-screen overlay, staggered links, accordion groups | Motion | P1 | Partial |
| 5 | Hero entrance | Home/all heros | Heading lines mask-reveal with stagger, then subhead, CTA and stat cards fade-up | GSAP SplitText or own word split | P1 | Yes (text reveal) |
| 6 | Showreel card | Home, Works | Muted autoplay loop when in view, pause off-screen; click opens lightbox video with sound; custom "Play" cursor | IntersectionObserver + dialog | P1 | No |
| 7 | Count-up stats | Home, About, Services | Numbers count from 0 when 50% in view, once | Existing `counter.tsx` | P1 | Yes |
| 8 | Logo marquee | Home, Works, Services, About | Infinite horizontal loop, 2 rows opposite directions, slows on hover, greyscale to colour on hover | Existing `marquee.tsx` | P1 | Yes |
| 9 | Scroll reveal | All sections | Fade + 24-40px rise, staggered children, once | Existing `reveal.tsx` | P1 | Yes |
| 10 | Card hover | Work cards, service cards | Image scale 1.05 inside rounded mask, arrow icon slides, tag colour shift | CSS transitions | P1 | Partial (tilt card) |
| 11 | Offer card carousel | Home "unlimited services" | Auto-scrolling or drag carousel, loop | Embla Carousel or marquee | P1 | No |
| 12 | Testimonial tabs/slider | Home client proof, careers | Logo tabs switch video + quote with crossfade; autoplay with progress bar | Radix Tabs + Motion | P1 | No |
| 13 | Video testimonials | Home, About, Services | Poster image, click to play inline, one at a time | Native video | P1 | No |
| 14 | FAQ accordion | Home, Services, Contact, Pricing | One open at a time, height animation, icon rotates 45° | Radix Accordion | P1 | Yes (faq.tsx) |
| 15 | Pricing tabs + billing toggle | Pricing | Tab swap with crossfade; prices tween on toggle | Radix Tabs + Motion number | P1 | No |
| 16 | Brief form chips | Contact block | Budget and type options as pill radios with active fill; inline validation; success state animation | RHF + Zod (existing) | P1 | Partial |
| 17 | Sticky chapter index | Case study, blog TOC | Left nav sticks, active item highlights on scroll | IntersectionObserver | P2 | No |
| 18 | Process timeline | Service pages | Horizontal line fills as you scroll through phases | GSAP ScrollTrigger scrub | P2 | No |
| 19 | Kinetic headline | About | Large words reveal/colour-fill tied to scroll position | GSAP ScrollTrigger scrub | P2 | Yes (text reveal) |
| 20 | Team photo marquee | About, Careers | Slow infinite loop of portraits | Existing marquee | P2 | Yes |
| 21 | Copy-link button | Blog post | Copies URL, "Copied!" toast | Clipboard API | P2 | No |
| 22 | Button hover | Global | Background fill slides, arrow nudges; magnetic effect on primary CTAs | CSS + small hook | P2 | Partial |
| 23 | Comparison table | Team extension | Rows stagger in, our column highlighted | Reveal | P2 | No |
| 24 | Before/after slider | Product redesign | Drag handle comparing images | Small custom component | P3 | No |
| 25 | Page transitions | Global | Fast fade/wipe between routes | Existing `page-transition.tsx` | P3 | Yes |
| 26 | Custom cursor | Desktop | Label cursor on work cards ("View"), video ("Play") | Existing `custom-cursor.tsx` | P3 | Yes |
| 27 | 3D hero | Home | Your existing R3F scene can replace Focotik's static sculpture image | Existing | P3 | Yes |

Motion rules: animate only `transform` and `opacity`; 300-700ms durations, `power3.out` / custom ease; everything respects `prefers-reduced-motion`; no entrance animation on mobile for above-the-fold content (the repo already does this).

---

## 5. Recommended tech stack

Keep the stack already in the repository; it is a better fit than Webflow for your needs (custom admin, leads inbox, academy, Bangladeshi payment options later).

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 App Router, TypeScript | Already in place; SSG/ISR for speed and SEO |
| Styling | Tailwind CSS v4 with design tokens | Already in place; retheme via tokens |
| UI primitives | Radix UI (NavigationMenu, Tabs, Accordion, Dialog) | Accessible mega menu, tabs, accordions, lightbox |
| Motion | GSAP + ScrollTrigger, Lenis, Motion | Already in place |
| Carousel | Embla Carousel (add) | Lightweight, accessible, drag + autoplay |
| CMS / data | Supabase + your existing `/admin` | Already built; add new content types (see 9.2) |
| Forms | React Hook Form + Zod, Server Actions, Turnstile, Resend | Already built |
| Booking | Cal.com or Google Calendar appointment link | Matches "Book a free 30-min call" |
| Video hosting | Mux, Bunny Stream, or Cloudinary (HLS, poster frames) | Showreel and testimonial videos without hurting LCP |
| Images | `next/image` + Supabase Storage (WebP/AVIF) | Already in place |
| Analytics | Existing page-view tracker + GA4 or Plausible; Microsoft Clarity for heatmaps | Conversion tracking on CTAs and form |
| Hosting | Vercel | Already planned |

Alternative if you prefer no-code editing like Focotik: Webflow. Not recommended here because you would lose the admin, leads inbox, academy and the work already done.

---

## 6. Component list

**Layout:** Header, MegaMenu (Services, Solutions), MobileMenu, Footer, FooterCTA, ContactStrip, WhatsAppButton, AnnouncementBar.

**Primitives (ui):** Button (primary / secondary / ghost / arrow), Badge/Tag, Chip (radio pill), Card, SectionHeading (eyebrow + H2 + intro), Container, StatItem, IconFeature, Avatar, AvatarStack, RatingStars, Breadcrumbs, Tabs, Accordion, Dialog/Lightbox, VideoPlayer, Toast.

**Sections (reusable across pages):**
- HeroCentered (H1, subhead, CTAs, stat cards, visual)
- HeroSplit (service/solution pages, with checklist)
- ShowreelCard
- StatsStrip
- LogoMarquee
- WorkGrid + WorkCard (+ filter chips)
- ServicesIconGrid, ServiceRows
- OfferCarousel
- ClientProofTabs (logo tabs + video testimonial)
- FeatureCardsGrid (AI, daily model, how we work, why us)
- StepsNumbered
- ComparisonCards (problem vs answer)
- ComparisonTable (3 columns)
- ProcessTimeline
- IndustriesGrid
- FitChecklist (great fit / not a fit)
- RecognitionBadges
- TestimonialMasonry, TestimonialSlider
- FAQSection (with JSON-LD)
- ContactBlock (team leads, next steps, channels, BriefForm)
- OfficeCards
- PricingTabs, PlanCard, BillingToggle, PackageCard, IncludedChecklist
- TeamGrid, TeamMarquee, ValuesGrid, FounderBlock, FootprintStats
- CaseStudyHeader, ChapterNav, ProblemSolutionPairs, Gallery, ImpactBlock, RelatedProjects
- BlogFeaturedRow, BlogFilter, PostCard, Pagination, TableOfContents, AuthorBox, ShareCopyLink, InlineCTA, RelatedPosts, NewsletterForm
- CTABand

**Templates:** ServicePageTemplate and SolutionPageTemplate driven by data (sections toggled per record), so adding a service in the admin produces a full landing page.

---

## 7. Non-functional requirements

### 7.1 SEO
- Unique title (≤60 chars) and meta description (≤155) per page; canonical URLs; one H1 per page.
- JSON-LD: Organization, WebSite, LocalBusiness (each office), Service, CreativeWork (case study), BlogPosting with author, FAQPage, BreadcrumbList. (Most already exist.)
- Clean URL strategy: one of `/services` only, never both `/service` and `/services`; www vs non-www fixed with a redirect.
- Location landing pages (e.g. `/locations/dhaka`, `/locations/uttara`) for local search, if relevant.
- Sitemap.xml and robots.txt (exist), Open Graph images per page type (exist).
- 301 redirects for any renamed URLs (e.g. `/works` → `/portfolio`).
- Blog: categories, author pages, internal links from service pages to related posts.

### 7.2 Performance budgets (mobile, 4G throttled)
- Lighthouse Performance ≥ 90 on Home, Service and Case study pages (repo currently scores 91-97).
- LCP ≤ 2.5s, CLS ≤ 0.05, INP ≤ 200ms.
- Hero video: poster image first, video lazy-loaded, ≤ 3 MB for the muted loop, HLS for the full showreel.
- Images: AVIF/WebP, responsive sizes, lazy below the fold; logo SVGs.
- JS: carousels and video players loaded only where used; 3D hero stays desktop-only.
- Fonts: 2 families max, self-hosted with `next/font`, `font-display: swap`.

### 7.3 Accessibility (WCAG 2.2 AA)
- Colour contrast ≥ 4.5:1 for body text, including on the orange accent and on dark sections.
- Mega menu, tabs, accordion, carousel and dialogs fully keyboard operable (Radix provides this).
- Marquees and autoplaying carousels/videos have pause controls and stop under reduced motion.
- Video testimonials have captions or transcripts.
- Visible focus rings; form fields with labels, error messages tied by `aria-describedby`.
- Alt text on all meaningful images (the admin already requires alt text in the media library).

### 7.4 Security and privacy
- Turnstile, honeypot and rate limiting on all forms (exist).
- Cookie consent banner with categories (Focotik has Essential / Marketing / Personalization / Analytics) if you add marketing pixels.
- Privacy policy covering form data and analytics.

### 7.5 Browser and device support
Latest 2 versions of Chrome, Safari (iOS and macOS), Firefox, Edge; layouts tested at 360, 390, 768, 1024, 1280, 1440, 1920px.

---

## 8. Content and assets you must supply

Nothing below can be copied from Focotik.

**Brand**
- [ ] Logo files (SVG, light and dark versions, favicon)
- [ ] Brand colours (primary accent, secondary, neutrals) or approval to propose a palette
- [ ] Fonts (or approval to choose)
- [ ] Hero visual direction (3D object, photo, illustration)

**Copy**
- [ ] Positioning line / H1 and subhead
- [ ] Service list (final), with 1-paragraph description each; for each priority service the long-form content in section 3.4
- [ ] Solutions you want to sell (MVP, redesign, team extension, or others)
- [ ] Process steps and timelines
- [ ] 6-10 FAQs for home, plus 4-6 per service
- [ ] About story, mission, values, differentiators
- [ ] Pricing model and prices

**Proof**
- [ ] 6-12 case studies (see data fields in 3.3), with client permission
- [ ] Client logos with permission to display
- [ ] Testimonials: 6-10 written (name, role, company, photo), 2-4 videos if possible
- [ ] True numbers for the stats strip (projects delivered, countries, years, clients, rating)
- [ ] Profiles and badges: Google Business, Clutch, Behance, Dribbble, Upwork, Fiverr, LinkedIn (links)
- [ ] Awards or certifications

**Media**
- [ ] Showreel video (30-60s) or footage to edit one
- [ ] Team photos (consistent style), office photos, culture photos
- [ ] Project mockups/screenshots for each case study

**People**
- [ ] Team members: name, title, photo, LinkedIn
- [ ] 1-2 named contact leads for the contact block
- [ ] Founder bio and photo

**Operations**
- [ ] Booking link (Cal.com / Google Calendar)
- [ ] Email for leads, WhatsApp number, phone
- [ ] Office addresses (all locations) and business hours / time zones
- [ ] Response-time promise (one number, used everywhere)
- [ ] Domain and DNS access, Google Search Console, analytics accounts

---

## 9. Gap analysis against the current repository

### 9.1 Reusable as-is
Next.js foundation, Tailwind tokens, Supabase schema and RLS, admin dashboard (modules, media, leads, settings, users), lead forms pipeline, SEO helpers and JSON-LD, Lenis, marquee, counters, reveals, text reveal, tilt card, custom cursor, page transitions, preloader, blog, careers form, pricing table, FAQ, portfolio and services detail routes.

### 9.2 Data model additions (Supabase migrations + admin modules)
- `projects`: add category, year, duration, live_url, problems (json), gallery, impact, metrics, testimonial link, related ids.
- `services`: add long-form section JSON (problem stats, offers, process phases, industries, fit list, reasons, FAQs) and `group` (design / service / development) for the mega menu.
- New `solutions` table (or a `kind` column on services).
- `pricing_plans`: add `plan_type` (subscription / project), monthly and quarterly price, hours, highlight flag, delivery days.
- `testimonials`: add video_url, poster, tags, platform (Clutch/Google/...).
- `team_members`: add `is_contact_lead`, LinkedIn.
- New `offices` (city, address, map, phone, email, timezone) and `badges` (image, label, url).
- `blog_posts`: add category, read time, author relation, featured flag.
- `leads`: add budget_range and project_type.

### 9.3 New UI work
Mega menu, showreel card + lightbox, offer carousel, client-proof tabs with video, pricing tabs + billing toggle, comparison table, process timeline, chapter nav / TOC, before/after slider, brief form with chips, office cards, recognition badges, testimonial masonry, team grid/marquee, blog filter and author box, solution pages, location pages, full visual retheme to the new style.

---

## 10. Development phases and milestones

Assumes one senior full-stack developer plus a designer, building on the existing repo. Durations are working weeks.

| Phase | Scope | Output / milestone | Est. |
| --- | --- | --- | --- |
| 0. Discovery | Collect company info (section 11), confirm sitemap, decide pricing model, record reference site interactions | Signed-off sitemap, content checklist owner per item | 0.5 wk |
| 1. Design | Moodboard and brand tokens; Figma for Home, Service template, Case study, Pricing, Contact, About, Blog (desktop + mobile); component library; motion spec | **M1: Figma approved** | 2 wk |
| 2. Foundation retheme | Apply new tokens, typography, header with mega menu, mobile menu, footer, buttons, primitives; data model migrations and admin modules from 9.2 | **M2: design system live on staging** | 1.5 wk |
| 3. Home + conversion core | All home sections, brief form with chips, booking integration, showreel, offer carousel, client-proof tabs, testimonials, FAQ | **M3: Home page on staging** | 2 wk |
| 4. Templates | Service and Solution long-form templates, Case study template, Work index with filters, Pricing tabs/toggle | **M4: all templates on staging** | 2 wk |
| 5. Remaining pages | About, Careers, Contact, Blog index/article (TOC, author, related, newsletter), location pages, legal | **M5: full site on staging** | 1.5 wk |
| 6. Content load | Enter all services, projects, testimonials, team, posts via admin; image optimisation; copy proofreading | **M6: content complete** | 1 wk (parallel with 5 if content is ready) |
| 7. QA and launch | Cross-browser/device QA, accessibility audit, Lighthouse, SEO checks, redirects, analytics events, form tests, Search Console | **M7: production launch** | 1 wk |
| 8. Post-launch | Monitor analytics and leads, fix issues, add blog posts, A/B test hero CTA | Monthly report | ongoing |

**Total: about 10-11 weeks** to launch; the critical path is design approval (M1) and receiving case-study content (M6). Content delays are the most common cause of slippage, so section 8 items should be gathered during Phases 1-3.

### Acceptance criteria for launch
- Every page in section 2 implemented and populated with real content (no placeholder or lorem ipsum anywhere).
- All CTAs point to a real destination; zero broken links.
- Lighthouse mobile ≥ 90 performance, 100 accessibility/SEO/best practices on key templates.
- Forms deliver to inbox and admin leads table; success/error states verified.
- All interactions in section 4 marked P1 implemented and working with reduced motion.
- Content editable from `/admin` without code changes.

---

## 11. Company information to send next

Please reply with as much of this as you have. Anything missing can be filled later; items marked ★ block the design phase.

1. ★ Company name as shown on the site, tagline, and one-sentence description of what you do and for whom.
2. ★ Target clients and markets (Bangladesh only, or also USA/UK/Middle East?) and site language(s).
3. ★ Final list of services (and which 3-4 are your priority for leads).
4. ★ Do you still want the Products and Academy sections on the new site?
5. ★ Pricing model: subscription, fixed project packages, hourly, or "contact for quote"; currency (BDT, USD, both).
6. ★ Brand assets: logo, colours, fonts, or permission to propose new ones.
7. Real stats: years in business, projects delivered, clients, countries, team size, ratings.
8. Case studies you can show (names, links, screenshots, results, client quotes, permission).
9. Client logos you can display.
10. Testimonials (text and any videos) and review profile links (Google, Clutch, Fiverr, Upwork, etc.).
11. Team list: names, titles, photos, LinkedIn; who is the contact lead on the contact page.
12. Founder story, mission, values, what makes you different.
13. Process: how a project runs, timelines, tools you use (Slack, Figma, Jira, WhatsApp...).
14. Office address(es), phone, WhatsApp, email, business hours, booking link.
15. Social media links.
16. Awards, certifications, partnerships.
17. Domain, hosting preference, and who will edit content after launch.
18. Launch deadline and budget range for the build.
