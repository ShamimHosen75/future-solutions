import type { Metadata } from "next";
import { blogPage, posts } from "@/content/blog";
import { PageHero } from "@/components/page/page-hero";
import { PostCard } from "@/components/page/post-card";
import { BlogGrid } from "@/components/page/blog-grid";
import { NewsletterForm } from "@/components/page/newsletter-form";
import { CtaBand } from "@/components/page/cta-band";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Blog",
  description: blogPage.intro,
};

export default function BlogPage() {
  const featured = posts.filter((p) => p.featured).slice(0, 3);
  const [lead, ...rest] = featured;

  return (
    <>
      <PageHero eyebrow={blogPage.eyebrow} title={blogPage.title} intro={blogPage.intro} crumbs={[{ label: "Blog" }]} />

      <Section tone="light">
        <Container>
          <SectionHeading eyebrow="Featured" title="Editor's picks" />
          <div className="grid gap-x-6 gap-y-12 lg:grid-cols-[1.4fr_1fr]">
            {lead ? <PostCard post={lead} large /> : null}
            <div className="grid gap-12">
              {rest.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <section className="border-t border-line bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="All articles" title="Latest from the team" />
          <BlogGrid />
        </Container>
      </section>

      <section className="bg-paper pt-16 sm:pt-20">
        <Container>
          <div
            data-reveal
            className="flex flex-col items-start justify-between gap-8 rounded-[calc(var(--radius-card)*1.4)] bg-ink p-8 text-white sm:p-12 lg:flex-row lg:items-center"
          >
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{blogPage.newsletter.title}</h2>
              <p className="mt-3 text-white/70">{blogPage.newsletter.text}</p>
            </div>
            <NewsletterForm />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
