import { PageHero } from "@/components/page/page-hero";
import { Button } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <PageHero eyebrow="404" title="This page could not be found" intro="The link may be broken or the page may have moved.">
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button href="/" size="lg">
          Back to home
        </Button>
        <Button href="/contact" size="lg" variant="outline-dark">
          Contact us
        </Button>
      </div>
    </PageHero>
  );
}
