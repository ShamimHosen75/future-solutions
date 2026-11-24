import { getService, serviceGroups, serviceHref, servicesByGroup, type ServiceGroup } from "./services";

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
  bookingUrl: "/contact#brief",
  socials: {
    linkedin: "#",
    facebook: "#",
    instagram: "#",
    x: "#",
    youtube: "#",
  },
} as const;

export type NavLink = { label: string; href: string };

const serviceLinks = (group: ServiceGroup): NavLink[] =>
  servicesByGroup(group).map((s) => ({ label: s.title, href: serviceHref(s.slug) }));
const service = (slug: string): NavLink => {
  const s = getService(slug);
  return { label: s?.title ?? slug, href: serviceHref(slug) };
};

export const navigation = {
  main: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Pricing", href: "/pricing" },
  ] satisfies NavLink[],
  servicesHref: "/services",
  /** Header dropdown columns, generated from src/content/services.ts. */
  services: serviceGroups.map(({ group }) => ({ group, items: serviceLinks(group) })),
  footer: [
    {
      title: "Services",
      links: ["website-ui-ux", "web-development", "mobile-apps", "e-commerce", "custom-software", "ai-automation", "branding", "seo"].map(service),
    },
    {
      title: "Company",
      links: [
        { label: "Work", href: "/work" },
        { label: "Pricing", href: "/pricing" },
        { label: "About", href: "/about" },
        { label: "Careers", href: "/about#careers" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "MVP development", href: serviceHref("saas-products") },
        service("product-redesign"),
        { label: "Team extension", href: "/pricing" },
      ],
    },
  ] satisfies { title: string; links: NavLink[] }[],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ] satisfies NavLink[],
};

export const offices = [
  { city: "Dhaka", country: "Bangladesh", flag: "🇧🇩", address: "Road 13, Sector 13, Uttara, Dhaka 1230" },
  { city: "Office two", country: "Add location", flag: "🌐", address: "Street address, city, postcode" },
  { city: "Office three", country: "Add location", flag: "🌐", address: "Street address, city, postcode" },
] as const;
