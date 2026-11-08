"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, type Control, type FieldValues } from "react-hook-form";
import { ArrowLeft, ExternalLink, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { saveRecord, deleteRecord } from "@/app/actions/content";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/admin/ui/switch";
import { ConfirmDialog } from "@/components/admin/ui/alert-dialog";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { useToast } from "@/components/admin/ui/toast";
import { RichTextEditor } from "./rich-text-editor";
import { TagsInput } from "./tags-input";
import { ImageField, ImagesField } from "./image-field";
import { getModule, type FieldDef, type Option, sectionsOf } from "@/lib/admin/modules";
import { emptyValue } from "@/lib/admin/schema";
import { cn, slugify } from "@/lib/utils";

type Values = Record<string, unknown>;

type RecordFormProps = {
  moduleKey: string;
  id: string | null;
  initialValues: Values;
  relationOptions: Record<string, Option[]>;
  publicUrl?: string | null;
};

const widthClass: Record<NonNullable<FieldDef["width"]>, string> = {
  full: "md:col-span-6",
  half: "md:col-span-3",
  third: "md:col-span-2",
};

export function RecordForm({ moduleKey, id, initialValues, relationOptions, publicUrl }: RecordFormProps) {
  const def = React.useMemo(() => getModule(moduleKey)!, [moduleKey]);
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = React.useTransition();
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const form = useForm<Values>({ defaultValues: initialValues, mode: "onBlur" });
  const { control, register, handleSubmit, setError, watch, setValue, formState } = form;

  // Auto slug while the slug field hasn't been touched manually on a new record.
  const slugTouched = React.useRef(Boolean(id));
  const sourceValue = watch(def.slugSource);
  React.useEffect(() => {
    if (!slugTouched.current && typeof sourceValue === "string") setValue("slug", slugify(sourceValue));
  }, [sourceValue, setValue]);

  const errorOf = (name: string) => {
    const err = (formState.errors as FieldValues)[name] as { message?: string } | undefined;
    return err?.message;
  };

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const res = await saveRecord(def.key, id, values);
      if (!res.ok) {
        if (res.fieldErrors) for (const [k, msgs] of Object.entries(res.fieldErrors)) setError(k, { type: "server", message: msgs[0] });
        toast({ title: res.message, tone: "error" });
        return;
      }
      toast({ title: res.message ?? "Saved" });
      if (!id && res.data) router.replace(`/admin/${def.key}/${res.data.id}`);
      else router.refresh();
    });
  });

  // Ctrl/Cmd+S saves.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void onSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSubmit]);

  const sections = sectionsOf(def);

  const renderField = (field: FieldDef) => {
    const error = errorOf(field.name);
    const invalid = Boolean(error);
    const common = { label: field.label, htmlFor: field.name, error, hint: field.hint, required: field.required };
    const wrap = (node: React.ReactNode) => (
      <Field key={field.name} {...common} className={widthClass[field.width ?? "full"]}>
        {node}
      </Field>
    );

    switch (field.type) {
      case "text":
      case "email":
      case "url":
        return wrap(<Input id={field.name} type={field.type === "text" ? "text" : field.type} placeholder={field.placeholder} aria-invalid={invalid} {...register(field.name)} />);
      case "slug":
        return wrap(
          <Input
            id={field.name}
            placeholder="auto-generated"
            aria-invalid={invalid}
            className="font-mono text-xs"
            {...register(field.name, {
              onChange: () => {
                slugTouched.current = true;
              },
            })}
          />,
        );
      case "textarea":
        return wrap(<Textarea id={field.name} placeholder={field.placeholder} aria-invalid={invalid} className="min-h-24" {...register(field.name)} />);
      case "number":
        return wrap(<Input id={field.name} type="number" inputMode="decimal" step="any" min={field.min} max={field.max} placeholder={field.placeholder} aria-invalid={invalid} {...register(field.name)} />);
      case "date":
        return wrap(<Input id={field.name} type="date" aria-invalid={invalid} {...register(field.name)} />);
      case "select":
        return wrap(
          <Select id={field.name} aria-invalid={invalid} {...register(field.name)}>
            {!field.required ? <option value="">—</option> : null}
            {(field.options ?? []).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>,
        );
      case "relation":
        return wrap(
          <Select id={field.name} aria-invalid={invalid} {...register(field.name)}>
            <option value="">— None —</option>
            {(relationOptions[field.name] ?? []).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>,
        );
      case "switch":
        return (
          <div key={field.name} className={cn("flex items-start justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-surface/40 px-4 py-3", widthClass[field.width ?? "full"])}>
            <div>
              <label htmlFor={field.name} className="text-sm font-medium text-white">{field.label}</label>
              {field.hint ? <p className="mt-0.5 text-xs text-muted">{field.hint}</p> : null}
            </div>
            <Controller control={control} name={field.name} render={({ field: f }) => <Switch id={field.name} checked={Boolean(f.value)} onCheckedChange={f.onChange} />} />
          </div>
        );
      case "richtext":
        return wrap(<Controller control={control} name={field.name} render={({ field: f }) => <RichTextEditor id={field.name} value={String(f.value ?? "")} onChange={f.onChange} placeholder={field.placeholder} invalid={invalid} />} />);
      case "tags":
        return wrap(<Controller control={control} name={field.name} render={({ field: f }) => <TagsInput id={field.name} value={(f.value as string[]) ?? []} onChange={f.onChange} invalid={invalid} />} />);
      case "image":
        return wrap(<Controller control={control} name={field.name} render={({ field: f }) => <ImageField id={field.name} value={(f.value as string) || null} onChange={(v) => f.onChange(v ?? "")} folder={def.key} aspect={field.name.includes("avatar") || field.name.includes("logo") ? "aspect-square max-w-48" : "aspect-video"} />} />);
      case "images":
        return wrap(<Controller control={control} name={field.name} render={({ field: f }) => <ImagesField value={(f.value as string[]) ?? []} onChange={f.onChange} folder={def.key} />} />);
      case "keyvalue":
        return (
          <div key={field.name} className={widthClass[field.width ?? "full"]}>
            <KeyValueField control={control} name={field.name} label={field.label} hint={field.hint} />
          </div>
        );
      case "list":
        return (
          <div key={field.name} className={widthClass[field.width ?? "full"]}>
            <ListField control={control} name={field.name} field={field} register={register} />
          </div>
        );
      default:
        return null;
    }
  };

  const title = String(watch(def.titleField) || (id ? "Untitled" : `New ${def.singular.toLowerCase()}`));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      {/* Sticky action bar */}
      <div className="sticky top-16 z-20 -mx-4 flex items-center justify-between gap-4 border-b border-border bg-bg/80 px-4 py-3 backdrop-blur-xl lg:-mx-8 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button href={`/admin/${def.key}`} variant="ghost" size="icon" aria-label={`Back to ${def.label}`} data-no-transition>
            <ArrowLeft className="size-4" />
          </Button>
          <div className="min-w-0">
            <p className="label text-[0.6rem]">{def.singular}</p>
            <h1 className="truncate font-display text-lg font-semibold text-white">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {publicUrl && id ? (
            <Button href={publicUrl} variant="ghost" size="sm" className="hidden sm:inline-flex">
              View <ExternalLink className="size-3.5" aria-hidden />
            </Button>
          ) : null}
          {id ? (
            <Button type="button" variant="ghost" size="sm" className="text-muted hover:text-orange" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-4" aria-hidden /> <span className="hidden sm:inline">Delete</span>
            </Button>
          ) : null}
          <AdminButton type="submit" pending={pending} size="sm">
            <Save className="size-4" aria-hidden /> {id ? "Save changes" : `Create ${def.singular.toLowerCase()}`}
          </AdminButton>
        </div>
      </div>

      {sections.map((section) => {
        const fields = def.fields.filter((f) => (f.section ?? "General") === section);
        return (
          <section key={section} className="rounded-[var(--radius-lg)] border border-border bg-surface/40 p-5 md:p-6" aria-labelledby={`section-${section}`}>
            <h2 id={`section-${section}`} className="label mb-5">{section}</h2>
            <div className="grid gap-5 md:grid-cols-6">{fields.map(renderField)}</div>
          </section>
        );
      })}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete this ${def.singular.toLowerCase()}?`}
        description="This permanently removes the record and cannot be undone."
        confirmLabel="Delete"
        pending={pending}
        onConfirm={() =>
          startTransition(async () => {
            if (!id) return;
            const res = await deleteRecord(def.key, id);
            if (res.ok) {
              toast({ title: res.message ?? "Deleted" });
              router.replace(`/admin/${def.key}`);
            } else toast({ title: res.message, tone: "error" });
          })
        }
      />
    </form>
  );
}

/* ───────────────────────── Repeatable object list ───────────────────────── */

function ListField({ control, name, field, register }: { control: Control<Values>; name: string; field: FieldDef; register: ReturnType<typeof useForm<Values>>["register"] }) {
  const { fields, append, remove, move } = useFieldArray({ control, name: name as never });
  const blank = () => Object.fromEntries((field.item ?? []).map((s) => [s.name, emptyValue(s)]));
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-xs font-medium tracking-wide text-silver">
        {field.label}
        {field.hint ? <span className="ml-2 font-normal text-muted">{field.hint}</span> : null}
      </legend>
      {fields.length === 0 ? <p className="rounded-[var(--radius-md)] border border-dashed border-border px-4 py-6 text-center text-xs text-muted">No items yet.</p> : null}
      {fields.map((item, index) => (
        <div key={item.id} className="relative grid gap-3 rounded-[var(--radius-md)] border border-border bg-surface/60 p-4 pl-10 md:grid-cols-6">
          <div className="absolute top-3 left-2 flex flex-col items-center gap-1 text-muted">
            <GripVertical className="size-4" aria-hidden />
            <button type="button" onClick={() => index > 0 && move(index, index - 1)} className="text-[0.6rem] hover:text-white" aria-label="Move up">▲</button>
            <button type="button" onClick={() => index < fields.length - 1 && move(index, index + 1)} className="text-[0.6rem] hover:text-white" aria-label="Move down">▼</button>
          </div>
          {(field.item ?? []).map((sub) => {
            const subName = `${name}.${index}.${sub.name}`;
            const cls = widthClass[sub.width ?? (sub.type === "textarea" || sub.type === "tags" ? "full" : "half")];
            return (
              <Field key={sub.name} label={sub.label} htmlFor={subName} required={sub.required} className={cls}>
                {sub.type === "textarea" ? (
                  <Textarea id={subName} className="min-h-20" {...register(subName)} />
                ) : sub.type === "select" ? (
                  <Select id={subName} {...register(subName)}>
                    {(sub.options ?? []).map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                ) : sub.type === "tags" ? (
                  <Controller control={control} name={subName as never} render={({ field: f }) => <TagsInput id={subName} value={((f.value as unknown) as string[]) ?? []} onChange={f.onChange} />} />
                ) : (
                  <Input id={subName} type={sub.type === "number" ? "number" : sub.type === "date" ? "date" : "text"} {...register(subName)} />
                )}
              </Field>
            );
          })}
          <button type="button" onClick={() => remove(index)} className="absolute top-3 right-3 rounded-full p-1.5 text-muted hover:bg-white/5 hover:text-orange" aria-label="Remove item">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append(blank() as never)} className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-silver hover:text-white">
        <Plus className="size-3.5" aria-hidden /> Add item
      </button>
    </fieldset>
  );
}

/* ───────────────────────── Key/value pairs (jsonb object) ───────────────────────── */

function KeyValueField({ control, name, label, hint }: { control: Control<Values>; name: string; label: string; hint?: string }) {
  const { fields, append, remove } = useFieldArray({ control, name: name as never });
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-xs font-medium tracking-wide text-silver">
        {label}
        {hint ? <span className="ml-2 font-normal text-muted">{hint}</span> : null}
      </legend>
      {fields.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <Controller control={control} name={`${name}.${index}.key` as never} render={({ field: f }) => <Input placeholder="key" aria-label="Key" className="w-1/3 font-mono text-xs" value={String(f.value ?? "")} onChange={f.onChange} />} />
          <Controller control={control} name={`${name}.${index}.value` as never} render={({ field: f }) => <Input placeholder="value" aria-label="Value" value={String(f.value ?? "")} onChange={f.onChange} />} />
          <button type="button" onClick={() => remove(index)} className="rounded-full p-2 text-muted hover:text-orange" aria-label="Remove pair"><Trash2 className="size-4" /></button>
        </div>
      ))}
      <button type="button" onClick={() => append({ key: "", value: "" } as never)} className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-silver hover:text-white">
        <Plus className="size-3.5" aria-hidden /> Add pair
      </button>
    </fieldset>
  );
}
