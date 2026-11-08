-- ============================================================================
-- Seed · realistic sample content for Future Solutions
-- Run after migrations: `supabase db reset` (local) or paste into SQL editor.
-- Safe to re-run: every insert is keyed on slug / key.
-- ============================================================================

-- Settings --------------------------------------------------------------------
insert into public.settings (key, value) values
('contact', '{
  "email": "hello@futuresolution.online",
  "phone": "+880 1714-530063",
  "whatsapp": "+8801714530063",
  "address": "Road 13, Sector 13, Uttara, Dhaka 1230, Bangladesh",
  "mapQuery": "Road 13, Sector 13, Uttara, Dhaka 1230, Bangladesh",
  "mapEmbedUrl": ""
}'::jsonb),
('socials', '{
  "facebook": "https://facebook.com/futuresolutionsbd",
  "linkedin": "https://linkedin.com/company/future-solutions-bd",
  "instagram": "",
  "youtube": "",
  "github": ""
}'::jsonb),
('seo', '{
  "title": "Future Solutions — Smart Solutions. Lasting Impact.",
  "titleTemplate": "%s · Future Solutions",
  "description": "Future Solutions is a software company and IT training institute in Uttara, Dhaka. Website design & development, e-commerce, mobile apps, custom software, AI automation and digital marketing.",
  "keywords": ["software company Dhaka", "web development Bangladesh", "e-commerce development", "mobile app development", "custom software", "AI automation", "digital marketing SEO", "IT training institute Uttara"],
  "ogImage": "/opengraph-image"
}'::jsonb),
('homepage', '{
  "heroEyebrow": "Software company & IT training institute · Dhaka",
  "heroTitle": "Smart Solutions. Lasting Impact.",
  "heroSubtitle": "We design, build and scale digital products — from high-converting websites and e-commerce to mobile apps, custom software and AI automation.",
  "stats": [
    {"label": "Projects delivered", "value": 120, "suffix": "+"},
    {"label": "Happy clients", "value": 80, "suffix": "+"},
    {"label": "Students trained", "value": 500, "suffix": "+"},
    {"label": "Years of experience", "value": 6, "suffix": ""}
  ]
}'::jsonb),
('announcement', '{"enabled": false, "text": "", "href": ""}'::jsonb)
on conflict (key) do update set value = excluded.value;

-- Services --------------------------------------------------------------------
insert into public.services
  (slug, title, short_description, description, icon, features, process_steps, deliverables, tech_stack, faqs, starting_price, price_currency, seo_title, seo_description, is_featured, sort_order, is_published)
