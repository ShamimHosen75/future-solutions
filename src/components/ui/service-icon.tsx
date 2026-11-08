import {
  Bot,
  Code2,
  Globe,
  LineChart,
  ShoppingBag,
  Smartphone,
  Sparkles,
  type LucideProps,
} from "lucide-react";

const icons = {
  globe: Globe,
  "shopping-bag": ShoppingBag,
  smartphone: Smartphone,
  code: Code2,
  "line-chart": LineChart,
  bot: Bot,
} as const;

export type ServiceIconName = keyof typeof icons;

type ServiceIconProps = Omit<LucideProps, "name"> & { name: string | null };

function isIconName(name: string): name is ServiceIconName {
  return name in icons;
}

/** Maps the `services.icon` column to a Lucide icon with a safe fallback. */
export function ServiceIcon({ name, ...props }: ServiceIconProps) {
  const Icon = name && isIconName(name) ? icons[name] : Sparkles;
  return <Icon aria-hidden {...props} />;
}
