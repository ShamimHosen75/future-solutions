import type { MockDevice, MockTheme } from "@/components/ui/mock-visual";

/**
 * Case studies. ALL names, numbers and quotes are PLACEHOLDERS.
 * Each entry produces a card on /work (the first six also show on the homepage)
 * and a full case study page at /work/[slug].
 */

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  theme: MockTheme;
  device: MockDevice;
  year: string;
  duration: string;
  liveUrl?: string;
  intro: string;
  client: string;
  challenges: { problem: string; solution: string }[];
  features: { title: string; text: string; theme: MockTheme; device: MockDevice }[];
  impact: string;
  metrics: { value: string; label: string }[];
  testimonial: { quote: string; name: string; role: string };
};

const sharedChallenges = [
  {
    problem: "Visitors could not tell what the business offered or who it was for within the first screen.",
    solution: "We rewrote the page hierarchy around one clear promise and moved proof and calls to action above the fold.",
  },
  {
    problem: "The old product was slow on mobile, which is where most customers arrived.",
    solution: "A rebuilt front end with optimised images and caching brought load times under two seconds.",
  },
  {
    problem: "The team relied on manual updates and spreadsheets to keep content and data in sync.",
    solution: "We connected a CMS and admin panel so the team updates everything without a developer.",
  },
];

const testimonial = (role: string) => ({
  quote:
    "Placeholder testimonial. The team understood our goals from the first call, communicated every day and delivered a product our customers love using.",
  name: "Client Name",
  role,
});