values
(
  'website-design-development',
  'Website Design & Development',
  'Fast, beautiful, conversion-focused websites built on Next.js with headless CMS and perfect Core Web Vitals.',
  '<p>Your website is your hardest-working salesperson. We design and build sites that load instantly, rank on Google and turn visitors into leads. Every project starts with strategy — who the site is for and what it must achieve — before a single pixel is drawn.</p><p>We work in the open with weekly demos, hand over a fully documented codebase and train your team to edit content without touching code.</p>',
  'globe',
  '["Custom UI/UX design in Figma", "Next.js / React development", "Headless CMS with live preview", "Lighthouse 90+ on mobile", "On-page SEO & schema markup", "Multi-language ready", "Analytics & conversion tracking", "30 days post-launch support"]'::jsonb,
  '[{"title": "Discover", "description": "Workshops to map goals, audiences and content."}, {"title": "Design", "description": "Wireframes, then high-fidelity UI with motion studies."}, {"title": "Build", "description": "Component-driven development with weekly staging demos."}, {"title": "Launch", "description": "Performance audit, SEO checks, DNS and go-live."}]'::jsonb,
  '["Figma design system", "Production codebase on GitHub", "CMS training session", "SEO & performance report"]'::jsonb,
  '["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Sanity", "Vercel"]'::jsonb,
  '[{"q": "How long does a website take?", "a": "A marketing site typically ships in 4–8 weeks depending on page count and content readiness."}, {"q": "Can I edit the content myself?", "a": "Yes. Every site includes a CMS and a training session for your team."}, {"q": "Do you provide hosting?", "a": "We deploy to Vercel and can manage hosting and domains for you, or hand over the keys."}]'::jsonb,
  35000, 'BDT',
  'Website Design & Development in Dhaka | Future Solutions',
  'Conversion-focused Next.js websites with headless CMS, perfect Core Web Vitals and on-page SEO. Built in Uttara, Dhaka.',
  true, 1, true
),
(
  'e-commerce-solutions',
  'E-Commerce Solutions',
  'Online stores that sell — storefront, payments (bKash, Nagad, SSLCommerz, Stripe), inventory and order management.',
  '<p>From a first Shopify store to a custom headless commerce platform, we build shopping experiences that are fast, trustworthy and easy to run. Local payment gateways, courier integrations and Bangla/English storefronts come standard.</p><p>We obsess over checkout: fewer steps, clear delivery promises and mobile-first design that lifts conversion rates.</p>',
  'shopping-bag',
  '["Custom or Shopify / WooCommerce storefront", "bKash, Nagad, SSLCommerz & Stripe", "Inventory & order management", "Courier API integration (Pathao, RedX, Steadfast)", "Abandoned-cart recovery", "Product reviews & wishlists", "Facebook & Google catalog sync", "Admin dashboard with sales analytics"]'::jsonb,
  '[{"title": "Audit", "description": "Catalog, logistics and payment requirements."}, {"title": "Design", "description": "Storefront UX focused on mobile checkout."}, {"title": "Integrate", "description": "Payments, couriers and marketing channels."}, {"title": "Grow", "description": "Launch, then optimise conversion with data."}]'::jsonb,
  '["Storefront & admin", "Payment gateway setup", "Courier integrations", "Staff training & SOPs"]'::jsonb,
  '["Next.js", "Medusa", "Shopify", "WooCommerce", "Stripe", "SSLCommerz", "Supabase"]'::jsonb,
  '[{"q": "Which payment gateways do you support?", "a": "bKash, Nagad, Rocket, SSLCommerz, Stripe and PayPal, plus cash on delivery."}, {"q": "Can you migrate my existing store?", "a": "Yes — products, customers and orders are migrated with zero downtime."}]'::jsonb,
  60000, 'BDT',
  'E-Commerce Development Bangladesh | bKash, Nagad, SSLCommerz',
  'Custom and Shopify e-commerce stores with local payment gateways, courier integration and sales analytics.',
  true, 2, true
),
(
  'mobile-app-development',
  'Mobile App Development',
  'Native-quality iOS and Android apps with React Native and Flutter, shipped to both stores from one codebase.',
  '<p>We design and build mobile apps that people keep on their home screen. One codebase, two platforms, native performance — with offline support, push notifications and analytics baked in.</p><p>From MVP to scale, we handle App Store and Play Store submission, crash monitoring and release management.</p>',
  'smartphone',
  '["iOS & Android from one codebase", "React Native or Flutter", "Offline-first data sync", "Push notifications", "In-app payments & subscriptions", "Biometric authentication", "App Store & Play Store submission", "Crash reporting & analytics"]'::jsonb,
  '[{"title": "Scope", "description": "User stories, flows and MVP definition."}, {"title": "Prototype", "description": "Clickable Figma prototype validated with users."}, {"title": "Develop", "description": "Two-week sprints with TestFlight / internal builds."}, {"title": "Release", "description": "Store listing, review and phased rollout."}]'::jsonb,
  '["Published apps on both stores", "Backend API & admin panel", "Source code & CI pipeline", "Release playbook"]'::jsonb,
  '["React Native", "Expo", "Flutter", "TypeScript", "Supabase", "Firebase", "Node.js"]'::jsonb,
  '[{"q": "React Native or Flutter?", "a": "Both are excellent. We recommend based on your team, existing web stack and design requirements."}, {"q": "Do you handle store submissions?", "a": "Yes, including developer accounts, listings, screenshots and review feedback."}]'::jsonb,
  120000, 'BDT',
  'Mobile App Development Dhaka | React Native & Flutter',
  'Cross-platform iOS and Android apps with offline sync, push notifications and store submission handled end to end.',
  true, 3, true
),
(
  'custom-software-development',
  'Custom Software Development',
  'ERP, CRM, HR, inventory, school and clinic management systems — tailored to how your business actually works.',
  '<p>Off-the-shelf software forces you to change your process. We build systems around your workflow instead: role-based dashboards, approvals, reporting and integrations with the tools you already use.</p><p>Secure by design, with audit logs, backups and documentation so your software is an asset, not a dependency.</p>',
  'code',
  '["Requirement analysis & system design", "Web-based dashboards with role permissions", "Workflow automation & approvals", "Reporting & data export", "REST / GraphQL APIs", "Third-party integrations", "Audit logs & backups", "Ongoing maintenance SLAs"]'::jsonb,
  '[{"title": "Analyse", "description": "Process mapping with your team."}, {"title": "Architect", "description": "Data model, security and integration plan."}, {"title": "Build", "description": "Iterative delivery, module by module."}, {"title": "Support", "description": "Training, documentation and SLA support."}]'::jsonb,
  '["Production system & admin", "API documentation", "Deployment & backup setup", "User manuals"]'::jsonb,
  '["Next.js", "Node.js", "PostgreSQL", "Supabase", "Prisma", "Docker", "AWS"]'::jsonb,
  '[{"q": "Do I own the source code?", "a": "Yes, 100%. Everything is delivered in your own GitHub organisation."}, {"q": "Can you integrate with my accounting software?", "a": "Yes — we routinely integrate with Tally, QuickBooks, Xero and local banking APIs."}]'::jsonb,
  150000, 'BDT',
  'Custom Software Development Company in Dhaka',
  'ERP, CRM, HR and inventory systems built around your workflow with role-based dashboards and integrations.',
  true, 4, true
),
(
  'digital-marketing-seo',
  'Digital Marketing & SEO',
  'Technical SEO, content, Google & Meta ads and analytics — measurable growth, not vanity metrics.',
  '<p>Traffic is only useful if it converts. We combine technical SEO, content strategy and paid campaigns with rigorous tracking so every taka is accountable.</p><p>Monthly reports show rankings, leads and revenue — the numbers that matter to your business.</p>',
  'line-chart',
  '["Technical SEO audits & fixes", "Keyword research & content strategy", "Google Ads & Meta Ads management", "Local SEO & Google Business Profile", "Conversion rate optimisation", "GA4 & server-side tracking", "Social media management", "Monthly performance reports"]'::jsonb,
  '[{"title": "Audit", "description": "Technical, content and competitor analysis."}, {"title": "Plan", "description": "90-day roadmap with KPIs."}, {"title": "Execute", "description": "Content, campaigns and on-site fixes."}, {"title": "Report", "description": "Monthly dashboard and strategy review."}]'::jsonb,
  '["SEO audit & roadmap", "Campaign setup & creatives", "Analytics dashboard", "Monthly reports"]'::jsonb,
  '["Google Search Console", "GA4", "Google Ads", "Meta Ads", "Ahrefs", "Looker Studio"]'::jsonb,
  '[{"q": "How soon will I see SEO results?", "a": "Technical fixes show within weeks; competitive keyword gains typically take 3–6 months."}, {"q": "Is there a minimum contract?", "a": "We recommend 3 months minimum for SEO; ads management is month-to-month."}]'::jsonb,
  15000, 'BDT',
  'Digital Marketing & SEO Agency in Dhaka | Future Solutions',
  'Technical SEO, content, Google & Meta ads and GA4 tracking with transparent monthly reporting.',
  false, 5, true
),
(
  'ai-automation-solutions',
  'AI Automation Solutions',
  'Chatbots, document processing, lead qualification and internal copilots powered by LLMs — automate the repetitive, scale the human.',
  '<p>We help businesses put AI to work on real problems: 24/7 customer support in Bangla and English, invoice and document extraction, lead scoring, content pipelines and internal knowledge assistants.</p><p>Built responsibly with guardrails, human-in-the-loop review and clear ROI tracking.</p>',
  'bot',
  '["WhatsApp & web chatbots (Bangla + English)", "RAG knowledge assistants over your docs", "Document & invoice data extraction", "Lead qualification & CRM automation", "Workflow automation (n8n, Make, Zapier)", "AI content & social pipelines", "Voice agents", "Guardrails, evals & monitoring"]'::jsonb,
  '[{"title": "Identify", "description": "Find high-ROI automation candidates."}, {"title": "Prototype", "description": "Working proof of concept in 2 weeks."}, {"title": "Integrate", "description": "Connect to your CRM, WhatsApp, email and databases."}, {"title": "Monitor", "description": "Evaluate quality, cost and iterate."}]'::jsonb,
  '["Deployed AI agent / workflow", "Integration with your tools", "Evaluation dashboard", "Runbook & training"]'::jsonb,
  '["Anthropic Claude", "OpenAI", "LangChain", "n8n", "Supabase pgvector", "WhatsApp Business API", "Python"]'::jsonb,
  '[{"q": "Will the chatbot understand Bangla?", "a": "Yes. We fine-tune prompts and test extensively in Bangla, Banglish and English."}, {"q": "How do you keep our data private?", "a": "Data stays in your own database; we use enterprise APIs with no training on your data and apply strict access controls."}]'::jsonb,
  50000, 'BDT',
  'AI Automation & Chatbot Development Bangladesh',
  'LLM chatbots, document extraction, lead automation and internal AI copilots with guardrails and ROI tracking.',
  true, 6, true
)
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  description = excluded.description,
  icon = excluded.icon,
  features = excluded.features,
  process_steps = excluded.process_steps,
  deliverables = excluded.deliverables,
  tech_stack = excluded.tech_stack,
  faqs = excluded.faqs,
  starting_price = excluded.starting_price,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

