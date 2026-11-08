import { Hero } from "@/components/sections/hero";
import { ClientsMarquee } from "@/components/sections/clients-marquee";
import { ServicesPinned } from "@/components/sections/services-pinned";
import { FeaturedWork } from "@/components/sections/featured-work";
import { ProductsStrip } from "@/components/sections/products-strip";
import { Testimonials } from "@/components/sections/testimonials";
import { AcademyTeaser } from "@/components/sections/academy-teaser";
import { CTA } from "@/components/sections/cta";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { getSettings } from "@/lib/data/settings";
import { getPublishedServices } from "@/lib/data/services";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getFeaturedProducts } from "@/lib/data/products";
import { getFeaturedTestimonials } from "@/lib/data/testimonials";
import { getFeaturedCourses } from "@/lib/data/courses";
import { getPublishedClients } from "@/lib/data/clients";
import { hasSupabaseEnv } from "@/lib/env";

export default async function HomePage() {
  const [settings, services, projects, products, testimonials, courses, clients] = await Promise.all([
    getSettings(),
    getPublishedServices(),
    getFeaturedProjects(3),
    getFeaturedProducts(3),
    getFeaturedTestimonials(3),
    getFeaturedCourses(3),
    getPublishedClients(),
  ]);

  const empty = services.length === 0 && projects.length === 0;

  return (
    <>
      <Hero homepage={settings.homepage} />
      <ClientsMarquee clients={clients} />
      {empty ? <EmptyState configured={hasSupabaseEnv()} /> : null}
      <ServicesPinned services={services} />
      <FeaturedWork projects={projects} />
      <ProductsStrip products={products} />
      <Testimonials testimonials={testimonials} />
      <AcademyTeaser courses={courses} />
      <CTA whatsapp={settings.contact.whatsapp} />
    </>
  );
}

function EmptyState({ configured }: { configured: boolean }) {
  return (
    <Container className="py-16">
      <GlassCard className="text-center">
        <p className="font-display text-lg text-white">
          {configured ? "No published content yet." : "Supabase isn't connected yet."}
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          {configured
            ? "Publish services and projects from the admin dashboard and the homepage sections will appear here."
            : "Add your project keys to .env.local, run the migrations and seed, and every section below fills itself from the database."}
        </p>
      </GlassCard>
    </Container>
  );
}
