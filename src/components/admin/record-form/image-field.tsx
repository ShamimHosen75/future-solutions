"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Library, Loader2, Trash2, X } from "lucide-react";
import { uploadMedia } from "@/lib/admin/upload";
import { useToast } from "@/components/admin/ui/toast";
import { Dialog, DialogContent } from "@/components/admin/ui/dialog";
import { MediaPicker } from "@/components/admin/media-picker";
import { cn } from "@/lib/utils";

type ImageFieldProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  id?: string;
  aspect?: string;
};

/** Single image: drop zone + upload with compression + pick from the media library. */
export function ImageField({ value, onChange, folder = "uploads", id, aspect = "aspect-video" }: ImageFieldProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const media = await uploadMedia(file, folder, setProgress);
      onChange(media.url);
      toast({ title: "Image uploaded" });
    } catch (e) {
      toast({ title: "Upload failed", description: e instanceof Error ? e.message : String(e), tone: "error" });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "group relative overflow-hidden rounded-[var(--radius-md)] border border-dashed border-border bg-surface/60 transition-colors",
          aspect,
          !value && "hover:border-cyan/60",
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleFiles(e.dataTransfer.files);
        }}
      >
        {value ? (
          <>
            <Image src={value} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} className="flex size-full flex-col items-center justify-center gap-2 text-muted hover:text-white" disabled={uploading}>
            {uploading ? <Loader2 className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
            <span className="text-xs">{uploading ? `Uploading… ${progress}%` : "Drop an image or click to upload"}</span>
          </button>
        )}
      </div>
      <input ref={inputRef} id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => void handleFiles(e.target.files)} />
      <div className="flex flex-wrap gap-2 text-xs">
        <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-silver hover:text-white">
          <ImagePlus className="size-3.5" aria-hidden /> {value ? "Replace" : "Upload"}
        </button>
        <button type="button" onClick={() => setPickerOpen(true)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-silver hover:text-white">
          <Library className="size-3.5" aria-hidden /> Library
        </button>
        {value ? (
          <button type="button" onClick={() => onChange(null)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-muted hover:text-orange">
            <Trash2 className="size-3.5" aria-hidden /> Remove
          </button>
        ) : null}
      </div>
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent title="Media library" description="Pick an existing upload." size="xl">
          <MediaPicker
            onSelect={(url) => {
              onChange(url);
              setPickerOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Multiple images (gallery). */
export function ImagesField({ value, onChange, folder = "uploads" }: { value: string[]; onChange: (urls: string[]) => void; folder?: string }) {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push((await uploadMedia(file, folder)).url);
      onChange([...value, ...urls]);
      toast({ title: `${urls.length} image${urls.length > 1 ? "s" : ""} uploaded` });
    } catch (e) {
      toast({ title: "Upload failed", description: e instanceof Error ? e.message : String(e), tone: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {value.map((url, i) => (
          <li key={`${url}-${i}`} className="group relative aspect-square overflow-hidden rounded-[var(--radius-sm)] border border-border">
            <Image src={url} alt="" fill sizes="120px" className="object-cover" />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="Remove image">
              <X className="size-3" />
            </button>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-[var(--radius-sm)] border border-dashed border-border text-muted hover:border-cyan/60 hover:text-white">
            {uploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
            <span className="text-[0.65rem]">Add</span>
          </button>
        </li>
      </ul>
      <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => void handleFiles(e.target.files)} />
      <button type="button" onClick={() => setPickerOpen(true)} className="w-fit rounded-full border border-border px-3 py-1.5 text-xs text-silver hover:text-white">
        Choose from library
      </button>
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent title="Media library" size="xl">
          <MediaPicker onSelect={(url) => onChange([...value, url])} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
