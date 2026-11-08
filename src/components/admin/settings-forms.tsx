"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, type Control, type UseFormRegister } from "react-hook-form";
import { Plus, Save, Trash2 } from "lucide-react";
import { saveSettings } from "@/app/actions/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { Switch } from "@/components/admin/ui/switch";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { useToast } from "@/components/admin/ui/toast";
import { RichTextEditor } from "@/components/admin/record-form/rich-text-editor";
import { TagsInput } from "@/components/admin/record-form/tags-input";
import { Field, Input, Textarea } from "@/components/ui/field";
import type { SiteSettings, SettingsKey } from "@/types/content";

type V = Record<string, unknown>;
type Ctx = { register: UseFormRegister<V>; control: Control<V>; errorOf: (name: string) => string | undefined };
type SectionFormProps<K extends SettingsKey> = { sectionKey: K; values: SiteSettings[K]; children: (ctx: Ctx) => React.ReactNode };

/** One form per settings section; saves the whole JSON blob for that key. */
function SectionForm<K extends SettingsKey>({ sectionKey, values, children }: SectionFormProps<K>) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = React.useTransition();
  const form = useForm<V>({ defaultValues: values as unknown as V });
  const errorOf = (name: string) => (form.formState.errors as Record<string, { message?: string } | undefined>)[name]?.message;

  const onSubmit = form.handleSubmit((data) =>
    startTransition(async () => {
      const res = await saveSettings(sectionKey, data);
      if (!res.ok) {
        if (res.fieldErrors) for (const [k, m] of Object.entries(res.fieldErrors)) form.setError(k as never, { type: "server", message: m[0] });
        toast({ title: res.message, tone: "error" });
        return;
      }
      toast({ title: "Settings saved" });
      router.refresh();
    }),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-[var(--radius-lg)] border border-border bg-surface/40 p-5 md:p-6" noValidate>
      {children({ register: form.register, control: form.control, errorOf })}
      <div className="flex justify-end border-t border-border pt-5">
        <AdminButton type="submit" pending={pending} size="sm"><Save className="size-4" aria-hidden /> Save {sectionKey}</AdminButton>
      </div>
    </form>
  );
}

