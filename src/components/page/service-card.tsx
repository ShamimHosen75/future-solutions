import Link from "next/link";
import { serviceHref, type Service } from "@/content/services";
import { NamedIcon } from "@/components/ui/icon-map";
import { ArrowUpRight } from "@/components/ui/icons";

/** Compact service card linking to its service page. */
export const ServiceCard = ({ service }: { service: Service }) => (
  <Link
    href={serviceHref(service.slug)}
    data-reveal="scale"
    className="group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_24px_50px_-30px_rgb(4_7_13/0.35)]"
  >
    <div className="flex items-start justify-between">
      <span className="flex size-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgb(254_107_1/0.12),rgb(0_150_230/0.12))] text-orange-500">
        <NamedIcon name={service.icon} className="size-6 transition-transform duration-500 group-hover:scale-110" />
      </span>
      <span className="flex size-9 items-center justify-center rounded-full border border-line text-ink transition-[background-color,color,border-color,transform] duration-500 group-hover:rotate-45 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
        <ArrowUpRight className="size-4" />
      </span>
    </div>
    <h3 className="mt-8 text-xl font-semibold tracking-tight">{service.title}</h3>
    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{service.summary}</p>
    <div className="mt-5 flex flex-wrap gap-1.5">
      {service.tags.map((t) => (
        <span key={t} className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-medium text-muted ring-1 ring-line">
          {t}
        </span>
      ))}
    </div>
  </Link>
);
