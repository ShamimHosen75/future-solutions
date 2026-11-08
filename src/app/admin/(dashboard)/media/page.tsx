import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { MediaLibrary } from "@/components/admin/media-library";
import { requireSession } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Media library" };

export default async function MediaPage() {
  await requireSession();
  const supabase = await createClient();
  const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false }).limit(1000);
  if (error) throw new Error(error.message);
  return (
    <>
      <AdminPageHeader title="Media library" description="Images are compressed to WebP (max 1920px) in your browser before upload to the public “media” bucket." crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Media" }]} />
      <MediaLibrary items={data ?? []} />
    </>
  );
}
