"use client";

import { createClient } from "@/lib/supabase/client";
import { registerMedia } from "@/app/actions/media";
import type { MediaItem } from "@/types/content";

const MAX_EDGE = 1920;
const QUALITY = 0.82;
const MAX_BYTES = 10 * 1024 * 1024;

/** Resize to max 1920px and re-encode as WebP in the browser. SVG/GIF pass through. */
export async function compressImage(file: File): Promise<{ blob: Blob; width: number | null; height: number | null; ext: string; type: string }> {
  if (file.type === "image/svg+xml" || file.type === "image/gif" || !file.type.startsWith("image/")) {
    return { blob: file, width: null, height: null, ext: file.name.split(".").pop() ?? "bin", type: file.type };
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
  if (!blob) throw new Error("Image encoding failed");
  // If WebP ended up larger than the original (rare for small PNGs), keep the original.
  if (blob.size > file.size && file.size < 300 * 1024) {
    return { blob: file, width, height, ext: file.name.split(".").pop() ?? "png", type: file.type };
  }
  return { blob, width, height, ext: "webp", type: "image/webp" };
}

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "file";
}

/** Compress, upload to the public "media" bucket and register in the media table. */
export async function uploadMedia(file: File, folder = "uploads", onProgress?: (pct: number) => void): Promise<MediaItem> {
  if (file.size > MAX_BYTES) throw new Error("File is larger than 10 MB");
  onProgress?.(10);
  const { blob, width, height, ext, type } = await compressImage(file);
  onProgress?.(40);

  const supabase = createClient();
  const now = new Date();
  const path = `${folder}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${safeName(file.name)}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, blob, { contentType: type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  onProgress?.(80);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  const result = await registerMedia({
    path,
    url: data.publicUrl,
    alt: safeName(file.name).replace(/-/g, " "),
    folder,
    mime_type: type,
    size_bytes: blob.size,
    width,
    height,
  });
  onProgress?.(100);
  if (!result.ok) throw new Error(result.message);
  return result.data!;
}