-- Clients & partners ----------------------------------------------------------
insert into public.clients (slug, name, website_url, industry, type, is_featured, sort_order, is_published) values
('dhaka-fresh-mart', 'Dhaka Fresh Mart', 'https://example.com', 'Grocery & Retail', 'client', true, 1, true),
('uttara-dental-care', 'Uttara Dental Care', 'https://example.com', 'Healthcare', 'client', true, 2, true),
('greenline-logistics', 'GreenLine Logistics', 'https://example.com', 'Logistics', 'client', true, 3, true),
('scholars-international-school', 'Scholars International School', 'https://example.com', 'Education', 'client', false, 4, true),
('nokshi-fashion', 'Nokshi Fashion', 'https://example.com', 'Fashion & Apparel', 'client', true, 5, true),
('bright-realty', 'Bright Realty', 'https://example.com', 'Real Estate', 'client', false, 6, true),
('supabase', 'Supabase', 'https://supabase.com', 'Technology Partner', 'partner', true, 7, true),
('vercel', 'Vercel', 'https://vercel.com', 'Technology Partner', 'partner', true, 8, true),
('sslcommerz', 'SSLCommerz', 'https://sslcommerz.com', 'Payments Partner', 'partner', true, 9, true)
on conflict (slug) do update set name = excluded.name, industry = excluded.industry, type = excluded.type, is_featured = excluded.is_featured, sort_order = excluded.sort_order, is_published = excluded.is_published;

