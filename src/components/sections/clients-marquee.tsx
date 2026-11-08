import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/motion/marquee";
import type { Client } from "@/types/content";

export function ClientsMarquee({ clients }: { clients: Client[] }) {
  if (clients.length === 0) return null;
  return (
    <section className="py-12 md:py-16" aria-label="Clients and partners">
      <Container className="mb-8 text-center">
        <p className="label">Trusted by teams across Bangladesh and beyond</p>
      </Container>
      <Marquee speed={55} gap="4rem">
        {clients.map((client) => (
          <ClientLogo key={client.id} client={client} />
        ))}
      </Marquee>
    </section>
  );
}

function ClientLogo({ client }: { client: Client }) {
  const content = client.logo_url ? (
    <Image
      src={client.logo_url}
      alt={client.name}
      width={140}
      height={40}
      className="h-8 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-10"
    />
  ) : (
    <span className="font-label text-xs tracking-[0.2em] whitespace-nowrap text-muted uppercase transition-colors hover:text-white md:text-sm">
      {client.name}
    </span>
  );
  if (client.website_url) {
    return (
      <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center" aria-label={client.name}>
        {content}
      </a>
    );
  }
  return <span className="flex items-center">{content}</span>;
}
