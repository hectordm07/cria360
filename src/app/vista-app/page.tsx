import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountHomeSummary } from "@/components/account-home-summary";
import { AccountInventorySummary } from "@/components/account-inventory-summary";
import { AccountSidebar } from "@/components/account-sidebar";
import { summarizeDay } from "@/lib/dashboard-data";
import { mobileAppScale } from "@/lib/mobile-app-scale";
import type { CSSProperties } from "react";

export const metadata: Metadata = { title: "Ejemplo de la vista de app", robots: { index: false, follow: false } };

// A public, labelled visual example. No account data or writable demo session.
export default async function AppPreviewPage({ searchParams }: { searchParams: Promise<{ escala?: string; ancho?: string }> }) {
  const params = await searchParams;
  const width = [360,390,430].includes(Number(params.ancho)) ? Number(params.ancho) : 390;
  const scale = params.escala === "amplia" ? mobileAppScale(980, width, 1) : 1;
  const style = { "--app-viewport-scale": scale, zoom: scale } as CSSProperties;
  return <div className="app-experience simulated-mobile-app" style={style}><div className="account-app-shell">
    <Suspense fallback={null}><AccountSidebar breederName="Mi criadero · Ejemplo" plan="Prueba · 30 días" preview /></Suspense>
    <div className="account-app-content"><section className="account-dashboard app-home">
      <p className="app-example-label">Vista de ejemplo · En tu cuenta verás tus datos</p>
      <AccountHomeSummary firstName="Criador" breederName="Mi criadero" dateLabel="Hoy" summary={summarizeDay([])} illustrative />
      <AccountInventorySummary total="0" active="0" published="0" />
    </section></div>
  </div></div>;
}