-- Team ------------------------------------------------------------------------
insert into public.team_members (slug, name, role, bio, socials, skills, is_featured, sort_order, is_published) values
('shamim-hosen', 'Shamim Hosen', 'Founder & Lead Engineer', 'Full-stack engineer and educator who founded Future Solutions to build products that last and train the engineers who build them.', '{"linkedin": "", "github": "", "x": ""}'::jsonb, '["Next.js", "TypeScript", "Supabase", "System design", "Mentoring"]'::jsonb, true, 1, true),
('nabila-rahman', 'Nabila Rahman', 'Head of Design', 'Designs interfaces that feel inevitable. Leads brand, UX research and motion design across every project.', '{"linkedin": "", "dribbble": ""}'::jsonb, '["Figma", "Design systems", "Motion", "UX research"]'::jsonb, true, 2, true),
('tanvir-ahmed', 'Tanvir Ahmed', 'Mobile Lead', 'Ships React Native and Flutter apps used by hundreds of thousands of people across Bangladesh.', '{"linkedin": "", "github": ""}'::jsonb, '["React Native", "Flutter", "Firebase", "CI/CD"]'::jsonb, true, 3, true),
('farhana-islam', 'Farhana Islam', 'Growth & SEO Strategist', 'Turns search intent into pipeline. Runs SEO, paid media and analytics for our marketing clients.', '{"linkedin": ""}'::jsonb, '["SEO", "Google Ads", "GA4", "Content strategy"]'::jsonb, false, 4, true)
on conflict (slug) do update set name = excluded.name, role = excluded.role, bio = excluded.bio, skills = excluded.skills, is_featured = excluded.is_featured, sort_order = excluded.sort_order, is_published = excluded.is_published;

-- Projects --------------------------------------------------------------------
insert into public.projects
  (slug, title, client_name, client_id, service_id, industry, year, summary, challenge, solution, results, tech_stack, metrics, live_url, is_featured, sort_order, is_published)
