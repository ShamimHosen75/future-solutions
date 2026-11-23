/**
 * Site-wide settings. Everything here is PLACEHOLDER until the company details are confirmed.
 */
export const site = {
  name: "Future Solutions",
  shortName: "FS",
  tagline: "Smart solutions. Lasting impact.",
  description:
    "Future Solutions designs and builds websites, apps and software products for ambitious businesses worldwide.",
  url: "https://futuresolution.online",
  email: "hello@futuresolution.online",
  phone: "+880 1700-000000",
  whatsapp: "8801700000000",
  bookingUrl: "#contact",
  socials: {
    linkedin: "#",
    facebook: "#",
    instagram: "#",
    x: "#",
    youtube: "#",
  },
} as const;

export const navigation = {
  main: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#why-us" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#contact" },
    { label: "Pricing", href: "#how-we-work" },
  ],
  services: [
    {
      group: "Design",
      items: ["Website UI/UX", "Mobile app design", "Product redesign", "Branding", "Dashboard design"],
    },
    {
      group: "Build",
      items: ["Web development", "E-commerce", "Mobile apps", "Custom software", "SaaS products"],
    },
    {
      group: "Grow",
      items: ["AI automation", "SEO", "Digital marketing", "Maintenance & support"],
    },
  ],
  footer: [
    {
      title: "Services",
      links: ["Website UI/UX", "Web development", "Mobile apps", "E-commerce", "Custom software", "AI automation", "Branding", "SEO"],
    },
    { title: "Company", links: ["Work", "Pricing", "About", "Careers", "Blog", "Contact"] },
    { title: "Solutions", links: ["MVP development", "Product redesign", "Team extension"] },
  ],
  legal: ["Privacy Policy", "Terms & Conditions"],
} as const;

export const offices = [
  { city: "Dhaka", country: "Bangladesh", flag: "🇧🇩", address: "Road 13, Sector 13, Uttara, Dhaka 1230" },
  { city: "Office two", country: "Add location", flag: "🌐", address: "Street address, city, postcode" },
  { city: "Office three", country: "Add location", flag: "🌐", address: "Street address, city, postcode" },
] as const;
