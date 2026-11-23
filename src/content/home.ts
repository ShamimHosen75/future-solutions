import type { MockDevice, MockTheme } from "@/components/ui/mock-visual";

/**
 * Homepage content. ALL copy, names, numbers and testimonials below are PLACEHOLDERS
 * written for layout purposes. Replace them with real Future Solutions content before launch.
 */

export const hero = {
  badges: ["Google", "Clutch", "Upwork", "Behance", "Dribbble"],
  title: "We design and build digital products that move businesses forward",
  subtitle:
    "Strategy, design and engineering under one roof. From first idea to launched product, with a senior team that ships on time.",
  cta: { label: "Book a free call", href: "#contact" },
  stats: [
    { value: 150, suffix: "+", label: "Projects delivered" },
    { value: 8, suffix: "+", label: "Years of experience" },
    { value: 20, suffix: "+", label: "Countries served" },
    { value: 4.9, suffix: "", label: "Average client rating", decimals: 1 },
  ],
};

export const showreel = {
  /** Add a real showreel file to /public/video and set this, e.g. "/video/showreel.mp4". */
  videoSrc: "",
  poster: "",
  label: "Watch our showreel",
};

export const partners = {
  title: "Trusted by teams we have worked with",
  /** Placeholder brand names. Replace with real client logos (SVG) you have permission to show. */
  rows: [
    ["Northwind", "Lumen", "Orbitly", "Kestrel", "Brightpath", "Nimbus", "Vertex", "Copperleaf"],
    ["Harbor & Co", "Pixelforge", "Atlas Labs", "Greenmile", "Quanta", "Solstice", "Bluepeak", "Foundry"],
    ["Meridian", "Arcwave", "Cobalt", "Pinecrest", "Novaline", "Silverline", "Driftwood", "Helix"],
  ],
};

export type Project = {
  title: string;
  summary: string;
  tags: string[];
  theme: MockTheme;
  device: MockDevice;
  href: string;
};

export const work = {
  eyebrow: "Selected work",
  title: "What we have built",
  cta: { label: "See all projects", href: "#" },
  projects: [
    { title: "Project One", summary: "Corporate website redesign and CMS build", tags: ["Website", "Business"], theme: "blue", device: "laptop", href: "#" },
    { title: "Project Two", summary: "Learning platform web app and dashboard", tags: ["Web app", "Education"], theme: "night", device: "dashboard", href: "#" },
    { title: "Project Three", summary: "E-commerce store with custom checkout", tags: ["E-commerce", "Website"], theme: "sand", device: "browser", href: "#" },
    { title: "Project Four", summary: "Health and fitness mobile app", tags: ["Mobile app", "UI/UX", "MVP"], theme: "orange", device: "phones", href: "#" },
    { title: "Project Five", summary: "Fintech mobile wallet, iOS and Android", tags: ["Mobile app", "Fintech"], theme: "cyan", device: "phones", href: "#" },
    { title: "Project Six", summary: "SaaS analytics dashboard", tags: ["SaaS", "Dashboard"], theme: "ember", device: "dashboard", href: "#" },
  ] satisfies Project[],
};

export const redesign = {
  eyebrow: "Redesign existing products",
  text: "Already have a website or app that is not performing? We audit it, find what holds it back, and rebuild it into a product that looks great and works hard for your business, with support long after launch.",
};

export type ServiceCard = { title: string; tags: string[]; theme: MockTheme; device: MockDevice };

export const services = {
  eyebrow: "All services",
  title: "Everything your product needs, in one team",
  intro: "From the first sketch to production code and growth, every service is handled in-house. No hand-offs, no surprises.",
  items: [
    { title: "Website design", tags: ["UI/UX", "Landing pages", "Responsive"], theme: "blue", device: "browser" },
    { title: "Web development", tags: ["Next.js", "CMS", "Performance"], theme: "night", device: "laptop" },
    { title: "Mobile apps", tags: ["iOS", "Android", "Flutter"], theme: "orange", device: "phones" },
    { title: "Dashboard design", tags: ["Data visualisation", "Admin panels"], theme: "sand", device: "dashboard" },
    { title: "E-commerce", tags: ["Storefronts", "Payments", "Inventory"], theme: "cyan", device: "browser" },
    { title: "Custom software", tags: ["ERP", "CRM", "Internal tools"], theme: "ember", device: "dashboard" },
    { title: "AI automation", tags: ["Chatbots", "Workflows", "Integrations"], theme: "blue", device: "phones" },
  ] satisfies ServiceCard[],
};