values
(
  'dhaka-fresh-mart-ecommerce', 'Dhaka Fresh Mart — Grocery Delivery Platform', 'Dhaka Fresh Mart',
  (select id from public.clients where slug = 'dhaka-fresh-mart'),
  (select id from public.services where slug = 'e-commerce-solutions'),
  'Grocery & Retail', 2025,
  'A mobile-first grocery store with same-day delivery slots, bKash/Nagad payments and a rider app.',
  'Orders were taken over phone and Facebook Messenger, leading to missed deliveries and no inventory visibility.',
  'We built a custom Next.js storefront with delivery-slot scheduling, integrated SSLCommerz and bKash, and a React Native rider app with live order tracking.',
  'Online orders now account for 68% of revenue, average order value rose 24% and delivery errors dropped by 90%.',
  '["Next.js", "Supabase", "React Native", "SSLCommerz", "bKash"]'::jsonb,
  '[{"label": "Online revenue share", "value": "68%"}, {"label": "AOV increase", "value": "+24%"}, {"label": "Delivery errors", "value": "-90%"}]'::jsonb,
  'https://example.com', true, 1, true
),
(
  'uttara-dental-care-booking', 'Uttara Dental Care — Appointment & Patient Portal', 'Uttara Dental Care',
  (select id from public.clients where slug = 'uttara-dental-care'),
  (select id from public.services where slug = 'custom-software-development'),
  'Healthcare', 2024,
  'Clinic management system with online booking, SMS reminders, treatment history and billing.',
  'Double bookings and paper records made it hard to scale to a second branch.',
  'A role-based web app for reception, dentists and patients with calendar scheduling, automated SMS reminders and PDF invoices.',
  'No-shows fell by 41% and the clinic opened its second branch on the same system within six months.',
  '["Next.js", "PostgreSQL", "Supabase", "Twilio"]'::jsonb,
  '[{"label": "No-show reduction", "value": "-41%"}, {"label": "Branches on one system", "value": "2"}, {"label": "Patients onboarded", "value": "6,000+"}]'::jsonb,
  null, true, 2, true
),
(
  'greenline-logistics-tracking', 'GreenLine Logistics — Fleet Tracking Dashboard', 'GreenLine Logistics',
  (select id from public.clients where slug = 'greenline-logistics'),
  (select id from public.services where slug = 'custom-software-development'),
  'Logistics', 2024,
  'Real-time fleet tracking, trip assignment and fuel analytics for a 120-vehicle fleet.',
  'Dispatchers tracked vehicles across WhatsApp groups and spreadsheets.',
  'A live map dashboard fed by GPS trackers, automated trip assignment and monthly fuel efficiency reports.',
  'Idle time reduced 18% and dispatch handled 2x the trips with the same team.',
  '["Next.js", "Node.js", "PostgreSQL", "Mapbox", "MQTT"]'::jsonb,
  '[{"label": "Idle time", "value": "-18%"}, {"label": "Trips per dispatcher", "value": "2x"}, {"label": "Vehicles tracked", "value": "120"}]'::jsonb,
  null, true, 3, true
),
(
  'nokshi-fashion-brand-site', 'Nokshi Fashion — Brand Website & Lookbook', 'Nokshi Fashion',
  (select id from public.clients where slug = 'nokshi-fashion'),
  (select id from public.services where slug = 'website-design-development'),
  'Fashion & Apparel', 2025,
  'An editorial brand site with seasonal lookbooks, store locator and Instagram-synced product drops.',
  'The brand had a strong Instagram presence but no owned channel to tell its story or capture leads.',
  'A motion-rich Next.js site with CMS-managed lookbooks, newsletter capture and WhatsApp ordering.',
  'Organic traffic grew 3.2x in four months and newsletter sign-ups passed 5,000.',
  '["Next.js", "Sanity", "GSAP", "Vercel"]'::jsonb,
  '[{"label": "Organic traffic", "value": "3.2x"}, {"label": "Newsletter sign-ups", "value": "5,000+"}, {"label": "Lighthouse mobile", "value": "96"}]'::jsonb,
  'https://example.com', false, 4, true
)
on conflict (slug) do update set
  title = excluded.title, summary = excluded.summary, challenge = excluded.challenge, solution = excluded.solution,
  results = excluded.results, tech_stack = excluded.tech_stack, metrics = excluded.metrics, is_featured = excluded.is_featured,
  sort_order = excluded.sort_order, is_published = excluded.is_published;

