import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(160deg, #05060A 0%, #0E1118 60%, #05060A 100%)",
          color: "#D9DDE3",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -200, right: -100, width: 600, height: 600, borderRadius: 9999, background: "radial-gradient(circle, rgba(10,61,255,0.45), transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -250, left: 200, width: 600, height: 600, borderRadius: 9999, background: "radial-gradient(circle, rgba(255,90,10,0.35), transparent 70%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg viewBox="0 0 256 256" width="96" height="96">
            <defs>
              <linearGradient id="s" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.6" stopColor="#8A93A3" /><stop offset="1" stopColor="#E8EBEF" /></linearGradient>
              <linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0A3DFF" /><stop offset="0.45" stopColor="#12C8FF" /><stop offset="0.7" stopColor="#FF5A0A" /><stop offset="1" stopColor="#FFA31A" /></linearGradient>
            </defs>
            <path fill="url(#s)" d="M52 56h84v26H82v34h46v26H82v58H52z" />
            <path fill="url(#b)" d="M204 86c-6-16-21-27-44-27-26 0-45 14-45 36 0 20 13 30 40 37l10 3c13 4 17 8 17 15 0 8-8 14-21 14-14 0-24-7-27-19l-27 7c6 23 26 38 54 38 29 0 49-15 49-40 0-21-13-32-38-39l-12-3c-12-3-17-7-17-13 0-7 7-12 17-12 11 0 18 5 21 13z" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: "#fff", letterSpacing: -1 }}>{site.name}</span>
            <span style={{ fontSize: 18, letterSpacing: 6, color: "#8A93A3", textTransform: "uppercase" }}>Software · Training</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontSize: 76, fontWeight: 800, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>Smart Solutions.</span>
          <span style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2, lineHeight: 1, background: "linear-gradient(120deg,#0A3DFF,#12C8FF 45%,#FF5A0A 70%,#FFA31A)", backgroundClip: "text", color: "transparent" }}>Lasting Impact.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#8A93A3" }}>
          <span>{site.domain}</span>
          <span>Uttara, Dhaka · Bangladesh</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: "linear-gradient(120deg,#0A3DFF,#12C8FF 45%,#FF5A0A 70%,#FFA31A)" }} />
      </div>
    ),
    size,
  );
}
