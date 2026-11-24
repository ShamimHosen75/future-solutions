import type { IconName } from "@/components/ui/icon-map";

/** About page. ALL names, numbers and copy are PLACEHOLDERS. */

export const about = {
  eyebrow: "About us",
  title: "A senior team building the future of digital business",
  intro:
    "Future Solutions is a design and engineering studio based in Dhaka, working with startups and growing businesses around the world. Placeholder copy, replace with your story.",
  stats: [
    { value: 8, suffix: "+", label: "Years in business" },
    { value: 150, suffix: "+", label: "Projects delivered" },
    { value: 25, suffix: "+", label: "Team members" },
  ],
  mission: {
    eyebrow: "Why Future Solutions",
    title: "Our name is our promise",
    intro: "We build products that are ready for what comes next, for our clients and their customers.",
    principles: [
      { title: "Build for the future", text: "Technology that scales and stays maintainable long after launch." },
      { title: "Solve real problems", text: "Every feature starts with a user need and a business goal." },
      { title: "Grow together", text: "We measure success by our clients' results, not by hours billed." },
    ],
  },
  kinetic: "Our team of designers and engineers is ready to help you build, launch and grow whenever you need us.",
  differentiators: [
    { title: "Senior-led projects", text: "Experienced people lead every project from start to finish." },
    { title: "Design and code together", text: "Designers and developers work side by side, so nothing gets lost in hand-off." },
    { title: "Transparent process", text: "Weekly demos, shared boards and a staging link you can check anytime." },
    { title: "Fixed scope, fair price", text: "A written scope and clear milestones before any work begins." },
    { title: "Global, flexible hours", text: "Overlapping hours with clients in Asia, Europe, the Middle East and North America." },
    { title: "Long-term partnership", text: "Most clients keep working with us long after the first launch." },
  ],
  story: [
    { year: "2018", title: "The beginning", text: "Started as a two-person studio building websites for local businesses." },
    { year: "2020", title: "Going global", text: "First international clients and our first mobile app launches." },
    { year: "2023", title: "Full product team", text: "Grew into a cross-functional team covering design, development and growth." },
    { year: "2026", title: "Today", text: "150+ projects delivered for clients in more than 20 countries." },
  ],
  founder: {
    name: "Founder Name",
    role: "Founder & CEO",
    bio: "Placeholder bio. Add a short story about the founder: background, why they started Future Solutions and what drives the team today.",
    stats: [
      { value: "10+", label: "Years experience" },
      { value: "150+", label: "Projects led" },
      { value: "20+", label: "Countries" },
      { value: "4.9", label: "Client rating" },
    ],
  },
  values: [
    { icon: "shield", title: "Honesty", text: "We say what we think and do what we promise." },
    { icon: "users", title: "Ownership", text: "We treat every product as if it were our own." },
    { icon: "bulb", title: "Curiosity", text: "We keep learning so our clients get the best of what is new." },
    { icon: "rocket", title: "Craft", text: "We care about the details users notice and the ones they do not." },
  ] satisfies { icon: IconName; title: string; text: string }[],
  team: [
    { name: "Team Member", role: "Founder & CEO" },
    { name: "Team Member", role: "Project Director" },
    { name: "Team Member", role: "Lead Designer" },
    { name: "Team Member", role: "Lead Developer" },
    { name: "Team Member", role: "Mobile Developer" },
    { name: "Team Member", role: "Back-end Developer" },
    { name: "Team Member", role: "UI/UX Designer" },
    { name: "Team Member", role: "QA Engineer" },
  ],
  careers: {
    title: "Join our team",
    text: "We are always looking for talented designers and developers. Send us your CV and portfolio and we will be in touch when a role opens.",
    cta: "Send your CV",
  },
};