-- Products --------------------------------------------------------------------
insert into public.products (slug, name, tagline, description, features, tech_stack, pricing_model, price, status, demo_url, is_featured, sort_order, is_published) values
('shopflow', 'ShopFlow', 'Launch your online store in a day', '<p>A ready-made e-commerce platform for Bangladeshi SMEs with bKash, Nagad and courier integrations built in. Your brand, your domain, live in 24 hours.</p>', '["Drag-and-drop storefront builder", "bKash / Nagad / SSLCommerz", "Pathao & Steadfast courier sync", "Facebook catalog sync", "Inventory alerts", "Bangla & English"]'::jsonb, '["Next.js", "Supabase", "Stripe"]'::jsonb, 'subscription', 2500, 'live', 'https://example.com', true, 1, true),
('eduhub', 'EduHub', 'School & coaching centre management', '<p>Admissions, attendance, fees, results and parent SMS in one dashboard — built with Bangladeshi schools and coaching centres.</p>', '["Student & batch management", "Fee collection with bKash", "Attendance & results", "Parent SMS notifications", "Teacher portal", "Reports & exports"]'::jsonb, '["Next.js", "PostgreSQL", "Supabase"]'::jsonb, 'subscription', 4000, 'live', null, true, 2, true),
('leadpilot-ai', 'LeadPilot AI', 'WhatsApp sales assistant that never sleeps', '<p>An AI agent that answers customer questions on WhatsApp in Bangla and English, qualifies leads and books meetings straight into your calendar.</p>', '["WhatsApp Business API", "Bangla + English", "Lead scoring", "Calendar booking", "CRM sync", "Human handoff"]'::jsonb, '["Claude", "n8n", "Supabase", "WhatsApp API"]'::jsonb, 'subscription', 6000, 'beta', null, true, 3, true)
on conflict (slug) do update set name = excluded.name, tagline = excluded.tagline, description = excluded.description, features = excluded.features, status = excluded.status, is_featured = excluded.is_featured, sort_order = excluded.sort_order, is_published = excluded.is_published;

-- Pricing plans ---------------------------------------------------------------
insert into public.pricing_plans (slug, name, description, category, price_monthly, price_yearly, price_one_time, currency, features, limits, cta_label, is_popular, sort_order, is_published) values
('starter-website', 'Starter', 'For new businesses that need a professional presence fast.', 'web', 4000, 40000, 35000, 'BDT',
  '["Up to 5 pages", "Responsive design", "Contact form & WhatsApp", "Basic on-page SEO", "1 revision round", "Hosting setup"]'::jsonb,
  '{"pages": 5, "revisions": 1, "support_days": 30}'::jsonb, 'Start with Starter', false, 1, true),
('business-website', 'Business', 'For growing companies that want to generate leads and rank on Google.', 'web', 9000, 90000, 85000, 'BDT',
  '["Up to 15 pages", "Custom UI design", "CMS with blog", "Advanced SEO & schema", "Animations & micro-interactions", "3 revision rounds", "Analytics dashboard", "90 days support"]'::jsonb,
  '{"pages": 15, "revisions": 3, "support_days": 90}'::jsonb, 'Choose Business', true, 2, true),
('enterprise-solution', 'Enterprise', 'Custom platforms, e-commerce and integrations with a dedicated team.', 'web', null, null, null, 'BDT',
  '["Unlimited pages", "E-commerce or custom software", "Third-party integrations", "Dedicated project manager", "SLA-backed support", "Priority roadmap", "Security review", "Training & documentation"]'::jsonb,
  '{"pages": null, "revisions": null, "support_days": 365}'::jsonb, 'Talk to sales', false, 3, true),
('growth-marketing', 'Growth Marketing', 'Monthly SEO + ads management for steady, compounding growth.', 'marketing', 15000, 150000, null, 'BDT',
  '["Technical SEO maintenance", "4 blog posts / month", "Google & Meta ads management", "Monthly reporting call", "Local SEO", "Conversion tracking"]'::jsonb,
  '{"posts_per_month": 4, "ad_platforms": 2}'::jsonb, 'Grow with us', false, 4, true)
on conflict (slug) do update set name = excluded.name, description = excluded.description, price_monthly = excluded.price_monthly, price_yearly = excluded.price_yearly, price_one_time = excluded.price_one_time, features = excluded.features, limits = excluded.limits, is_popular = excluded.is_popular, sort_order = excluded.sort_order, is_published = excluded.is_published;

