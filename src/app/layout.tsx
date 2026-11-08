import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/data/settings";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: settings.seo.title,
      template: settings.seo.titleTemplate,
    },
    description: settings.seo.description,
    keywords: settings.seo.keywords,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: site.url,
      title: settings.seo.title,
      description: settings.seo.description,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo.title,
      description: settings.seo.description,
    },
    robots: { index: true, follow: true },
    icons: { icon: "/icon.svg" },
  };
}

const bootstrapScript = `
(function(){
  var d=document.documentElement;
  d.classList.add('js');
  try{
    var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduced && !localStorage.getItem('fs:visited')) d.setAttribute('data-preload','1');
  }catch(e){}
})();`;

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Runs before paint: marks JS as available (for masked reveals) and
            flags first-time visitors so the preloader can show without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      </head>
      <body className="min-h-dvh bg-bg font-sans text-silver antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
