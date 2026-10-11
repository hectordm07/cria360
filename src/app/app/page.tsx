import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mi criadero", robots: { index: false, follow: false } };

export default function AppEntryPage() {
  // AccountLayout verifies the session and completed registration on the server.
  redirect("/cuenta");
}
