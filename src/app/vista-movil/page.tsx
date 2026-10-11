import type { Metadata } from "next";
import { MobilePreview } from "@/components/mobile-preview";

export const metadata: Metadata = { title: "Vista móvil de la mini app", robots: { index: false, follow: false } };

export default function MobilePreviewPage() { return <MobilePreview />; }