/* Repeatable rows of simple inputs, used by stats / values / milestones / openings / FAQs */
function Rows({ control, name, columns, blank, label }: { control: Control<V>; name: string; columns: { key: string; label: string; type?: "text" | "number" | "textarea"; width?: string }[]; blank: Record<string, unknown>; label: string }) {
  const { fields, append, remove, move } = useFieldArray({ control: control as never, name: name as never });
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-xs font-medium tracking-wide text-silver">{label}</legend>
      {fields.map((f, i) => (
        <div key={f.id} className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-surface/60 p-3 md:flex-row md:items-start">
          <div className="grid flex-1 gap-3" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
            {columns.map((c) => (
              <Controller key={c.key} control={control as never} name={`${name}.${i}.${c.key}` as never} render={({ field }) => c.type === "textarea" ? <Textarea aria-label={c.label} placeholder={c.label} className="min-h-16" value={String(field.value ?? "")} onChange={field.onChange} /> : <Input aria-label={c.label} placeholder={c.label} type={c.type ?? "text"} value={String(field.value ?? "")} onChange={field.onChange} />} />
            ))}
          </div>
          <div className="flex shrink-0 gap-1 text-muted">
            <button type="button" onClick={() => i > 0 && move(i, i - 1)} className="rounded p-2 hover:text-white" aria-label="Move up">▲</button>
            <button type="button" onClick={() => i < fields.length - 1 && move(i, i + 1)} className="rounded p-2 hover:text-white" aria-label="Move down">▼</button>
            <button type="button" onClick={() => remove(i)} className="rounded p-2 hover:text-orange" aria-label="Remove"><Trash2 className="size-4" /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => append(blank as never)} className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-silver hover:text-white"><Plus className="size-3.5" aria-hidden /> Add</button>
    </fieldset>
  );
}

export function SettingsForms({ settings }: { settings: SiteSettings }) {
  return (
    <Tabs defaultValue="contact" className="flex flex-col gap-6">
      <TabsList aria-label="Settings sections">
        {(["contact", "socials", "seo", "homepage", "announcement", "about", "careers", "pricing", "legal"] as SettingsKey[]).map((k) => (
          <TabsTrigger key={k} value={k} className="capitalize">{k}</TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="contact">
        <SectionForm sectionKey="contact" values={settings.contact}>
          {({ register, errorOf }) => (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Email" htmlFor="c-email" required error={errorOf("email")}><Input id="c-email" type="email" {...register("email")} /></Field>
              <Field label="Phone (display)" htmlFor="c-phone" required error={errorOf("phone")}><Input id="c-phone" {...register("phone")} /></Field>
              <Field label="WhatsApp number" htmlFor="c-wa" required error={errorOf("whatsapp")} hint="Digits with country code, e.g. +8801714530063"><Input id="c-wa" {...register("whatsapp")} /></Field>
              <Field label="Address" htmlFor="c-address" required error={errorOf("address")}><Input id="c-address" {...register("address")} /></Field>
              <Field label="Map search query" htmlFor="c-map" hint="Used for the embedded Google Map when no embed URL is set."><Input id="c-map" {...register("mapQuery")} /></Field>
              <Field label="Map embed URL" htmlFor="c-embed" error={errorOf("mapEmbedUrl")} hint="Optional: paste the src from Google Maps → Share → Embed."><Input id="c-embed" {...register("mapEmbedUrl")} /></Field>
            </div>
          )}
        </SectionForm>
      </TabsContent>

      <TabsContent value="socials">
        <SectionForm sectionKey="socials" values={settings.socials}>
          {({ register, errorOf }) => (
            <div className="grid gap-5 md:grid-cols-2">
              {(["facebook", "linkedin", "instagram", "youtube", "github"] as const).map((k) => (
                <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} htmlFor={`s-${k}`} error={errorOf(k)}><Input id={`s-${k}`} placeholder="https://" {...register(k)} /></Field>
              ))}
            </div>
          )}
        </SectionForm>
      </TabsContent>

      <TabsContent value="seo">
        <SectionForm sectionKey="seo" values={settings.seo}>
          {({ register, control, errorOf }) => (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Default title" htmlFor="seo-title" required error={errorOf("title")}><Input id="seo-title" {...register("title")} /></Field>
              <Field label="Title template" htmlFor="seo-template" required error={errorOf("titleTemplate")} hint="%s is replaced with the page title."><Input id="seo-template" {...register("titleTemplate")} /></Field>
              <Field label="Default description" htmlFor="seo-desc" required error={errorOf("description")} className="md:col-span-2"><Textarea id="seo-desc" {...register("description")} /></Field>
              <Field label="Keywords" htmlFor="seo-keywords" className="md:col-span-2"><Controller control={control} name="keywords" render={({ field }) => <TagsInput id="seo-keywords" value={(field.value as string[]) ?? []} onChange={field.onChange} />} /></Field>
              <Field label="Open Graph image path" htmlFor="seo-og" hint="Leave as /opengraph-image to use the generated card."><Input id="seo-og" {...register("ogImage")} /></Field>
            </div>
          )}
        </SectionForm>
      </TabsContent>

      <TabsContent value="homepage">
        <SectionForm sectionKey="homepage" values={settings.homepage}>
          {({ register, control, errorOf }) => (
            <div className="flex flex-col gap-5">
              <Field label="Hero eyebrow" htmlFor="h-eyebrow" error={errorOf("heroEyebrow")}><Input id="h-eyebrow" {...register("heroEyebrow")} /></Field>
              <Field label="Hero title" htmlFor="h-title" error={errorOf("heroTitle")} hint="The animated headline is fixed to the tagline; this is used for SEO and fallbacks."><Input id="h-title" {...register("heroTitle")} /></Field>
              <Field label="Hero subtitle" htmlFor="h-sub" error={errorOf("heroSubtitle")}><Textarea id="h-sub" {...register("heroSubtitle")} /></Field>
              <Rows control={control} name="stats" label="Homepage stats (max 6)" blank={{ label: "", value: 0, suffix: "+" }} columns={[{ key: "label", label: "Label" }, { key: "value", label: "Value", type: "number" }, { key: "suffix", label: "Suffix" }]} />
            </div>
          )}
        </SectionForm>
      </TabsContent>

      <TabsContent value="announcement">
        <SectionForm sectionKey="announcement" values={settings.announcement}>
          {({ register, control, errorOf }) => (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-border px-4 py-3"><div><p className="text-sm font-medium text-white">Show announcement bar</p><p className="text-xs text-muted">Reserved for a future top bar; stored now so it&apos;s ready.</p></div><Controller control={control} name="enabled" render={({ field }) => <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />} /></div>
              <Field label="Text" htmlFor="a-text" error={errorOf("text")}><Input id="a-text" {...register("text")} /></Field>
              <Field label="Link" htmlFor="a-href" error={errorOf("href")}><Input id="a-href" placeholder="/academy" {...register("href")} /></Field>
            </div>
          )}
        </SectionForm>
      </TabsContent>

      <TabsContent value="about">
        <SectionForm sectionKey="about" values={settings.about}>
          {({ register, control, errorOf }) => (
            <div className="flex flex-col gap-5">
              <Field label="Intro" htmlFor="ab-intro" error={errorOf("intro")}><Textarea id="ab-intro" {...register("intro")} /></Field>
              <Field label="Our story" htmlFor="ab-story" error={errorOf("story")}><Controller control={control} name="story" render={({ field }) => <RichTextEditor id="ab-story" value={String(field.value ?? "")} onChange={field.onChange} />} /></Field>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Mission" htmlFor="ab-mission" error={errorOf("mission")}><Textarea id="ab-mission" className="min-h-20" {...register("mission")} /></Field>
                <Field label="Vision" htmlFor="ab-vision" error={errorOf("vision")}><Textarea id="ab-vision" className="min-h-20" {...register("vision")} /></Field>
              </div>
              <Rows control={control} name="values" label="Values" blank={{ title: "", description: "" }} columns={[{ key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea" }]} />
              <Rows control={control} name="milestones" label="Milestones" blank={{ year: "", title: "" }} columns={[{ key: "year", label: "Year" }, { key: "title", label: "Milestone" }]} />
            </div>
          )}
        </SectionForm>
      </TabsContent>

      <TabsContent value="careers">
        <SectionForm sectionKey="careers" values={settings.careers}>
          {({ register, control, errorOf }) => (
            <div className="flex flex-col gap-5">
              <Field label="Intro" htmlFor="ca-intro" error={errorOf("intro")}><Textarea id="ca-intro" {...register("intro")} /></Field>
              <Field label="Perks" htmlFor="ca-perks"><Controller control={control} name="perks" render={({ field }) => <TagsInput id="ca-perks" value={(field.value as string[]) ?? []} onChange={field.onChange} />} /></Field>
              <Rows control={control} name="openings" label="Open positions" blank={{ title: "", type: "Full-time", location: "", description: "" }} columns={[{ key: "title", label: "Title" }, { key: "type", label: "Type" }, { key: "location", label: "Location" }, { key: "description", label: "Description", type: "textarea" }]} />
            </div>
          )}
        </SectionForm>
      </TabsContent>

      <TabsContent value="pricing">
        <SectionForm sectionKey="pricing" values={settings.pricing}>
          {({ register, control, errorOf }) => (
            <div className="flex flex-col gap-5">
              <Field label="Intro" htmlFor="p-intro" error={errorOf("intro")}><Textarea id="p-intro" {...register("intro")} /></Field>
              <Field label="Comparison table note" htmlFor="p-note" error={errorOf("comparisonNote")}><Input id="p-note" {...register("comparisonNote")} /></Field>
              <Rows control={control} name="faqs" label="Pricing FAQs" blank={{ q: "", a: "" }} columns={[{ key: "q", label: "Question" }, { key: "a", label: "Answer", type: "textarea" }]} />
            </div>
          )}
        </SectionForm>
      </TabsContent>

      <TabsContent value="legal">
        <SectionForm sectionKey="legal" values={settings.legal}>
          {({ register, control, errorOf }) => (
            <div className="flex flex-col gap-5">
              <Field label="Last updated" htmlFor="l-date" error={errorOf("updatedAt")}><Input id="l-date" type="date" {...register("updatedAt")} /></Field>
              <Field label="Privacy policy" htmlFor="l-privacy" error={errorOf("privacy")}><Controller control={control} name="privacy" render={({ field }) => <RichTextEditor id="l-privacy" value={String(field.value ?? "")} onChange={field.onChange} />} /></Field>
              <Field label="Terms of service" htmlFor="l-terms" error={errorOf("terms")}><Controller control={control} name="terms" render={({ field }) => <RichTextEditor id="l-terms" value={String(field.value ?? "")} onChange={field.onChange} />} /></Field>
            </div>
          )}
        </SectionForm>
      </TabsContent>
    </Tabs>
  );
}
