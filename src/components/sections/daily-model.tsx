import { dailyModel } from "@/content/home";
import { Avatar, Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { NamedIcon } from "@/components/ui/icon-map";

export const DailyModel = () => (
  <Section tone="dark">
    <Container>
      <SectionHeading eyebrow={dailyModel.eyebrow} title={dailyModel.title} intro={dailyModel.intro} tone="dark" />
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_420px]">
        <div>
          <ul className="divide-y divide-white/10">
            {dailyModel.features.map((f) => (
              <li key={f.title} data-reveal="left" className="flex gap-5 py-6 first:pt-0">
                <NamedIcon name={f.icon} className="mt-0.5 size-7 shrink-0 text-orange-400" />
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-dark">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div data-reveal className="mt-6">
            <Button href={dailyModel.cta.href}>{dailyModel.cta.label}</Button>
          </div>
        </div>
        <ChatMock />
      </div>
    </Container>
  </Section>
);

const ChatMock = () => (
  <div data-reveal="right" className="rounded-2xl bg-white p-5 text-text shadow-[0_40px_80px_-30px_rgb(0_107_200/0.45)] lg:sticky lg:top-28">
    <div className="flex items-center justify-between border-b border-line pb-3 text-sm">
      <span className="font-semibold">{dailyModel.chat.channel}</span>
      <span className="flex items-center gap-1.5 text-xs text-emerald-600">
        <span className="size-1.5 rounded-full bg-emerald-500" /> 6 online
      </span>
    </div>
    <ul className="mt-4 space-y-4">
      {dailyModel.chat.messages.map((m, i) => (
        <li key={i} className="flex gap-3">
          <Avatar name={m.name} hue={m.name.startsWith("FS") ? "orange" : "blue"} className="size-8 rounded-lg text-[10px]" />
          <div className="min-w-0">
            <p className="text-xs">
              <span className="font-semibold">{m.name}</span> <span className="text-muted">{m.time}</span>
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-text/80">{m.text}</p>
          </div>
        </li>
      ))}
    </ul>
    <div className="mt-5 flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm text-muted">
      <span className="text-lg leading-none">+</span> Message {dailyModel.chat.channel}
    </div>
  </div>
);
