import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProfileForm } from "@/components/admin/profile-form";
import { requireSession } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "My profile" };

export default async function ProfilePage() {
  const session = await requireSession();
  return (
    <>
      <AdminPageHeader title="My profile" crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Profile" }]} />
      <ProfileForm profile={session.profile} />
    </>
  );
}
