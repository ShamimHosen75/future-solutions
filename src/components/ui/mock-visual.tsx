import { cn } from "@/lib/cn";

/**
 * Placeholder artwork for project and service cards. Swap for real screenshots
 * (next/image) once case-study assets are supplied.
 */
export type MockTheme = "orange" | "blue" | "night" | "sand" | "cyan" | "ember";
export type MockDevice = "laptop" | "phones" | "browser" | "dashboard";

const backgrounds: Record<MockTheme, string> = {
  orange: "bg-[radial-gradient(120%_120%_at_10%_0%,#ffb547_0%,#fe6b01_45%,#7a1f00_100%)]",
  blue: "bg-[radial-gradient(120%_120%_at_90%_0%,#5be3ff_0%,#006bc8_45%,#001a3d_100%)]",
  night: "bg-[radial-gradient(100%_100%_at_50%_0%,#1b2a4a_0%,#04070d_75%)]",
  sand: "bg-[linear-gradient(160deg,#f6e7d4_0%,#e9c9a2_100%)]",
  cyan: "bg-[linear-gradient(160deg,#c9f4ff_0%,#7fd8f5_100%)]",
  ember: "bg-[radial-gradient(120%_120%_at_50%_100%,#fd4d00_0%,#3a0d00_70%)]",
};

const ScreenUI = ({ accent }: { accent: "orange" | "blue" }) => (
  <div className="flex h-full flex-col gap-[6%] bg-ink-2 p-[6%]">
    <div className="flex items-center justify-between">
      <span className={cn("h-[8%] min-h-1.5 w-1/4 rounded-full", accent === "orange" ? "bg-orange-500" : "bg-blue-400")} />
      <span className="flex gap-1">
        <span className="size-1.5 rounded-full bg-white/30" />
        <span className="size-1.5 rounded-full bg-white/30" />
        <span className="size-1.5 rounded-full bg-white/30" />
      </span>
    </div>
    <span className="h-[10%] w-3/4 rounded bg-white/85" />
    <span className="h-[6%] w-1/2 rounded bg-white/35" />
    <div className="mt-auto grid grid-cols-3 gap-[4%]">
      <span className="aspect-[4/3] rounded bg-white/10" />
      <span className={cn("aspect-[4/3] rounded", accent === "orange" ? "bg-orange-500/70" : "bg-blue-500/70")} />
      <span className="aspect-[4/3] rounded bg-white/10" />
    </div>
  </div>
);

const DashboardUI = () => (
  <div className="grid h-full grid-cols-[18%_1fr] bg-white">
    <div className="flex flex-col gap-2 bg-ink p-2">
      <span className="h-2 w-3/4 rounded-full bg-orange-500" />
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="h-1.5 w-full rounded-full bg-white/20" />
      ))}
    </div>
    <div className="flex flex-col gap-2 p-3">
      <div className="grid grid-cols-3 gap-2">
        <span className="h-6 rounded bg-blue-50 ring-1 ring-blue-100" />
        <span className="h-6 rounded bg-orange-50 ring-1 ring-orange-100" />
        <span className="h-6 rounded bg-paper ring-1 ring-line" />
      </div>
      <div className="flex flex-1 items-end gap-1.5 rounded bg-paper p-2">
        {[40, 65, 35, 80, 55, 90, 70, 45, 85].map((h, i) => (
          <span key={i} className={cn("flex-1 rounded-sm", i % 3 === 0 ? "bg-orange-500" : "bg-blue-500")} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  </div>
);

export const MockVisual = ({
  theme = "night",
  device = "laptop",
  className,
}: {
  theme?: MockTheme;
  device?: MockDevice;
  className?: string;
}) => {
  const accent = theme === "blue" || theme === "cyan" ? "orange" : "blue";
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", backgrounds[theme], className)} aria-hidden>
      {device === "laptop" ? (
        <div className="w-[68%] translate-y-[6%]">
          <div className="aspect-[16/10] overflow-hidden rounded-t-lg border-[3px] border-b-0 border-black/80 shadow-2xl">
            <ScreenUI accent={accent} />
          </div>
          <div className="mx-[-6%] h-2.5 rounded-b-xl bg-gradient-to-b from-neutral-300 to-neutral-500" />
        </div>
      ) : null}
      {device === "browser" ? (
        <div className="w-[78%] translate-y-[8%] overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/10">
          <div className="flex h-5 items-center gap-1 bg-neutral-200 px-2">
            <span className="size-1.5 rounded-full bg-orange-500" />
            <span className="size-1.5 rounded-full bg-orange-300" />
            <span className="size-1.5 rounded-full bg-blue-400" />
          </div>
          <div className="aspect-[16/9]">
            <ScreenUI accent={accent} />
          </div>
        </div>
      ) : null}
      {device === "dashboard" ? (
        <div className="aspect-[16/10] w-[76%] translate-y-[8%] overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/10">
          <DashboardUI />
        </div>
      ) : null}
      {device === "phones" ? (
        <div className="flex translate-y-[10%] items-end gap-[4%]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "aspect-[9/19] overflow-hidden rounded-[1.1rem] border-[3px] border-black/85 shadow-2xl",
                i === 1 ? "w-28 sm:w-32" : "w-24 opacity-90 sm:w-28",
              )}
            >
              <ScreenUI accent={i === 1 ? "orange" : "blue"} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
