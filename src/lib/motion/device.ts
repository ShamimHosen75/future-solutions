export type MotionTier = "full" | "static";

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/** Decides whether the device gets the 3D / heavy motion experience. Client only. */
export function detectMotionTier(): MotionTier {
  if (typeof window === "undefined") return "static";
  const nav = navigator as NavigatorExtras;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const smallViewport = window.innerWidth < 1024;
  const lowMemory = (nav.deviceMemory ?? 8) < 4;
  const fewCores = (nav.hardwareConcurrency ?? 8) < 4;
  const saveData = nav.connection?.saveData === true;
  const slowNetwork = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");

  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    webgl = false;
  }

  if (reducedMotion || saveData || slowNetwork || !webgl) return "static";
  if (coarsePointer || smallViewport || lowMemory || fewCores) return "static";
  return "full";
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine) and (hover: hover)").matches;
}
