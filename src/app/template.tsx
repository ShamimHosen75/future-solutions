/** Re-mounts on every navigation, so each page fades in. Opacity only, so sticky and fixed children are unaffected. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-[page-in_0.5s_ease-out]">{children}</div>;
}