-- Courses ---------------------------------------------------------------------
insert into public.courses (slug, title, short_description, description, level, format, duration_weeks, price, discount_price, curriculum, outcomes, prerequisites, batches, instructor_id, is_featured, sort_order, is_published) values
(
  'full-stack-web-development', 'Full-Stack Web Development with Next.js',
  'Go from HTML basics to deploying production Next.js + Supabase apps in 24 weeks.',
  '<p>Our flagship programme. Learn by building six real projects, pair with mentors who ship client work daily, and finish with a portfolio and interview prep.</p>',
  'beginner', 'hybrid', 24, 45000, 36000,
  '[{"module": "Web foundations", "topics": ["HTML & CSS", "Responsive layout", "Git & GitHub"]}, {"module": "JavaScript & TypeScript", "topics": ["ES2023+", "Async", "TypeScript"]}, {"module": "React & Next.js", "topics": ["Components", "App Router", "Server Actions"]}, {"module": "Backend & Databases", "topics": ["PostgreSQL", "Supabase", "Auth & RLS"]}, {"module": "Deployment & DevOps", "topics": ["Vercel", "CI/CD", "Monitoring"]}, {"module": "Capstone", "topics": ["Team project", "Code review", "Portfolio"]}]'::jsonb,
  '["Build & deploy full-stack apps", "Work in a Git-based team workflow", "Portfolio of 6 projects", "Interview & freelance readiness"]'::jsonb,
  '["Basic computer literacy", "A laptop (8 GB RAM recommended)"]'::jsonb,
  '[{"name": "Batch 12", "starts_on": "2026-01-10", "schedule": "Sat, Mon, Wed · 7–9 PM", "seats": 25, "seats_left": 9, "status": "enrolling"}, {"name": "Batch 13", "starts_on": "2026-04-04", "schedule": "Fri & Sat · 10 AM–1 PM", "seats": 25, "seats_left": 25, "status": "upcoming"}]'::jsonb,
  (select id from public.team_members where slug = 'shamim-hosen'), true, 1, true
),
(
  'mobile-app-development-react-native', 'Mobile App Development with React Native',
  'Build and publish cross-platform iOS and Android apps in 16 weeks.',
  '<p>From your first screen to a published app on both stores. Covers navigation, state, native modules, offline data and release management.</p>',
  'intermediate', 'hybrid', 16, 35000, null,
  '[{"module": "React Native & Expo", "topics": ["Setup", "Components", "Navigation"]}, {"module": "State & Data", "topics": ["Hooks", "Offline sync", "Supabase"]}, {"module": "Native features", "topics": ["Camera", "Push", "Payments"]}, {"module": "Release", "topics": ["EAS Build", "App Store", "Play Store"]}]'::jsonb,
  '["Publish an app to both stores", "Implement offline-first data", "Handle push & payments"]'::jsonb,
  '["JavaScript fundamentals", "Basic React knowledge"]'::jsonb,
  '[{"name": "Batch 5", "starts_on": "2026-02-01", "schedule": "Sun, Tue, Thu · 7–9 PM", "seats": 20, "seats_left": 14, "status": "enrolling"}]'::jsonb,
  (select id from public.team_members where slug = 'tanvir-ahmed'), true, 2, true
),
(
  'digital-marketing-seo-mastery', 'Digital Marketing & SEO Mastery',
  'Learn SEO, Google Ads, Meta Ads and analytics with live client campaigns in 12 weeks.',
  '<p>A hands-on programme where you run real campaigns, read real dashboards and leave with certifications and a results-driven portfolio.</p>',
  'beginner', 'online', 12, 18000, 15000,
  '[{"module": "SEO", "topics": ["Technical SEO", "Keyword research", "Content"]}, {"module": "Paid media", "topics": ["Google Ads", "Meta Ads", "Creative testing"]}, {"module": "Analytics", "topics": ["GA4", "Tag Manager", "Looker Studio"]}]'::jsonb,
  '["Run SEO audits", "Launch & optimise ad campaigns", "Build reporting dashboards"]'::jsonb,
  '["None"]'::jsonb,
  '[{"name": "Batch 8", "starts_on": "2026-01-20", "schedule": "Mon & Wed · 8–10 PM", "seats": 30, "seats_left": 22, "status": "enrolling"}]'::jsonb,
  (select id from public.team_members where slug = 'farhana-islam'), false, 3, true
),
(
  'ai-automation-for-business', 'AI Automation for Business',
  'Build chatbots, document pipelines and no-code automations with LLMs in 8 weeks.',
  '<p>For founders, marketers and developers who want to put AI to work. Build a WhatsApp assistant, an invoice extractor and an internal knowledge bot.</p>',
  'intermediate', 'online', 8, 25000, null,
  '[{"module": "LLM foundations", "topics": ["Prompting", "RAG", "Evals"]}, {"module": "Automation", "topics": ["n8n", "APIs", "Webhooks"]}, {"module": "Projects", "topics": ["WhatsApp bot", "Doc extraction", "Knowledge base"]}]'::jsonb,
  '["Ship 3 working AI automations", "Evaluate & monitor LLM output", "Integrate AI with business tools"]'::jsonb,
  '["Comfort with spreadsheets or basic coding"]'::jsonb,
  '[{"name": "Batch 2", "starts_on": "2026-03-01", "schedule": "Sat & Sun · 11 AM–1 PM", "seats": 20, "seats_left": 20, "status": "upcoming"}]'::jsonb,
  (select id from public.team_members where slug = 'shamim-hosen'), true, 4, true
)
on conflict (slug) do update set title = excluded.title, short_description = excluded.short_description, description = excluded.description, price = excluded.price, discount_price = excluded.discount_price, curriculum = excluded.curriculum, outcomes = excluded.outcomes, batches = excluded.batches, is_featured = excluded.is_featured, sort_order = excluded.sort_order, is_published = excluded.is_published;

