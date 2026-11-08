import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { CoverImage } from "@/components/ui/cover-image";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { CTA } from "@/components/sections/cta";
import { getPublishedPosts } from "@/lib/data/blog";
import { getPublishedTeam } from "@/lib/data/team";
import { getSettings } from "@/lib/data/settings";
import { asStringArray } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Articles on web development, e-commerce, payments, AI automation and growing a digital business in Bangladesh, from the Future Solutions team.",
  path: "/blog",
});

export default async function BlogPage() {
  const [posts, team, settings] = await Promise.all([getPublishedPosts(), getPublishedTeam(), getSettings()]);
  const authors = Object.fromEntries(team.map((t) => [t.id, t.name]));
  const [featured, ...rest] = posts;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <PageHeader eyebrow="Blog" title={"Notes from\nthe studio."} highlight={["studio."]} description="Practical writing on building, launching and growing digital products in Bangladesh." />
      <Container className="flex flex-col gap-6 pb-8">
        {featured ? (
          <Reveal>
            <Link href={`/blog/${featured.slug}`} className="group block" data-cursor="Read">
              <TiltCard as="article" intensity={3} className="p-2" innerClassName="lg:grid lg:grid-cols-2">
                <CoverImage src={featured.cover_image} alt={`${featured.title} cover`} title={featured.title} sizes="(min-width:1024px) 50vw, 100vw" className="aspect-[16/10] rounded-[calc(var(--radius-lg)-0.5rem)] lg:aspect-auto lg:min-h-[320px]" priority />
                <div className="flex flex-col gap-4 p-6 md:p-8">
                  <PostMeta post={featured} author={featured.author_id ? authors[featured.author_id] : undefined} />
                  <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">{featured.title}</h2>
                  {featured.excerpt ? <p className="text-muted md:text-lg">{featured.excerpt}</p> : null}
                  <span className="mt-auto inline-flex items-center gap-2 text-sm text-silver group-hover:text-white">Read article <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden /></span>
                </div>
              </TiltCard>
            </Link>
          </Reveal>
        ) : (
          <p className="text-center text-muted">No articles yet. Check back soon.</p>
        )}
        {rest.length > 0 ? (
          <Reveal as="ul" stagger={0.08} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block h-full" data-cursor="Read">
                  <TiltCard as="article" intensity={4} className="flex h-full flex-col p-2">
                    <CoverImage src={post.cover_image} alt={`${post.title} cover`} title={post.title} className="aspect-[16/10] rounded-[calc(var(--radius-lg)-0.5rem)]" />
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <PostMeta post={post} author={post.author_id ? authors[post.author_id] : undefined} />
                      <h2 className="font-display text-lg font-semibold text-white">{post.title}</h2>
                      {post.excerpt ? <p className="line-clamp-3 text-sm text-muted">{post.excerpt}</p> : null}
                      <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-silver group-hover:text-white">Read <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden /></span>
                    </div>
                  </TiltCard>
                </Link>
              </li>
            ))}
          </Reveal>
        ) : null}
      </Container>
      <CTA whatsapp={settings.contact.whatsapp} />
    </>
  );
}

function PostMeta({ post, author }: { post: { published_at: string | null; reading_time: number | null; tags: unknown }; author?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      {post.published_at ? <time dateTime={post.published_at} className="tabular">{formatDate(post.published_at)}</time> : null}
      {post.reading_time ? <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden /> {post.reading_time} min read</span> : null}
      {author ? <span>by {author}</span> : null}
      {asStringArray(post.tags).slice(0, 2).map((t) => (<span key={t} className="rounded-full border border-border px-2 py-0.5 text-[0.65rem]">{t}</span>))}
    </div>
  );
}
