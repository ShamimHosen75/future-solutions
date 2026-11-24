import type { MockDevice, MockTheme } from "@/components/ui/mock-visual";

/**
 * Blog posts. ALL posts are PLACEHOLDERS written for layout.
 * Each post renders at /blog/[slug]. Its sections become the article body and the table of contents.
 */

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: { name: string; role: string };
  theme: MockTheme;
  device: MockDevice;
  featured?: boolean;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

const authors = {
  lead: { name: "Team Lead", role: "Project Director" },
  dev: { name: "Lead Developer", role: "Engineering" },
  design: { name: "Lead Designer", role: "Design" },
};

const body = (topic: string): Post["sections"] => [
  {
    heading: "Why this matters",
    paragraphs: [
      `Placeholder article text about ${topic}. Replace this with your own writing. Most businesses we talk to know they need to improve here, but are not sure where to start or what to prioritise.`,
      "In this guide we share the approach we use with clients, what to watch out for and how to measure whether it is working.",
    ],
  },
  {
    heading: "Start with the goal",
    paragraphs: [
      "Before choosing tools or designs, agree on what success looks like. More leads, faster checkout, fewer support tickets: one clear goal makes every later decision easier.",
    ],
    bullets: ["Write the goal in one sentence", "Pick one metric to track", "Agree on a timeline and budget"],
  },
  {
    heading: "Understand your users",
    paragraphs: [
      "Talk to five customers. Watch how they use your current product. You will learn more in an afternoon than in weeks of guessing.",
      "Look for repeated friction: the same questions, the same drop-off points, the same workarounds.",
    ],
  },
  {
    heading: "Ship in small steps",
    paragraphs: [
      "Big launches are risky. Release the most valuable change first, measure it, then move to the next. Small steps keep the business running and the team learning.",
    ],
    bullets: ["Prioritise by impact and effort", "Release behind a feature flag when possible", "Review results every week"],
  },
  {
    heading: "Key takeaways",
    paragraphs: ["Clear goals, real user insight and steady releases beat a perfect plan. If you want help applying this to your product, book a free call with our team."],
  },
];

export const posts: Post[] = [
  {
    slug: "how-to-plan-a-website-redesign",
    title: "How to plan a website redesign without losing traffic",
    excerpt: "A step-by-step plan to redesign your site, keep your search rankings and launch with confidence.",
    category: "Web design",
    date: "2026-11-10",
    readTime: "7 min read",
    author: authors.design,
    theme: "blue",
    device: "browser",
    featured: true,
    sections: body("planning a website redesign"),
  },
  {
    slug: "mvp-checklist-for-founders",
    title: "The MVP checklist every founder should use",
    excerpt: "What to build first, what to leave out, and how to launch a product people actually want.",
    category: "Startups",
    date: "2026-10-28",
    readTime: "6 min read",
    author: authors.lead,
    theme: "orange",
    device: "phones",
    featured: true,
    sections: body("building a minimum viable product"),
  },
  {
    slug: "nextjs-vs-wordpress",
    title: "Next.js or WordPress: which is right for your business?",
    excerpt: "A practical comparison of speed, cost, editing and security for business websites.",
    category: "Development",
    date: "2026-10-14",
    readTime: "8 min read",
    author: authors.dev,
    theme: "night",
    device: "laptop",
    featured: true,
    sections: body("choosing between Next.js and WordPress"),
  },
  {
    slug: "ai-automation-for-small-business",
    title: "5 AI automations that save small teams hours every week",
    excerpt: "Simple, practical automations you can set up without replacing your existing tools.",
    category: "AI",
    date: "2026-09-30",
    readTime: "5 min read",
    author: authors.dev,
    theme: "cyan",
    device: "dashboard",
    sections: body("AI automation for small businesses"),
  },
  {
    slug: "ecommerce-checkout-best-practices",
    title: "Checkout best practices that reduce abandoned carts",
    excerpt: "Small changes to your checkout that make a big difference to conversion.",
    category: "E-commerce",
    date: "2026-09-16",
    readTime: "6 min read",
    author: authors.design,
    theme: "sand",
    device: "browser",
    sections: body("e-commerce checkout optimisation"),
  },
  {
    slug: "mobile-app-cost-guide",
    title: "How much does a mobile app cost in 2026?",
    excerpt: "What drives the price of an app, and how to plan a budget that fits your goals.",
    category: "Mobile apps",
    date: "2026-09-02",
    readTime: "9 min read",
    author: authors.lead,
    theme: "ember",
    device: "phones",
    sections: body("estimating mobile app costs"),
  },
  {
    slug: "technical-seo-basics",
    title: "Technical SEO basics for business websites",
    excerpt: "The technical foundations that help search engines find, understand and rank your site.",
    category: "SEO",
    date: "2026-08-19",
    readTime: "7 min read",
    author: authors.dev,
    theme: "blue",
    device: "dashboard",
    sections: body("technical SEO"),
  },
  {
    slug: "design-systems-for-growing-teams",
    title: "Why growing teams need a design system",
    excerpt: "How a shared component library keeps your product consistent and your team fast.",
    category: "Web design",
    date: "2026-08-05",
    readTime: "6 min read",
    author: authors.design,
    theme: "night",
    device: "dashboard",
    sections: body("design systems"),
  },
  {
    slug: "choosing-a-development-partner",
    title: "How to choose the right development partner",
    excerpt: "Questions to ask, red flags to avoid and how to compare proposals fairly.",
    category: "Startups",
    date: "2026-07-22",
    readTime: "5 min read",
    author: authors.lead,
    theme: "orange",
    device: "laptop",
    sections: body("choosing a development partner"),
  },
];

export const blogCategories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const postHref = (slug: string) => `/blog/${slug}`;
export const headingId = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export const blogPage = {
  eyebrow: "Blog",
  title: "Insights on design, development and growth",
  intro: "Practical guides from our team on building better websites, apps and software. Placeholder articles until real posts are added.",
  newsletter: { title: "Get new articles in your inbox", text: "One email a month. No spam, unsubscribe anytime." },
};
