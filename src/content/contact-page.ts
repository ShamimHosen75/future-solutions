import type { IconName } from "@/components/ui/icon-map";

/** Contact page extras. Placeholder copy. The contact block itself uses `contact` in home.ts. */
export const contactPage = {
  eyebrow: "Contact",
  title: "Let's build something great together",
  intro: "Tell us about your project, book a call or message us directly. A real person replies within 12 hours.",
  features: [
    { icon: "clock", title: "Fast response", text: "Replies within 12 hours on working days, usually much sooner." },
    { icon: "globe", title: "Flexible time zones", text: "Overlapping hours with clients in Asia, Europe, the Middle East and the Americas." },
    { icon: "shield", title: "NDA on request", text: "Your idea stays confidential. We sign an NDA before you share details." },
    { icon: "chat", title: "Free consultation", text: "A no-pressure call to discuss scope, budget and the best approach." },
  ] satisfies { icon: IconName; title: string; text: string }[],
  faqs: [
    { q: "How quickly will you reply?", a: "Within 12 hours on working days. Most briefs get a reply the same day. Placeholder answer." },
    { q: "What should I include in my brief?", a: "Your goals, who the product is for, any examples you like, your timeline and a rough budget. A few sentences is enough to start." },
    { q: "Can we meet in person?", a: "Yes, if you are near one of our offices. Most of our clients work with us remotely over video calls." },
    { q: "Do you sign NDAs?", a: "Yes. We are happy to sign your NDA or provide ours before you share project details." },
    { q: "What happens after I send a brief?", a: "A specialist reviews it, may ask a few questions, and we schedule a call to discuss scope and next steps." },
    { q: "Do you work with small budgets?", a: "We work with startups and established companies. If your budget is small, we will suggest what is realistic to build first." },
  ],
};