export const clientProof = {
  eyebrow: "Client proof",
  title: "Beyond the brief, our clients speak",
  items: [
    {
      brand: "Client A",
      quote:
        "Placeholder testimonial. They understood our goals from the first call, delivered on schedule and the new platform doubled our enquiries in three months.",
      name: "Client Name",
      role: "Founder, Company A",
      tags: ["Web app", "UI/UX", "SEO"],
    },
    {
      brand: "Client B",
      quote:
        "Placeholder testimonial. Clear communication, fast iterations and a product our customers love using every day. We will keep building with them.",
      name: "Client Name",
      role: "CEO, Company B",
      tags: ["Mobile app", "MVP", "Design system"],
    },
    {
      brand: "Client C",
      quote:
        "Placeholder testimonial. Our old system was slowing the whole team down. The custom dashboard they built saves us hours every week.",
      name: "Client Name",
      role: "Operations Lead, Company C",
      tags: ["Custom software", "Dashboard"],
    },
    {
      brand: "Client D",
      quote:
        "Placeholder testimonial. From branding to the online store, everything feels like one consistent experience. Sales are up and returns are down.",
      name: "Client Name",
      role: "Director, Company D",
      tags: ["E-commerce", "Branding"],
    },
  ],
};

export const ai = {
  eyebrow: "How we use AI",
  title: "AI-accelerated delivery, human-led quality",
  intro:
    "We use AI to speed up research, prototyping and testing, so our designers and engineers spend their time on the decisions that matter to your users.",
  features: [
    { icon: "bulb", title: "AI-first exploration", text: "Explore more ideas and UX options early, before committing to a direction." },
    { icon: "clock", title: "Save time and budget", text: "Automate repetitive production work and reduce cost without lowering quality." },
    { icon: "users", title: "Human-led final output", text: "Every screen and line of code is reviewed and owned by a senior specialist." },
    { icon: "rocket", title: "Smarter outcomes", text: "Data-informed decisions that improve conversion, retention and speed." },
  ],
} as const;

export const howWeWork = {
  eyebrow: "How we work",
  title: "Simple process, no surprises",
  intro: "A clear path from first call to launch. You always know what is happening, what is next and what it costs.",
  steps: [
    { icon: "compass", title: "Discover and plan", text: "A free call, a written scope and a fixed timeline. Kick-off within 48 hours of sign-off." },
    { icon: "layers", title: "Design and build", text: "Weekly demos, shared boards and direct access to your designers and developers." },
    { icon: "rocket", title: "Launch and grow", text: "Tested, documented and deployed. Then ongoing support, analytics and improvements." },
  ],
  banner: { title: "Grow faster with better digital products", cta: { label: "See pricing", href: "#contact" } },
} as const;

export const dailyModel = {
  eyebrow: "Daily working model",
  title: "Not a brief and a wait. A team inside your project.",
  intro:
    "We do not disappear for weeks. Your team hears from us every day, in the tools you already use.",
  features: [
    { icon: "chat", title: "Same-day responses", text: "A shared WhatsApp or Slack channel. Ask a question, get an answer the same day." },
    { icon: "unlock", title: "You own everything", text: "Designs, code and accounts live in your workspace. Nothing is locked to us." },
    { icon: "video", title: "Every delivery explained", text: "Short video walkthroughs with each release, so feedback is quick and clear." },
    { icon: "calendar", title: "Weekly check-ins", text: "A standing call to review progress and plan the next sprint. Optional, never forced." },
  ],
  cta: { label: "Start a project", href: "#contact" },
  chat: {
    channel: "#project-launch",
    messages: [
      { name: "Client", time: "9:04 AM", text: "Morning! Can we see the checkout flow before the investor demo?" },
      { name: "FS Designer", time: "9:20 AM", text: "Already in the prototype: all 5 states, including errors and empty cart. Link is in the thread." },
      { name: "FS Developer", time: "10:12 AM", text: "Staging is updated as well, payments in test mode. Ready for your review." },
      { name: "Client", time: "10:30 AM", text: "Exactly what we needed for today. Thank you! 🙌" },
    ],
  },
} as const;

export const whyUs = {
  eyebrow: "Why Future Solutions",
  title: "The partner growing businesses actually need",
  intro: "Most teams choose between an expensive in-house hire, a slow agency or an unreliable freelancer. We remove that trade-off.",
  points: [
    { icon: "clock", from: "Months of hiring", to: "Start in 48 hours", title: "Faster than hiring", text: "No job posts or interviews. A senior team starts this week." },
    { icon: "wallet", from: "Full in-house cost", to: "One clear price", title: "A fraction of the cost", text: "Design, development and QA for less than one full-time salary." },
    { icon: "shield", from: "Scope creep", to: "Fixed scope", title: "No hidden surprises", text: "Written scope and milestones. You approve every change before it costs anything." },
    { icon: "users", from: "Junior output", to: "Senior-led", title: "Senior work, always", text: "Every project is led by experienced people, not handed off to juniors." },
    { icon: "chat", from: "Vendor hand-off", to: "Embedded team", title: "A partner, not a vendor", text: "We work in your tools and rhythm, like part of your own team." },
    { icon: "unlock", from: "Lock-in contracts", to: "Flexible terms", title: "Flexible, not trapped", text: "Pause or scale your plan as your needs change. No long lock-ins." },
  ],
} as const;

