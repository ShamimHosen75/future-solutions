/**
 * Static site constants. Anything editable by the client lives in Supabase
 * (`settings` table) and is merged over these defaults at request time.
 */
export const site = {
  name: "Future Solutions",
  tagline: "Smart Solutions. Lasting Impact.",
  description:
    "Future Solutions is a software company and IT training institute in Dhaka, Bangladesh. We design websites, build e-commerce, mobile apps, custom software, AI automation and run digital marketing that delivers lasting impact.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://futuresolution.online",
  domain: "futuresolution.online",
  locale: "en_US",
  contact: {
    email: "hello@futuresolution.online",
    phone: "+880 1714-530063",
    whatsapp: "+8801714530063",
    address: "Road 13, Sector 13, Uttara, Dhaka 1230, Bangladesh",
    mapQuery: "Road 13, Sector 13, Uttara, Dhaka 1230, Bangladesh",
  },
  socials: {
    facebook: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    github: "",
  },
  themeColor: "#05060A",
} as const;

export const nav = {
  main: [
    { label: "Services", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pricing", href: "/pricing" },
    { label: "Academy", href: "/academy" },
    { label: "About", href: "/about" },
  ],
  footer: {
    company: [
      { label: "About", href: "/about" },
      { label: "Clients & Reviews", href: "/clients" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
} as const;

export type NavItem = { label: string; href: string };