-- Testimonials ----------------------------------------------------------------
insert into public.testimonials (slug, author_name, author_role, author_company, client_id, content, rating, source, is_approved, is_featured, sort_order, is_published) values
('rafiq-dhaka-fresh-mart', 'Rafiqul Islam', 'Managing Director', 'Dhaka Fresh Mart', (select id from public.clients where slug = 'dhaka-fresh-mart'), 'Future Solutions rebuilt our entire ordering flow. Online orders went from zero to the majority of our revenue in under a year, and the team still answers our WhatsApp within minutes.', 5, 'Direct', true, true, 1, true),
('dr-sabrina-uttara-dental', 'Dr. Sabrina Haque', 'Principal Dentist', 'Uttara Dental Care', (select id from public.clients where slug = 'uttara-dental-care'), 'The booking system paid for itself in three months. No-shows dropped dramatically and opening our second branch was painless because everything was already in one place.', 5, 'Google', true, true, 2, true),
('imran-greenline', 'Imran Chowdhury', 'Operations Head', 'GreenLine Logistics', (select id from public.clients where slug = 'greenline-logistics'), 'They understood logistics better than some vendors we have worked with for years. The dashboard is fast, reliable and our dispatchers actually enjoy using it.', 5, 'LinkedIn', true, true, 3, true),
('mehnaz-nokshi', 'Mehnaz Karim', 'Founder', 'Nokshi Fashion', (select id from public.clients where slug = 'nokshi-fashion'), 'Our website finally looks as premium as our clothes. The animations are stunning and our organic traffic tripled.', 5, 'Direct', true, false, 4, true),
('arif-student', 'Arif Hossain', 'Junior Developer', 'Graduate · Batch 9', null, 'I joined the full-stack course with zero coding experience. Six months later I had a portfolio, a GitHub full of projects and a job offer. The mentors treat you like a colleague.', 5, 'Academy', true, true, 5, true),
('pending-review-sample', 'Pending Reviewer', 'Customer', 'Sample Co', null, 'This is an example of a submitted review awaiting approval in the admin dashboard.', 4, 'Website', false, false, 6, false)
on conflict (slug) do update set content = excluded.content, rating = excluded.rating, is_approved = excluded.is_approved, is_featured = excluded.is_featured, sort_order = excluded.sort_order, is_published = excluded.is_published;

-- Blog posts ------------------------------------------------------------------
insert into public.blog_posts (slug, title, excerpt, content, author_id, tags, reading_time, published_at, is_featured, sort_order, is_published) values
('why-bangladeshi-smes-need-a-website-in-2026', 'Why every Bangladeshi SME needs a real website in 2026', 'Facebook pages are rented land. Here is how an owned website compounds trust, search traffic and sales.', '<p>Coming soon.</p>', (select id from public.team_members where slug = 'shamim-hosen'), '["Business", "Web"]'::jsonb, 5, now() - interval '12 days', true, 1, true),
('bkash-nagad-integration-guide', 'Integrating bKash and Nagad into your online store: a practical guide', 'What merchants need to know about sandbox access, callbacks and reconciliation before launch.', '<p>Coming soon.</p>', (select id from public.team_members where slug = 'shamim-hosen'), '["E-commerce", "Payments"]'::jsonb, 8, now() - interval '30 days', false, 2, true)
on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, tags = excluded.tags, is_published = excluded.is_published;

-- Sample leads (visible only to admins) --------------------------------------
insert into public.leads (type, name, email, phone, company, subject, message, budget, service_id, source, status)
select 'quote', 'Nusrat Jahan', 'nusrat@example.com', '+8801700000001', 'Jahan Interiors', 'Website for interior design studio', 'We need a portfolio website with a project gallery and WhatsApp inquiry button.', '50,000–100,000 BDT', (select id from public.services where slug = 'website-design-development'), 'website', 'new'
where not exists (select 1 from public.leads where email = 'nusrat@example.com');

insert into public.leads (type, name, email, phone, subject, message, course_id, source, status)
select 'enrollment', 'Mahmudul Hasan', 'mahmud@example.com', '+8801700000002', 'Enrollment: Full-Stack Web Development', 'Interested in Batch 12. Is there an installment option?', (select id from public.courses where slug = 'full-stack-web-development'), 'academy', 'contacted'
where not exists (select 1 from public.leads where email = 'mahmud@example.com');