export const numbers = {
  eyebrow: "By the numbers",
  intro: "We partner with startups and established brands to deliver websites, apps and software that perform across industries.",
  tiles: [
    { value: 20, suffix: "+", label: "Countries served", tone: "navy" },
    { value: 150, suffix: "+", label: "Projects delivered", tone: "cyan" },
    { value: 98, suffix: "%", label: "Client retention", tone: "sand" },
    { value: 4.9, suffix: "", label: "Average rating", tone: "orange", decimals: 1 },
  ],
} as const;

export const recognition = {
  eyebrow: "Recognition",
  title: "Recognised for quality work",
  intro: "Our work and client feedback are featured across leading review and design platforms.",
  /** Placeholder labels. Replace with your real profile badges and links. */
  badges: [
    { name: "Google", text: "5.0 rating on Google reviews" },
    { name: "Clutch", text: "Verified reviews on Clutch" },
    { name: "Upwork", text: "Top Rated on Upwork" },
    { name: "Behance", text: "Projects featured on Behance" },
    { name: "Dribbble", text: "Featured profile on Dribbble" },
    { name: "Fiverr", text: "Level 2 seller on Fiverr" },
    { name: "GoodFirms", text: "Top web developers" },
    { name: "LinkedIn", text: "Growing community" },
  ],
};

export const testimonials = {
  eyebrow: "What clients say",
  title: "Words from the founders",
  items: [
    { quote: "Placeholder review. They designed and built our MVP in eight weeks and stayed flexible with every change we asked for. Highly recommended.", name: "Client Name", role: "Founder, Startup" },
    { quote: "Placeholder review. Fantastic work and great execution on our app redesign. Very happy with the result.", name: "Client Name", role: "Product Manager" },
    { quote: "Placeholder review. Extremely pleased with the delivery and quality. They understood our use case and delivered high quality designs and code.", name: "Client Name", role: "CTO, SaaS company" },
    { quote: "Placeholder review. This is our second project together and once again we are very happy. Professional, responsive and easy to work with.", name: "Client Name", role: "Head of Product" },
    { quote: "Placeholder review. They always understand the brief and have an excellent understanding of what we want.", name: "Client Name", role: "Founder, E-commerce brand" },
    { quote: "Placeholder review. The app exceeded our expectations. Creativity, clarity and attention to detail on every screen. Communication was smooth throughout.", name: "Client Name", role: "Software Engineer" },
  ],
};

export const faq = {
  eyebrow: "FAQs",
  title: "Common questions",
  items: [
    { q: "What does Future Solutions do?", a: "We design and develop websites, mobile apps, e-commerce stores and custom software, and help businesses grow them with SEO, automation and digital marketing." },
    { q: "Why work with Future Solutions?", a: "You get one senior team for strategy, design and development, a fixed scope and timeline, and support after launch. Placeholder answer, update with your real differentiators." },
    { q: "Can you redesign an existing website or app?", a: "Yes. We start with an audit of your current product, agree priorities with you, then redesign and rebuild in stages so your business keeps running." },
    { q: "Do you take one-off projects or only monthly plans?", a: "Both. Fixed-price projects work well for new builds; monthly plans suit ongoing design, development and growth work. Placeholder answer." },
    { q: "How fast can we start?", a: "Usually within 48 hours of approving the proposal. You will see the first designs within the first week. Placeholder answer." },
    { q: "Do you work with clients outside Bangladesh?", a: "Yes. We work with clients across Asia, the Middle East, Europe and North America, with overlapping working hours for each time zone." },
    { q: "How much does a website or app cost?", a: "It depends on scope. After a free call we send a written estimate with fixed milestones. Placeholder answer, add your price ranges." },
  ],
};

export const contact = {
  leads: [
    { name: "Team Lead", role: "Project Director" },
    { name: "Team Lead", role: "Lead Developer" },
  ],
  steps: ["We reply within 12 hours.", "A specialist collects your details and prepares a brief.", "We sign an NDA if you need one."],
  booking: {
    title: "Book a free 30-minute call",
    text: "Pick a time that suits you. We will discuss your product, goals and whether we are the right fit.",
    cta: "Schedule a call",
  },
  form: {
    title: "Send a brief",
    text: "Tell us about your project. We will get back to you within 24 hours, often the same day.",
    budgets: ["Under $2,000", "$2,000 to $5,000", "$5,000 to $10,000", "$10,000 to $25,000", "$25,000+"],
    projectTypes: ["Website", "Mobile app", "E-commerce", "Custom software", "UI/UX design", "Branding", "AI automation", "Other"],
    note: "Every message is read by a person on our team, not an automated system.",
  },
};
