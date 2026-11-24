import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, headingId, posts } from "@/content/blog";
import { site } from "@/content/site";
import { HeroGlow } from "@/components/page/page-hero";
import { ChapterNav } from "@/components/page/chapter-nav";
import { CopyLink } from "@/components/page/copy-link";
import { PostCard } from "@/components/page/post-card";
import { CtaBand } from "@/components/page/cta-band";
import { Avatar, Button, Container, SplitText } from "@/components/ui/primitives";
import { MockVisual } from "@/components/ui/mock-visual";
import { ArrowLeft } from "@/components/ui/icons";

type Params = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt, openGraph: { type: "article", publishedTime: post.date } };
}

export default async function PostPage({ params }: Params) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const toc = post.sections.map((s) => ({ id: headingId(s.heading), label: s.heading }));
  const sameCategory = posts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const related = [...sameCategory, ...posts.filter((p) => p.slug !== post.slug && p.category !== post.category)].slice(0, 3);
  const inlineCtaAfter = Math.min(1, post.sections.length - 1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <section data-tone="dark" className="relative overflow-hidden bg-ink pt-32 pb-40 text-white sm:pt-40 sm:pb-52">
        <HeroGlow />
        <Container className="relative max-w-[920px]">
          <Link href="/blog" data-reveal className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white">
            <ArrowLeft className="size-4" /> Back to blog
          </Link>
          <p data-reveal className="mt-8 flex items-center gap-2 text-xs font-medium">
            <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-orange-300">{post.category}</span>
            <span className="text-white/60">{post.readTime}</span>
          </p>
          <SplitText as="h1" text={post.title} className="mt-5 text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl" />
          <div data-reveal className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Avatar name={post.author.name} />
              <span>
                <span className="block font-medium">{post.author.name}</span>
                <span className="block text-xs text-white/60">
                  <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.author.role}
                </span>
              </span>
            </div>
            <CopyLink />
          </div>
        </Container>
      </section>

      <div className="bg-paper">
        <Container className="-mt-28 max-w-[1080px] sm:-mt-36">
          <div data-clip className="overflow-hidden rounded-[calc(var(--radius-card)*1.4)] shadow-[0_40px_80px_-40px_rgb(4_7_13/0.6)]">
            <MockVisual theme={post.theme} device={post.device} className="aspect-[16/8]" />
          </div>
        </Container>
      </div>

      <section className="bg-paper py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <ChapterNav chapters={toc} title="On this page" numbered={false} />
          </aside>
          <article className="max-w-[680px]">
            {post.sections.map((s, i) => (
              <div key={s.heading}>
                <h2 id={headingId(s.heading)} className="mt-12 scroll-mt-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl">
                  {s.heading}
                </h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="mt-5 text-[17px] leading-[1.75] text-text/85">
                    {p}
                  </p>
                ))}
                {s.bullets ? (
                  <ul className="mt-5 space-y-2.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3 text-[17px] leading-relaxed text-text/85">
                        <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-orange-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {i === inlineCtaAfter ? (
                  <aside className="mt-10 rounded-[var(--radius-card)] bg-[linear-gradient(135deg,#cdf3ff,#ffe6cc)] p-6 sm:p-8">
                    <p className="text-xl font-semibold text-ink">Planning a project like this?</p>
                    <p className="mt-1.5 text-sm text-ink/70">Get a free consultation and a fixed quote from our team.</p>
                    <Button href="/contact" variant="dark" className="mt-5">
                      Book a free call
                    </Button>
                  </aside>
                ) : null}
              </div>
            ))}

            <div className="mt-14 flex items-start gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6">
              <Avatar name={post.author.name} className="size-14 text-base" />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Written by</p>
                <p className="mt-1 text-lg font-semibold">{post.author.name}</p>
                <p className="text-sm text-muted">{post.author.role} at {site.name}. Placeholder author bio, add a short description and links.</p>
              </div>
            </div>
          </article>
        </Container>
      </section>

      <section className="border-t border-line bg-white py-20 sm:py-24">
        <Container>
          <h2 className="mb-10 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">Related articles</h2>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
