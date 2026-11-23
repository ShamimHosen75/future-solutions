import type { ComponentType } from "react";
import { Hero } from "@/components/sections/hero";
import { Showreel } from "@/components/sections/showreel";
import { Partners } from "@/components/sections/partners";
import { FeaturedWork } from "@/components/sections/featured-work";
import { RedesignCallout } from "@/components/sections/redesign-callout";
import { ServicesCarousel } from "@/components/sections/services-carousel";
import { ClientProof } from "@/components/sections/client-proof";
import { AiSection } from "@/components/sections/ai-section";
import { HowWeWork } from "@/components/sections/how-we-work";
import { DailyModel } from "@/components/sections/daily-model";
import { WhyUs } from "@/components/sections/why-us";
import { ByTheNumbers } from "@/components/sections/by-the-numbers";
import { Recognition } from "@/components/sections/recognition";
import { TestimonialsWall } from "@/components/sections/testimonials-wall";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

/**
 * Homepage section order, matching the reference layout.
 * To add a new section: create it in src/components/sections/, then insert it here.
 * To hide one: remove or comment out its line.
 */
const sections: { id: string; Component: ComponentType }[] = [
  { id: "hero", Component: Hero },
  { id: "showreel", Component: Showreel },
  { id: "partners", Component: Partners },
  { id: "featured-work", Component: FeaturedWork },
  { id: "redesign", Component: RedesignCallout },
  { id: "services", Component: ServicesCarousel },
  { id: "client-proof", Component: ClientProof },
  { id: "ai", Component: AiSection },
  { id: "how-we-work", Component: HowWeWork },
  { id: "daily-model", Component: DailyModel },
  { id: "why-us", Component: WhyUs },
  { id: "numbers", Component: ByTheNumbers },
  { id: "recognition", Component: Recognition },
  { id: "testimonials", Component: TestimonialsWall },
  { id: "faq", Component: Faq },
  { id: "contact", Component: Contact },
];

export default function HomePage() {
  return (
    <>
      {sections.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </>
  );
}
