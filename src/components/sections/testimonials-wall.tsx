import { testimonials } from "@/content/home";
import { site } from "@/content/site";
import { Avatar, Button, Container, Section, SectionHeading, Stars } from "@/components/ui/primitives";

/** Masonry wall of written reviews, with a badge card and a CTA card mixed in like the reference. */
export const TestimonialsWall = () => {
  const items = testimonials.items;
  return (
    <Section tone="light">
      <Container>
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          action={
            <div className="rounded-xl border border-line bg-white px-4 py-3 text-sm shadow-sm">
              <p className="flex items-center gap-2 text-xs text-muted">
                Reviewed on <Stars />
              </p>
              <p className="mt-1 font-semibold">Google · Clutch · Upwork</p>
            </div>
          }
        />
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {items.slice(0, 2).map((t, i) => (
            <Review key={i} {...t} hue={i % 2 ? "blue" : "orange"} />
          ))}
          <BadgeCard label="Featured on" platform="Behance" />
          {items.slice(2, 4).map((t, i) => (
            <Review key={i + 2} {...t} hue={i % 2 ? "orange" : "blue"} />
          ))}
          <BadgeCard label="Top rated on" platform="Upwork" />
          {items.slice(4).map((t, i) => (
            <Review key={i + 4} {...t} hue={i % 2 ? "blue" : "orange"} />
          ))}
          <div data-reveal className="rounded-[var(--radius-card)] p-6 text-center">
            <p className="text-2xl font-semibold tracking-tight">Sound good?</p>
            <p className="mx-auto mt-2 max-w-60 text-sm text-muted">Your dedicated product team is just one call away.</p>
            <Button href={site.bookingUrl} className="mt-5">
              Book a 30-min call
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
};

const Review = ({ quote, name, role, hue }: { quote: string; name: string; role: string; hue: "orange" | "blue" }) => (
  <figure data-reveal className="rounded-[var(--radius-card)] border border-line bg-white p-6 transition-shadow duration-500 hover:shadow-[0_24px_50px_-30px_rgb(4_7_13/0.35)]">
    <blockquote className="text-[15px] leading-relaxed text-text/90">{quote}</blockquote>
    <figcaption className="mt-6 flex items-center gap-3">
      <Avatar name={name} hue={hue} />
      <span>
        <span className="block text-sm font-semibold">{name}</span>
        <span className="block text-xs text-muted">{role}</span>
      </span>
    </figcaption>
  </figure>
);

const BadgeCard = ({ label, platform }: { label: string; platform: string }) => (
  <div data-reveal className="flex flex-col items-center justify-center rounded-[var(--radius-card)] py-8 text-center">
    <span className="text-4xl font-bold tracking-tight text-gradient-brand">{platform}</span>
    <span className="mt-2 text-lg font-medium">{label}</span>
    <span className="mt-0.5 text-sm text-muted">{platform}</span>
  </div>
);
