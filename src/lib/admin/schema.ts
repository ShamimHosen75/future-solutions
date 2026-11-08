import { z } from "zod";
import type { FieldDef, ModuleDef } from "./modules";

/** Builds the Zod schema for a field type. Empty strings become null for optional scalars. */
function fieldSchema(field: FieldDef): z.ZodTypeAny {
  const optionalString = (base: z.ZodString) =>
    field.required ? base.min(1, `${field.label} is required`) : base.optional().nullable().transform((v) => (v ? v : null));

  switch (field.type) {
    case "text":
    case "slug":
    case "textarea":
    case "richtext":
      return optionalString(z.string().trim().max(field.type === "richtext" ? 200_000 : 5000));
    case "email":
      return field.required
        ? z.string().trim().email()
        : z.string().trim().email().or(z.literal("")).optional().nullable().transform((v) => (v ? v : null));
    case "url":
      return field.required
        ? z.string().trim().url()
        : z.string().trim().url().or(z.literal("")).optional().nullable().transform((v) => (v ? v : null));
    case "number": {
      let n = z.coerce.number();
      if (field.min !== undefined) n = n.min(field.min);
      if (field.max !== undefined) n = n.max(field.max);
      return field.required
        ? n
        : z.preprocess((v) => (v === "" || v === null || v === undefined ? null : v), n.nullable());
    }
    case "select": {
      const values = (field.options ?? []).map((o) => o.value) as [string, ...string[]];
      const en = values.length ? z.enum(values) : z.string();
      return field.required ? en : z.preprocess((v) => (v === "" ? null : v), en.nullable());
    }
    case "switch":
      return z.coerce.boolean().default(false);
    case "image":
      return z.string().trim().optional().nullable().transform((v) => (v ? v : null));
    case "images":
    case "tags":
      return z.array(z.string().trim().min(1)).default([]);
    case "date":
      return z
        .string()
        .trim()
        .optional()
        .nullable()
        .transform((v) => (v ? v : null))
        .refine((v) => v === null || !Number.isNaN(Date.parse(v)), "Invalid date");
    case "relation":
      return z.preprocess((v) => (v === "" ? null : v), z.string().uuid().nullable());
    case "keyvalue":
      return z
        .array(z.object({ key: z.string().trim(), value: z.string().trim() }))
        .default([])
        .transform((pairs) => Object.fromEntries(pairs.filter((p) => p.key).map((p) => [p.key, p.value])));
    case "list": {
      const shape: Record<string, z.ZodTypeAny> = {};
      for (const sub of field.item ?? []) shape[sub.name] = fieldSchema(sub);
      return z.array(z.object(shape)).default([]);
    }
    default:
      return z.unknown();
  }
}

/** Full record schema for a module. Unknown keys are stripped. */
export function moduleSchema(def: ModuleDef) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of def.fields) shape[f.name] = fieldSchema(f);
  return z.object(shape);
}

/** Default values for a brand-new record of this module. */
export function defaultValues(def: ModuleDef): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of def.fields) out[f.name] = emptyValue(f);
  return out;
}

export function emptyValue(field: FieldDef): unknown {
  switch (field.type) {
    case "switch":
      return field.name === "is_published" ? false : false;
    case "images":
    case "tags":
    case "list":
    case "keyvalue":
      return [];
    case "number":
      return "";
    case "select":
      return field.options?.[0]?.value ?? "";
    default:
      return "";
  }
}

/**
 * Converts a database row to form values: nulls → "", jsonb objects for
 * keyvalue fields → pair arrays, numbers → strings for inputs.
 */
export function rowToValues(def: ModuleDef, row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of def.fields) {
    const v = row[f.name];
    switch (f.type) {
      case "keyvalue":
        out[f.name] =
          v && typeof v === "object" && !Array.isArray(v)
            ? Object.entries(v as Record<string, unknown>).map(([key, value]) => ({ key, value: String(value ?? "") }))
            : [];
        break;
      case "images":
      case "tags":
        out[f.name] = Array.isArray(v) ? v : [];
        break;
      case "list":
        out[f.name] = Array.isArray(v)
          ? (v as Record<string, unknown>[]).map((item) => {
              const o: Record<string, unknown> = {};
              for (const sub of f.item ?? []) {
                const sv = item?.[sub.name];
                o[sub.name] = sub.type === "tags" ? (Array.isArray(sv) ? sv : []) : sv === null || sv === undefined ? "" : sub.type === "date" ? String(sv).slice(0, 10) : String(sv);
              }
              return o;
            })
          : [];
        break;
      case "switch":
        out[f.name] = Boolean(v);
        break;
      case "date":
        out[f.name] = v ? String(v).slice(0, 10) : "";
        break;
      default:
        out[f.name] = v === null || v === undefined ? "" : String(v);
    }
  }
  return out;
}
