import type { Metadata } from "next";
import Link from "next/link";
import { QuickFinanceForm } from "@/components/quick-finance-form";
import { limaDate } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Registrar movimiento", robots: { index: false, follow: false } };
export default async function NewMovementPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const { tipo } = await searchParams;
  const type = tipo === "gasto" || tipo === "compra" ? tipo : "venta";
  return <section className="inventory-page quick-entry-page"><div className="section-shell quick-entry-shell">
    <Link href={`/cuenta/finanzas?tipo=${type}`} className="quick-entry-back"><span aria-hidden="true">←</span> Volver a {type === "venta" ? "ventas" : type === "compra" ? "compras" : "gastos"}</Link>
    <header><h1>{type === "venta" ? "Nueva venta" : type === "compra" ? "Nueva compra" : "Nuevo gasto"}</h1><p>Registra el monto, el concepto y listo.</p></header>
    <nav className="finance-tabs" aria-label="Tipo de registro">{(["venta", "compra", "gasto"] as const).map(kind => <Link href={`/cuenta/finanzas/nuevo?tipo=${kind}`} key={kind} className={type === kind ? "active" : ""} aria-current={type === kind ? "page" : undefined}>{kind === "venta" ? "Venta" : kind === "compra" ? "Compra" : "Gasto"}</Link>)}</nav>
    <QuickFinanceForm key={type} type={type} today={limaDate()} />
  </div></section>;
}
