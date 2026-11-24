import { recognition } from "@/content/home";
import { Container, Section, SectionHeading, Stars } from "@/components/ui/primitives";

export const Recognition = () => (
  <Section tone="dark">
    <Container>
      <SectionHeading eyebrow={recognition.eyebrow} title={recognition.title} intro={recognition.intro} tone="dark" />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {recognition.badges.map((b) => (
          <li
            key={b.name}
            data-reveal="scale"
            className="group flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center transition-colors duration-500 hover:border-orange-500/40 hover:bg-white/[0.05]"
          >
            {/* Placeholder: replace with the platform's official badge image */}
            <span className="text-2xl font-bold tracking-tight transition-transform duration-500 group-hover:scale-110">{b.name}</span>
            <Stars />
            <span className="text-sm text-white/75">{b.text}</span>
          </li>
        ))}
      </ul>
    </Container>
  </Section>
);
