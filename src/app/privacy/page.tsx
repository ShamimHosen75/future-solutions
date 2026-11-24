import type { Metadata } from "next";
import { LegalPage } from "@/components/page/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 2026"
      sections={[
        { heading: "Information we collect", text: "When you contact us or send a brief, we collect the details you provide, such as your name, email, budget and project description." },
        { heading: "How we use it", text: "We use your information only to respond to your enquiry, prepare proposals and deliver our services. We never sell your data." },
        { heading: "Cookies and analytics", text: "We may use privacy-friendly analytics to understand how the site is used. Add details of any cookies or tracking tools here." },
        { heading: "Your rights", text: "You can ask us to access, correct or delete your personal data at any time by emailing us." },
      ]}
    />
  );
}
