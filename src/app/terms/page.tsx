import type { Metadata } from "next";
import { LegalPage } from "@/components/page/legal-page";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="November 2026"
      sections={[
        { heading: "Services", text: "Each project is governed by a written proposal or agreement describing scope, timeline, deliverables and fees." },
        { heading: "Payments", text: "Payments are made in milestones as set out in the proposal. Monthly plans are billed in advance and can be paused or cancelled with notice." },
        { heading: "Ownership", text: "Once paid in full, you own the designs, code and content created for your project." },
        { heading: "Liability", text: "Add your limitation of liability, warranty and governing law clauses here after legal review." },
      ]}
    />
  );
}
