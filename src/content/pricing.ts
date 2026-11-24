/**
 * Pricing page. ALL plan names, prices and features are PLACEHOLDERS.
 * Prices are in USD. Change `currency` to switch the symbol everywhere on the page.
 */

export const pricing = {
  currency: "$",
  eyebrow: "Pricing",
  title: "Simple pricing for every stage of growth",
  intro: "Choose a monthly plan for ongoing design and development, or a fixed-price project for a single launch. No hidden costs.",
  badge: "3 project spots available this month",
  trust: ["4.9 average rating", "150+ projects delivered", "20+ countries served", "Registered company"],
  quarterlyDiscount: 0.1,
  subscription: [
    {
      name: "Starter",
      description: "For small teams who need steady design and development support.",
      monthly: 1490,
      team: "1 designer or developer, part time",
      features: ["One request at a time", "48-hour turnaround on most tasks", "Website and landing page updates", "Shared Slack or WhatsApp channel", "Pause or cancel anytime"],
      highlighted: false,
    },
    {
      name: "Growth",
      description: "For growing businesses shipping new features every week.",
      monthly: 2990,
      team: "Designer and developer, dedicated hours",
      features: ["Two requests at a time", "Product design and development", "Weekly check-in call", "QA and deployment included", "Priority support", "Pause or cancel anytime"],
      highlighted: true,
    },
    {
      name: "Custom",
      description: "For larger products that need a full cross-functional team.",
      monthly: null,
      team: "Dedicated team sized to your roadmap",
      features: ["Product manager included", "Design, front end, back end and QA", "Sprint planning and reporting", "Flexible team size", "SLA-backed support"],
      highlighted: false,
    },
  ],
  projects: [
    { name: "Landing page", from: 900, days: "7-10 days", features: ["Up to 5 sections", "Responsive design", "Basic SEO setup", "Contact form"] },
    { name: "Business website", from: 2500, days: "3-4 weeks", features: ["Up to 10 pages", "CMS for your team", "SEO and analytics", "1 month support"] },
    { name: "E-commerce store", from: 4500, days: "4-6 weeks", features: ["Product catalogue", "Payments and shipping", "Inventory management", "Training session"] },
    { name: "Mobile app MVP", from: 9000, days: "8-12 weeks", features: ["iOS and Android", "Core feature set", "Admin panel", "Store launch"] },
  ],
  included: [
    "Free discovery call",
    "Written scope and timeline",
    "Senior project lead",
    "Weekly progress updates",
    "Figma design files",
    "Responsive on every device",
    "Source code ownership",
    "Staging link for review",
    "Cross-browser testing",
    "Speed optimisation",
    "Basic SEO setup",
    "Analytics setup",
    "Accessibility checks",
    "Deployment and hosting help",
    "Documentation",
    "Team training",
    "Post-launch support",
    "NDA on request",
  ],
  faqs: [
    { q: "Which option is right for me?", a: "Choose a project if you have one clear launch in mind. Choose a monthly plan if you need ongoing design and development. We can help you decide on a free call." },
    { q: "Can I pause or cancel a monthly plan?", a: "Yes. Monthly plans can be paused or cancelled anytime with notice before the next billing date. Placeholder answer." },
    { q: "Do you accept payments in BDT?", a: "Placeholder answer. Add your accepted currencies and payment methods here." },
    { q: "Are there any hidden costs?", a: "No. Third-party costs like hosting, domains or paid plugins are listed in your proposal before you approve it." },
    { q: "What if my project does not fit a package?", a: "Most projects are custom. Book a call and we will send a fixed quote with milestones." },
  ],
};
