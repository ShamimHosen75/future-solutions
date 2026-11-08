import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForms } from "@/components/admin/settings-forms";
import { requireSession } from "@/lib/admin/auth";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireSession("admin");
  const settings = await getSettings();
  return (
    <>
      <AdminPageHeader title="Site settings" description="Contact details, social links, SEO defaults, homepage stats and page copy. Changes go live immediately." crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Settings" }]} />
      <SettingsForms settings={settings} />
    </>
  );
}
