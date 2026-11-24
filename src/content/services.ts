import type { IconName } from "@/components/ui/icon-map";
import type { MockDevice, MockTheme } from "@/components/ui/mock-visual";

/**
 * Service pages. ALL copy below is PLACEHOLDER written for layout.
 * Each entry produces a full page at /services/[slug] and a link in the header dropdown and footer.
 * To add a service: add an entry here. To remove one: delete it.
 */

export type ServiceGroup = "Design" | "Build" | "Grow";

export type Service = {
  slug: string;
  title: string;
  group: ServiceGroup;
  icon: IconName;
  theme: MockTheme;
  device: MockDevice;
  /** One line, used on cards and in meta descriptions. */
  summary: string;
  /** Hero paragraph on the service page. */
  intro: string;
  highlights: string[];
  tags: string[];
  offers: { title: string; text: string }[];
};

export const serviceGroups: { group: ServiceGroup; text: string }[] = [
  { group: "Design", text: "Research, interfaces and brands that make products easy to use and easy to trust." },
  { group: "Build", text: "Websites, apps and software engineered for speed, security and growth." },
  { group: "Grow", text: "Automation, search and marketing that keep a launched product improving." },
];

export const services: Service[] = [
  {
    slug: "website-ui-ux",
    title: "Website UI/UX",
    group: "Design",
    icon: "layers",
    theme: "blue",
    device: "browser",
    summary: "Websites designed to explain your offer clearly and turn visitors into leads.",
    intro:
      "We research your audience, map the journey and design every page in Figma, so your website looks premium and guides visitors to take action.",
    highlights: ["Conversion-focused page structure", "Responsive design for every screen", "Clickable Figma prototype", "Developer-ready design system"],
    tags: ["UI/UX", "Landing pages", "Responsive"],
    offers: [
      { title: "UX research", text: "Competitor review, user interviews and analytics to find what your visitors need." },
      { title: "Information architecture", text: "Sitemaps and user flows that make content easy to find." },
      { title: "Wireframes", text: "Low-fidelity layouts to agree on structure before visual design." },
      { title: "Visual design", text: "High-fidelity pages in your brand, for desktop, tablet and mobile." },
      { title: "Prototyping", text: "Interactive prototypes to test ideas with real users before build." },
      { title: "Design system", text: "Reusable components and tokens so the site stays consistent as it grows." },
    ],
  },
  {
    slug: "mobile-app-design",
    title: "Mobile app design",
    group: "Design",
    icon: "spark",
    theme: "orange",
    device: "phones",
    summary: "iOS and Android app interfaces that feel native, simple and fast.",
    intro:
      "From onboarding to checkout, we design app flows that users understand instantly, following iOS and Android guidelines while keeping your brand distinct.",
    highlights: ["Native iOS and Android patterns", "Onboarding and retention flows", "Tested interactive prototypes", "Handoff with specs and assets"],
    tags: ["iOS", "Android", "Prototype"],
    offers: [
      { title: "App strategy", text: "Define core features, user goals and the shortest path to value." },
      { title: "User flows", text: "Every screen and state mapped, including errors and empty states." },
      { title: "UI design", text: "Polished screens that follow platform conventions and your brand." },
      { title: "Micro-interactions", text: "Motion that gives feedback and makes the app feel alive." },
      { title: "Usability testing", text: "Prototype sessions with real users to catch issues early." },
      { title: "Developer handoff", text: "Specs, assets and a component library ready for engineering." },
    ],
  },
  {
    slug: "product-redesign",
    title: "Product redesign",
    group: "Design",
    icon: "compass",
    theme: "night",
    device: "laptop",
    summary: "Audit and rebuild an existing website or app that is not performing.",
    intro:
      "We find what holds your current product back, agree priorities with you and redesign in stages, so your business keeps running while the product improves.",
    highlights: ["UX and performance audit", "Prioritised improvement roadmap", "Staged rollout, no downtime", "Before and after metrics"],
    tags: ["Audit", "Redesign", "Migration"],
    offers: [
      { title: "UX audit", text: "Heuristic review, analytics and session recordings to find friction." },
      { title: "Technical audit", text: "Speed, accessibility, SEO and code health checked and scored." },
      { title: "Roadmap", text: "Quick wins and bigger changes ranked by impact and effort." },
      { title: "Redesign", text: "New interface and flows built on what already works." },
      { title: "Migration", text: "Content, data and URLs moved safely with redirects in place." },
      { title: "Measurement", text: "Track conversions and speed before and after launch." },
    ],
  },
  {
    slug: "branding",
    title: "Branding",
    group: "Design",
    icon: "bulb",
    theme: "ember",
    device: "browser",
    summary: "Logos, identity systems and guidelines that make your business memorable.",
    intro:
      "We shape how your business looks and sounds, from logo and colour to tone of voice, and package it in guidelines your team can use everywhere.",
    highlights: ["Brand strategy workshop", "Logo and visual identity", "Full brand guidelines", "Marketing and social templates"],
    tags: ["Logo", "Identity", "Guidelines"],
    offers: [
      { title: "Brand strategy", text: "Positioning, audience and personality defined in a workshop." },
      { title: "Logo design", text: "A distinctive mark with variations for every use." },
      { title: "Visual identity", text: "Colour, type, imagery and graphic elements that work together." },
      { title: "Tone of voice", text: "How your brand writes, with examples and do's and don'ts." },
      { title: "Guidelines", text: "A clear brand book so anyone can apply the identity correctly." },
      { title: "Templates", text: "Social posts, presentations and stationery ready to use." },
    ],
  },
  {
    slug: "dashboard-design",
    title: "Dashboard design",
    group: "Design",
    icon: "layers",
    theme: "sand",
    device: "dashboard",
    summary: "Admin panels and data dashboards that turn complex data into clear decisions.",
    intro:
      "We design dashboards around the decisions your users make every day, with clear hierarchy, readable charts and workflows that save time.",
    highlights: ["Role-based views", "Readable data visualisation", "Fast, keyboard-friendly workflows", "Scalable component library"],
    tags: ["SaaS", "Data", "Admin panels"],
    offers: [
      { title: "Workflow mapping", text: "Understand each role and the tasks they repeat daily." },
      { title: "Data visualisation", text: "Charts and tables chosen for the question they answer." },
      { title: "Navigation", text: "Information architecture that scales as features grow." },
      { title: "Component library", text: "Tables, filters, forms and states built as reusable parts." },
      { title: "Accessibility", text: "Colour contrast, focus states and keyboard support built in." },
      { title: "Prototype and test", text: "Validate with real users before development starts." },
    ],
  },
  {
    slug: "web-development",
    title: "Web development",
    group: "Build",
    icon: "rocket",
    theme: "night",
    device: "laptop",
    summary: "Fast, secure websites and web apps built with modern frameworks.",
    intro:
      "We turn designs into fast, accessible websites and web apps using Next.js and modern tooling, with a CMS your team can edit without a developer.",
    highlights: ["Next.js and React", "Headless CMS integration", "90+ Lighthouse scores", "SEO and analytics set up"],
    tags: ["Next.js", "CMS", "Performance"],
    offers: [
      { title: "Front-end development", text: "Pixel-accurate, responsive interfaces with smooth interactions." },
      { title: "Back-end and APIs", text: "Secure APIs, authentication and integrations with your tools." },
      { title: "CMS setup", text: "Edit pages, posts and media yourself without touching code." },
      { title: "Performance", text: "Optimised images, caching and code for fast load times." },
      { title: "Testing and QA", text: "Cross-browser and device testing before every release." },
      { title: "Deployment", text: "CI/CD, hosting and monitoring set up and documented." },
    ],
  },
  {
    slug: "e-commerce",
    title: "E-commerce",
    group: "Build",
    icon: "wallet",
    theme: "cyan",
    device: "browser",
    summary: "Online stores with smooth checkout, payments and inventory built in.",
    intro:
      "We build online stores that load fast, look great and make buying easy, with local and international payments, inventory and order management connected.",
    highlights: ["Custom or Shopify storefronts", "Local and global payment gateways", "Inventory and order management", "Conversion-focused checkout"],
    tags: ["Storefronts", "Payments", "Inventory"],
    offers: [
      { title: "Storefront design", text: "Product pages and collections that sell." },
      { title: "Checkout", text: "Fewer steps, guest checkout and clear delivery costs." },
      { title: "Payments", text: "Cards, mobile wallets and cash on delivery integrated." },
      { title: "Inventory", text: "Stock, variants and suppliers managed in one place." },
      { title: "Marketing tools", text: "Discounts, abandoned cart emails and product feeds." },
      { title: "Analytics", text: "Track sales, funnels and customer behaviour." },
    ],
  },
  {
    slug: "mobile-apps",
    title: "Mobile apps",
    group: "Build",
    icon: "spark",
    theme: "orange",
    device: "phones",
    summary: "Cross-platform iOS and Android apps, from MVP to app store launch.",
    intro:
      "We build reliable mobile apps with Flutter and React Native, sharing one codebase across iOS and Android without compromising on feel or performance.",
    highlights: ["Flutter and React Native", "One codebase, two platforms", "Push notifications and offline mode", "App Store and Play Store launch"],
    tags: ["iOS", "Android", "Flutter"],
    offers: [
      { title: "MVP builds", text: "Launch the core feature set quickly and learn from real users." },
      { title: "Cross-platform apps", text: "Native-feeling apps from one shared codebase." },
      { title: "Back-end", text: "APIs, databases and admin panels to run the app." },
      { title: "Integrations", text: "Payments, maps, chat and analytics connected." },
      { title: "Store launch", text: "Listings, screenshots and review submission handled." },
      { title: "Ongoing releases", text: "Updates, monitoring and new features after launch." },
    ],
  },
  {
    slug: "custom-software",
    title: "Custom software",
    group: "Build",
    icon: "shield",
    theme: "ember",
    device: "dashboard",
    summary: "ERP, CRM and internal tools built around how your business actually works.",
    intro:
      "Off-the-shelf tools rarely fit. We build software around your real workflows, connecting teams and data so work gets done with fewer steps.",
    highlights: ["Built around your workflows", "Role-based access and audit logs", "Integrates with existing tools", "Scales with your team"],
    tags: ["ERP", "CRM", "Internal tools"],
    offers: [
      { title: "Discovery", text: "Map processes, pain points and requirements with your team." },
      { title: "ERP and CRM", text: "Sales, inventory, HR and finance in one system." },
      { title: "Internal tools", text: "Dashboards and admin panels that remove manual work." },
      { title: "Integrations", text: "Connect accounting, email, messaging and third-party APIs." },
      { title: "Security", text: "Permissions, backups and audit trails from day one." },
      { title: "Training and support", text: "Documentation and onboarding for every user." },
    ],
  },
  {
    slug: "saas-products",
    title: "SaaS products",
    group: "Build",
    icon: "globe",
    theme: "blue",
    device: "dashboard",
    summary: "Multi-tenant SaaS platforms with subscriptions, billing and analytics.",
    intro:
      "We help founders take SaaS ideas to market, from MVP to scale, with multi-tenant architecture, subscriptions and the analytics to grow.",
    highlights: ["MVP in weeks, not months", "Subscriptions and billing", "Multi-tenant architecture", "Product analytics built in"],
    tags: ["SaaS", "MVP", "Subscriptions"],
    offers: [
      { title: "Product discovery", text: "Validate the problem and define the smallest valuable product." },
      { title: "MVP development", text: "A launch-ready product focused on your core value." },
      { title: "Billing", text: "Plans, trials, invoices and payment providers connected." },
      { title: "Onboarding", text: "First-run flows that get users to value quickly." },
      { title: "Analytics", text: "Usage, retention and revenue metrics in one view." },
      { title: "Scale", text: "Architecture and infrastructure that grow with demand." },
    ],
  },
  {
    slug: "ai-automation",
    title: "AI automation",
    group: "Grow",
    icon: "bulb",
    theme: "blue",
    device: "phones",
    summary: "Chatbots, workflow automation and AI features that save hours every week.",
    intro:
      "We find repetitive work in your business and automate it, using AI assistants, document processing and integrations that connect your tools.",
    highlights: ["AI chatbots and assistants", "Workflow automation", "Document and data processing", "Secure, private by design"],
    tags: ["Chatbots", "Workflows", "Integrations"],
    offers: [
      { title: "Automation audit", text: "Find the tasks that cost your team the most time." },
      { title: "AI assistants", text: "Chatbots that answer customers and support your team." },
      { title: "Workflow automation", text: "Connect apps so data moves without copy and paste." },
      { title: "Document processing", text: "Extract data from invoices, forms and emails automatically." },
      { title: "AI features", text: "Search, recommendations and summaries inside your product." },
      { title: "Monitoring", text: "Track accuracy, cost and time saved after launch." },
    ],
  },
  {
    slug: "seo",
    title: "SEO",
    group: "Grow",
    icon: "compass",
    theme: "sand",
    device: "browser",
    summary: "Technical and content SEO that brings qualified visitors from search.",
    intro:
      "We fix the technical foundations, research what your customers search for and create content that ranks, with monthly reporting you can understand.",
    highlights: ["Technical SEO audit", "Keyword and competitor research", "On-page and content optimisation", "Monthly reporting"],
    tags: ["Technical SEO", "Content", "Local SEO"],
    offers: [
      { title: "Technical audit", text: "Crawlability, speed, structured data and indexing fixed." },
      { title: "Keyword research", text: "Find terms your customers use and how hard they are to win." },
      { title: "On-page SEO", text: "Titles, headings, internal links and content improved." },
      { title: "Content strategy", text: "A plan of pages and posts that build authority." },
      { title: "Local SEO", text: "Google Business Profile and local listings optimised." },
      { title: "Reporting", text: "Rankings, traffic and leads tracked every month." },
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital marketing",
    group: "Grow",
    icon: "rocket",
    theme: "orange",
    device: "browser",
    summary: "Paid ads, social media and campaigns that turn attention into customers.",
    intro:
      "We plan and run campaigns across search and social, with landing pages and tracking set up properly, so every taka or dollar spent can be measured.",
    highlights: ["Google and Meta ads", "Social media content", "Landing pages that convert", "Clear ROI tracking"],
    tags: ["Ads", "Social", "Campaigns"],
    offers: [
      { title: "Strategy", text: "Channels, audiences and budget planned around your goals." },
      { title: "Paid search", text: "Google Ads campaigns built and optimised weekly." },
      { title: "Social ads", text: "Facebook, Instagram and LinkedIn campaigns that target well." },
      { title: "Content", text: "Posts, short videos and creatives for your channels." },
      { title: "Landing pages", text: "Focused pages built and tested for each campaign." },
      { title: "Tracking", text: "Pixels, conversions and dashboards configured correctly." },
    ],
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & support",
    group: "Grow",
    icon: "shield",
    theme: "night",
    device: "dashboard",
    summary: "Updates, monitoring, backups and fixes so your product keeps running smoothly.",
    intro:
      "We keep your website or app secure, fast and up to date, with monitoring, backups and a team on hand when you need changes or fixes.",
    highlights: ["Uptime and error monitoring", "Security updates and backups", "Monthly improvement hours", "Fast response times"],
    tags: ["Monitoring", "Security", "Support"],
    offers: [
      { title: "Monitoring", text: "Uptime, errors and performance watched around the clock." },
      { title: "Security updates", text: "Frameworks, plugins and dependencies kept current." },
      { title: "Backups", text: "Automatic backups with tested restore." },
      { title: "Bug fixes", text: "Issues reported, prioritised and fixed quickly." },
      { title: "Small improvements", text: "Monthly hours for content changes and new features." },
      { title: "Reports", text: "A monthly summary of health, fixes and next steps." },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const servicesByGroup = (group: ServiceGroup) => services.filter((s) => s.group === group);
export const serviceHref = (slug: string) => `/services/${slug}`;

/** Sections shared by every service page. Placeholder copy; adjust per service later if needed. */
export const serviceShared = {
  problem: {
    eyebrow: "Why it matters",
    stat: "3s",
    statText: "is roughly how long people give a digital product before they decide to stay or leave.",
    points: [
      { title: "First impressions decide", text: "Visitors judge credibility in seconds, mostly by design and speed." },
      { title: "Friction costs revenue", text: "Every confusing step loses customers who were ready to buy." },
      { title: "Quality compounds", text: "A product that works well gets recommended, reviewed and reused." },
    ],
  },
  process: [
    { week: "Week 1", title: "Discover", text: "Free call, goals, audience and a written scope with a fixed timeline." },
    { week: "Week 1-2", title: "Plan", text: "User flows, sitemap and technical plan agreed before any design." },
    { week: "Week 2-4", title: "Design", text: "Wireframes, then high-fidelity screens reviewed with you every week." },
    { week: "Week 3-8", title: "Build", text: "Development in sprints, with a staging link you can test anytime." },
    { week: "Launch", title: "Launch and support", text: "Testing, launch, training and support after go-live." },
  ],
  fit: [
    "You want one senior team for strategy, design and development",
    "You value clear scope, timelines and weekly progress",
    "You are launching something new or fixing something that underperforms",
    "You want to own your designs, code and accounts",
    "You prefer direct access to the people doing the work",
    "You plan to keep improving the product after launch",
  ],
  faqs: (title: string) => [
    {
      q: `How long does a ${title.toLowerCase()} project take?`,
      a: "Most projects take 3 to 8 weeks depending on scope. You get a written timeline before we start. Placeholder answer.",
    },
    {
      q: `How much does ${title.toLowerCase()} cost?`,
      a: "It depends on scope. After a free call we send a fixed quote with milestones, or you can use a monthly plan. See the pricing page for ranges. Placeholder answer.",
    },
    { q: "Will I own the final work?", a: "Yes. All designs, code and accounts are yours once the project is paid. Nothing is locked to us." },
    { q: "Do you offer support after launch?", a: "Yes. Every project includes a support period, and you can continue with a monthly maintenance plan. Placeholder answer." },
  ],
};
