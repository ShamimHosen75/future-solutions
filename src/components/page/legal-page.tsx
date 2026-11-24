import { PageHero } from "./page-hero";
import { Container } from "@/components/ui/primitives";
import { site } from "@/content/site";

/** Simple text page for legal content. The sections passed in are PLACEHOLDERS: have the final text reviewed before launch. */
export const LegalPage = ({ title, updated, sections }: { title: string; updated: string; sections: { heading: string; text: string }[] }) => (
  <>
    <PageHero title={title} intro={`Last updated ${updated}. Placeholder text, replace with your reviewed policy.`} crumbs={[{ label: title }]} />
    <section className="bg-paper py-16 sm:py-24">
      <Container className="max-w-[760px]">
        {sections.map((s) => (
          <div key={s.heading} className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight">{s.heading}</h2>
            <p className="mt-3 leading-relaxed text-text/80">{s.text}</p>
          </div>
        ))}
        <p className="border-t border-line pt-8 text-sm text-muted">
          Questions? Email us at{" "}
          <a href={`mailto:${site.email}`} className="font-medium text-orange-600 hover:underline">
            {site.email}
          </a>
          .
        </p>
      </Container>
    </section>
  </>
);
