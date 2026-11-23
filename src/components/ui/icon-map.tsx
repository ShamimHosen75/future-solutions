import type { ComponentType, SVGProps } from "react";
import * as Icons from "./icons";

const map = {
  bulb: Icons.Bulb,
  clock: Icons.Clock,
  users: Icons.Users,
  rocket: Icons.Rocket,
  compass: Icons.Compass,
  layers: Icons.Layers,
  chat: Icons.Chat,
  unlock: Icons.Unlock,
  video: Icons.Video,
  calendar: Icons.Calendar,
  wallet: Icons.Wallet,
  shield: Icons.Shield,
  spark: Icons.Spark,
  globe: Icons.Globe,
} satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export type IconName = keyof typeof map;

export const NamedIcon = ({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) => {
  const Icon = map[name];
  return <Icon {...props} />;
};
