import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountHomeSummary } from "@/components/account-home-summary";
import { AccountInventorySummary } from "@/components/account-inventory-summary";
import { AccountSidebar } from "@/components/account-sidebar";
import { summarizeDay } from "@/lib/dashboard-data";
import { mobileAppScale } from "@/lib/mobile-app-scale";
import { InventoryView } from "@/components/inventory-view";
import { AnimalFormFields } from "@/components/animal-form-fields";
import { PreviewAnimalForm } from "@/components/preview-animal-form";
import type { CSSProperties } from "react";

export const metadata: Metadata = { title: "Ejemplo de la vista de app", robots: { index: false, follow: false } };

// A public, labelled visual example. No account data or writable demo session.
export default async function AppPreviewPage({ searchParams }: { searchParams: Promise<{ escala?: string; ancho?: string; pantalla?: string; tipo?: string }> }) {
  const params = await searchParams;
  const width = [360,390,430].includes(Number(params.ancho)) ? Number(params.ancho) : 390;
  const scale = params.escala === "amplia" ? mobileAppScale(980, width, 1) : 1;
  const style = { "--app-viewport-scale": scale, zoom: scale } as CSSProperties;
  return <div className="app-experience simulated-mobile-app" style={style}><div className="account-app-shell">
    <Suspense fallback={null}><AccountSidebar breederName="Mi criadero · Ejemplo" plan="Prueba · 30 días" preview /></Suspense>
    <div className="account-app-content"><section className="account-dashboard app-home">
      <p className="app-example-label">Vista de ejemplo · En tu cuenta verás tus datos</p>
      {params.pantalla === "inventario" ? <InventoryView key={params.tipo ?? "folders"} selectedType={params.tipo} preview basePath={`/vista-app?pantalla=inventario${params.escala === "amplia" ? `&escala=amplia&ancho=${width}` : ""}`} animals={[
        {id:"example-a",public_code:"EJEMPLO-001",name:"Imperial",species:"Aves",breed:"Brahma",sex:"macho",inventory_status:"activo",publication_status:"borrador",price_pen:480,created_at:"2026-10-12"},
        {id:"example-b",public_code:"EJEMPLO-002",name:"Canela",species:"Aves",breed:"Criolla",sex:"hembra",inventory_status:"reservado",publication_status:"borrador",price_pen:null,created_at:"2026-10-12"},
        {id:"example-c",public_code:"EJEMPLO-003",name:"Nube",species:"Patos",breed:"Pekín",sex:"hembra",inventory_status:"activo",publication_status:"borrador",price_pen:120,created_at:"2026-10-12"}
      ]}/> : params.pantalla === "registro" ? <div className="animal-editor"><h1>Registrar animal</h1><p>Completa los datos de su ficha.</p><PreviewAnimalForm><AnimalFormFields /></PreviewAnimalForm></div> : <><AccountHomeSummary firstName="Criador" breederName="Mi criadero" dateLabel="Hoy" summary={summarizeDay([])} illustrative />
      <AccountInventorySummary total="0" active="0" published="0" /></>}
    </section></div>
  </div></div>;
}
