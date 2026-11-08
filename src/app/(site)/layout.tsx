import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Preloader } from "@/components/motion/preloader";
import { PageTransition } from "@/components/motion/page-transition";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { getSettings } from "@/lib/data/settings";
import { getPublishedServices } from "@/lib/data/services";

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, services] = await Promise.all([getSettings(), getPublishedServices()]);

  return (
    <MotionProvider>
      <Preloader />
      <Header />
      <main id="main" className="relative pt-[var(--header-h)]">
        {children}
      </main>
      <Footer settings={settings} services={services.map((s) => ({ title: s.title, slug: s.slug }))} />
      <WhatsAppButton phone={settings.contact.whatsapp} />
      <PageTransition />
      <CustomCursor />
    </MotionProvider>
  );
}