export const caseStudies: CaseStudy[] = [
  {
    slug: "project-one",
    title: "Project One",
    summary: "Corporate website redesign and CMS build",
    category: "Website",
    tags: ["Website", "Business"],
    theme: "blue",
    device: "laptop",
    year: "2025",
    duration: "6 weeks",
    intro: "A full redesign of a corporate website, rebuilt on a modern stack with a CMS the marketing team now runs on its own.",
    client: "Placeholder client: a growing services company with offices in three countries, looking to modernise its online presence.",
    challenges: sharedChallenges,
    features: [
      { title: "New homepage", text: "A clear story from promise to proof to action.", theme: "blue", device: "browser" },
      { title: "Service templates", text: "Reusable page templates for every service line.", theme: "night", device: "laptop" },
      { title: "CMS editing", text: "Pages and posts edited visually by the team.", theme: "sand", device: "dashboard" },
    ],
    impact: "The new site launched on schedule and became the company's main source of inbound leads within the first quarter.",
    metrics: [
      { value: "2x", label: "More enquiries" },
      { value: "1.6s", label: "Average load time" },
      { value: "-40%", label: "Bounce rate" },
    ],
    testimonial: testimonial("Marketing Director, Company A"),
  },
  {
    slug: "project-two",
    title: "Project Two",
    summary: "Learning platform web app and dashboard",
    category: "Web app",
    tags: ["Web app", "Education"],
    theme: "night",
    device: "dashboard",
    year: "2025",
    duration: "12 weeks",
    intro: "An online learning platform with course management, progress tracking and a dashboard for instructors.",
    client: "Placeholder client: an education startup moving its in-person courses online.",
    challenges: sharedChallenges,
    features: [
      { title: "Student dashboard", text: "Progress, deadlines and next lessons in one view.", theme: "night", device: "dashboard" },
      { title: "Course player", text: "Video lessons, notes and quizzes in a focused layout.", theme: "blue", device: "laptop" },
      { title: "Mobile learning", text: "Responsive design for learning on the go.", theme: "cyan", device: "phones" },
    ],
    impact: "The platform now serves thousands of active learners, with course completion rates well above the industry average.",
    metrics: [
      { value: "10k+", label: "Active learners" },
      { value: "68%", label: "Completion rate" },
      { value: "4.8", label: "App rating" },
    ],
    testimonial: testimonial("Founder, Company B"),
  },
  {
    slug: "project-three",
    title: "Project Three",
    summary: "E-commerce store with custom checkout",
    category: "E-commerce",
    tags: ["E-commerce", "Website"],
    theme: "sand",
    device: "browser",
    year: "2024",
    duration: "8 weeks",
    intro: "A fashion e-commerce store with a faster checkout, local payment options and inventory synced across channels.",
    client: "Placeholder client: a lifestyle brand selling online and through two retail stores.",
    challenges: sharedChallenges,
    features: [
      { title: "Product pages", text: "Large imagery, size guides and reviews.", theme: "sand", device: "browser" },
      { title: "One-page checkout", text: "Guest checkout with cards and mobile wallets.", theme: "orange", device: "phones" },
      { title: "Inventory sync", text: "Stock updated live across store and web.", theme: "night", device: "dashboard" },
    ],
    impact: "Checkout completion improved sharply and online revenue grew month over month after launch.",
    metrics: [
      { value: "+35%", label: "Conversion rate" },
      { value: "-50%", label: "Checkout time" },
      { value: "3x", label: "Online revenue" },
    ],
    testimonial: testimonial("Director, Company C"),
  },
  {
    slug: "project-four",
    title: "Project Four",
    summary: "Health and fitness mobile app",
    category: "Mobile app",
    tags: ["Mobile app", "UI/UX", "MVP"],
    theme: "orange",
    device: "phones",
    year: "2024",
    duration: "10 weeks",
    intro: "A fitness app MVP with workout plans, progress tracking and in-app subscriptions, launched on iOS and Android.",
    client: "Placeholder client: a personal trainer turning a coaching business into a product.",
    challenges: sharedChallenges,
    features: [
      { title: "Workout plans", text: "Guided sessions with video and timers.", theme: "orange", device: "phones" },
      { title: "Progress tracking", text: "Charts and streaks that keep users motivated.", theme: "ember", device: "phones" },
      { title: "Coach dashboard", text: "Manage clients and programmes from the web.", theme: "night", device: "dashboard" },
    ],
    impact: "The MVP reached its first paying subscribers within weeks of launch and is now growing through referrals.",
    metrics: [
      { value: "5k", label: "Downloads in month one" },
      { value: "42%", label: "30-day retention" },
      { value: "4.9", label: "Store rating" },
    ],
    testimonial: testimonial("Founder, Company D"),
  },
  {
    slug: "project-five",
    title: "Project Five",
    summary: "Fintech mobile wallet, iOS and Android",
    category: "Mobile app",
    tags: ["Mobile app", "Fintech"],
    theme: "cyan",
    device: "phones",
    year: "2024",
    duration: "16 weeks",
    intro: "A secure mobile wallet for payments, transfers and bill pay, with biometric login and real-time notifications.",
    client: "Placeholder client: a fintech company launching its first consumer product.",
    challenges: sharedChallenges,
    features: [
      { title: "Send and receive", text: "Transfers in three taps, with contacts and QR.", theme: "cyan", device: "phones" },
      { title: "Bill pay", text: "Utilities and top-ups in one place.", theme: "blue", device: "phones" },
      { title: "Admin console", text: "Risk, support and reporting for the operations team.", theme: "night", device: "dashboard" },
    ],
    impact: "The wallet launched with bank-grade security and processed its first million in transactions within the quarter.",
    metrics: [
      { value: "1M+", label: "Transactions" },
      { value: "99.9%", label: "Uptime" },
      { value: "<2s", label: "Transfer time" },
    ],
    testimonial: testimonial("CTO, Company E"),
  },
  {
    slug: "project-six",
    title: "Project Six",
    summary: "SaaS analytics dashboard",
    category: "SaaS",
    tags: ["SaaS", "Dashboard"],
    theme: "ember",
    device: "dashboard",
    year: "2023",
    duration: "14 weeks",
    intro: "A multi-tenant analytics dashboard that turns raw marketing data into clear weekly reports.",
    client: "Placeholder client: a B2B SaaS startup serving marketing agencies.",
    challenges: sharedChallenges,
    features: [
      { title: "Report builder", text: "Drag-and-drop widgets and saved views.", theme: "ember", device: "dashboard" },
      { title: "Team workspaces", text: "Roles, permissions and shared dashboards.", theme: "night", device: "laptop" },
      { title: "Billing", text: "Plans, trials and invoices built in.", theme: "sand", device: "browser" },
    ],
    impact: "The product moved from beta to paid plans, with agencies saving hours each week on reporting.",
    metrics: [
      { value: "300+", label: "Teams onboarded" },
      { value: "6h", label: "Saved per week" },
      { value: "-25%", label: "Churn" },
    ],
    testimonial: testimonial("CEO, Company F"),
  },
  {
    slug: "project-seven",
    title: "Project Seven",
    summary: "Restaurant group brand identity and website",
    category: "Branding",
    tags: ["Branding", "Website"],
    theme: "orange",
    device: "browser",
    year: "2023",
    duration: "5 weeks",
    intro: "A new identity and website for a restaurant group, with online reservations and menus the team updates itself.",
    client: "Placeholder client: a restaurant group with four locations.",
    challenges: sharedChallenges,
    features: [
      { title: "Brand identity", text: "Logo, colour and type that feel warm and modern.", theme: "orange", device: "browser" },
      { title: "Reservations", text: "Book a table from any page in two steps.", theme: "sand", device: "phones" },
      { title: "Menu manager", text: "Menus and prices updated in minutes.", theme: "night", device: "dashboard" },
    ],
    impact: "Online reservations became the main booking channel across all locations.",
    metrics: [
      { value: "+60%", label: "Online bookings" },
      { value: "4", label: "Locations launched" },
      { value: "5 wks", label: "Concept to launch" },
    ],
    testimonial: testimonial("Owner, Company G"),
  },
  {
    slug: "project-eight",
    title: "Project Eight",
    summary: "Logistics ERP and driver app",
    category: "Custom software",
    tags: ["Custom software", "Mobile app"],
    theme: "night",
    device: "dashboard",
    year: "2023",
    duration: "20 weeks",
    intro: "A custom ERP for a logistics company, with dispatch, tracking, invoicing and a companion driver app.",
    client: "Placeholder client: a regional logistics company with a fleet of 200 vehicles.",
    challenges: sharedChallenges,
    features: [
      { title: "Dispatch board", text: "Assign and track deliveries in real time.", theme: "night", device: "dashboard" },
      { title: "Driver app", text: "Routes, proof of delivery and status updates.", theme: "blue", device: "phones" },
      { title: "Invoicing", text: "Automatic invoices from completed jobs.", theme: "cyan", device: "laptop" },
    ],
    impact: "Paperwork dropped dramatically and the operations team now runs the business from one system.",
    metrics: [
      { value: "-70%", label: "Manual paperwork" },
      { value: "200", label: "Vehicles tracked" },
      { value: "+18%", label: "On-time deliveries" },
    ],
    testimonial: testimonial("Operations Lead, Company H"),
  },
];

export const workCategories = ["All", ...Array.from(new Set(caseStudies.map((c) => c.category)))];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const caseStudyHref = (slug: string) => `/work/${slug}`;

export const workPage = {
  eyebrow: "Our work",
  title: "Products we have designed, built and launched",
  intro: "A selection of websites, apps and software we have delivered for startups and growing businesses. Placeholder projects until real case studies are added.",
  midCta: { title: "Let's build your product next", text: "Tell us what you are planning. We reply within 12 hours with next steps.", cta: "Start a project" },
};
