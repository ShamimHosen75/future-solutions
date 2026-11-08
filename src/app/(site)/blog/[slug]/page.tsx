import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { CoverImage } from "@/components/ui/cover-image";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { CTA } from "@/components/sections/cta";
import { getPostBySlug, getPublishedPosts } from "@/lib/data/blog";
import { getPublishedTeam } from "@/lib/data/team";
import { getSettings } from "@/lib/data/settings";
import { asStringArray, initials } from "@/lib/content";
import { site } from "@/lib/site";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

type Params = { slug: string };
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return pageMetadata({ title: post.seo_title ?? post.title, description: post.seo_description ?? post.excerpt ?? post.title, path: `/blog/${post.slug}`, image: post.cover_image, type: "article" });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [post, posts, team, settings] = await Promise.all([getPostBySlug(slug), getPublishedPosts(), getPublishedTeam(), getSettings()]);
  if (!post) notFound();
  const author = team.find((t) => t.id === post.author_id);
  const tags = asStringArray(post.tags);
  const others = posts.filter((p) => p.id !== post.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image ?? absoluteUrl("/opengraph-image"),
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: author ? { "@type": "Person", name: author.name, jobTitle: author.role } : { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: tags.join(", ") || undefined,
  };

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])]} />
      <article>
        <header className="relative overflow-hidden pt-16 pb-10 md:pt-24">
          <div aria-hidden className="bg-vignette absolute inset-0" />
          <Container className="relative mx-auto flex max-w-3xl flex-col gap-6">
            <Reveal y={10}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <Link href="/blog" className="label hover:text-white">Blog</Link>
                {post.published_at ? <time dateTime={post.published_at} className="tabular">{formatDate(post.published_at)}</time> : null}
                {post.reading_time ? <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden /> {post.reading_time} min read</span> : null}
              </div>
            </Reveal>
            <TextReveal as="h1" trigger="mount" text={post.title} wordClassName="text-silver-gradient" className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] font-bold" />
            {post.excerpt ? <Reveal delay={0.4}><p className="text-lg text-muted">{post.excerpt}</p></Reveal> : null}
            {author ? (
              <Reveal delay={0.5}>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand-gradient font-display text-xs font-bold text-white">{initials(author.name)}</span>
                  <div><p className="text-sm font-semibold text-white">{author.name}</p><p className="text-xs text-muted">{author.role}</p></div>
                </div>
              </Reveal>
            ) : null}
          </Container>
        </header>
        <Container className="mx-auto flex max-w-3xl flex-col gap-10 pb-8">
          {post.cover_image ? <Reveal><CoverImage src={post.cover_image} alt={`${post.title} cover`} title={post.title} className="aspect-[16/9] rounded-[var(--radius-lg)]" sizes="(min-width:768px) 768px, 100vw" priority /></Reveal> : null}
          <Reveal><Prose html={post.content} className="text-silver" /></Reveal>
          {tags.length > 0 ? (
            <Reveal><ul className="flex flex-wrap gap-2 border-t border-border pt-6">{tags.map((t) => (<li key={t} className="rounded-full border border-border px-3 py-1 text-xs text-silver">{t}</li>))}</ul></Reveal>
          ) : null}
          <Reveal className="flex items-center justify-between border-t border-border pt-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white"><ArrowLeft className="size-4" aria-hidden /> All articles</Link>
          </Reveal>
        </Container>
        {others.length > 0 ? (
          <Container className="py-16">
            <Reveal><h2 className="label mb-6">Keep reading</h2></Reveal>
            <Reveal as="ul" stagger={0.08} className="grid gap-5 md:grid-cols-3">
              {others.map((p) => (
                <li key={p.id}>
                  <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-surface/40 p-5 hover:border-border-strong">
                    {p.published_at ? <time dateTime={p.published_at} className="tabular text-xs text-muted">{formatDate(p.published_at)}</time> : null}
                    <h3 className="font-display font-semibold text-white">{p.title}</h3>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-silver group-hover:text-white">Read <ArrowRight className="size-4" aria-hidden /></span>
                  </Link>
                </li>
              ))}
            </Reveal>
          </Container>
        ) : null}
      </article>
      <CTA whatsapp={settings.contact.whatsapp} />
    </>
  );
}
