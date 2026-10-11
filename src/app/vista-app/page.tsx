import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountHomeSummary } from "@/components/account-home-summary";
import { AccountSidebar } from "@/components/account-sidebar";
import { summarizeDay } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Ejemplo de la vista de app", robots: { index: false, follow: false } };

// A public, labelled visual example. No account data or writable demo session.
export default function AppPreviewPage() {
  return <div className="account-app-shell">
    <Suspense fallback={null}><AccountSidebar breederName="Mi criadero · Ejemplo" plan="Gratis" preview /></Suspense>
    <div className="account-app-content"><section className="account-dashboard analytics-dashboard">
      <p className="app-example-label">Vista de ejemplo · En tu cuenta verás tus datos</p>
      <AccountHomeSummary firstName="Criador" breederName="Mi criadero" dateLabel="Hoy" summary={summarizeDay([])} illustrative />
      <div className="dashboard-section-head"><div><h2>Tu inventario</h2><p>Registra tu primer animal para empezar.</p></div></div>
    </section></div>
  </div>;
}
